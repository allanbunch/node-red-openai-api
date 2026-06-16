"use strict";

// This file is the broad API surface sanity check.
// It proves our method wrappers, examples, and help text still line up with the OpenAI SDK contract.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const adminNoa81EditorMethods = [
  ["getOrganizationUsageFileSearchCalls", "retrieve organization usage file search calls", "Retrieve Organization Usage File Search Calls"],
  ["getOrganizationUsageWebSearchCalls", "retrieve organization usage web search calls", "Retrieve Organization Usage Web Search Calls"],
  ["getOrganizationDataRetention", "retrieve organization data retention", "Retrieve Organization Data Retention"],
  ["modifyOrganizationDataRetention", "modify organization data retention", "Modify Organization Data Retention"],
  ["createOrganizationSpendAlert", "create organization spend alert", "Create Organization Spend Alert"],
  ["modifyOrganizationSpendAlert", "modify organization spend alert", "Modify Organization Spend Alert"],
  ["listOrganizationSpendAlerts", "list organization spend alerts", "List Organization Spend Alerts"],
  ["deleteOrganizationSpendAlert", "delete organization spend alert", "Delete Organization Spend Alert"],
  ["getProjectDataRetention", "retrieve project data retention", "Retrieve Project Data Retention"],
  ["modifyProjectDataRetention", "modify project data retention", "Modify Project Data Retention"],
  ["createProjectSpendAlert", "create project spend alert", "Create Project Spend Alert"],
  ["modifyProjectSpendAlert", "modify project spend alert", "Modify Project Spend Alert"],
  ["listProjectSpendAlerts", "list project spend alerts", "List Project Spend Alerts"],
  ["deleteProjectSpendAlert", "delete project spend alert", "Delete Project Spend Alert"],
  ["getProjectModelPermissions", "retrieve project model permissions", "Retrieve Project Model Permissions"],
  ["modifyProjectModelPermissions", "modify project model permissions", "Modify Project Model Permissions"],
  ["deleteProjectModelPermissions", "delete project model permissions", "Delete Project Model Permissions"],
  ["getProjectHostedToolPermissions", "retrieve project hosted tool permissions", "Retrieve Project Hosted Tool Permissions"],
  ["modifyProjectHostedToolPermissions", "modify project hosted tool permissions", "Modify Project Hosted Tool Permissions"],
  ["getOrganizationUserRole", "retrieve organization user role", "Retrieve Organization User Role"],
  ["getOrganizationGroup", "retrieve organization group", "Retrieve Organization Group"],
  ["getOrganizationGroupUser", "retrieve organization group user", "Retrieve Organization Group User"],
  ["getOrganizationGroupRole", "retrieve organization group role", "Retrieve Organization Group Role"],
  ["getOrganizationRole", "retrieve organization role", "Retrieve Organization Role"],
  ["modifyProjectServiceAccount", "modify project service account", "Modify Project Service Account"],
  ["getProjectUserRole", "retrieve project user role", "Retrieve Project User Role"],
  ["getProjectGroup", "retrieve project group", "Retrieve Project Group"],
  ["getProjectGroupRole", "retrieve project group role", "Retrieve Project Group Role"],
  ["getProjectRole", "retrieve project role", "Retrieve Project Role"],
];

const workloadIdentityAuditEventTypes = [
  "workload_identity_provider.created",
  "workload_identity_provider.updated",
  "workload_identity_provider.deleted",
  "workload_identity_provider_mapping.created",
  "workload_identity_provider_mapping.updated",
  "workload_identity_provider_mapping.deleted",
];

function helpSection(html, startTitle, endTitle) {
  const pattern = new RegExp(`${startTitle}[\\s\\S]*?(?=${endTitle})`);
  const match = html.match(pattern);
  assert.ok(match, `Expected help section between ${startTitle} and ${endTitle}`);
  return match[0];
}

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

test("responses methods map parse/delete/cancel/compact/input-items/input-tokens to OpenAI SDK", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        parse: async (payload) => {
          calls.push({ method: "responses.parse", payload });
          return {
            id: "resp_parsed",
            output_parsed: { answer: "done" },
          };
        },
        delete: async (responseId, options) => {
          calls.push({ method: "responses.delete", responseId, options });
          return { id: responseId, deleted: true };
        },
        cancel: async (responseId, options) => {
          calls.push({ method: "responses.cancel", responseId, options });
          return { id: responseId, status: "cancelled" };
        },
        compact: async (payload) => {
          calls.push({ method: "responses.compact", payload });
          return { id: "compaction_1", object: "response.compaction" };
        },
        inputItems: {
          list: async (responseId, options) => {
            calls.push({ method: "responses.inputItems.list", responseId, options });
            return {
              data: [{ id: "item_1" }, { id: "item_2" }],
            };
          },
        },
        inputTokens: {
          count: async (payload) => {
            calls.push({ method: "responses.inputTokens.count", payload });
            return { object: "response.input_tokens", input_tokens: 42 };
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test", baseURL: "https://api.example.com/v1" } };

    const parsedResponse = await responsesMethods.parseModelResponse.call(clientContext, {
      payload: {
        model: "gpt-5.4-mini",
        input: "Return structured output.",
        text: {
          format: {
            type: "json_schema",
            name: "result",
            schema: {
              type: "object",
              properties: {
                answer: { type: "string" },
              },
              required: ["answer"],
              additionalProperties: false,
            },
          },
        },
      },
    });
    assert.deepEqual(parsedResponse, {
      id: "resp_parsed",
      output_parsed: { answer: "done" },
    });

    const deleteResponse = await responsesMethods.deleteModelResponse.call(clientContext, {
      payload: {
        response_id: "resp_123",
      },
    });
    assert.deepEqual(deleteResponse, { id: "resp_123", deleted: true });

    const cancelResponse = await responsesMethods.cancelModelResponse.call(clientContext, {
      payload: {
        response_id: "resp_123",
      },
    });
    assert.deepEqual(cancelResponse, { id: "resp_123", status: "cancelled" });

    const compactResponse = await responsesMethods.compactModelResponse.call(clientContext, {
      payload: {
        model: "gpt-5.2",
        input: [{ role: "user", content: [{ type: "text", text: "hi" }] }],
        service_tier: "auto",
      },
    });
    assert.deepEqual(compactResponse, {
      id: "compaction_1",
      object: "response.compaction",
    });

    const inputItems = await responsesMethods.listInputItems.call(clientContext, {
      payload: {
        response_id: "resp_123",
        order: "desc",
        include: ["message.input_image.image_url"],
      },
    });
    assert.deepEqual(inputItems, [{ id: "item_1" }, { id: "item_2" }]);

    const inputTokenCount = await responsesMethods.countInputTokens.call(clientContext, {
      payload: {
        model: "gpt-4.1-mini",
        input: "hello",
        personality: "friendly",
      },
    });
    assert.deepEqual(inputTokenCount, {
      object: "response.input_tokens",
      input_tokens: 42,
    });

    delete require.cache[modulePath];
  });

  const responseCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(responseCalls, [
    {
      method: "responses.parse",
      payload: {
        model: "gpt-5.4-mini",
        input: "Return structured output.",
        text: {
          format: {
            type: "json_schema",
            name: "result",
            schema: {
              type: "object",
              properties: {
                answer: { type: "string" },
              },
              required: ["answer"],
              additionalProperties: false,
            },
          },
        },
      },
    },
    {
      method: "responses.delete",
      responseId: "resp_123",
      options: {},
    },
    {
      method: "responses.cancel",
      responseId: "resp_123",
      options: {},
    },
    {
      method: "responses.compact",
      payload: {
        model: "gpt-5.2",
        input: [{ role: "user", content: [{ type: "text", text: "hi" }] }],
        service_tier: "auto",
      },
    },
    {
      method: "responses.inputItems.list",
      responseId: "resp_123",
      options: {
        order: "desc",
        include: ["message.input_image.image_url"],
      },
    },
    {
      method: "responses.inputTokens.count",
      payload: {
        model: "gpt-4.1-mini",
        input: "hello",
        personality: "friendly",
      },
    },
  ]);
});

test("responses create forwards phase, prompt_cache_key, tool_search, defer_loading, computer, and gpt-5.4-mini payloads", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        create: async (payload) => {
          calls.push({ method: "responses.create", payload });
          return { id: "resp_123", status: "completed" };
        },
      };
    }
  }

  const requestPayload = {
    model: "gpt-5.4-mini",
    prompt_cache_key: "responses-agentic-demo-v1",
    input: [
      {
        type: "additional_tools",
        role: "developer",
        id: "item_tools_release_lookup",
        tools: [
          {
            type: "function",
            name: "lookup_release_ticket",
            description: "Look up a release ticket by id.",
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
      },
      {
        type: "message",
        role: "assistant",
        phase: "commentary",
        content: [{ type: "output_text", text: "Planning the response." }],
      },
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Summarize the release work." }],
      },
    ],
    tools: [
      { type: "tool_search" },
      {
        type: "function",
        name: "lookup_release_ticket",
        description: "Look up a release ticket by id.",
        parameters: {
          type: "object",
          properties: {
            ticket_id: { type: "string" },
          },
          required: ["ticket_id"],
          additionalProperties: false,
        },
        strict: true,
        defer_loading: true,
      },
      { type: "computer" },
    ],
  };

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test", baseURL: "https://api.example.com/v1" } };

    const response = await responsesMethods.createModelResponse.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, { id: "resp_123", status: "completed" });

    delete require.cache[modulePath];
  });

  const createCalls = calls.filter((entry) => entry.method === "responses.create");
  assert.deepEqual(createCalls, [
    {
      method: "responses.create",
      payload: requestPayload,
    },
  ]);
});

test("responses create preserves computer keypress actions with keys arrays", async () => {
  class FakeOpenAI {
    constructor() {
      this.responses = {
        create: async () => ({
          id: "resp_computer_1",
          output: [
            {
              id: "item_1",
              type: "computer_call",
              action: {
                type: "keypress",
                keys: ["CTRL", "L"],
              },
            },
          ],
        }),
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
      payload: {
        model: "gpt-5.4",
        tools: [{ type: "computer" }],
        input: "Open the address bar.",
      },
    });

    assert.deepEqual(response, {
      id: "resp_computer_1",
      output: [
        {
          id: "item_1",
          type: "computer_call",
          action: {
            type: "keypress",
            keys: ["CTRL", "L"],
          },
        },
      ],
    });

    delete require.cache[modulePath];
  });
});

