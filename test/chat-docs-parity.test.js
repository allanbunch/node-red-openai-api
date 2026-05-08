"use strict";

// This file keeps the Chat top_logprobs contract honest.
// It proves chat-completions requests still pass top_logprobs through unchanged and that the help text matches the current SDK wording.

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

const chatHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "chat", "help.html"),
    "utf8"
);

function getCreateChatCompletionHelpSection() {
    const match = chatHelp.match(
        /<h4 style="font-weight: bolder;"> ⋙ Create Chat Completion<\/h4>([\s\S]*?)<h4 style="font-weight: bolder;"> ⋙ Get Chat Completion<\/h4>/
    );

    assert.ok(match, "Expected Create Chat Completion help section to exist");
    return match[1];
}

test("createChatCompletion forwards top_logprobs unchanged to the OpenAI SDK", async () => {
    const calls = [];
    const requestPayload = {
        model: "gpt-5.4-mini",
        messages: [{ role: "user", content: "Summarize the rollout status." }],
        logprobs: true,
        top_logprobs: 20,
    };

    class FakeOpenAI {
        constructor(clientParams) {
            calls.push({ method: "ctor", clientParams });
            this.chat = {
                completions: {
                    create: async (payload) => {
                        calls.push({ method: "chat.completions.create", payload });
                        return { id: "chat_top_logprobs", choices: [] };
                    },
                },
            };
        }
    }

    await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/chat/methods.js");
        delete require.cache[modulePath];
        const chatMethods = require("../src/chat/methods.js");

        const clientContext = {
            clientParams: {
                apiKey: "sk-test",
                baseURL: "https://api.example.com/v1",
            },
        };

        const response = await chatMethods.createChatCompletion.call(clientContext, {
            payload: requestPayload,
        });

        assert.deepEqual(response, { id: "chat_top_logprobs", choices: [] });

        delete require.cache[modulePath];
    });

    assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
        {
            method: "chat.completions.create",
            payload: requestPayload,
        },
    ]);
});

test("Chat help documents the current top_logprobs range and usage requirements", () => {
    const createHelp = getCreateChatCompletionHelpSection();

    assert.match(createHelp, /top_logprobs/);
    assert.match(createHelp, /between 0 and 20/);
    assert.match(createHelp, /fewer\s+than requested/);
    assert.match(createHelp, /logprobs<\/code> to <code>true/);
    assert.doesNotMatch(createHelp, /between 0 and 5/);
});