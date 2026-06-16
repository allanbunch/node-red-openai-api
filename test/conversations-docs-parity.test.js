"use strict";

// This file keeps the Conversations create-item contract honest.
// It checks that items arrays, additional tools, and assistant-message phase values pass through cleanly.

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

const examplePath = path.join(__dirname, "..", "examples", "conversations.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

const additionalToolsItem = {
    type: "additional_tools",
    role: "developer",
    id: "item_tools_shipping_lookup",
    tools: [
        {
            type: "function",
            name: "lookup_shipping_options",
            description: "Look up available shipping options for an order.",
            parameters: {
                type: "object",
                properties: {
                    order_id: { type: "string" },
                },
                required: ["order_id"],
                additionalProperties: false,
            },
            strict: true,
        },
    ],
};

test("createConversationItem forwards additional_tools items and assistant-message phase unchanged", async () => {
    const calls = [];
    const requestPayload = {
        conversation_id: "conv_1",
        items: [
            additionalToolsItem,
            {
                type: "message",
                role: "assistant",
                phase: "commentary",
                content: [
                    {
                        type: "output_text",
                        text: "I will work through the request before answering.",
                    },
                ],
            },
            {
                type: "message",
                role: "assistant",
                phase: "final_answer",
                content: [
                    {
                        type: "output_text",
                        text: "Here is the completed answer.",
                    },
                ],
            },
        ],
    };

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.conversations = {
                items: {
                    create: async (conversationId, body) => {
                        calls.push({ method: "conversations.items.create", conversationId, body });
                        return { id: "item_new" };
                    },
                },
            };
        }
    }

    await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/conversations/methods.js");
        delete require.cache[modulePath];
        const conversationMethods = require("../src/conversations/methods.js");

        const clientContext = {
            clientParams: {
                apiKey: "sk-test",
                baseURL: "https://api.example.com/v1",
            },
        };

        const response = await conversationMethods.createConversationItem.call(clientContext, {
            payload: requestPayload,
        });

        assert.deepEqual(response, { id: "item_new" });

        delete require.cache[modulePath];
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "conversations.items.create",
            conversationId: "conv_1",
            body: {
                items: requestPayload.items,
            },
        },
    ]);
});

test("Conversations example flow uses items arrays and preserved assistant-message phase values", () => {
    const methods = exampleNodes
        .filter((node) => node.type === "OpenAI API")
        .map((node) => node.method);

    assert.deepEqual(methods, ["createConversationItem"]);

    const openaiNode = exampleNodes.find((node) => node.type === "OpenAI API");
    assert.equal(openaiNode.property, "payload");
    assert.equal(openaiNode.service, "");

    const injectNode = exampleNodes.find(
        (node) => node.type === "inject" && node.name === "Add Phased Conversation Items"
    );
    assert.ok(injectNode);

    assert.equal(
        injectNode.props.some((prop) => prop.p === "payload.conversation_id"),
        true
    );
    assert.equal(
        injectNode.props.some((prop) => prop.p === "payload.items"),
        true
    );

    const items = JSON.parse(injectNode.props.find((prop) => prop.p === "payload.items").v);
    assert.equal(Array.isArray(items), true);
    assert.equal(items.some((item) => item.type === "additional_tools" && item.role === "developer"), true);
    assert.equal(items.some((item) => item.type === "additional_tools" && item.id === "item_tools_shipping_lookup"), true);
    assert.equal(items.some((item) => item.type === "additional_tools" && item.tools[0].name === "lookup_shipping_options"), true);
    assert.equal(items.some((item) => item.role === "assistant" && item.phase === "commentary"), true);
    assert.equal(items.some((item) => item.role === "assistant" && item.phase === "final_answer"), true);

});