test("responses example flows remain valid JSON and cover the documented agentic payload shapes", () => {
  const phaseExamplePath = path.join(
    __dirname,
    "..",
    "examples",
    "responses",
    "phase.json"
  );
  const toolSearchExamplePath = path.join(
    __dirname,
    "..",
    "examples",
    "responses",
    "tool-search.json"
  );
  const computerUseExamplePath = path.join(
    __dirname,
    "..",
    "examples",
    "responses",
    "computer-use.json"
  );
  const websocketExamplePath = path.join(
    __dirname,
    "..",
    "examples",
    "responses",
    "websocket.json"
  );

  const phaseExample = JSON.parse(fs.readFileSync(phaseExamplePath, "utf8"));
  const toolSearchExample = JSON.parse(
    fs.readFileSync(toolSearchExamplePath, "utf8")
  );
  const computerUseExample = JSON.parse(
    fs.readFileSync(computerUseExamplePath, "utf8")
  );
  const websocketExample = JSON.parse(
    fs.readFileSync(websocketExamplePath, "utf8")
  );

  [phaseExample, toolSearchExample, computerUseExample].forEach((flow) => {
    assert.ok(Array.isArray(flow));
    const openaiNode = flow.find((entry) => entry.type === "OpenAI API");
    const commentNodes = flow.filter((entry) => entry.type === "comment");
    assert.ok(openaiNode);
    assert.equal(openaiNode.method, "createModelResponse");
    assert.ok(commentNodes.length >= 1);
  });

  const phaseInjectNode = phaseExample.find(
    (entry) => entry.type === "inject" && entry.name === "Create Phased Response"
  );
  const toolSearchInjectNode = toolSearchExample.find(
    (entry) =>
      entry.type === "inject" && entry.name === "Create Tool Search Request"
  );
  const computerCreateInjectNode = computerUseExample.find(
    (entry) => entry.type === "inject" && entry.name === "Create Computer Request"
  );
  const computerFollowupInjectNode = computerUseExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Submit Computer Screenshot (edit placeholders)"
  );

  assert.ok(phaseInjectNode);
  assert.ok(toolSearchInjectNode);
  assert.ok(computerCreateInjectNode);
  assert.ok(computerFollowupInjectNode);

  const phaseMessage = JSON.parse(
    phaseInjectNode.props.find((prop) => prop.p === "ai.input[0]").v
  );
  const toolSearchTool = JSON.parse(
    toolSearchInjectNode.props.find((prop) => prop.p === "ai.tools[0]").v
  );
  const deferredMcpTool = JSON.parse(
    toolSearchInjectNode.props.find((prop) => prop.p === "ai.tools[1]").v
  );
  const additionalToolsItem = JSON.parse(
    toolSearchInjectNode.props.find((prop) => prop.p === "ai.input[0]").v
  );
  const computerTool = JSON.parse(
    computerCreateInjectNode.props.find((prop) => prop.p === "ai.tools[0]").v
  );
  const computerCallOutput = JSON.parse(
    computerFollowupInjectNode.props.find((prop) => prop.p === "ai.input[0]").v
  );

  assert.equal(
    phaseInjectNode.props.find((prop) => prop.p === "ai.prompt_cache_key").v,
    "responses-phase-example-v1"
  );
  assert.equal(phaseMessage.phase, "commentary");
  assert.equal(toolSearchTool.type, "tool_search");
  assert.equal(deferredMcpTool.defer_loading, true);
  assert.equal(additionalToolsItem.type, "additional_tools");
  assert.equal(additionalToolsItem.role, "developer");
  assert.equal(additionalToolsItem.tools[0].name, "lookup_transport_notes");
  assert.equal(computerTool.type, "computer");
  assert.equal(computerCallOutput.type, "computer_call_output");
  assert.equal(computerCallOutput.output.type, "computer_screenshot");

  assert.ok(Array.isArray(websocketExample));
  const websocketOpenaiNode = websocketExample.find(
    (entry) => entry.type === "OpenAI API"
  );
  const websocketCommentNodes = websocketExample.filter(
    (entry) => entry.type === "comment"
  );
  const connectInjectNode = websocketExample.find(
    (entry) =>
      entry.type === "inject" && entry.name === "Connect Responses WebSocket"
  );
  const sendInjectNode = websocketExample.find(
    (entry) =>
      entry.type === "inject" && entry.name === "Send response.create Event"
  );
  const closeInjectNode = websocketExample.find(
    (entry) =>
      entry.type === "inject" && entry.name === "Close Responses WebSocket"
  );

  assert.ok(websocketOpenaiNode);
  assert.equal(websocketOpenaiNode.method, "manageModelResponseWebSocket");
  assert.ok(websocketCommentNodes.length >= 2);
  assert.ok(connectInjectNode);
  assert.ok(sendInjectNode);
  assert.ok(closeInjectNode);
  assert.equal(
    connectInjectNode.props.find((prop) => prop.p === "ai.action").v,
    "connect"
  );
  assert.equal(
    sendInjectNode.props.find((prop) => prop.p === "ai.action").v,
    "send"
  );
  assert.equal(
    closeInjectNode.props.find((prop) => prop.p === "ai.action").v,
    "close"
  );
  assert.deepEqual(
    JSON.parse(sendInjectNode.props.find((prop) => prop.p === "ai.event").v),
    {
      type: "response.create",
      model: "gpt-5.4-nano-2026-03-17",
      input: "Say hello from Responses websocket mode in one sentence.",
    }
  );
});

test("responses help documents websocket lifecycle contract", () => {
  const responsesHelpPath = path.join(__dirname, "..", "src", "responses", "help.html");
  const responsesHelp = fs.readFileSync(responsesHelpPath, "utf8");

  assert.match(responsesHelp, /Manage Model Response WebSocket/);
  assert.match(responsesHelp, /msg\.payload\.action/);
  assert.match(responsesHelp, /connect<\/code>, <code>send<\/code>, or <code>close<\/code>/);
  assert.match(responsesHelp, /msg\.openai/);
  assert.match(responsesHelp, /custom auth headers and query-string auth/);
});

test("realtime example flow remains valid JSON and documents the nested session contract", () => {
  const realtimeExamplePath = path.join(
    __dirname,
    "..",
    "examples",
    "realtime",
    "client-secrets.json"
  );

  const realtimeExample = JSON.parse(fs.readFileSync(realtimeExamplePath, "utf8"));
  assert.ok(Array.isArray(realtimeExample));

  const openaiNode = realtimeExample.find((entry) => entry.type === "OpenAI API");
  const commentNodes = realtimeExample.filter((entry) => entry.type === "comment");
  const explainerComment = realtimeExample.find(
    (entry) => entry.type === "comment" && entry.name === "What is a client secret?"
  );
  const translationScopeComment = realtimeExample.find(
    (entry) => entry.type === "comment" && entry.name === "Translation session scope"
  );
  const realtimeInjectNode = realtimeExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Create Realtime 2 Client Secret"
  );
  const audioInjectNode = realtimeExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Create Audio 1.5 Client Secret"
  );
  const translationInjectNode = realtimeExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Create Translation Client Secret"
  );

  assert.ok(openaiNode);
  assert.equal(openaiNode.method, "createRealtimeClientSecret");
  assert.ok(commentNodes.length >= 4);
  assert.ok(explainerComment);
  assert.ok(translationScopeComment);
  assert.match(explainerComment.info, /not your long-lived OpenAI API key/);
  assert.match(translationScopeComment.info, /out of scope/);
  assert.ok(realtimeInjectNode);
  assert.ok(audioInjectNode);
  assert.ok(translationInjectNode);

  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.type").v,
    "realtime"
  );
  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.model").v,
    "gpt-realtime-2"
  );
  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.reasoning.effort").v,
    "low"
  );
  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.parallel_tool_calls").v,
    "true"
  );
  assert.equal(
    audioInjectNode.props.find((prop) => prop.p === "ai.session.type").v,
    "realtime"
  );
  assert.equal(
    audioInjectNode.props.find((prop) => prop.p === "ai.session.model").v,
    "gpt-audio-1.5"
  );
  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.expires_after.seconds").v,
    "600"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.type").v,
    "translation"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.model").v,
    "gpt-realtime-translate"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.audio.input.noise_reduction.type").v,
    "near_field"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.audio.input.transcription.model").v,
    "gpt-realtime-whisper"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.audio.input.transcription.delay").v,
    "low"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.audio.input.turn_detection").v,
    "null"
  );
  assert.equal(
    translationInjectNode.props.find((prop) => prop.p === "ai.session.audio.output.language").v,
    "es"
  );
});

test("responses retrieve streams chunks when stream=true", async () => {
  const calls = [];

  async function* createFakeStream() {
    yield { type: "response.in_progress", sequence_number: 1 };
    yield { type: "response.completed", sequence_number: 2 };
  }

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
        retrieve: async (responseId, options) => {
          calls.push({ method: "responses.retrieve", responseId, options });
          if (options.stream) {
            return createFakeStream();
          }
          return { id: responseId, status: "completed" };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/responses/methods.js");
    delete require.cache[modulePath];
    const responsesMethods = require("../src/responses/methods.js");

    const sentMessages = [];
    const statuses = [];
    const node = {
      send: (msg) => sentMessages.push(msg),
      status: (status) => statuses.push(status),
    };

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const streamResult = await responsesMethods.getModelResponse.call(clientContext, {
      _node: node,
      msg: { topic: "t1" },
      payload: {
        response_id: "resp_stream",
        stream: true,
      },
    });
    assert.equal(streamResult, undefined);

    assert.deepEqual(sentMessages, [
      {
        topic: "t1",
        payload: { type: "response.in_progress", sequence_number: 1 },
      },
      {
        topic: "t1",
        payload: { type: "response.completed", sequence_number: 2 },
      },
    ]);

    assert.deepEqual(statuses, [
      {
        fill: "green",
        shape: "dot",
        text: "OpenaiApi.status.streaming",
      },
      {},
    ]);

    const retrieveResponse = await responsesMethods.getModelResponse.call(clientContext, {
      _node: node,
      msg: { topic: "t1" },
      payload: {
        response_id: "resp_non_stream",
      },
    });
    assert.deepEqual(retrieveResponse, { id: "resp_non_stream", status: "completed" });

    delete require.cache[modulePath];
  });

  const retrieveCalls = calls.filter((entry) => entry.method === "responses.retrieve");
  assert.deepEqual(retrieveCalls, [
    {
      method: "responses.retrieve",
      responseId: "resp_stream",
      options: { stream: true },
    },
    {
      method: "responses.retrieve",
      responseId: "resp_non_stream",
      options: {},
    },
  ]);
});

