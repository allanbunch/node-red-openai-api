"use strict";

// This file keeps the defer_loading tool contract honest.
// It proves the node forwards deferred MCP and additional tool shapes unchanged and that the docs/examples still describe the current Responses tool-search shape.

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
  assert.match(responsesHelp, /defer_loading: true/);
  assert.match(responsesHelp, /Deferred tool loading is supported/);
  assert.match(responsesHelp, /additional_tools/);

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
  const additionalToolsItem = JSON.parse(
    injectNode.props.find((prop) => prop.p === "ai.input[0]").v
  );
  const userMessage = JSON.parse(
    injectNode.props.find((prop) => prop.p === "ai.input[1]").v
  );

  assert.deepEqual(toolSearchTool, { type: "tool_search" });
  assert.deepEqual(deferredMcpTool, {
    type: "mcp",
    server_label: "deepwiki",
    server_url: "https://mcp.deepwiki.com/mcp",
    require_approval: "never",
    defer_loading: true,
  });
  assert.equal(additionalToolsItem.type, "additional_tools");
  assert.equal(additionalToolsItem.role, "developer");
  assert.equal(additionalToolsItem.id, "item_tools_transport_lookup");
  assert.equal(additionalToolsItem.tools[0].type, "function");
  assert.equal(additionalToolsItem.tools[0].name, "lookup_transport_notes");
  assert.equal(userMessage.type, "message");
  assert.equal(userMessage.role, "user");

  const exampleTab = toolSearchExample.find((entry) => entry.type === "tab");
  assert.ok(exampleTab);
  assert.match(exampleTab.info, /defer_loading: true/);
  assert.match(exampleTab.info, /additional_tools/);
});
