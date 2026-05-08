"use strict";

// This file keeps the NOA-64 Images contract honest.
// It proves Image 2 requests stay pass-through where they should, streaming emits events, multi-image edits work, and the local help/examples describe the same contract.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function withMockedOpenAI(FakeOpenAI, callback) {
    const openaiModule = require("openai");
    const originalDescriptor = Object.getOwnPropertyDescriptor(openaiModule, "OpenAI");

    Object.defineProperty(openaiModule, "OpenAI", {
        value: FakeOpenAI,
        configurable: true,
        enumerable: true,
        writable: true,
    });

    const run = async () => {
        try {
            return await callback();
        } finally {
            if (originalDescriptor) {
                Object.defineProperty(openaiModule, "OpenAI", originalDescriptor);
            }
        }
    };

    return run();
}

function withMockedReadStreams(callback) {
    const originalCreateReadStream = fs.createReadStream;
    const createdStreams = [];

    fs.createReadStream = (filePath) => {
        const streamHandle = { kind: "read-stream", filePath };
        createdStreams.push(streamHandle);
        return streamHandle;
    };

    const run = async () => {
        try {
            await callback(createdStreams);
        } finally {
            fs.createReadStream = originalCreateReadStream;
        }
    };

    return run();
}

function createFakeImageStream(events) {
    return {
        async *[Symbol.asyncIterator]() {
            for (const event of events) {
                yield event;
            }
        },
    };
}

const imagesHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "images", "help.html"),
    "utf8"
);
const imagesExample = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "examples", "images.json"), "utf8")
);

test("createImage forwards current Image 2 payloads unchanged and returns response.data", async () => {
    const calls = [];
    const requestPayload = {
        model: "gpt-image-2",
        prompt: "Create a widescreen transit poster with crisp typography.",
        size: "1536x864",
        background: "auto",
        output_format: "png",
        quality: "auto",
    };

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.images = {
                generate: async (payload) => {
                    calls.push({ method: "images.generate", payload });
                    return {
                        data: [{ b64_json: "image_data_1" }],
                    };
                },
            };
        }
    }

    await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/images/methods.js");
        delete require.cache[modulePath];
        const imageMethods = require("../src/images/methods.js");

        const clientContext = { clientParams: { apiKey: "sk-test" } };
        const response = await imageMethods.createImage.call(clientContext, {
            payload: requestPayload,
        });

        assert.deepEqual(response, [{ b64_json: "image_data_1" }]);

        delete require.cache[modulePath];
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "images.generate",
            payload: requestPayload,
        },
    ]);
});

test("createImage emits streaming image events when stream is true", async () => {
    const calls = [];

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.images = {
                generate: async (payload) => {
                    calls.push({ method: "images.generate", payload });
                    return createFakeImageStream([
                        { type: "image.gen.partial_image", sequence_number: 1 },
                        { type: "image.gen.completed", sequence_number: 2 },
                    ]);
                },
            };
        }
    }

    await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/images/methods.js");
        delete require.cache[modulePath];
        const imageMethods = require("../src/images/methods.js");

        const sentMessages = [];
        const statuses = [];
        const node = {
            send: (msg) => sentMessages.push(msg),
            status: (status) => statuses.push(status),
        };

        const result = await imageMethods.createImage.call(
            { clientParams: { apiKey: "sk-test" } },
            {
                _node: node,
                msg: { topic: "image-stream" },
                payload: {
                    model: "gpt-image-2",
                    prompt: "Create a layered magazine cover illustration.",
                    size: "1536x1024",
                    background: "auto",
                    stream: true,
                    partial_images: 2,
                },
            }
        );

        assert.equal(result, undefined);
        assert.deepEqual(sentMessages, [
            {
                topic: "image-stream",
                payload: { type: "image.gen.partial_image", sequence_number: 1 },
            },
            {
                topic: "image-stream",
                payload: { type: "image.gen.completed", sequence_number: 2 },
            },
        ]);
        assert.deepEqual(statuses, [
            {
                fill: "green",
                shape: "dot",
                text: "OpenaiApi.status.streaming",
            },
            {},
        ]);

        delete require.cache[modulePath];
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "images.generate",
            payload: {
                model: "gpt-image-2",
                prompt: "Create a layered magazine cover illustration.",
                size: "1536x1024",
                background: "auto",
                stream: true,
                partial_images: 2,
            },
        },
    ]);
});

test("createImageEdit preserves single-image behavior and converts mask paths to streams", async () => {
    const calls = [];

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.images = {
                edit: async (payload) => {
                    calls.push({ method: "images.edit", payload });
                    return {
                        data: [{ b64_json: "edited_image" }],
                    };
                },
            };
        }
    }

    await withMockedReadStreams(async () => {
        await withMockedOpenAI(FakeOpenAI, async () => {
            const modulePath = require.resolve("../src/images/methods.js");
            delete require.cache[modulePath];
            const imageMethods = require("../src/images/methods.js");

            const response = await imageMethods.createImageEdit.call(
                { clientParams: { apiKey: "sk-test" } },
                {
                    payload: {
                        image: "/tmp/source.png",
                        mask: "/tmp/mask.png",
                        prompt: "Add a blue dot in the middle.",
                        model: "gpt-image-1.5",
                        size: "1024x1024",
                    },
                }
            );

            assert.deepEqual(response, [{ b64_json: "edited_image" }]);

            delete require.cache[modulePath];
        });
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "images.edit",
            payload: {
                image: { kind: "read-stream", filePath: "/tmp/source.png" },
                mask: { kind: "read-stream", filePath: "/tmp/mask.png" },
                prompt: "Add a blue dot in the middle.",
                model: "gpt-image-1.5",
                size: "1024x1024",
            },
        },
    ]);
});

