"use strict";

// This file keeps the ComparisonFilter contract honest.
// It checks that vector-store search forwards `in` and `nin` filters unchanged, and that the user-facing picker/help/example surfaces advertise that contract clearly.

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

const locale = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "locales", "en-US", "node.json"), "utf8")
);
const vectorStoresHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "vector-stores", "help.html"),
  "utf8"
);
const vectorStoreSearchExample = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "examples", "vector-store-search.json"), "utf8")
);

test("searchVectorStore forwards ComparisonFilter in/nin payloads unchanged to the OpenAI SDK", async () => {
  const calls = [];
  const requestPayload = {
    vector_store_id: "vs_123",
    query: "release alignment notes",
    filters: {
      type: "and",
      filters: [
        {
          type: "in",
          key: "team",
          value: ["platform", "integrations"],
        },
        {
          type: "nin",
          key: "status",
          value: ["archived", "draft"],
        },
      ],
    },
    max_num_results: 5,
    rewrite_query: true,
  };

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.vectorStores = {
        search: async (vectorStoreId, body) => {
          calls.push({ method: "vectorStores.search", vectorStoreId, body });
          return {
            data: [
              {
                file_id: "file_123",
                filename: "release-notes.md",
                attributes: {
                  team: "platform",
                  status: "published",
                },
              },
            ],
          };
        },
      };
    }
  }

  await withMockedOpenAI(FakeOpenAI, async () => {
    const modulePath = require.resolve("../src/vector-stores/methods.js");
    delete require.cache[modulePath];
    const vectorStoreMethods = require("../src/vector-stores/methods.js");

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
      },
    };

    const response = await vectorStoreMethods.searchVectorStore.call(clientContext, {
      payload: requestPayload,
    });

    assert.deepEqual(response, [
      {
        file_id: "file_123",
        filename: "release-notes.md",
        attributes: {
          team: "platform",
          status: "published",
        },
      },
    ]);

    delete require.cache[modulePath];
  });

  const searchCalls = calls.filter((entry) => entry.method === "vectorStores.search");
  assert.deepEqual(searchCalls, [
    {
      method: "vectorStores.search",
      vectorStoreId: "vs_123",
      body: {
        query: "release alignment notes",
        filters: {
          type: "and",
          filters: [
            {
              type: "in",
              key: "team",
              value: ["platform", "integrations"],
            },
            {
              type: "nin",
              key: "status",
              value: ["archived", "draft"],
            },
          ],
        },
        max_num_results: 5,
        rewrite_query: true,
      },
    },
  ]);
});

test("vector-store picker and help document the search contract and ComparisonFilter operators", () => {
  assert.equal(
    locale.OpenaiApi.parameters.searchVectorStore,
    "search vector store"
  );

  assert.match(vectorStoresHelp, /Search Vector Store/);
  assert.match(vectorStoresHelp, /vector_store_id/);
  assert.match(vectorStoresHelp, /query/);
  assert.match(vectorStoresHelp, /ComparisonFilter/);
  assert.match(vectorStoresHelp, /CompoundFilter/);
  assert.match(vectorStoresHelp, /<code>in<\/code>/);
  assert.match(vectorStoresHelp, /<code>nin<\/code>/);
  assert.match(vectorStoresHelp, /max_num_results/);
  assert.match(vectorStoresHelp, /rewrite_query/);
});

test("vector-store search example demonstrates in/nin ComparisonFilter usage", () => {
  assert.ok(Array.isArray(vectorStoreSearchExample));

  const openaiNode = vectorStoreSearchExample.find(
    (entry) => entry.type === "OpenAI API"
  );
  const injectNode = vectorStoreSearchExample.find(
    (entry) => entry.type === "inject" && entry.name === "Search Vector Store"
  );
  const commentNode = vectorStoreSearchExample.find(
    (entry) => entry.type === "comment"
  );

  assert.ok(openaiNode);
  assert.ok(injectNode);
  assert.ok(commentNode);
  assert.equal(openaiNode.method, "searchVectorStore");
  assert.match(commentNode.info, /ComparisonFilter/);
  assert.match(commentNode.info, /`in`/);
  assert.match(commentNode.info, /`nin`/);
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.vector_store_id").v,
    "vs_replace_me"
  );
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.query").v,
    "release alignment notes"
  );
  assert.equal(
    injectNode.props.find((prop) => prop.p === "ai.max_num_results").v,
    "5"
  );
  assert.deepEqual(
    JSON.parse(injectNode.props.find((prop) => prop.p === "ai.filters").v),
    {
      type: "and",
      filters: [
        {
          type: "in",
          key: "team",
          value: ["platform", "integrations"],
        },
        {
          type: "nin",
          key: "status",
          value: ["archived", "draft"],
        },
      ],
    }
  );
});