test("responses stream helper emits events and returns the final parsed response", async () => {
  const calls = [];

  function createFakeResponseStream() {
    return {
      async *[Symbol.asyncIterator]() {
        yield { type: "response.in_progress", sequence_number: 1 };
        yield { type: "response.output_text.delta", sequence_number: 2, delta: "Hello" };
        yield { type: "response.completed", sequence_number: 3 };
      },
      async finalResponse() {
        return {
          id: "resp_stream_final",
          output_parsed: { answer: "Hello" },
        };
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

    const sentMessages = [];
    const statuses = [];
    const node = {
      send: (msg) => sentMessages.push(msg),
      status: (status) => statuses.push(status),
    };

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const finalResponse = await responsesMethods.streamModelResponse.call(clientContext, {
      _node: node,
      msg: { topic: "stream-helper" },
      payload: {
        model: "gpt-5.4-mini",
        input: "Say hello from the stream helper.",
      },
    });

    assert.deepEqual(finalResponse, {
      id: "resp_stream_final",
      output_parsed: { answer: "Hello" },
    });

    assert.deepEqual(sentMessages, [
      {
        topic: "stream-helper",
        payload: { type: "response.in_progress", sequence_number: 1 },
      },
      {
        topic: "stream-helper",
        payload: { type: "response.output_text.delta", sequence_number: 2, delta: "Hello" },
      },
      {
        topic: "stream-helper",
        payload: { type: "response.completed", sequence_number: 3 },
      },
    ]);

    assert.deepEqual(statuses, [
      {
        fill: "green",
        shape: "dot",
        text: "OpenaiApi.status.streaming",
      },
      {},
    ]);

    delete require.cache[modulePath];
  });

  assert.deepEqual(calls.filter((entry) => entry.method !== "ctor"), [
    {
      method: "responses.stream",
      payload: {
        model: "gpt-5.4-mini",
        input: "Say hello from the stream helper.",
      },
    },
  ]);
});

test("conversation methods map to OpenAI SDK conversations endpoints", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });

      this.conversations = {
        create: async (body) => {
          calls.push({ method: "conversations.create", body });
          return { id: "conv_new" };
        },
        retrieve: async (conversationId, options) => {
          calls.push({ method: "conversations.retrieve", conversationId, options });
          return { id: conversationId };
        },
        update: async (conversationId, body) => {
          calls.push({ method: "conversations.update", conversationId, body });
          return { id: conversationId, updated: true };
        },
        delete: async (conversationId, options) => {
          calls.push({ method: "conversations.delete", conversationId, options });
          return { id: conversationId, deleted: true };
        },
        items: {
          create: async (conversationId, body) => {
            calls.push({ method: "conversations.items.create", conversationId, body });
            return { id: "item_new" };
          },
          retrieve: async (itemId, options) => {
            calls.push({ method: "conversations.items.retrieve", itemId, options });
            return { id: itemId };
          },
          list: async (conversationId, options) => {
            calls.push({ method: "conversations.items.list", conversationId, options });
            return { data: [{ id: "item_1" }, { id: "item_2" }] };
          },
          delete: async (itemId, options) => {
            calls.push({ method: "conversations.items.delete", itemId, options });
            return { id: itemId, deleted: true };
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/conversations/methods.js");
    delete require.cache[modulePath];
    const conversationMethods = require("../src/conversations/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const created = await conversationMethods.createConversation.call(clientContext, {
      payload: { metadata: { app: "node-red" } },
    });
    assert.deepEqual(created, { id: "conv_new" });

    const fetched = await conversationMethods.getConversation.call(clientContext, {
      payload: { conversation_id: "conv_1", include: ["items"] },
    });
    assert.deepEqual(fetched, { id: "conv_1" });

    const updated = await conversationMethods.modifyConversation.call(clientContext, {
      payload: { conversation_id: "conv_1", metadata: { env: "dev" } },
    });
    assert.deepEqual(updated, { id: "conv_1", updated: true });

    const deleted = await conversationMethods.deleteConversation.call(clientContext, {
      payload: { conversation_id: "conv_1" },
    });
    assert.deepEqual(deleted, { id: "conv_1", deleted: true });

    const createdItem = await conversationMethods.createConversationItem.call(clientContext, {
      payload: {
        conversation_id: "conv_1",
        items: [
          {
            type: "additional_tools",
            role: "developer",
            id: "item_tools_shipping_lookup",
            tools: [
              {
                type: "function",
                name: "lookup_shipping_options",
                description: "Look up available shipping options for an order.",
                parameters: {
                  type: "object",
                  properties: {
                    order_id: { type: "string" },
                  },
                  required: ["order_id"],
                  additionalProperties: false,
                },
                strict: true,
              },
            ],
          },
          {
            type: "message",
            role: "assistant",
            phase: "commentary",
            content: [{ type: "output_text", text: "hello" }],
          },
        ],
      },
    });
    assert.deepEqual(createdItem, { id: "item_new" });

    const fetchedItem = await conversationMethods.getConversationItem.call(clientContext, {
      payload: {
        conversation_id: "conv_1",
        item_id: "item_1",
      },
    });
    assert.deepEqual(fetchedItem, { id: "item_1" });

    const listedItems = await conversationMethods.listConversationItems.call(clientContext, {
      payload: {
        conversation_id: "conv_1",
        limit: 2,
      },
    });
    assert.deepEqual(listedItems, [{ id: "item_1" }, { id: "item_2" }]);

    const deletedItem = await conversationMethods.deleteConversationItem.call(clientContext, {
      payload: {
        conversation_id: "conv_1",
        item_id: "item_1",
      },
    });
    assert.deepEqual(deletedItem, { id: "item_1", deleted: true });

    delete require.cache[modulePath];
  });

  assert.equal(calls.some((entry) => entry.method === "conversations.create"), true);
  assert.deepEqual(
    calls.find((entry) => entry.method === "conversations.items.create"),
    {
      method: "conversations.items.create",
      conversationId: "conv_1",
      body: {
        items: [
          {
            type: "additional_tools",
            role: "developer",
            id: "item_tools_shipping_lookup",
            tools: [
              {
                type: "function",
                name: "lookup_shipping_options",
                description: "Look up available shipping options for an order.",
                parameters: {
                  type: "object",
                  properties: {
                    order_id: { type: "string" },
                  },
                  required: ["order_id"],
                  additionalProperties: false,
                },
                strict: true,
              },
            ],
          },
          {
            type: "message",
            role: "assistant",
            phase: "commentary",
            content: [{ type: "output_text", text: "hello" }],
          },
        ],
      },
    }
  );
  assert.equal(calls.some((entry) => entry.method === "conversations.items.list"), true);
  assert.equal(calls.some((entry) => entry.method === "conversations.items.delete"), true);
});

test("skills methods map to OpenAI SDK skills endpoints", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.skills = {
        create: async (body) => {
          calls.push({ method: "skills.create", body });
          return { id: "skill_new" };
        },
        retrieve: async (skillId, options) => {
          calls.push({ method: "skills.retrieve", skillId, options });
          return { id: skillId };
        },
        update: async (skillId, body) => {
          calls.push({ method: "skills.update", skillId, body });
          return { id: skillId, updated: true };
        },
        delete: async (skillId, options) => {
          calls.push({ method: "skills.delete", skillId, options });
          return { id: skillId, deleted: true };
        },
        list: async (options) => {
          calls.push({ method: "skills.list", options });
          return { data: [{ id: "skill_1" }, { id: "skill_2" }] };
        },
        content: {
          retrieve: async (skillId, options) => {
            calls.push({ method: "skills.content.retrieve", skillId, options });
            return { id: skillId, object: "skill.content" };
          },
        },
        versions: {
          create: async (skillId, body) => {
            calls.push({ method: "skills.versions.create", skillId, body });
            return { id: "skill_version_new", skill_id: skillId };
          },
          retrieve: async (version, options) => {
            calls.push({ method: "skills.versions.retrieve", version, options });
            return { id: "skill_version_1", version };
          },
          list: async (skillId, options) => {
            calls.push({ method: "skills.versions.list", skillId, options });
            return { data: [{ id: "sv_1" }, { id: "sv_2" }] };
          },
          delete: async (version, options) => {
            calls.push({ method: "skills.versions.delete", version, options });
            return { deleted: true, version };
          },
          content: {
            retrieve: async (version, options) => {
              calls.push({ method: "skills.versions.content.retrieve", version, options });
              return { object: "skill.version.content", version };
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/skills/methods.js");
    delete require.cache[modulePath];
    const skillMethods = require("../src/skills/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const listed = await skillMethods.listSkills.call(clientContext, {
      payload: { order: "desc", limit: 2 },
    });
    assert.deepEqual(listed, [{ id: "skill_1" }, { id: "skill_2" }]);

    const created = await skillMethods.createSkill.call(clientContext, {
      payload: { files: ["./skill.zip"] },
    });
    assert.deepEqual(created, { id: "skill_new" });

    const fetched = await skillMethods.getSkill.call(clientContext, {
      payload: { skill_id: "skill_1" },
    });
    assert.deepEqual(fetched, { id: "skill_1" });

    const updated = await skillMethods.modifySkill.call(clientContext, {
      payload: { skill_id: "skill_1", default_version: "2" },
    });
    assert.deepEqual(updated, { id: "skill_1", updated: true });

    const deleted = await skillMethods.deleteSkill.call(clientContext, {
      payload: { skill_id: "skill_1" },
    });
    assert.deepEqual(deleted, { id: "skill_1", deleted: true });

    const content = await skillMethods.getSkillContent.call(clientContext, {
      payload: { skill_id: "skill_1" },
    });
    assert.deepEqual(content, { id: "skill_1", object: "skill.content" });

    const listedVersions = await skillMethods.listSkillVersions.call(clientContext, {
      payload: { skill_id: "skill_1", order: "asc" },
    });
    assert.deepEqual(listedVersions, [{ id: "sv_1" }, { id: "sv_2" }]);

    const createdVersion = await skillMethods.createSkillVersion.call(clientContext, {
      payload: { skill_id: "skill_1", default: true, files: ["./v2.zip"] },
    });
    assert.deepEqual(createdVersion, { id: "skill_version_new", skill_id: "skill_1" });

    const fetchedVersion = await skillMethods.getSkillVersion.call(clientContext, {
      payload: { skill_id: "skill_1", version: "2" },
    });
    assert.deepEqual(fetchedVersion, { id: "skill_version_1", version: "2" });

    const deletedVersion = await skillMethods.deleteSkillVersion.call(clientContext, {
      payload: { skill_id: "skill_1", version: "2" },
    });
    assert.deepEqual(deletedVersion, { deleted: true, version: "2" });

    const versionContent = await skillMethods.getSkillVersionContent.call(clientContext, {
      payload: { skill_id: "skill_1", version: "2" },
    });
    assert.deepEqual(versionContent, { object: "skill.version.content", version: "2" });

    delete require.cache[modulePath];
  });

  const skillCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(skillCalls, [
    {
      method: "skills.list",
      options: { order: "desc", limit: 2 },
    },
    {
      method: "skills.create",
      body: { files: ["./skill.zip"] },
    },
    {
      method: "skills.retrieve",
      skillId: "skill_1",
      options: {},
    },
    {
      method: "skills.update",
      skillId: "skill_1",
      body: { default_version: "2" },
    },
    {
      method: "skills.delete",
      skillId: "skill_1",
      options: {},
    },
    {
      method: "skills.content.retrieve",
      skillId: "skill_1",
      options: {},
    },
    {
      method: "skills.versions.list",
      skillId: "skill_1",
      options: { order: "asc" },
    },
    {
      method: "skills.versions.create",
      skillId: "skill_1",
      body: { default: true, files: ["./v2.zip"] },
    },
    {
      method: "skills.versions.retrieve",
      version: "2",
      options: { skill_id: "skill_1" },
    },
    {
      method: "skills.versions.delete",
      version: "2",
      options: { skill_id: "skill_1" },
    },
    {
      method: "skills.versions.content.retrieve",
      version: "2",
      options: { skill_id: "skill_1" },
    },
  ]);
});

