"use strict";

// This file keeps the NOA-67, NOA-78, and NOA-124 Responses request-shape claims honest.
// It proves current SDK fields pass through unchanged on the supported paths and that examples keep the same structured payloads.

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

const webSearchExample = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "examples", "responses", "web-search.json"),
    "utf8"
  )
);

const additionalToolsInputItem = {
  type: "additional_tools",
  role: "developer",
  id: "item_tools_release_lookup",
  tools: [
    {
      type: "function",
      name: "lookup_release_note",
      description: "Look up release notes by ticket id.",
      parameters: {
        type: "object",
        properties: {
          ticket_id: { type: "string" },
        },
        required: ["ticket_id"],
        additionalProperties: false,
      },
      strict: true,
    },
  ],
};

test("responses create forwards additional_tools, input_file detail, include, prompt cache retention, and top_logprobs unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4",
    input: [
      additionalToolsInputItem,
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Summarize the attached release notes and recent public coverage.",
          },
        ],
      },
      {
        type: "input_file",
        file_id: "file_release_notes",
        detail: "high",
      },
    ],
    tools: [{ type: "web_search" }],
    include: ["web_search_call.results", "message.output_text.logprobs"],
    prompt_cache_retention: "in_memory",
    top_logprobs: 3,
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        create: async (payload) => {
          calls.push({ method: "responses.create", payload });
          return { id: "resp_parity_create", status: "completed" };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await responsesMethods.createModelResponse.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, { id: "resp_parity_create", status: "completed" });

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.create",
      payload: requestPayload,
    },
  ]);
});

test("responses stream helper forwards additional_tools and the same newer request fields unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4-mini",
    input: [
      additionalToolsInputItem,
      {
        type: "input_file",
        file_id: "file_release_notes",
        detail: "high",
      },
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Search the web for recent context and summarize the document.",
          },
        ],
      },
    ],
    tools: [{ type: "web_search" }],
    include: ["web_search_call.results", "message.output_text.logprobs"],
    prompt_cache_retention: "in_memory",
    top_logprobs: 3,
  };

  function createFakeResponseStream() {
    return {
      async *[Symbol.asyncIterator]() {
        yield { type: "response.in_progress", sequence_number: 1 };
        yield { type: "response.completed", sequence_number: 2 };
      },
      async finalResponse() {
        return { id: "resp_stream_parity", status: "completed" };
      },
    };
  }

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        stream: (payload) => {
          calls.push({ method: "responses.stream", payload });
          return createFakeResponseStream();
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };
    const node = {
      send: () => {},
      status: () => {},
    };

    const finalResponse = await responsesMethods.streamModelResponse.call(clientContext, {
      _node: node,
      msg: { topic: "responses-stream-parity" },
      payload: requestPayload,
    });

    assert.deepEqual(finalResponse, { id: "resp_stream_parity", status: "completed" });

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.stream",
      payload: requestPayload,
    },
  ]);
});

test("responses compact forwards service_tier, prompt_cache_retention, and input_file detail unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4",
    input: [
      {
        type: "input_file",
        file_id: "file_release_notes",
        detail: "high",
      },
    ],
    prompt_cache_key: "responses-compact-proof-v1",
    prompt_cache_retention: "in_memory",
    service_tier: "auto",
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        compact: async (payload) => {
          calls.push({ method: "responses.compact", payload });
          return { id: "compaction_2", object: "response.compaction" };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await responsesMethods.compactModelResponse.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, { id: "compaction_2", object: "response.compaction" });

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.compact",
      payload: requestPayload,
    },
  ]);
});

test("responses input token count forwards personality unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4-mini",
    input: "Count these tokens with a friendly style preset.",
    personality: "friendly",
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        inputTokens: {
          count: async (payload) => {
            calls.push({ method: "responses.inputTokens.count", payload });
            return { object: "response.input_tokens", input_tokens: 12 };
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await responsesMethods.countInputTokens.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, { object: "response.input_tokens", input_tokens: 12 });

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.inputTokens.count",
      payload: requestPayload,
    },
  ]);
});

test("Responses web-search example keeps the newer request-shape fields discoverable", () => {
  assert.ok(Array.isArray(webSearchExample));

  const openaiNode = webSearchExample.find((entry) => entry.type === "OpenAI API");
  const injectNode = webSearchExample.find(
    (entry) => entry.type === "inject" && entry.name === "Create Web Search Request"
  );

  assert.ok(openaiNode);
  assert.equal(openaiNode.method, "createModelResponse");
  assert.ok(injectNode);

  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.prompt_cache_retention").v,
    "in_memory"
  );
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.top_logprobs").v,
    "3"
  );
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.include[0]").v,
    "web_search_call.results"
  );
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.include[1]").v,
    "message.output_text.logprobs"
  );
  assert.deepEqual(
    JSON.parse(injectNode.props.find((prop) => prop.p === "ai.tools[0]").v),
    { type: "web_search", search_context_size: "medium" }
  );
});
