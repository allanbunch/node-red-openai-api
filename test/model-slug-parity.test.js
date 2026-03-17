"use strict";

// This file keeps the newer gpt-5.4 mini/nano slug contract honest.
// It proves the node forwards the new v6.32.0 model ids unchanged and that the visible docs/examples mention the current slug set.

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

const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
const responsesHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "responses", "help.html"),
  "utf8"
);
const responsesWebsocketExample = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "examples", "responses", "websocket.json"),
    "utf8"
  )
);

test("responses and chat methods forward gpt-5.4 mini/nano slugs unchanged", async () => {
  const calls = [];
  const models = [
    "gpt-5.4-mini",
    "gpt-5.4-nano",
    "gpt-5.4-mini-2026-03-17",
    "gpt-5.4-nano-2026-03-17",
  ];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        create: async (payload) => {
          calls.push({ method: "responses.create", payload });
          return { id: `resp_${payload.model}` };
        },
      };
      this.chat = {
        completions: {
          create: async (payload) => {
            calls.push({ method: "chat.completions.create", payload });
            return { id: `chat_${payload.model}` };
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const responsesModulePath = require.resolve("../src/responses/methods.js");
    const chatModulePath = require.resolve("../src/chat/methods.js");
    delete require.cache[responsesModulePath];
    delete require.cache[chatModulePath];

    const responsesMethods = require("../src/responses/methods.js");
    const chatMethods = require("../src/chat/methods.js");
    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    for (const model of models) {
      const response = await responsesMethods.createModelResponse.call(clientContext, {
        payload: {
          model,
          input: "Summarize the rollout status in one sentence.",
        },
      });

      assert.deepEqual(response, { id: `resp_${model}` });
    }

    for (const model of models) {
      const response = await chatMethods.createChatCompletion.call(clientContext, {
        payload: {
          model,
          messages: [{ role: "user", content: "Say hello." }],
        },
      });

      assert.deepEqual(response, { id: `chat_${model}` });
    }

    delete require.cache[responsesModulePath];
    delete require.cache[chatModulePath];
  });

  assert.deepEqual(
    calls.filter((entry) => entry.method !== "ctor"),
    [
      {
        method: "responses.create",
        payload: {
          model: "gpt-5.4-mini",
          input: "Summarize the rollout status in one sentence.",
        },
      },
      {
        method: "responses.create",
        payload: {
          model: "gpt-5.4-nano",
          input: "Summarize the rollout status in one sentence.",
        },
      },
      {
        method: "responses.create",
        payload: {
          model: "gpt-5.4-mini-2026-03-17",
          input: "Summarize the rollout status in one sentence.",
        },
      },
      {
        method: "responses.create",
        payload: {
          model: "gpt-5.4-nano-2026-03-17",
          input: "Summarize the rollout status in one sentence.",
        },
      },
      {
        method: "chat.completions.create",
        payload: {
          model: "gpt-5.4-mini",
          messages: [{ role: "user", content: "Say hello." }],
        },
      },
      {
        method: "chat.completions.create",
        payload: {
          model: "gpt-5.4-nano",
          messages: [{ role: "user", content: "Say hello." }],
        },
      },
      {
        method: "chat.completions.create",
        payload: {
          model: "gpt-5.4-mini-2026-03-17",
          messages: [{ role: "user", content: "Say hello." }],
        },
      },
      {
        method: "chat.completions.create",
        payload: {
          model: "gpt-5.4-nano-2026-03-17",
          messages: [{ role: "user", content: "Say hello." }],
        },
      },
    ]
  );
});

test("README, Responses help, and websocket example reflect the current gpt-5.4 mini/nano slug set", () => {
  assert.match(readme, /"model": "gpt-5\.4-mini"/);
  assert.match(readme, /gpt-5\.4-mini/);
  assert.match(readme, /gpt-5\.4-nano/);
  assert.match(readme, /gpt-5\.4-mini-2026-03-17/);

  assert.match(responsesHelp, /gpt-5\.4-mini/);
  assert.match(responsesHelp, /gpt-5\.4-nano/);
  assert.match(responsesHelp, /gpt-5\.4-mini-2026-03-17/);

  const websocketInjectNode = responsesWebsocketExample.find(
    (node) => node.name === "Send response.create Event"
  );
  assert.ok(websocketInjectNode);

  const websocketEventProperty = websocketInjectNode.props.find(
    (prop) => prop.p === "ai.event"
  );
  assert.ok(websocketEventProperty);

  const websocketEvent = JSON.parse(websocketEventProperty.v);
  assert.deepEqual(websocketEvent, {
    type: "response.create",
    model: "gpt-5.4-nano-2026-03-17",
    input: "Say hello from Responses websocket mode in one sentence.",
  });
});