test("chatkit methods map to OpenAI SDK beta chatkit endpoints", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.beta = {
        chatkit: {
          sessions: {
            create: async (body) => {
              calls.push({ method: "beta.chatkit.sessions.create", body });
              return {
                id: "cksess_1",
                object: "chatkit.session",
                user: body.user,
              };
            },
            cancel: async (sessionId, options) => {
              calls.push({
                method: "beta.chatkit.sessions.cancel",
                sessionId,
                options,
              });
              return {
                id: sessionId,
                object: "chatkit.session",
                status: "cancelled",
              };
            },
          },
          threads: {
            retrieve: async (threadId, options) => {
              calls.push({
                method: "beta.chatkit.threads.retrieve",
                threadId,
                options,
              });
              return { id: threadId, object: "chatkit.thread" };
            },
            list: async (options) => {
              calls.push({ method: "beta.chatkit.threads.list", options });
              return {
                data: [{ id: "cthr_1" }, { id: "cthr_2" }],
              };
            },
            delete: async (threadId, options) => {
              calls.push({
                method: "beta.chatkit.threads.delete",
                threadId,
                options,
              });
              return { id: threadId, deleted: true };
            },
            listItems: async (threadId, options) => {
              calls.push({
                method: "beta.chatkit.threads.listItems",
                threadId,
                options,
              });
              return {
                data: [{ id: "item_1" }, { id: "item_2" }],
              };
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/chatkit/methods.js");
    delete require.cache[modulePath];
    const chatkitMethods = require("../src/chatkit/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const createdSession = await chatkitMethods.createChatKitSession.call(
      clientContext,
      {
        payload: {
          user: "user_123",
          workflow: {
            id: "wf_123",
            version: "3",
            state_variables: {
              region: "us",
              retries: 2,
            },
          },
        },
      }
    );
    assert.deepEqual(createdSession, {
      id: "cksess_1",
      object: "chatkit.session",
      user: "user_123",
    });

    const cancelledSession = await chatkitMethods.cancelChatKitSession.call(
      clientContext,
      {
        payload: {
          session_id: "cksess_1",
        },
      }
    );
    assert.deepEqual(cancelledSession, {
      id: "cksess_1",
      object: "chatkit.session",
      status: "cancelled",
    });

    const listedThreads = await chatkitMethods.listChatKitThreads.call(
      clientContext,
      {
        payload: {
          user: "user_123",
          limit: 2,
        },
      }
    );
    assert.deepEqual(listedThreads, [{ id: "cthr_1" }, { id: "cthr_2" }]);

    const fetchedThread = await chatkitMethods.getChatKitThread.call(
      clientContext,
      {
        payload: {
          thread_id: "cthr_1",
        },
      }
    );
    assert.deepEqual(fetchedThread, { id: "cthr_1", object: "chatkit.thread" });

    const deletedThread = await chatkitMethods.deleteChatKitThread.call(
      clientContext,
      {
        payload: {
          thread_id: "cthr_1",
        },
      }
    );
    assert.deepEqual(deletedThread, { id: "cthr_1", deleted: true });

    const threadItems = await chatkitMethods.listChatKitThreadItems.call(
      clientContext,
      {
        payload: {
          thread_id: "cthr_1",
          limit: 2,
          order: "desc",
        },
      }
    );
    assert.deepEqual(threadItems, [{ id: "item_1" }, { id: "item_2" }]);

    delete require.cache[modulePath];
  });

  const chatkitCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(chatkitCalls, [
    {
      method: "beta.chatkit.sessions.create",
      body: {
        user: "user_123",
        workflow: {
          id: "wf_123",
          version: "3",
          state_variables: {
            region: "us",
            retries: 2,
          },
        },
      },
    },
    {
      method: "beta.chatkit.sessions.cancel",
      sessionId: "cksess_1",
      options: {},
    },
    {
      method: "beta.chatkit.threads.list",
      options: {
        user: "user_123",
        limit: 2,
      },
    },
    {
      method: "beta.chatkit.threads.retrieve",
      threadId: "cthr_1",
      options: {},
    },
    {
      method: "beta.chatkit.threads.delete",
      threadId: "cthr_1",
      options: {},
    },
    {
      method: "beta.chatkit.threads.listItems",
      threadId: "cthr_1",
      options: {
        limit: 2,
        order: "desc",
      },
    },
  ]);
});

test("evals methods map to OpenAI SDK evals endpoints", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.evals = {
        create: async (body) => {
          calls.push({ method: "evals.create", body });
          return { id: "eval_new" };
        },
        retrieve: async (evalId, options) => {
          calls.push({ method: "evals.retrieve", evalId, options });
          return { id: evalId };
        },
        update: async (evalId, body) => {
          calls.push({ method: "evals.update", evalId, body });
          return { id: evalId, updated: true };
        },
        delete: async (evalId, options) => {
          calls.push({ method: "evals.delete", evalId, options });
          return { id: evalId, deleted: true };
        },
        list: async (options) => {
          calls.push({ method: "evals.list", options });
          return { data: [{ id: "eval_1" }, { id: "eval_2" }] };
        },
        runs: {
          create: async (evalId, body) => {
            calls.push({ method: "evals.runs.create", evalId, body });
            return { id: "run_new", eval_id: evalId };
          },
          retrieve: async (runId, options) => {
            calls.push({ method: "evals.runs.retrieve", runId, options });
            return { id: runId };
          },
          list: async (evalId, options) => {
            calls.push({ method: "evals.runs.list", evalId, options });
            return { data: [{ id: "run_1" }, { id: "run_2" }] };
          },
          delete: async (runId, options) => {
            calls.push({ method: "evals.runs.delete", runId, options });
            return { id: runId, deleted: true };
          },
          cancel: async (runId, options) => {
            calls.push({ method: "evals.runs.cancel", runId, options });
            return { id: runId, status: "cancelled" };
          },
          outputItems: {
            retrieve: async (outputItemId, options) => {
              calls.push({
                method: "evals.runs.outputItems.retrieve",
                outputItemId,
                options,
              });
              return { id: outputItemId };
            },
            list: async (runId, options) => {
              calls.push({ method: "evals.runs.outputItems.list", runId, options });
              return { data: [{ id: "out_1" }, { id: "out_2" }] };
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/evals/methods.js");
    delete require.cache[modulePath];
    const evalMethods = require("../src/evals/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const listedEvals = await evalMethods.listEvals.call(clientContext, {
      payload: { order: "desc", limit: 2 },
    });
    assert.deepEqual(listedEvals, [{ id: "eval_1" }, { id: "eval_2" }]);

    const createdEval = await evalMethods.createEval.call(clientContext, {
      payload: {
        name: "Support quality eval",
        data_source_config: { type: "custom", schema: { type: "object" } },
        testing_criteria: [],
      },
    });
    assert.deepEqual(createdEval, { id: "eval_new" });

    const fetchedEval = await evalMethods.getEval.call(clientContext, {
      payload: { eval_id: "eval_1" },
    });
    assert.deepEqual(fetchedEval, { id: "eval_1" });

    const updatedEval = await evalMethods.modifyEval.call(clientContext, {
      payload: { eval_id: "eval_1", name: "Updated eval" },
    });
    assert.deepEqual(updatedEval, { id: "eval_1", updated: true });

    const deletedEval = await evalMethods.deleteEval.call(clientContext, {
      payload: { eval_id: "eval_1" },
    });
    assert.deepEqual(deletedEval, { id: "eval_1", deleted: true });

    const listedRuns = await evalMethods.listEvalRuns.call(clientContext, {
      payload: { eval_id: "eval_1", limit: 2 },
    });
    assert.deepEqual(listedRuns, [{ id: "run_1" }, { id: "run_2" }]);

    const createdRun = await evalMethods.createEvalRun.call(clientContext, {
      payload: {
        eval_id: "eval_1",
        data_source: {
          type: "jsonl",
          source: { type: "file_id", id: "file_1" },
        },
      },
    });
    assert.deepEqual(createdRun, { id: "run_new", eval_id: "eval_1" });

    const fetchedRun = await evalMethods.getEvalRun.call(clientContext, {
      payload: { eval_id: "eval_1", run_id: "run_1" },
    });
    assert.deepEqual(fetchedRun, { id: "run_1" });

    const cancelledRun = await evalMethods.cancelEvalRun.call(clientContext, {
      payload: { eval_id: "eval_1", run_id: "run_1" },
    });
    assert.deepEqual(cancelledRun, { id: "run_1", status: "cancelled" });

    const deletedRun = await evalMethods.deleteEvalRun.call(clientContext, {
      payload: { eval_id: "eval_1", run_id: "run_1" },
    });
    assert.deepEqual(deletedRun, { id: "run_1", deleted: true });

    const listedOutputItems = await evalMethods.listEvalRunOutputItems.call(clientContext, {
      payload: { eval_id: "eval_1", run_id: "run_1", limit: 1 },
    });
    assert.deepEqual(listedOutputItems, [{ id: "out_1" }, { id: "out_2" }]);

    const fetchedOutputItem = await evalMethods.getEvalRunOutputItem.call(clientContext, {
      payload: { eval_id: "eval_1", run_id: "run_1", output_item_id: "out_1" },
    });
    assert.deepEqual(fetchedOutputItem, { id: "out_1" });

    delete require.cache[modulePath];
  });

  const evalCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(evalCalls, [
    {
      method: "evals.list",
      options: { order: "desc", limit: 2 },
    },
    {
      method: "evals.create",
      body: {
        name: "Support quality eval",
        data_source_config: { type: "custom", schema: { type: "object" } },
        testing_criteria: [],
      },
    },
    {
      method: "evals.retrieve",
      evalId: "eval_1",
      options: {},
    },
    {
      method: "evals.update",
      evalId: "eval_1",
      body: { name: "Updated eval" },
    },
    {
      method: "evals.delete",
      evalId: "eval_1",
      options: {},
    },
    {
      method: "evals.runs.list",
      evalId: "eval_1",
      options: { limit: 2 },
    },
    {
      method: "evals.runs.create",
      evalId: "eval_1",
      body: {
        data_source: {
          type: "jsonl",
          source: { type: "file_id", id: "file_1" },
        },
      },
    },
    {
      method: "evals.runs.retrieve",
      runId: "run_1",
      options: { eval_id: "eval_1" },
    },
    {
      method: "evals.runs.cancel",
      runId: "run_1",
      options: { eval_id: "eval_1" },
    },
    {
      method: "evals.runs.delete",
      runId: "run_1",
      options: { eval_id: "eval_1" },
    },
    {
      method: "evals.runs.outputItems.list",
      runId: "run_1",
      options: { eval_id: "eval_1", limit: 1 },
    },
    {
      method: "evals.runs.outputItems.retrieve",
      outputItemId: "out_1",
      options: { eval_id: "eval_1", run_id: "run_1" },
    },
  ]);
});

test("videos methods map to OpenAI SDK videos endpoints", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.videos = {
        create: async (body) => {
          calls.push({ method: "videos.create", body });
          return { id: "video_new" };
        },
        retrieve: async (videoId, options) => {
          calls.push({ method: "videos.retrieve", videoId, options });
          return { id: videoId };
        },
        list: async (options) => {
          calls.push({ method: "videos.list", options });
          return { data: [{ id: "video_1" }, { id: "video_2" }] };
        },
        delete: async (videoId, options) => {
          calls.push({ method: "videos.delete", videoId, options });
          return { id: videoId, deleted: true };
        },
        createCharacter: async (body) => {
          calls.push({ method: "videos.createCharacter", body });
          return { id: "char_1", name: body.name };
        },
        downloadContent: async (videoId, query) => {
          calls.push({ method: "videos.downloadContent", videoId, query });
          return { binary: true };
        },
        edit: async (body) => {
          calls.push({ method: "videos.edit", body });
          return { id: "video_edit" };
        },
        extend: async (body) => {
          calls.push({ method: "videos.extend", body });
          return { id: "video_extend" };
        },
        getCharacter: async (characterId, options) => {
          calls.push({ method: "videos.getCharacter", characterId, options });
          return { id: characterId };
        },
        remix: async (videoId, body) => {
          calls.push({ method: "videos.remix", videoId, body });
          return { id: "video_remix" };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/videos/methods.js");
    delete require.cache[modulePath];
    const videoMethods = require("../src/videos/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const listedVideos = await videoMethods.listVideos.call(clientContext, {
      payload: { order: "desc", limit: 1 },
    });
    assert.deepEqual(listedVideos, [{ id: "video_1" }, { id: "video_2" }]);

    const createdVideo = await videoMethods.createVideo.call(clientContext, {
      payload: { prompt: "A sunrise over mountains", model: "sora-2" },
    });
    assert.deepEqual(createdVideo, { id: "video_new" });

    const fetchedVideo = await videoMethods.getVideo.call(clientContext, {
      payload: { video_id: "video_1" },
    });
    assert.deepEqual(fetchedVideo, { id: "video_1" });

    const deletedVideo = await videoMethods.deleteVideo.call(clientContext, {
      payload: { video_id: "video_1" },
    });
    assert.deepEqual(deletedVideo, { id: "video_1", deleted: true });

    const createdCharacter = await videoMethods.createVideoCharacter.call(clientContext, {
      payload: { name: "Runner", video: { file_id: "file_1" } },
    });
    assert.deepEqual(createdCharacter, { id: "char_1", name: "Runner" });

    const downloaded = await videoMethods.downloadVideoContent.call(clientContext, {
      payload: { video_id: "video_1", variant: "thumbnail" },
    });
    assert.deepEqual(downloaded, { binary: true });

    const edited = await videoMethods.editVideo.call(clientContext, {
      payload: { prompt: "Add neon lighting", video: { id: "video_1" } },
    });
    assert.deepEqual(edited, { id: "video_edit" });

    const extended = await videoMethods.extendVideo.call(clientContext, {
      payload: { prompt: "Keep the motion going", seconds: "16", video: { id: "video_1" } },
    });
    assert.deepEqual(extended, { id: "video_extend" });

    const fetchedCharacter = await videoMethods.getVideoCharacter.call(clientContext, {
      payload: { character_id: "char_1" },
    });
    assert.deepEqual(fetchedCharacter, { id: "char_1" });

    const remixed = await videoMethods.remixVideo.call(clientContext, {
      payload: { video_id: "video_1", prompt: "Make it cinematic" },
    });
    assert.deepEqual(remixed, { id: "video_remix" });

    delete require.cache[modulePath];
  });

  const videoCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(videoCalls, [
    {
      method: "videos.list",
      options: { order: "desc", limit: 1 },
    },
    {
      method: "videos.create",
      body: { prompt: "A sunrise over mountains", model: "sora-2" },
    },
    {
      method: "videos.retrieve",
      videoId: "video_1",
      options: {},
    },
    {
      method: "videos.delete",
      videoId: "video_1",
      options: {},
    },
    {
      method: "videos.createCharacter",
      body: { name: "Runner", video: { file_id: "file_1" } },
    },
    {
      method: "videos.downloadContent",
      videoId: "video_1",
      query: { variant: "thumbnail" },
    },
    {
      method: "videos.edit",
      body: { prompt: "Add neon lighting", video: { id: "video_1" } },
    },
    {
      method: "videos.extend",
      body: { prompt: "Keep the motion going", seconds: "16", video: { id: "video_1" } },
    },
    {
      method: "videos.getCharacter",
      characterId: "char_1",
      options: {},
    },
    {
      method: "videos.remix",
      videoId: "video_1",
      body: { prompt: "Make it cinematic" },
    },
  ]);
});