test("createImageEdit accepts multiple image paths and emits edit stream events", async () => {
    const calls = [];

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.images = {
                edit: async (payload) => {
                    calls.push({ method: "images.edit", payload });
                    return createFakeImageStream([
                        { type: "image.edit.partial_image", sequence_number: 1 },
                        { type: "image.edit.completed", sequence_number: 2 },
                    ]);
                },
            };
        }
    }

    await withMockedReadStreams(async () => {
        await withMockedOpenAI(FakeOpenAI, async () => {
            const modulePath = require.resolve("../src/images/methods.js");
            delete require.cache[modulePath];
            const imageMethods = require("../src/images/methods.js");

            const sentMessages = [];
            const statuses = [];
            const node = {
                send: (msg) => sentMessages.push(msg),
                status: (status) => statuses.push(status),
            };

            const result = await imageMethods.createImageEdit.call(
                { clientParams: { apiKey: "sk-test" } },
                {
                    _node: node,
                    msg: { topic: "image-edit-stream" },
                    payload: {
                        image: ["/tmp/source-1.png", "/tmp/source-2.png"],
                        prompt: "Blend these two source images into one poster composition.",
                        model: "gpt-image-2",
                        size: "1536x1024",
                        background: "auto",
                        stream: true,
                        partial_images: 1,
                    },
                }
            );

            assert.equal(result, undefined);
            assert.deepEqual(sentMessages, [
                {
                    topic: "image-edit-stream",
                    payload: { type: "image.edit.partial_image", sequence_number: 1 },
                },
                {
                    topic: "image-edit-stream",
                    payload: { type: "image.edit.completed", sequence_number: 2 },
                },
            ]);
            assert.deepEqual(statuses, [
                {
                    fill: "green",
                    shape: "dot",
                    text: "OpenaiApi.status.streaming",
                },
                {},
            ]);

            delete require.cache[modulePath];
        });
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "images.edit",
            payload: {
                image: [
                    { kind: "read-stream", filePath: "/tmp/source-1.png" },
                    { kind: "read-stream", filePath: "/tmp/source-2.png" },
                ],
                prompt: "Blend these two source images into one poster composition.",
                model: "gpt-image-2",
                size: "1536x1024",
                background: "auto",
                stream: true,
                partial_images: 1,
            },
        },
    ]);
});

test("Images help and example flow describe the current Image 2 contract", () => {
    assert.match(imagesHelp, /gpt-image-2/);
    assert.match(imagesHelp, /gpt-image-2-2026-04-21/);
    assert.match(imagesHelp, /gpt-image-1\.5/);
    assert.match(imagesHelp, /chatgpt-image-latest/);
    assert.match(imagesHelp, /WIDTHxHEIGHT/);
    assert.match(imagesHelp, /1536x864/);
    assert.match(imagesHelp, /divisible by 16/);
    assert.match(imagesHelp, /do\s+not support transparent backgrounds/);
    assert.match(imagesHelp, /emits image stream events/);
    assert.match(imagesHelp, /string \| string\[\]/);

    const createImageInject = imagesExample.find(
        (node) => node.type === "inject" && node.name === "Create Image 2 Request"
    );
    assert.ok(createImageInject, "Expected Image 2 generate example inject node");
    assert.deepEqual(createImageInject.props, [
        { p: "payload.model", v: "gpt-image-2", vt: "str" },
        {
            p: "payload.prompt",
            v: "Create a widescreen transit poster with crisp typography and a sunrise skyline.",
            vt: "str",
        },
        { p: "payload.size", v: "1536x864", vt: "str" },
        { p: "payload.background", v: "auto", vt: "str" },
        { p: "payload.output_format", v: "png", vt: "str" },
    ]);

    const streamInject = imagesExample.find(
        (node) => node.type === "inject" && node.name === "Create Streaming Image 2 Request"
    );
    assert.ok(streamInject, "Expected streaming image example inject node");
    assert.equal(
        streamInject.props.find((prop) => prop.p === "payload.stream")?.v,
        "true"
    );
    assert.equal(
        streamInject.props.find((prop) => prop.p === "payload.partial_images")?.v,
        "2"
    );

    const editInject = imagesExample.find(
        (node) => node.type === "inject" && node.name === "Create Multi-Image Edit Request"
    );
    assert.ok(editInject, "Expected multi-image edit example inject node");
    assert.equal(
        editInject.props.find((prop) => prop.p === "payload.image[0]")?.v,
        "/path/to/source-1.png"
    );
    assert.equal(
        editInject.props.find((prop) => prop.p === "payload.image[1]")?.v,
        "/path/to/source-2.png"
    );
    assert.equal(
        editInject.props.find((prop) => prop.p === "payload.model")?.v,
        "gpt-image-2"
    );
    assert.equal(
        editInject.props.find((prop) => prop.p === "payload.background")?.v,
        "auto"
    );
});