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

test("OpenaiApi prototype exposes new responses, conversations, and skills methods", () => {
  const OpenaiApi = require("../src/lib.js");
  const client = new OpenaiApi("sk-test", "https://api.openai.com/v1", null);

  assert.equal(typeof client.cancelModelResponse, "function");
  assert.equal(typeof client.compactModelResponse, "function");
  assert.equal(typeof client.countInputTokens, "function");
  assert.equal(typeof client.createConversation, "function");
  assert.equal(typeof client.listConversationItems, "function");
  assert.equal(typeof client.listSkills, "function");
  assert.equal(typeof client.getSkillVersionContent, "function");
});

test("editor templates and locale expose new responses, conversations, and skills methods", () => {
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
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/conversations\/help\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/skills\/template\.html'\)/);
  assert.match(nodeTemplate, /@@include\('\.\/skills\/help\.html'\)/);
  assert.match(responsesHelp, /⋙ Count Input Tokens/);
  assert.match(responsesHelp, /Default is <code>desc<\/code>/);
  assert.match(skillsHelp, /⋙ Create Skill/);
  assert.match(skillsHelp, /⋙ List Skill Versions/);

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
});
