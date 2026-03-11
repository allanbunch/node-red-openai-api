"use strict";

// This file is the broad API surface sanity check.
// It proves our method wrappers, examples, and help text still line up with the OpenAI SDK contract.

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

test("responses methods map delete/cancel/compact/input-items/input-tokens to OpenAI SDK", async () => {
  const calls = [];

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.responses = {
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
      },
    },
  ]);
});

test("responses create forwards phase, prompt_cache_key, tool_search, defer_loading, computer, and gpt-5.4 payloads", async () => {
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
    model: "gpt-5.4",
    prompt_cache_key: "responses-agentic-demo-v1",
    input: [
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
      model: "gpt-5.4",
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
  const realtimeInjectNode = realtimeExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Create Realtime 1.5 Client Secret"
  );
  const audioInjectNode = realtimeExample.find(
    (entry) =>
      entry.type === "inject" &&
      entry.name === "Create Audio 1.5 Client Secret"
  );

  assert.ok(openaiNode);
  assert.equal(openaiNode.method, "createRealtimeClientSecret");
  assert.ok(commentNodes.length >= 3);
  assert.ok(explainerComment);
  assert.match(explainerComment.info, /not your long-lived OpenAI API key/);
  assert.ok(realtimeInjectNode);
  assert.ok(audioInjectNode);

  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.type").v,
    "realtime"
  );
  assert.equal(
    realtimeInjectNode.props.find((prop) => prop.p === "ai.session.model").v,
    "gpt-realtime-1.5"
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
        item: { role: "user", content: [{ type: "text", text: "hello" }] },
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
        downloadContent: async (videoId, query) => {
          calls.push({ method: "videos.downloadContent", videoId, query });
          return { binary: true };
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

    const downloaded = await videoMethods.downloadVideoContent.call(clientContext, {
      payload: { video_id: "video_1", variant: "thumbnail" },
    });
    assert.deepEqual(downloaded, { binary: true });

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
      method: "videos.downloadContent",
      videoId: "video_1",
      query: { variant: "thumbnail" },
    },
    {
      method: "videos.remix",
      videoId: "video_1",
      body: { prompt: "Make it cinematic" },
    },
  ]);
});

test("realtime methods map to OpenAI SDK realtime endpoints and pass newer model ids through unchanged", async () => {
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

    const clientSecretPayload = {
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
      session: {
        type: "realtime",
        model: "gpt-realtime-1.5",
        instructions: "Speak clearly and keep responses concise.",
        output_modalities: ["audio"],
      },
    };
    const secret = await realtimeMethods.createRealtimeClientSecret.call(clientContext, {
      payload: clientSecretPayload,
    });
    assert.deepEqual(secret, {
      expires_at: 123,
      session: clientSecretPayload.session,
      value: "ek_rt_secret_1",
    });

    const accepted = await realtimeMethods.acceptRealtimeCall.call(clientContext, {
      payload: {
        call_id: "call_1",
        type: "realtime",
        model: "gpt-audio-1.5",
        output_modalities: ["audio"],
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
          model: "gpt-realtime-1.5",
          instructions: "Speak clearly and keep responses concise.",
          output_modalities: ["audio"],
        },
      },
    },
    {
      method: "realtime.calls.accept",
      callId: "call_1",
      body: {
        type: "realtime",
        model: "gpt-audio-1.5",
        output_modalities: ["audio"],
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

test("OpenaiApi prototype exposes latest methods", () => {
  const OpenaiApi = require("../src/lib.js");
  const client = new OpenaiApi("sk-test", "https://api.openai.com/v1", null);

  assert.equal(typeof client.cancelModelResponse, "function");
  assert.equal(typeof client.compactModelResponse, "function");
  assert.equal(typeof client.countInputTokens, "function");
  assert.equal(typeof client.createConversation, "function");
  assert.equal(typeof client.listConversationItems, "function");
  assert.equal(typeof client.createEval, "function");
  assert.equal(typeof client.listEvalRunOutputItems, "function");
  assert.equal(typeof client.createRealtimeClientSecret, "function");
  assert.equal(typeof client.listSkills, "function");
  assert.equal(typeof client.getSkillVersionContent, "function");
  assert.equal(typeof client.createVideo, "function");
  assert.equal(typeof client.verifyWebhookSignature, "function");
});

test("editor templates and locale expose latest methods", () => {
  const responsesTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "responses", "template.html"),
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
  const responsesHelp = fs.readFileSync(
    path.join(__dirname, "..", "src", "responses", "help.html"),
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

  assert.match(responsesTemplate, /value="cancelModelResponse"/);
  assert.match(responsesTemplate, /value="compactModelResponse"/);
  assert.match(responsesTemplate, /value="countInputTokens"/);
  assert.match(conversationsTemplate, /value="createConversation"/);
  assert.match(conversationsTemplate, /value="listConversationItems"/);
  assert.match(skillsTemplate, /value="listSkills"/);
  assert.match(skillsTemplate, /value="getSkillVersionContent"/);
  assert.match(evalsTemplate, /value="createEval"/);
  assert.match(evalsTemplate, /value="listEvalRunOutputItems"/);
  assert.match(realtimeTemplate, /value="createRealtimeClientSecret"/);
  assert.match(realtimeTemplate, /value="rejectRealtimeCall"/);
  assert.match(videosTemplate, /value="downloadVideoContent"/);
  assert.match(webhooksTemplate, /value="verifyWebhookSignature"/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/help\.html'\)/);
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
  assert.match(responsesHelp, /⋙ Count Input Tokens/);
  assert.match(responsesHelp, /Default is <code>desc<\/code>/);
  assert.match(evalsHelp, /⋙ Create Eval/);
  assert.match(evalsHelp, /⋙ List Eval Run Output Items/);
  assert.match(realtimeHelp, /⋙ Create Realtime Client Secret/);
  assert.match(realtimeHelp, /⋙ Reject Realtime Call/);
  assert.match(realtimeHelp, /msg\.payload\.session/);
  assert.match(realtimeHelp, /session\.model/);
  assert.match(realtimeHelp, /gpt-realtime-1\.5/);
  assert.match(realtimeHelp, /gpt-audio-1\.5/);
  assert.match(skillsHelp, /⋙ Create Skill/);
  assert.match(skillsHelp, /⋙ List Skill Versions/);
  assert.match(videosHelp, /⋙ Download Video Content/);
  assert.match(webhooksHelp, /⋙ Verify Webhook Signature/);

  assert.equal(
    locale.OpenaiApi.parameters.cancelModelResponse,
    "cancel model response"
  );
  assert.equal(
    locale.OpenaiApi.parameters.countInputTokens,
    "count input tokens"
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
    locale.OpenaiApi.parameters.verifyWebhookSignature,
    "verify webhook signature"
  );
});
