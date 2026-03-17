"use strict";

// This file keeps the Batch contract honest.
// It checks that batch payloads still pass through cleanly and that the user-facing Batch help matches the widened endpoint support in the SDK.

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

const batchHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "batch", "help.html"),
  "utf8"
);

test("createBatch forwards a /v1/videos endpoint payload unchanged to the OpenAI SDK", async () => {
  const calls = [];
  const requestPayload = {
    input_file_id: "file_batch_123",
    endpoint: "/v1/videos",
    completion_window: "24h",
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.batches = {
        create: async (payload) => {
          calls.push({ method: "batches.create", payload });
          return { id: "batch_123", endpoint: payload.endpoint };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/batch/methods.js");
    delete require.cache[modulePath];
    const batchMethods = require("../src/batch/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await batchMethods.createBatch.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, {
      id: "batch_123",
      endpoint: "/v1/videos",
    });

    delete require.cache[modulePath];
  });

  const createCalls = calls.filter((entry) => entry.method === "batches.create");
  assert.deepEqual(createCalls, [
    {
      method: "batches.create",
      payload: requestPayload,
    },
  ]);
});

test("Batch help describes the widened batch endpoint contract including /v1/videos", () => {
  assert.match(batchHelp, /\/v1\/responses/);
  assert.match(batchHelp, /\/v1\/chat\/completions/);
  assert.match(batchHelp, /\/v1\/embeddings/);
  assert.match(batchHelp, /\/v1\/completions/);
  assert.match(batchHelp, /\/v1\/moderations/);
  assert.match(batchHelp, /\/v1\/images\/generations/);
  assert.match(batchHelp, /\/v1\/images\/edits/);
  assert.match(batchHelp, /\/v1\/videos/);
  assert.doesNotMatch(batchHelp, /Currently only \/v1\/chat\/completions is supported/);
});
