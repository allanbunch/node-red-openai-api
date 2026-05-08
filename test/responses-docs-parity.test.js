"use strict";

// This file keeps the NOA-67 Responses request-shape claims honest.
// It proves current SDK fields pass through unchanged on the supported paths and that the local docs/examples use the same contract terms.

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
const webSearchExample = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "examples", "responses", "web-search.json"),
    "utf8"
  )
);

function getHelpSection(startTitle, endTitle) {
  const escapedStart = startTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = endTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = responsesHelp.match(
    new RegExp(`${escapedStart}([\\s\\S]*?)${escapedEnd}`)
  );

  assert.ok(match, `Expected help section between ${startTitle} and ${endTitle}`);
  return match[1];
}

function listFilesRecursively(rootPath) {
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });
  const filePaths = [];

  for (const entry of entries) {
    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      filePaths.push(...listFilesRecursively(entryPath));
      continue;
    }
    filePaths.push(entryPath);
  }

  return filePaths;
}

test("responses create forwards input_file detail, include, prompt cache retention, and top_logprobs unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4",
    input: [
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

test("responses stream helper forwards the same newer request fields unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4-mini",
    input: [
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

test("responses compact forwards prompt_cache_retention and input_file detail unchanged", async () => {
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

test("Responses help and README describe the current request shape without translation wording", () => {
  const createHelp = getHelpSection(
    "<h4 style=\"font-weight: bolder;\"> ⋙ Create Model Response</h4>",
    "<h4 style=\"font-weight: bolder;\"> ⋙ Parse Model Response</h4>"
  );
  const streamHelp = getHelpSection(
    "<h4 style=\"font-weight: bolder;\"> ⋙ Stream Model Response</h4>",
    "<h4 style=\"font-weight: bolder;\"> ⋙ Delete Model Response</h4>"
  );
  const compactHelp = getHelpSection(
    "<h4 style=\"font-weight: bolder;\"> ⋙ Compact Model Response</h4>",
    "<h4 style=\"font-weight: bolder;\"> ⋙ List Input Items</h4>"
  );

  assert.match(createHelp, /input_file/);
  assert.match(createHelp, /detail/);
  assert.match(createHelp, /web_search_call\.results/);
  assert.match(createHelp, /message\.output_text\.logprobs/);
  assert.match(createHelp, /prompt_cache_retention/);
  assert.match(createHelp, /in_memory/);
  assert.match(createHelp, /top_logprobs/);

  assert.match(streamHelp, /same request body shape as/);
  assert.match(streamHelp, /prompt_cache_retention/);
  assert.match(streamHelp, /top_logprobs/);

  assert.match(compactHelp, /prompt_cache_retention/);
  assert.match(compactHelp, /in_memory/);

  assert.match(readme, /examples\/responses\/web-search\.json/);
  assert.match(readme, /input_file\.detail/);
  assert.match(readme, /web_search_call\.results/);
  assert.match(readme, /prompt_cache_retention` values such as `in_memory`/);
  assert.match(readme, /top_logprobs/);
  assert.match(readme, /direct SDK pass-throughs/);
});

test("Responses web-search example keeps the newer request-shape fields discoverable", () => {
  assert.ok(Array.isArray(webSearchExample));

  const openaiNode = webSearchExample.find((entry) => entry.type === "OpenAI API");
  const injectNode = webSearchExample.find(
    (entry) => entry.type === "inject" && entry.name === "Create Web Search Request"
  );
  const commentNodes = webSearchExample.filter((entry) => entry.type === "comment");
  const tabNode = webSearchExample.find((entry) => entry.type === "tab");

  assert.ok(openaiNode);
  assert.equal(openaiNode.method, "createModelResponse");
  assert.ok(injectNode);
  assert.ok(commentNodes.length >= 1);
  assert.ok(tabNode);

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

  assert.match(tabNode.info, /passes the SDK request body through unchanged/);
  assert.match(tabNode.info, /in_memory/);
  assert.match(tabNode.info, /top_logprobs/);
});

test("Responses docs scan rejects stale in-memory wording in repo-owned support claims", () => {
  const filesToScan = [
    path.join(__dirname, "..", "README.md"),
    path.join(__dirname, "..", "src", "responses", "help.html"),
    ...listFilesRecursively(path.join(__dirname, "..", "examples", "responses")),
    ...listFilesRecursively(path.join(__dirname, "..", "features", "responses")),
  ];

  for (const filePath of filesToScan) {
    const contents = fs.readFileSync(filePath, "utf8");
    assert.doesNotMatch(contents, /in-memory/, `Did not expect stale in-memory wording in ${filePath}`);
  }
});