test("realtime methods map to OpenAI SDK realtime endpoints and pass newer session payloads through unchanged", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.realtime = {
        clientSecrets: {
          create: async (body) => {
            calls.push({ method: "realtime.clientSecrets.create", body });
            return {
              expires_at: 123,
              session: body.session,
              value: "ek_rt_secret_1",
            };
          },
        },
        calls: {
          accept: async (callId, body) => {
            calls.push({ method: "realtime.calls.accept", callId, body });
          },
          hangup: async (callId, options) => {
            calls.push({ method: "realtime.calls.hangup", callId, options });
          },
          refer: async (callId, body) => {
            calls.push({ method: "realtime.calls.refer", callId, body });
          },
          reject: async (callId, body) => {
            calls.push({ method: "realtime.calls.reject", callId, body });
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/realtime/methods.js");
    delete require.cache[modulePath];
    const realtimeMethods = require("../src/realtime/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const realtimeTwoPayload = {
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
      session: {
        type: "realtime",
        model: "gpt-realtime-2",
        instructions: "Speak clearly and keep responses concise.",
        output_modalities: ["audio"],
        reasoning: { effort: "low" },
        parallel_tool_calls: true,
      },
    };
    const secret = await realtimeMethods.createRealtimeClientSecret.call(clientContext, {
      payload: realtimeTwoPayload,
    });
    assert.deepEqual(secret, {
      expires_at: 123,
      session: realtimeTwoPayload.session,
      value: "ek_rt_secret_1",
    });

    const translationPayload = {
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
      session: {
        type: "translation",
        model: "gpt-realtime-translate",
        audio: {
          input: {
            noise_reduction: { type: "near_field" },
            transcription: {
              model: "gpt-realtime-whisper",
              delay: "low",
              language: "en",
            },
            turn_detection: null,
          },
          output: {
            language: "es",
          },
        },
      },
    };
    const translationSecret = await realtimeMethods.createRealtimeClientSecret.call(clientContext, {
      payload: translationPayload,
    });
    assert.deepEqual(translationSecret, {
      expires_at: 123,
      session: translationPayload.session,
      value: "ek_rt_secret_1",
    });

    const accepted = await realtimeMethods.acceptRealtimeCall.call(clientContext, {
      payload: {
        call_id: "call_1",
        type: "realtime",
        model: "gpt-realtime-2",
        output_modalities: ["audio"],
        reasoning: { effort: "low" },
        parallel_tool_calls: true,
      },
    });
    assert.deepEqual(accepted, { call_id: "call_1", status: "accepted" });

    const hungUp = await realtimeMethods.hangupRealtimeCall.call(clientContext, {
      payload: { call_id: "call_1" },
    });
    assert.deepEqual(hungUp, { call_id: "call_1", status: "hung_up" });

    const referred = await realtimeMethods.referRealtimeCall.call(clientContext, {
      payload: { call_id: "call_1", target_uri: "tel:+14155550123" },
    });
    assert.deepEqual(referred, { call_id: "call_1", status: "referred" });

    const rejected = await realtimeMethods.rejectRealtimeCall.call(clientContext, {
      payload: { call_id: "call_2", status_code: 486 },
    });
    assert.deepEqual(rejected, { call_id: "call_2", status: "rejected" });

    delete require.cache[modulePath];
  });

  const realtimeCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(realtimeCalls, [
    {
      method: "realtime.clientSecrets.create",
      body: {
        expires_after: {
          anchor: "created_at",
          seconds: 600,
        },
        session: {
          type: "realtime",
          model: "gpt-realtime-2",
          instructions: "Speak clearly and keep responses concise.",
          output_modalities: ["audio"],
          reasoning: { effort: "low" },
          parallel_tool_calls: true,
        },
      },
    },
    {
      method: "realtime.clientSecrets.create",
      body: {
        expires_after: {
          anchor: "created_at",
          seconds: 600,
        },
        session: {
          type: "translation",
          model: "gpt-realtime-translate",
          audio: {
            input: {
              noise_reduction: { type: "near_field" },
              transcription: {
                model: "gpt-realtime-whisper",
                delay: "low",
                language: "en",
              },
              turn_detection: null,
            },
            output: {
              language: "es",
            },
          },
        },
      },
    },
    {
      method: "realtime.calls.accept",
      callId: "call_1",
      body: {
        type: "realtime",
        model: "gpt-realtime-2",
        output_modalities: ["audio"],
        reasoning: { effort: "low" },
        parallel_tool_calls: true,
      },
    },
    {
      method: "realtime.calls.hangup",
      callId: "call_1",
      options: {},
    },
    {
      method: "realtime.calls.refer",
      callId: "call_1",
      body: { target_uri: "tel:+14155550123" },
    },
    {
      method: "realtime.calls.reject",
      callId: "call_2",
      body: { status_code: 486 },
    },
  ]);
});

test("webhooks methods map to OpenAI SDK webhooks utilities", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.webhooks = {
        unwrap: async (payload, headers, secret, tolerance) => {
          calls.push({
            method: "webhooks.unwrap",
            payload,
            headers,
            secret,
            tolerance,
          });
          return { id: "evt_1", type: "response.completed" };
        },
        verifySignature: async (payload, headers, secret, tolerance) => {
          calls.push({
            method: "webhooks.verifySignature",
            payload,
            headers,
            secret,
            tolerance,
          });
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/webhooks/methods.js");
    delete require.cache[modulePath];
    const webhookMethods = require("../src/webhooks/methods.js");

    const clientContext = { clientParams: { apiKey: "sk-test" } };

    const event = await webhookMethods.unwrapWebhookEvent.call(clientContext, {
      payload: {
        payload: "{\"id\":\"evt_1\"}",
        headers: {
          "webhook-id": "wh_1",
          "webhook-signature": "v1,abc",
          "webhook-timestamp": "123",
        },
        secret: "whsec_test",
        tolerance: 30,
      },
    });
    assert.deepEqual(event, { id: "evt_1", type: "response.completed" });

    const verified = await webhookMethods.verifyWebhookSignature.call(clientContext, {
      payload: {
        payload: "{\"id\":\"evt_1\"}",
        headers: {
          "webhook-id": "wh_1",
          "webhook-signature": "v1,abc",
          "webhook-timestamp": "123",
        },
        secret: "whsec_test",
        tolerance: 30,
      },
    });
    assert.deepEqual(verified, { verified: true });

    delete require.cache[modulePath];
  });

  const webhookCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(webhookCalls, [
    {
      method: "webhooks.unwrap",
      payload: "{\"id\":\"evt_1\"}",
      headers: {
        "webhook-id": "wh_1",
        "webhook-signature": "v1,abc",
        "webhook-timestamp": "123",
      },
      secret: "whsec_test",
      tolerance: 30,
    },
    {
      method: "webhooks.verifySignature",
      payload: "{\"id\":\"evt_1\"}",
      headers: {
        "webhook-id": "wh_1",
        "webhook-signature": "v1,abc",
        "webhook-timestamp": "123",
      },
      secret: "whsec_test",
      tolerance: 30,
    },
  ]);
});

test("admin methods map representative organization and project resources to OpenAI SDK", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.admin = {
        organization: {
          auditLogs: {
            list: async (query) => {
              calls.push({ method: "admin.organization.auditLogs.list", query });
              return {
                data: [
                  {
                    id: "log_1",
                    type: "workload_identity_provider.created",
                    "workload_identity_provider.created": {
                      id: "wip_123",
                      data: {
                        name: "AWS production federation",
                        issuer_url: "https://oidc.eks.example.com/id/cluster",
                      },
                    },
                  },
                  {
                    id: "log_2",
                    type: "workload_identity_provider_mapping.updated",
                    "workload_identity_provider_mapping.updated": {
                      id: "wipm_123",
                      identity_provider_id: "wip_123",
                      changes_requested: {
                        service_account_id: "svc_456",
                        project_id: "proj_1",
                      },
                    },
                  },
                ],
              };
            },
          },
          adminAPIKeys: {
            retrieve: async (keyID, options) => {
              calls.push({ method: "admin.organization.adminAPIKeys.retrieve", keyID, options });
              return { id: keyID, object: "organization.admin_api_key" };
            },
          },
          users: {
            roles: {
              create: async (userID, body) => {
                calls.push({ method: "admin.organization.users.roles.create", userID, body });
                return { id: "role_assignment_1", user_id: userID };
              },
            },
          },
          projects: {
            list: async (query) => {
              calls.push({ method: "admin.organization.projects.list", query });
              return { data: [{ id: "proj_1" }, { id: "proj_2" }] };
            },
            users: {
              retrieve: async (userID, params) => {
                calls.push({ method: "admin.organization.projects.users.retrieve", userID, params });
                return { id: userID, project_id: params.project_id };
              },
            },
            rateLimits: {
              updateRateLimit: async (rateLimitID, params) => {
                calls.push({ method: "admin.organization.projects.rateLimits.updateRateLimit", rateLimitID, params });
                return { id: rateLimitID, project_id: params.project_id, max_requests_per_1_minute: params.max_requests_per_1_minute };
              },
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/admin/methods.js");
    delete require.cache[modulePath];
    const adminMethods = require("../src/admin/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: null,
        adminAPIKey: "sk-admin-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const auditLogs = await adminMethods.listOrganizationAuditLogs.call(clientContext, {
      payload: {
        effective_at: { gt: 1710000000 },
        project_ids: ["proj_1"],
        event_types: workloadIdentityAuditEventTypes,
      },
    });
    assert.deepEqual(auditLogs, [
      {
        id: "log_1",
        type: "workload_identity_provider.created",
        "workload_identity_provider.created": {
          id: "wip_123",
          data: {
            name: "AWS production federation",
            issuer_url: "https://oidc.eks.example.com/id/cluster",
          },
        },
      },
      {
        id: "log_2",
        type: "workload_identity_provider_mapping.updated",
        "workload_identity_provider_mapping.updated": {
          id: "wipm_123",
          identity_provider_id: "wip_123",
          changes_requested: {
            service_account_id: "svc_456",
            project_id: "proj_1",
          },
        },
      },
    ]);

    const adminApiKey = await adminMethods.getOrganizationAdminApiKey.call(clientContext, {
      payload: {
        key_id: "key_123",
      },
    });
    assert.deepEqual(adminApiKey, {
      id: "key_123",
      object: "organization.admin_api_key",
    });

    const userRole = await adminMethods.createOrganizationUserRole.call(clientContext, {
      payload: {
        user_id: "user_123",
        role: "owner",
      },
    });
    assert.deepEqual(userRole, { id: "role_assignment_1", user_id: "user_123" });

    const projects = await adminMethods.listOrganizationProjects.call(clientContext, {
      payload: {
        limit: 20,
        include_archived: true,
      },
    });
    assert.deepEqual(projects, [{ id: "proj_1" }, { id: "proj_2" }]);

    const projectUser = await adminMethods.getProjectUser.call(clientContext, {
      payload: {
        project_id: "proj_1",
        user_id: "user_456",
      },
    });
    assert.deepEqual(projectUser, { id: "user_456", project_id: "proj_1" });

    const rateLimit = await adminMethods.modifyProjectRateLimit.call(clientContext, {
      payload: {
        project_id: "proj_1",
        rate_limit_id: "rl_123",
        max_requests_per_1_minute: 500,
      },
    });
    assert.deepEqual(rateLimit, {
      id: "rl_123",
      project_id: "proj_1",
      max_requests_per_1_minute: 500,
    });

    assert.equal(adminMethods.listOrganizationProjects.authentication, "admin");
    assert.equal(adminMethods.modifyProjectRateLimit.authentication, "admin");

    delete require.cache[modulePath];
  });

  const adminCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(adminCalls, [
    {
      method: "admin.organization.auditLogs.list",
      query: {
        effective_at: { gt: 1710000000 },
        project_ids: ["proj_1"],
        event_types: workloadIdentityAuditEventTypes,
      },
    },
    {
      method: "admin.organization.adminAPIKeys.retrieve",
      keyID: "key_123",
      options: {},
    },
    {
      method: "admin.organization.users.roles.create",
      userID: "user_123",
      body: {
        role: "owner",
      },
    },
    {
      method: "admin.organization.projects.list",
      query: {
        limit: 20,
        include_archived: true,
      },
    },
    {
      method: "admin.organization.projects.users.retrieve",
      userID: "user_456",
      params: {
        project_id: "proj_1",
      },
    },
    {
      method: "admin.organization.projects.rateLimits.updateRateLimit",
      rateLimitID: "rl_123",
      params: {
        project_id: "proj_1",
        max_requests_per_1_minute: 500,
      },
    },
  ]);
});

