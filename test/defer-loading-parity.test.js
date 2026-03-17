"use strict";

// This file keeps the defer_loading tool contract honest.
// It proves the node forwards deferred MCP tool definitions unchanged and that the docs/examples still describe the current Responses tool-search shape.

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
const toolSearchExample = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "examples", "responses", "tool-search.json"),
    "utf8"
  )
);

test("responses create forwards deferred MCP tool definitions unchanged", async () => {
  const calls = [];
  const requestPayload = {
    model: "gpt-5.4-mini",
    tools: [
      { type: "tool_search" },
      {
        type: "mcp",
        server_label: "deepwiki",
        server_url: "https://mcp.deepwiki.com/mcp",
        require_approval: "never",
        defer_loading: true,
      },
    ],
    input: "Use the available documentation tools to summarize MCP transports.",
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        create: async (payload) => {
          calls.push({ method: "responses.create", payload });
          return { id: "resp_deferred", status: "completed" };
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

    assert.deepEqual(response, { id: "resp_deferred", status: "completed" });

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.create",
      payload: requestPayload,
    },
  ]);
});

test("tool-search docs and example keep defer_loading explicit", () => {
  assert.match(readme, /deferred MCP loading via `defer_loading`/);
  assert.match(responsesHelp, /defer_loading: true/);
  assert.match(responsesHelp, /Deferred tool loading is supported/);

  const injectNode = toolSearchExample.find(
    (entry) => entry.type === "inject" && entry.name === "Create Tool Search Request"
  );
  assert.ok(injectNode);

  const toolSearchTool = JSON.parse(
    injectNode.props.find((prop) => prop.p === "ai.tools[0]").v
  );
  const deferredMcpTool = JSON.parse(
    injectNode.props.find((prop) => prop.p === "ai.tools[1]").v
  );

  assert.deepEqual(toolSearchTool, { type: "tool_search" });
  assert.deepEqual(deferredMcpTool, {
    type: "mcp",
    server_label: "deepwiki",
    server_url: "https://mcp.deepwiki.com/mcp",
    require_approval: "never",
    defer_loading: true,
  });

  const exampleTab = toolSearchExample.find((entry) => entry.type === "tab");
  assert.ok(exampleTab);
  assert.match(exampleTab.info, /defer_loading: true/);
});
