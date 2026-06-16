"use strict";

// This file keeps the Batch contract honest.
// It checks that batch payloads still pass through cleanly.

const assert = require("node:assert/strict");
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