test("admin methods map v6.39.0 existing-family retrieve and update wrappers to OpenAI SDK", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.admin = {
        organization: {
          users: {
            roles: {
              retrieve: async (roleID, params) => {
                calls.push({ method: "admin.organization.users.roles.retrieve", roleID, params });
                return { id: roleID, user_id: params.user_id, object: "organization.user.role" };
              },
            },
          },
          groups: {
            retrieve: async (groupID, options) => {
              calls.push({ method: "admin.organization.groups.retrieve", groupID, options });
              return { id: groupID, object: "organization.group", options };
            },
            users: {
              retrieve: async (userID, params) => {
                calls.push({ method: "admin.organization.groups.users.retrieve", userID, params });
                return { id: userID, group_id: params.group_id, object: "organization.group.user" };
              },
            },
            roles: {
              retrieve: async (roleID, params) => {
                calls.push({ method: "admin.organization.groups.roles.retrieve", roleID, params });
                return { id: roleID, group_id: params.group_id, object: "organization.group.role" };
              },
            },
          },
          roles: {
            retrieve: async (roleID, options) => {
              calls.push({ method: "admin.organization.roles.retrieve", roleID, options });
              return { id: roleID, object: "organization.role", options };
            },
          },
          projects: {
            serviceAccounts: {
              update: async (serviceAccountID, params) => {
                calls.push({ method: "admin.organization.projects.serviceAccounts.update", serviceAccountID, params });
                return { id: serviceAccountID, project_id: params.project_id, name: params.name };
              },
            },
            users: {
              roles: {
                retrieve: async (roleID, params) => {
                  calls.push({ method: "admin.organization.projects.users.roles.retrieve", roleID, params });
                  return {
                    id: roleID,
                    project_id: params.project_id,
                    user_id: params.user_id,
                    object: "project.user.role",
                  };
                },
              },
            },
            groups: {
              retrieve: async (groupID, params) => {
                calls.push({ method: "admin.organization.projects.groups.retrieve", groupID, params });
                return { id: groupID, project_id: params.project_id, object: "project.group" };
              },
              roles: {
                retrieve: async (roleID, params) => {
                  calls.push({ method: "admin.organization.projects.groups.roles.retrieve", roleID, params });
                  return {
                    id: roleID,
                    project_id: params.project_id,
                    group_id: params.group_id,
                    object: "project.group.role",
                  };
                },
              },
            },
            roles: {
              retrieve: async (roleID, params) => {
                calls.push({ method: "admin.organization.projects.roles.retrieve", roleID, params });
                return { id: roleID, project_id: params.project_id, object: "project.role" };
              },
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/admin/methods.js");
    delete require.cache[modulePath];
    const adminMethods = require("../src/admin/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: null,
        adminAPIKey: "sk-admin-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    assert.deepEqual(
      await adminMethods.getOrganizationUserRole.call(clientContext, {
        payload: { user_id: "user_1", role_id: "role_org_user_1", request_id: "trace_user_role" },
      }),
      {
        id: "role_org_user_1",
        user_id: "user_1",
        object: "organization.user.role",
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationGroup.call(clientContext, {
        payload: { group_id: "group_1", request_id: "trace_org_group" },
      }),
      {
        id: "group_1",
        object: "organization.group",
        options: { request_id: "trace_org_group" },
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationGroupUser.call(clientContext, {
        payload: { group_id: "group_1", user_id: "user_2", request_id: "trace_group_user" },
      }),
      {
        id: "user_2",
        group_id: "group_1",
        object: "organization.group.user",
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationGroupRole.call(clientContext, {
        payload: { group_id: "group_1", role_id: "role_group_1", request_id: "trace_group_role" },
      }),
      {
        id: "role_group_1",
        group_id: "group_1",
        object: "organization.group.role",
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationRole.call(clientContext, {
        payload: { role_id: "role_org_1", request_id: "trace_org_role" },
      }),
      {
        id: "role_org_1",
        object: "organization.role",
        options: { request_id: "trace_org_role" },
      }
    );
    assert.deepEqual(
      await adminMethods.modifyProjectServiceAccount.call(clientContext, {
        payload: { project_id: "proj_1", service_account_id: "svc_1", name: "billing worker" },
      }),
      {
        id: "svc_1",
        project_id: "proj_1",
        name: "billing worker",
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectUserRole.call(clientContext, {
        payload: {
          project_id: "proj_1",
          user_id: "user_3",
          role_id: "role_project_user_1",
          request_id: "trace_project_user_role",
        },
      }),
      {
        id: "role_project_user_1",
        project_id: "proj_1",
        user_id: "user_3",
        object: "project.user.role",
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectGroup.call(clientContext, {
        payload: { project_id: "proj_1", group_id: "group_2", request_id: "trace_project_group" },
      }),
      {
        id: "group_2",
        project_id: "proj_1",
        object: "project.group",
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectGroupRole.call(clientContext, {
        payload: {
          project_id: "proj_1",
          group_id: "group_2",
          role_id: "role_project_group_1",
          request_id: "trace_project_group_role",
        },
      }),
      {
        id: "role_project_group_1",
        project_id: "proj_1",
        group_id: "group_2",
        object: "project.group.role",
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectRole.call(clientContext, {
        payload: { project_id: "proj_1", role_id: "role_project_1", request_id: "trace_project_role" },
      }),
      {
        id: "role_project_1",
        project_id: "proj_1",
        object: "project.role",
      }
    );

    [
      "getOrganizationUserRole",
      "getOrganizationGroup",
      "getOrganizationGroupUser",
      "getOrganizationGroupRole",
      "getOrganizationRole",
      "modifyProjectServiceAccount",
      "getProjectUserRole",
      "getProjectGroup",
      "getProjectGroupRole",
      "getProjectRole",
    ].forEach((methodName) => {
      assert.equal(adminMethods[methodName].authentication, "admin");
    });

    delete require.cache[modulePath];
  });

  const adminCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(adminCalls, [
    {
      method: "admin.organization.users.roles.retrieve",
      roleID: "role_org_user_1",
      params: { user_id: "user_1", request_id: "trace_user_role" },
    },
    {
      method: "admin.organization.groups.retrieve",
      groupID: "group_1",
      options: { request_id: "trace_org_group" },
    },
    {
      method: "admin.organization.groups.users.retrieve",
      userID: "user_2",
      params: { group_id: "group_1", request_id: "trace_group_user" },
    },
    {
      method: "admin.organization.groups.roles.retrieve",
      roleID: "role_group_1",
      params: { group_id: "group_1", request_id: "trace_group_role" },
    },
    {
      method: "admin.organization.roles.retrieve",
      roleID: "role_org_1",
      options: { request_id: "trace_org_role" },
    },
    {
      method: "admin.organization.projects.serviceAccounts.update",
      serviceAccountID: "svc_1",
      params: { project_id: "proj_1", name: "billing worker" },
    },
    {
      method: "admin.organization.projects.users.roles.retrieve",
      roleID: "role_project_user_1",
      params: {
        project_id: "proj_1",
        user_id: "user_3",
        request_id: "trace_project_user_role",
      },
    },
    {
      method: "admin.organization.projects.groups.retrieve",
      groupID: "group_2",
      params: { project_id: "proj_1", request_id: "trace_project_group" },
    },
    {
      method: "admin.organization.projects.groups.roles.retrieve",
      roleID: "role_project_group_1",
      params: {
        project_id: "proj_1",
        group_id: "group_2",
        request_id: "trace_project_group_role",
      },
    },
    {
      method: "admin.organization.projects.roles.retrieve",
      roleID: "role_project_1",
      params: { project_id: "proj_1", request_id: "trace_project_role" },
    },
  ]);
});

test("admin methods map v6.39.0 resource-family wrappers to OpenAI SDK", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.admin = {
        organization: {
          usage: {
            fileSearchCalls: async (query) => {
              calls.push({ method: "admin.organization.usage.fileSearchCalls", query });
              return { object: "usage.file_search_calls", query };
            },
            webSearchCalls: async (query) => {
              calls.push({ method: "admin.organization.usage.webSearchCalls", query });
              return { object: "usage.web_search_calls", query };
            },
          },
          dataRetention: {
            retrieve: async (options) => {
              calls.push({ method: "admin.organization.dataRetention.retrieve", options });
              return { object: "organization.data_retention", options };
            },
            update: async (body) => {
              calls.push({ method: "admin.organization.dataRetention.update", body });
              return { object: "organization.data_retention", ...body };
            },
          },
          spendAlerts: {
            create: async (body) => {
              calls.push({ method: "admin.organization.spendAlerts.create", body });
              return { id: "org_alert_created", ...body };
            },
            update: async (alertID, body) => {
              calls.push({ method: "admin.organization.spendAlerts.update", alertID, body });
              return { id: alertID, ...body };
            },
            list: async (query) => {
              calls.push({ method: "admin.organization.spendAlerts.list", query });
              return { data: [{ id: "org_alert_1" }, { id: "org_alert_2" }] };
            },
            delete: async (alertID, options) => {
              calls.push({ method: "admin.organization.spendAlerts.delete", alertID, options });
              return { id: alertID, deleted: true };
            },
          },
          projects: {
            dataRetention: {
              retrieve: async (projectID, options) => {
                calls.push({ method: "admin.organization.projects.dataRetention.retrieve", projectID, options });
                return { object: "project.data_retention", project_id: projectID, options };
              },
              update: async (projectID, body) => {
                calls.push({ method: "admin.organization.projects.dataRetention.update", projectID, body });
                return { object: "project.data_retention", project_id: projectID, ...body };
              },
            },
            spendAlerts: {
              create: async (projectID, body) => {
                calls.push({ method: "admin.organization.projects.spendAlerts.create", projectID, body });
                return { id: "project_alert_created", project_id: projectID, ...body };
              },
              update: async (alertID, params) => {
                calls.push({ method: "admin.organization.projects.spendAlerts.update", alertID, params });
                return { id: alertID, project_id: params.project_id };
              },
              list: async (projectID, query) => {
                calls.push({ method: "admin.organization.projects.spendAlerts.list", projectID, query });
                return { data: [{ id: "project_alert_1" }, { id: "project_alert_2" }] };
              },
              delete: async (alertID, params) => {
                calls.push({ method: "admin.organization.projects.spendAlerts.delete", alertID, params });
                return { id: alertID, deleted: true };
              },
            },
            modelPermissions: {
              retrieve: async (projectID, options) => {
                calls.push({ method: "admin.organization.projects.modelPermissions.retrieve", projectID, options });
                return { object: "project.model_permissions", project_id: projectID, options };
              },
              update: async (projectID, body) => {
                calls.push({ method: "admin.organization.projects.modelPermissions.update", projectID, body });
                return { object: "project.model_permissions", project_id: projectID, ...body };
              },
              delete: async (projectID, options) => {
                calls.push({ method: "admin.organization.projects.modelPermissions.delete", projectID, options });
                return { id: projectID, deleted: true };
              },
            },
            hostedToolPermissions: {
              retrieve: async (projectID, options) => {
                calls.push({ method: "admin.organization.projects.hostedToolPermissions.retrieve", projectID, options });
                return { object: "project.hosted_tool_permissions", project_id: projectID, options };
              },
              update: async (projectID, body) => {
                calls.push({ method: "admin.organization.projects.hostedToolPermissions.update", projectID, body });
                return { object: "project.hosted_tool_permissions", project_id: projectID, ...body };
              },
            },
          },
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/admin/methods.js");
    delete require.cache[modulePath];
    const adminMethods = require("../src/admin/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: null,
        adminAPIKey: "sk-admin-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    assert.deepEqual(
      await adminMethods.getOrganizationUsageFileSearchCalls.call(clientContext, {
        payload: { start_time: 1710000000, end_time: 1710086400 },
      }),
      {
        object: "usage.file_search_calls",
        query: { start_time: 1710000000, end_time: 1710086400 },
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationUsageWebSearchCalls.call(clientContext, {
        payload: { start_time: 1710000000, bucket_width: "1d" },
      }),
      {
        object: "usage.web_search_calls",
        query: { start_time: 1710000000, bucket_width: "1d" },
      }
    );
    assert.deepEqual(
      await adminMethods.getOrganizationDataRetention.call(clientContext, {
        payload: { request_id: "trace_org_retention" },
      }),
      {
        object: "organization.data_retention",
        options: { request_id: "trace_org_retention" },
      }
    );
    assert.deepEqual(
      await adminMethods.modifyOrganizationDataRetention.call(clientContext, {
        payload: { retention_type: "zero_data_retention" },
      }),
      {
        object: "organization.data_retention",
        retention_type: "zero_data_retention",
      }
    );
    assert.deepEqual(
      await adminMethods.createOrganizationSpendAlert.call(clientContext, {
        payload: { currency: "USD", interval: "month", threshold_amount: 1000 },
      }),
      {
        id: "org_alert_created",
        currency: "USD",
        interval: "month",
        threshold_amount: 1000,
      }
    );
    assert.deepEqual(
      await adminMethods.modifyOrganizationSpendAlert.call(clientContext, {
        payload: { alert_id: "alert_org_1", threshold_amount: 2000 },
      }),
      {
        id: "alert_org_1",
        threshold_amount: 2000,
      }
    );
    assert.deepEqual(
      await adminMethods.listOrganizationSpendAlerts.call(clientContext, {
        payload: { limit: 20 },
      }),
      [{ id: "org_alert_1" }, { id: "org_alert_2" }]
    );
    assert.deepEqual(
      await adminMethods.deleteOrganizationSpendAlert.call(clientContext, {
        payload: { alert_id: "alert_org_1", request_id: "trace_delete" },
      }),
      {
        id: "alert_org_1",
        deleted: true,
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectDataRetention.call(clientContext, {
        payload: { project_id: "proj_1", request_id: "trace_project_retention" },
      }),
      {
        object: "project.data_retention",
        project_id: "proj_1",
        options: { request_id: "trace_project_retention" },
      }
    );
    assert.deepEqual(
      await adminMethods.modifyProjectDataRetention.call(clientContext, {
        payload: { project_id: "proj_1", retention_type: "organization_default" },
      }),
      {
        object: "project.data_retention",
        project_id: "proj_1",
        retention_type: "organization_default",
      }
    );
    assert.deepEqual(
      await adminMethods.createProjectSpendAlert.call(clientContext, {
        payload: { project_id: "proj_1", currency: "USD", threshold_amount: 3000 },
      }),
      {
        id: "project_alert_created",
        project_id: "proj_1",
        currency: "USD",
        threshold_amount: 3000,
      }
    );
    assert.deepEqual(
      await adminMethods.modifyProjectSpendAlert.call(clientContext, {
        payload: { project_id: "proj_1", alert_id: "alert_project_1", threshold_amount: 3500 },
      }),
      {
        id: "alert_project_1",
        project_id: "proj_1",
      }
    );
    assert.deepEqual(
      await adminMethods.listProjectSpendAlerts.call(clientContext, {
        payload: { project_id: "proj_1", limit: 10 },
      }),
      [{ id: "project_alert_1" }, { id: "project_alert_2" }]
    );
    assert.deepEqual(
      await adminMethods.deleteProjectSpendAlert.call(clientContext, {
        payload: { project_id: "proj_1", alert_id: "alert_project_1" },
      }),
      {
        id: "alert_project_1",
        deleted: true,
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectModelPermissions.call(clientContext, {
        payload: { project_id: "proj_1", request_id: "trace_model_permissions" },
      }),
      {
        object: "project.model_permissions",
        project_id: "proj_1",
        options: { request_id: "trace_model_permissions" },
      }
    );
    assert.deepEqual(
      await adminMethods.modifyProjectModelPermissions.call(clientContext, {
        payload: { project_id: "proj_1", mode: "allow_list", model_ids: ["gpt-5.4"] },
      }),
      {
        object: "project.model_permissions",
        project_id: "proj_1",
        mode: "allow_list",
        model_ids: ["gpt-5.4"],
      }
    );
    assert.deepEqual(
      await adminMethods.deleteProjectModelPermissions.call(clientContext, {
        payload: { project_id: "proj_1", request_id: "trace_model_delete" },
      }),
      {
        id: "proj_1",
        deleted: true,
      }
    );
    assert.deepEqual(
      await adminMethods.getProjectHostedToolPermissions.call(clientContext, {
        payload: { project_id: "proj_1", request_id: "trace_hosted_tools" },
      }),
      {
        object: "project.hosted_tool_permissions",
        project_id: "proj_1",
        options: { request_id: "trace_hosted_tools" },
      }
    );
    assert.deepEqual(
      await adminMethods.modifyProjectHostedToolPermissions.call(clientContext, {
        payload: {
          project_id: "proj_1",
          web_search: { enabled: true },
          file_search: { enabled: false },
        },
      }),
      {
        object: "project.hosted_tool_permissions",
        project_id: "proj_1",
        web_search: { enabled: true },
        file_search: { enabled: false },
      }
    );

    [
      "getOrganizationUsageFileSearchCalls",
      "getOrganizationUsageWebSearchCalls",
      "getOrganizationDataRetention",
      "modifyOrganizationDataRetention",
      "createOrganizationSpendAlert",
      "modifyOrganizationSpendAlert",
      "listOrganizationSpendAlerts",
      "deleteOrganizationSpendAlert",
      "getProjectDataRetention",
      "modifyProjectDataRetention",
      "createProjectSpendAlert",
      "modifyProjectSpendAlert",
      "listProjectSpendAlerts",
      "deleteProjectSpendAlert",
      "getProjectModelPermissions",
      "modifyProjectModelPermissions",
      "deleteProjectModelPermissions",
      "getProjectHostedToolPermissions",
      "modifyProjectHostedToolPermissions",
    ].forEach((methodName) => {
      assert.equal(adminMethods[methodName].authentication, "admin");
    });

    delete require.cache[modulePath];
  });

  const adminCalls = calls.filter((entry) => entry.method !== "ctor");
  assert.deepEqual(adminCalls, [
    {
      method: "admin.organization.usage.fileSearchCalls",
      query: { start_time: 1710000000, end_time: 1710086400 },
    },
    {
      method: "admin.organization.usage.webSearchCalls",
      query: { start_time: 1710000000, bucket_width: "1d" },
    },
    {
      method: "admin.organization.dataRetention.retrieve",
      options: { request_id: "trace_org_retention" },
    },
    {
      method: "admin.organization.dataRetention.update",
      body: { retention_type: "zero_data_retention" },
    },
    {
      method: "admin.organization.spendAlerts.create",
      body: { currency: "USD", interval: "month", threshold_amount: 1000 },
    },
    {
      method: "admin.organization.spendAlerts.update",
      alertID: "alert_org_1",
      body: { threshold_amount: 2000 },
    },
    {
      method: "admin.organization.spendAlerts.list",
      query: { limit: 20 },
    },
    {
      method: "admin.organization.spendAlerts.delete",
      alertID: "alert_org_1",
      options: { request_id: "trace_delete" },
    },
    {
      method: "admin.organization.projects.dataRetention.retrieve",
      projectID: "proj_1",
      options: { request_id: "trace_project_retention" },
    },
    {
      method: "admin.organization.projects.dataRetention.update",
      projectID: "proj_1",
      body: { retention_type: "organization_default" },
    },
    {
      method: "admin.organization.projects.spendAlerts.create",
      projectID: "proj_1",
      body: { currency: "USD", threshold_amount: 3000 },
    },
    {
      method: "admin.organization.projects.spendAlerts.update",
      alertID: "alert_project_1",
      params: { project_id: "proj_1", threshold_amount: 3500 },
    },
    {
      method: "admin.organization.projects.spendAlerts.list",
      projectID: "proj_1",
      query: { limit: 10 },
    },
    {
      method: "admin.organization.projects.spendAlerts.delete",
      alertID: "alert_project_1",
      params: { project_id: "proj_1" },
    },
    {
      method: "admin.organization.projects.modelPermissions.retrieve",
      projectID: "proj_1",
      options: { request_id: "trace_model_permissions" },
    },
    {
      method: "admin.organization.projects.modelPermissions.update",
      projectID: "proj_1",
      body: { mode: "allow_list", model_ids: ["gpt-5.4"] },
    },
    {
      method: "admin.organization.projects.modelPermissions.delete",
      projectID: "proj_1",
      options: { request_id: "trace_model_delete" },
    },
    {
      method: "admin.organization.projects.hostedToolPermissions.retrieve",
      projectID: "proj_1",
      options: { request_id: "trace_hosted_tools" },
    },
    {
      method: "admin.organization.projects.hostedToolPermissions.update",
      projectID: "proj_1",
      body: {
        web_search: { enabled: true },
        file_search: { enabled: false },
      },
    },
  ]);
});

test("OpenaiApi prototype exposes latest methods", () => {
  const OpenaiApi = require("../src/lib.js");
  const client = new OpenaiApi("sk-test", "https://api.openai.com/v1", null);

  assert.equal(typeof client.listOrganizationProjects, "function");
  assert.equal(typeof client.modifyProjectRateLimit, "function");
  assert.equal(typeof client.getOrganizationUserRole, "function");
  assert.equal(typeof client.getOrganizationGroup, "function");
  assert.equal(typeof client.getOrganizationGroupUser, "function");
  assert.equal(typeof client.getOrganizationGroupRole, "function");
  assert.equal(typeof client.getOrganizationRole, "function");
  assert.equal(typeof client.getOrganizationUsageFileSearchCalls, "function");
  assert.equal(typeof client.getOrganizationUsageWebSearchCalls, "function");
  assert.equal(typeof client.getOrganizationDataRetention, "function");
  assert.equal(typeof client.modifyOrganizationDataRetention, "function");
  assert.equal(typeof client.createOrganizationSpendAlert, "function");
  assert.equal(typeof client.modifyOrganizationSpendAlert, "function");
  assert.equal(typeof client.listOrganizationSpendAlerts, "function");
  assert.equal(typeof client.deleteOrganizationSpendAlert, "function");
  assert.equal(typeof client.getProjectDataRetention, "function");
  assert.equal(typeof client.modifyProjectDataRetention, "function");
  assert.equal(typeof client.modifyProjectServiceAccount, "function");
  assert.equal(typeof client.getProjectUserRole, "function");
  assert.equal(typeof client.getProjectGroup, "function");
  assert.equal(typeof client.getProjectGroupRole, "function");
  assert.equal(typeof client.getProjectRole, "function");
  assert.equal(typeof client.createProjectSpendAlert, "function");
  assert.equal(typeof client.modifyProjectSpendAlert, "function");
  assert.equal(typeof client.listProjectSpendAlerts, "function");
  assert.equal(typeof client.deleteProjectSpendAlert, "function");
  assert.equal(typeof client.getProjectModelPermissions, "function");
  assert.equal(typeof client.modifyProjectModelPermissions, "function");
  assert.equal(typeof client.deleteProjectModelPermissions, "function");
  assert.equal(typeof client.getProjectHostedToolPermissions, "function");
  assert.equal(typeof client.modifyProjectHostedToolPermissions, "function");
  assert.equal(typeof client.cancelModelResponse, "function");
  assert.equal(typeof client.compactModelResponse, "function");
  assert.equal(typeof client.countInputTokens, "function");
  assert.equal(typeof client.parseModelResponse, "function");
  assert.equal(typeof client.streamModelResponse, "function");
  assert.equal(typeof client.createChatKitSession, "function");
  assert.equal(typeof client.listChatKitThreadItems, "function");
  assert.equal(typeof client.createConversation, "function");
  assert.equal(typeof client.listConversationItems, "function");
  assert.equal(typeof client.createEval, "function");
  assert.equal(typeof client.listEvalRunOutputItems, "function");
  assert.equal(typeof client.createRealtimeClientSecret, "function");
  assert.equal(typeof client.listSkills, "function");
  assert.equal(typeof client.getSkillVersionContent, "function");
  assert.equal(typeof client.createVideo, "function");
  assert.equal(typeof client.createVideoCharacter, "function");
  assert.equal(typeof client.editVideo, "function");
  assert.equal(typeof client.extendVideo, "function");
  assert.equal(typeof client.getVideoCharacter, "function");
  assert.equal(typeof client.verifyWebhookSignature, "function");
});

test("editor templates and locale expose latest methods", () => {
  const adminTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "admin", "template.html"),
    "utf8"
  );
  const responsesTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "responses", "template.html"),
    "utf8"
  );
  const chatkitTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "chatkit", "template.html"),
    "utf8"
  );
  const conversationsTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "conversations", "template.html"),
    "utf8"
  );
  const skillsTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "skills", "template.html"),
    "utf8"
  );
  const evalsTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "evals", "template.html"),
    "utf8"
  );
  const realtimeTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "realtime", "template.html"),
    "utf8"
  );
  const videosTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "videos", "template.html"),
    "utf8"
  );
  const webhooksTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "webhooks", "template.html"),
    "utf8"
  );
  const nodeTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "node.html"),
    "utf8"
  );
  const generatedNodeHtml = fs.readFileSync(
    path.join(__dirname, "..", "node.html"),
    "utf8"
  );
  const adminHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "admin", "help.html"),
    "utf8"
  );
  const responsesHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "responses", "help.html"),
    "utf8"
  );
  const chatkitHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "chatkit", "help.html"),
    "utf8"
  );
  const skillsHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "skills", "help.html"),
    "utf8"
  );
  const evalsHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "evals", "help.html"),
    "utf8"
  );
  const realtimeHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "realtime", "help.html"),
    "utf8"
  );
  const videosHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "videos", "help.html"),
    "utf8"
  );
  const webhooksHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "webhooks", "help.html"),
    "utf8"
  );
  const locale = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "locales", "en-US", "node.json"), "utf8")
  );

  assert.match(adminTemplate, /value="listOrganizationProjects"/);
  assert.match(adminTemplate, /value="modifyProjectRateLimit"/);
  for (const [method, label, heading] of adminNoa81EditorMethods) {
    const option = `<option value="${method}" data-i18n="OpenaiApi.parameters.${method}"></option>`;
    assert.equal(adminTemplate.includes(option), true);
    assert.equal(generatedNodeHtml.includes(option), true);
    assert.equal(locale.OpenaiApi.parameters[method], label);
    assert.match(adminHelp, new RegExp(`⋙ ${heading}`));
    assert.match(generatedNodeHtml, new RegExp(`⋙ ${heading}`));
  }
  assert.match(responsesTemplate, /value="cancelModelResponse"/);
  assert.match(responsesTemplate, /value="compactModelResponse"/);
  assert.match(responsesTemplate, /value="countInputTokens"/);
  assert.match(responsesTemplate, /value="parseModelResponse"/);
  assert.match(responsesTemplate, /value="streamModelResponse"/);
  assert.match(chatkitTemplate, /value="createChatKitSession"/);
  assert.match(chatkitTemplate, /value="listChatKitThreadItems"/);
  assert.match(conversationsTemplate, /value="createConversation"/);
  assert.match(conversationsTemplate, /value="listConversationItems"/);
  assert.match(skillsTemplate, /value="listSkills"/);
  assert.match(skillsTemplate, /value="getSkillVersionContent"/);
  assert.match(evalsTemplate, /value="createEval"/);
  assert.match(evalsTemplate, /value="listEvalRunOutputItems"/);
  assert.match(realtimeTemplate, /value="createRealtimeClientSecret"/);
  assert.match(realtimeTemplate, /value="rejectRealtimeCall"/);
  assert.match(videosTemplate, /value="downloadVideoContent"/);
  assert.match(videosTemplate, /value="createVideoCharacter"/);
  assert.match(videosTemplate, /value="editVideo"/);
  assert.match(videosTemplate, /value="extendVideo"/);
  assert.match(videosTemplate, /value="getVideoCharacter"/);
  assert.match(webhooksTemplate, /value="verifyWebhookSignature"/);
  assert.match(nodeTemplate, /@@include\('\.\/admin\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/admin\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/chatkit\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/chatkit\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/evals\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/evals\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/realtime\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/realtime\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/skills\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/skills\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/videos\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/videos\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/webhooks\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/webhooks\/help\.html'\)/);
  assert.match(adminHelp, /⋙ List Organization Projects/);
  assert.match(adminHelp, /⋙ List Project Rate Limits/);
  assert.match(adminHelp, /Admin API Key/);
  assert.match(adminHelp, /retention_type/);
  assert.match(adminHelp, /notification_channel/);
  assert.match(adminHelp, /model_ids/);
  assert.match(adminHelp, /web_search/);
  assert.match(adminHelp, /service_account_id/);
  assert.match(adminHelp, /full SDK event detail objects/);
  assert.match(generatedNodeHtml, /full SDK event detail objects/);
  for (const eventType of workloadIdentityAuditEventTypes) {
    const eventTypePattern = new RegExp(eventType.replace(/\./g, "\\."));
    assert.match(adminHelp, eventTypePattern);
    assert.match(generatedNodeHtml, eventTypePattern);
  }
  assert.match(responsesHelp, /⋙ Count Input Tokens/);
  assert.match(responsesHelp, /⋙ Parse Model Response/);
  assert.match(responsesHelp, /⋙ Stream Model Response/);
  assert.match(responsesHelp, /SDK parse helper/);
  assert.match(responsesHelp, /helper's final parsed response object/);
  assert.match(responsesHelp, /Default is <code>desc<\/code>/);
  const generatedCompactHelp = helpSection(
    generatedNodeHtml,
    "<h4 style=\"font-weight: bolder;\"> ⋙ Compact Model Response</h4>",
    "<h4 style=\"font-weight: bolder;\"> ⋙ List Input Items</h4>"
  );
  assert.match(generatedNodeHtml, /value="compactModelResponse"/);
  assert.match(generatedCompactHelp, /service_tier/);
  assert.match(generatedCompactHelp, /auto/);
  assert.match(generatedCompactHelp, /default/);
  assert.match(generatedCompactHelp, /flex/);
  assert.match(generatedCompactHelp, /priority/);
  assert.match(generatedCompactHelp, /<code>null<\/code>/);
  assert.match(chatkitHelp, /⋙ Create ChatKit Session/);
  assert.match(chatkitHelp, /workflow\.id/);
  assert.match(chatkitHelp, /client_secret/);
  assert.match(chatkitHelp, /⋙ List ChatKit Thread Items/);
  assert.match(evalsHelp, /⋙ Create Eval/);
  assert.match(evalsHelp, /⋙ List Eval Run Output Items/);
  assert.match(realtimeHelp, /⋙ Create Realtime Client Secret/);
  assert.match(realtimeHelp, /⋙ Reject Realtime Call/);
  assert.match(realtimeHelp, /msg\.payload\.session/);
  assert.match(realtimeHelp, /session\.model/);
  assert.match(realtimeHelp, /gpt-realtime-2/);
  assert.match(realtimeHelp, /gpt-realtime-1\.5/);
  assert.match(realtimeHelp, /gpt-audio-1\.5/);
  assert.match(realtimeHelp, /session\.reasoning\.effort/);
  assert.match(realtimeHelp, /session\.parallel_tool_calls/);
  assert.match(realtimeHelp, /gpt-realtime-whisper/);
  assert.match(realtimeHelp, /session\.audio\.input\.transcription\.delay/);
  assert.match(realtimeHelp, /session\.audio\.input\.turn_detection/);
  assert.match(realtimeHelp, /session\.audio\.output\.language/);
  assert.match(realtimeHelp, /See the official docs above for transport, lifecycle, and tuning details/);
  assert.match(skillsHelp, /⋙ Create Skill/);
  assert.match(skillsHelp, /⋙ List Skill Versions/);
  assert.match(videosHelp, /⋙ Download Video Content/);
  assert.match(videosHelp, /⋙ Create Video Character/);
  assert.match(videosHelp, /⋙ Edit Video/);
  assert.match(videosHelp, /⋙ Extend Video/);
  assert.match(videosHelp, /⋙ Retrieve Video Character/);
  assert.match(videosHelp, /file_id/);
  assert.match(videosHelp, /image_url/);
  assert.match(videosHelp, /1792x1024/);
  assert.match(webhooksHelp, /⋙ Verify Webhook Signature/);

  assert.equal(
    locale.OpenaiApi.parameters.listOrganizationProjects,
    "list organization projects"
  );
  assert.equal(
    locale.OpenaiApi.parameters.modifyProjectRateLimit,
    "modify project rate limit"
  );
  assert.equal(
    locale.OpenaiApi.parameters.cancelModelResponse,
    "cancel model response"
  );
  assert.equal(
    locale.OpenaiApi.parameters.parseModelResponse,
    "parse model response"
  );
  assert.equal(
    locale.OpenaiApi.parameters.countInputTokens,
    "count input tokens"
  );
  assert.equal(
    locale.OpenaiApi.parameters.streamModelResponse,
    "stream model response"
  );
  assert.equal(
    locale.OpenaiApi.parameters.createChatKitSession,
    "create chatkit session"
  );
  assert.equal(
    locale.OpenaiApi.parameters.listChatKitThreads,
    "list chatkit threads"
  );
  assert.equal(
    locale.OpenaiApi.parameters.createConversation,
    "create conversation"
  );
  assert.equal(
    locale.OpenaiApi.parameters.listSkills,
    "list skills"
  );
  assert.equal(
    locale.OpenaiApi.parameters.getSkillVersion,
    "retrieve skill version"
  );
  assert.equal(
    locale.OpenaiApi.parameters.createEvalRun,
    "create eval run"
  );
  assert.equal(
    locale.OpenaiApi.parameters.acceptRealtimeCall,
    "accept realtime call"
  );
  assert.equal(
    locale.OpenaiApi.parameters.downloadVideoContent,
    "download video content"
  );
  assert.equal(
    locale.OpenaiApi.parameters.createVideoCharacter,
    "create video character"
  );
  assert.equal(
    locale.OpenaiApi.parameters.editVideo,
    "edit video"
  );
  assert.equal(
    locale.OpenaiApi.parameters.extendVideo,
    "extend video"
  );
  assert.equal(
    locale.OpenaiApi.parameters.getVideoCharacter,
    "retrieve video character"
  );
  assert.equal(
    locale.OpenaiApi.parameters.verifyWebhookSignature,
    "verify webhook signature"
  );
});
