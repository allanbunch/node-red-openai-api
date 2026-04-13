"use strict";

// This file keeps the audio contract honest.
// It checks that speech payloads still pass through cleanly and that the user-facing docs match the current custom-voice support in the SDK.

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
const audioHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "audio", "help.html"),
  "utf8"
);

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

test("README and Audio help describe the widened custom-voice contract", () => {
  assert.doesNotMatch(readme, /openai` Node SDK `\^6\.29\.0`/);
  assert.match(readme, /openai` Node SDK `\^6\.34\.0`/);
  assert.match(
    readme,
    /Audio speech support with built-in voices and saved custom voice ids/
  );
  assert.match(audioHelp, /string or object/);
  assert.match(audioHelp, /custom voice object/);
  assert.match(audioHelp, /voice_1234/);
  assert.match(audioHelp, /ballad/);
  assert.match(audioHelp, /verse/);
  assert.match(audioHelp, /marin/);
  assert.match(audioHelp, /cedar/);
});
