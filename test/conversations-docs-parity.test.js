"use strict";

// This file keeps the Conversations create-item contract honest.
// It checks that items arrays and assistant-message phase values pass through cleanly and that the help text matches the upstream published contract.

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

const conversationsHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "conversations", "help.html"),
    "utf8"
);

function getCreateConversationItemHelpSection() {
    const match = conversationsHelp.match(
        /<h4 style="font-weight: bolder;"> ⋙ Create Conversation Item<\/h4>([\s\S]*?)<h4 style="font-weight: bolder;"> ⋙ Retrieve Conversation Item<\/h4>/
    );

    assert.ok(match, "Expected Create Conversation Item help section to exist");
    return match[1];
}

test("createConversationItem forwards items arrays and assistant-message phase unchanged", async () => {
    const calls = [];
    const requestPayload = {
        conversation_id: "conv_1",
        items: [
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

test("Conversations help documents the items contract and assistant-only phase guidance", () => {
    const createConversationItemHelp = getCreateConversationItemHelpSection();

    assert.match(createConversationItemHelp, /items/);
    assert.match(createConversationItemHelp, /array/);
    assert.doesNotMatch(createConversationItemHelp, /<dt>\s*item\s*<span class="property-type">object<\/span>/);
    assert.match(createConversationItemHelp, /assistant/i);
    assert.match(createConversationItemHelp, /commentary/);
    assert.match(createConversationItemHelp, /final_answer/);
    assert.match(createConversationItemHelp, /degrade performance/i);
    assert.match(createConversationItemHelp, /not required for user messages/i);
});