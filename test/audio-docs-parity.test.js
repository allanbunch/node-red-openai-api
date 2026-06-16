"use strict";

// This file keeps the audio contract honest.
// It checks that speech payloads still pass through cleanly.

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

test("createSpeech forwards a custom voice object unchanged to the OpenAI SDK", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-4o-mini-tts",
    input: "Read this in a calm voice.",
    voice: {
      id: "voice_1234",
    },
  };

  class FakeSpeechResponse {
    async arrayBuffer() {
      return Uint8Array.from([1, 2, 3]).buffer;
    }
  }

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.audio = {
        speech: {
          create: async (payload) => {
            calls.push({ method: "audio.speech.create", payload });
            return new FakeSpeechResponse();
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/audio/methods.js");
    delete require.cache[modulePath];
    const audioMethods = require("../src/audio/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await audioMethods.createSpeech.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(Array.from(response.values()), [1, 2, 3]);

    delete require.cache[modulePath];
  });

  const speechCalls = calls.filter((entry) => entry.method === "audio.speech.create");
  assert.deepEqual(speechCalls, [
    {
      method: "audio.speech.create",
      payload: requestPayload,
    },
  ]);
});
