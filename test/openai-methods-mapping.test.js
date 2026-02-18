"use strict";

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

test("OpenaiApi prototype exposes new responses and conversations methods", () => {
  const OpenaiApi = require("../src/lib.js");
  const client = new OpenaiApi("sk-test", "https://api.openai.com/v1", null);

  assert.equal(typeof client.cancelModelResponse, "function");
  assert.equal(typeof client.compactModelResponse, "function");
  assert.equal(typeof client.countInputTokens, "function");
  assert.equal(typeof client.createConversation, "function");
  assert.equal(typeof client.listConversationItems, "function");
});

test("editor templates and locale expose new responses and conversations methods", () => {
  const responsesTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "responses", "template.html"),
    "utf8"
  );
  const conversationsTemplate = fs.readFileSync(
    path.join(__dirname, "..", "src", "conversations", "template.html"),
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
  const locale = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "locales", "en-US", "node.json"), "utf8")
  );

  assert.match(responsesTemplate, /value="cancelModelResponse"/);
  assert.match(responsesTemplate, /value="compactModelResponse"/);
  assert.match(responsesTemplate, /value="countInputTokens"/);
  assert.match(conversationsTemplate, /value="createConversation"/);
  assert.match(conversationsTemplate, /value="listConversationItems"/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/help\.html'\)/);
  assert.match(responsesHelp, /⋙ Count Input Tokens/);
  assert.match(responsesHelp, /Default is <code>desc<\/code>/);

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
});
