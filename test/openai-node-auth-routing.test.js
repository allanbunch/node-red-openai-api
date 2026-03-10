"use strict";

// This file keeps the Service Host auth rules honest.
// It checks that header auth, query auth, and default Authorization behavior are all routed the way this node promises.

const assert = require("node:assert/strict");
const EventEmitter = require("node:events");
const test = require("node:test");

const OpenaiApi = require("../lib.js");
const nodeModule = require("../node.js");

function createEvaluateNodeProperty() {
  return (value, type, node, msg, callback) => {
    let resolvedValue = value;

    if (type === "env" || type === "msg" || type === "flow" || type === "global") {
      resolvedValue = `resolved:${type}:${value}`;
    }

    if (typeof callback === "function") {
      callback(null, resolvedValue);
      return undefined;
    }

    return resolvedValue;
  };
}

function createNodeHarness() {
  const registeredTypes = {};
  const configNodes = new Map();

  const RED = {
    nodes: {
      createNode: (node, config) => {
        const emitter = new EventEmitter();
        node.on = emitter.on.bind(emitter);
        node.emit = emitter.emit.bind(emitter);

        node.sentMessages = [];
        node.errorMessages = [];
        node.send = (msg) => {
          node.sentMessages.push(msg);
        };
        node.error = (error, msg) => {
          node.errorMessages.push({ error, msg });
        };
        node.status = () => { };
        node.context = () => ({
          flow: { get: () => undefined },
          global: { get: () => undefined },
        });

        node.credentials = config.credentials || {};
        node.id = config.id;
      },
      registerType: (name, ctor) => {
        registeredTypes[name] = ctor;
      },
      getNode: (id) => configNodes.get(id),
    },
    util: {
      evaluateNodeProperty: createEvaluateNodeProperty(),
      getMessageProperty: (msg, path) => {
        if (path === "payload") {
          return msg.payload;
        }

        return path.split(".").reduce((value, key) => {
          if (value === undefined || value === null) {
            return undefined;
          }
          return value[key];
        }, msg);
      },
    },
  };

  nodeModule(RED);

  return {
    OpenaiApiNode: registeredTypes["OpenAI API"],
    ServiceHostNode: registeredTypes["Service Host"],
    configNodes,
  };
}

async function runAuthRoutingCase(serviceConfig) {
  const harness = createNodeHarness();
  assert.ok(harness.OpenaiApiNode, "OpenAI API node should register");
  assert.ok(harness.ServiceHostNode, "Service Host node should register");

  const serviceNode = new harness.ServiceHostNode({
    id: "service-1",
    apiBase: "https://api.example.com/v1",
    apiBaseType: "str",
    secureApiKeyHeaderOrQueryName: "Authorization",
    secureApiKeyHeaderOrQueryNameType: "str",
    organizationId: "OPENAI_ORG_ID",
    organizationIdType: "env",
    secureApiKeyIsQuery: false,
    secureApiKeyValueType: "cred",
    credentials: {
      secureApiKeyValue: "sk-test",
    },
    ...serviceConfig,
  });
  harness.configNodes.set("service-1", serviceNode);

  const apiNode = new harness.OpenaiApiNode({
    id: "openai-1",
    service: "service-1",
    method: "createModelResponse",
    property: "payload",
    propertyType: "msg",
  });

  apiNode.emit("input", { payload: { model: "gpt-5-nano" } });

  // Allow Promise-based input handler to resolve and send.
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(apiNode.errorMessages.length, 0);
  assert.equal(apiNode.sentMessages.length, 1);
}

test("applies custom auth header to OpenAI client params", async () => {
  const originalCreateModelResponse = OpenaiApi.prototype.createModelResponse;
  const capturedClientParams = [];

  OpenaiApi.prototype.createModelResponse = async function () {
    capturedClientParams.push({ ...this.clientParams });
    return { ok: true };
  };

  try {
    await runAuthRoutingCase({
      secureApiKeyHeaderOrQueryName: "X-API-Key",
      secureApiKeyHeaderOrQueryNameType: "str",
      secureApiKeyIsQuery: false,
    });
  } finally {
    OpenaiApi.prototype.createModelResponse = originalCreateModelResponse;
  }

  assert.equal(capturedClientParams.length, 1);
  assert.deepEqual(capturedClientParams[0].defaultHeaders, {
    Authorization: null,
    "X-API-Key": "sk-test",
  });
  assert.equal(capturedClientParams[0].defaultQuery, undefined);
});

test("applies query-string auth mode with typed header name", async () => {
  const originalCreateModelResponse = OpenaiApi.prototype.createModelResponse;
  const capturedClientParams = [];

  OpenaiApi.prototype.createModelResponse = async function () {
    capturedClientParams.push({ ...this.clientParams });
    return { ok: true };
  };

  try {
    await runAuthRoutingCase({
      secureApiKeyHeaderOrQueryName: "OPENAI_AUTH_QUERY_PARAM",
      secureApiKeyHeaderOrQueryNameType: "env",
      secureApiKeyIsQuery: "true",
    });
  } finally {
    OpenaiApi.prototype.createModelResponse = originalCreateModelResponse;
  }

  assert.equal(capturedClientParams.length, 1);
  assert.deepEqual(capturedClientParams[0].defaultHeaders, {
    Authorization: null,
  });
  assert.deepEqual(capturedClientParams[0].defaultQuery, {
    "resolved:env:OPENAI_AUTH_QUERY_PARAM": "sk-test",
  });
});

test("keeps OpenAI SDK default Authorization behavior when header stays Authorization", async () => {
  const originalCreateModelResponse = OpenaiApi.prototype.createModelResponse;
  const capturedClientParams = [];

  OpenaiApi.prototype.createModelResponse = async function () {
    capturedClientParams.push({ ...this.clientParams });
    return { ok: true };
  };

  try {
    await runAuthRoutingCase({
      secureApiKeyHeaderOrQueryName: "Authorization",
      secureApiKeyHeaderOrQueryNameType: "str",
      secureApiKeyIsQuery: false,
    });
  } finally {
    OpenaiApi.prototype.createModelResponse = originalCreateModelResponse;
  }

  assert.equal(capturedClientParams.length, 1);
  assert.equal(capturedClientParams[0].defaultHeaders, undefined);
  assert.equal(capturedClientParams[0].defaultQuery, undefined);
});
