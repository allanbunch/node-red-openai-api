"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const nodeModule = require("../node.js");

function createServiceHostNode(evaluateNodeProperty) {
  let ServiceHostNode;

  const RED = {
    nodes: {
      createNode: (node, config) => {
        node.credentials = config.credentials || {};
      },
      registerType: (name, ctor) => {
        if (name === "Service Host") {
          ServiceHostNode = ctor;
        }
      },
      getNode: () => undefined,
    },
    util: {
      evaluateNodeProperty,
    },
  };

  nodeModule(RED);
  assert.ok(ServiceHostNode, "Service Host constructor should register");
  return ServiceHostNode;
}

function createEvaluateNodeProperty(calls, options = {}) {
  return (value, type, node, msg, callback) => {
    calls.push({ value, type, node, msg, hasCallback: typeof callback === "function" });

    if (type === "flow" || type === "global") {
      const resolvedValue = `resolved:${type}:${value}`;
      if (typeof callback === "function") {
        const deliver = options.asyncFlowGlobal ? setImmediate : (fn) => fn();
        deliver(() => callback(null, resolvedValue));
        return undefined;
      }
      return resolvedValue;
    }

    if (type === "str" || type === "cred") {
      if (typeof callback === "function") {
        callback(null, value);
        return undefined;
      }
      return value;
    }

    const resolvedValue = `resolved:${type}:${value}`;
    if (typeof callback === "function") {
      callback(null, resolvedValue);
      return undefined;
    }
    return resolvedValue;
  };
}

test("uses credential value when API key type is cred", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    secureApiKeyValueType: "cred",
    secureApiKeyValueRef: "",
    credentials: { secureApiKeyValue: "sk-test" },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "sk-test");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "sk-test");
  assert.equal(calls[0].type, "cred");
});

test("uses explicit reference value when API key type is env", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    secureApiKeyValueType: "env",
    secureApiKeyValueRef: "OPENAI_API_KEY",
    credentials: { secureApiKeyValue: "sk-ignored" },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "resolved:env:OPENAI_API_KEY");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "OPENAI_API_KEY");
  assert.equal(calls[0].type, "env");
});

test("supports legacy non-cred nodes that stored env reference in credentials", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    secureApiKeyValueType: "env",
    credentials: { secureApiKeyValue: "OPENAI_API_KEY" },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "resolved:env:OPENAI_API_KEY");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "OPENAI_API_KEY");
  assert.equal(calls[0].type, "env");
});

test("falls back to credential value when non-cred reference is empty", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    secureApiKeyValueType: "env",
    secureApiKeyValueRef: "",
    credentials: { secureApiKeyValue: "OPENAI_API_KEY" },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "resolved:env:OPENAI_API_KEY");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "OPENAI_API_KEY");
  assert.equal(calls[0].type, "env");
});

test("supports legacy typed value stored only in credentials type field", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    credentials: {
      secureApiKeyValue: "OPENAI_API_KEY",
      secureApiKeyValueType: "env",
    },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "resolved:env:OPENAI_API_KEY");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "OPENAI_API_KEY");
  assert.equal(calls[0].type, "env");
});

test("supports legacy string API key values without reference field", () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(createEvaluateNodeProperty(calls));
  const node = new ServiceHostNode({
    secureApiKeyValueType: "str",
    credentials: { secureApiKeyValue: "sk-legacy" },
  });

  const result = node.evaluateTyped("secureApiKeyValue", {}, node);

  assert.equal(result, "sk-legacy");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "sk-legacy");
  assert.equal(calls[0].type, "str");
});

test("evaluateTypedAsync resolves flow/global types using callback path", async () => {
  const calls = [];
  const ServiceHostNode = createServiceHostNode(
    createEvaluateNodeProperty(calls, { asyncFlowGlobal: true })
  );
  const node = new ServiceHostNode({
    secureApiKeyValueType: "flow",
    secureApiKeyValueRef: "openai.key",
  });

  const result = await node.evaluateTypedAsync("secureApiKeyValue", {}, node);

  assert.equal(result, "resolved:flow:openai.key");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].value, "openai.key");
  assert.equal(calls[0].type, "flow");
  assert.equal(calls[0].hasCallback, true);
});
