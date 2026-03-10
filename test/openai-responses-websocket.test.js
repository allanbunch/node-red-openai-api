"use strict";

// This file covers the Responses websocket lifecycle in isolation.
// It proves connect/send/close behavior, auth routing, parse errors, and node cleanup without needing a real network socket.

const assert = require("node:assert/strict");
const EventEmitter = require("node:events");
const test = require("node:test");

const OpenaiApi = require("../lib.js");
const nodeModule = require("../node.js");

function withMockedWebSocket(FakeWebSocket, callback) {
  const wsModulePath = require.resolve("ws");
  const methodsModulePath = require.resolve("../src/responses/methods.js");
  const websocketModulePath = require.resolve("../src/responses/websocket.js");
  const originalWsExports = require(wsModulePath);

  delete require.cache[methodsModulePath];
  delete require.cache[websocketModulePath];
  require.cache[wsModulePath].exports = { WebSocket: FakeWebSocket };

  const run = async () => {
    try {
      const responsesMethods = require("../src/responses/methods.js");
      return await callback(responsesMethods);
    } finally {
      delete require.cache[methodsModulePath];
      delete require.cache[websocketModulePath];
      require.cache[wsModulePath].exports = originalWsExports;
    }
  };

  return run();
}

class FakeWebSocket extends EventEmitter {
  constructor(url, options) {
    super();
    this.url = url.toString();
    this.options = options;
    this.sentPayloads = [];
    this.closeCalls = [];

    FakeWebSocket.instances.push(this);
    setImmediate(() => {
      this.emit("open");
    });
  }

  send(data) {
    this.sentPayloads.push(JSON.parse(data));
  }

  close(code, reason) {
    this.closeCalls.push({ code, reason });
    setImmediate(() => {
      this.emit("close", code, Buffer.from(reason));
    });
  }

  emitServerEvent(event) {
    this.emit("message", Buffer.from(JSON.stringify(event)));
  }

  emitRawMessage(raw) {
    this.emit("message", Buffer.from(raw));
  }

  static reset() {
    FakeWebSocket.instances.length = 0;
  }
}

FakeWebSocket.instances = [];

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

async function nextTick() {
  await new Promise((resolve) => setImmediate(resolve));
}

test("responses websocket connect/send/close uses custom auth header and emits server events", async () => {
  FakeWebSocket.reset();

  await withMockedWebSocket(FakeWebSocket, async (responsesMethods) => {
    const sentMessages = [];
    const errorMessages = [];
    const cleanupHandlers = [];
    const node = {
      send: (msg) => sentMessages.push(msg),
      error: (error) => errorMessages.push(error),
      registerCleanupHandler: (handler) => cleanupHandlers.push(handler),
    };

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "http://api.example.com/v1",
        organization: "org_test",
        defaultHeaders: {
          Authorization: null,
          "X-API-Key": "sk-test",
        },
      },
    };

    const connectResponse = await responsesMethods.manageModelResponseWebSocket.call(
      clientContext,
      {
        _node: node,
        payload: {
          action: "connect",
          connection_id: "connection-1",
        },
      }
    );

    const socket = FakeWebSocket.instances[0];
    assert.ok(socket);
    assert.deepEqual(connectResponse, {
      object: "response.websocket.connection",
      action: "connect",
      connection_id: "connection-1",
      url: "ws://api.example.com/v1/responses",
    });
    assert.deepEqual(socket.options, {
      headers: {
        "X-API-Key": "sk-test",
        "OpenAI-Organization": "org_test",
      },
    });
    assert.equal(cleanupHandlers.length, 1);

    socket.emitServerEvent({ type: "response.created", response: { id: "resp_1" } });
    await nextTick();

    assert.deepEqual(sentMessages, [
      {
        payload: { type: "response.created", response: { id: "resp_1" } },
        openai: {
          transport: "responses.websocket",
          direction: "server",
          connection_id: "connection-1",
          event_type: "response.created",
        },
      },
    ]);

    const sendResponse = await responsesMethods.manageModelResponseWebSocket.call(
      clientContext,
      {
        _node: node,
        payload: {
          action: "send",
          connection_id: "connection-1",
          event: {
            type: "response.create",
            model: "gpt-5.4",
            input: "Say hello from the websocket test.",
          },
        },
      }
    );

    assert.deepEqual(socket.sentPayloads, [
      {
        type: "response.create",
        model: "gpt-5.4",
        input: "Say hello from the websocket test.",
      },
    ]);
    assert.deepEqual(sendResponse, {
      object: "response.websocket.client_event",
      action: "send",
      connection_id: "connection-1",
      event_type: "response.create",
    });

    const closeResponse = await responsesMethods.manageModelResponseWebSocket.call(
      clientContext,
      {
        _node: node,
        payload: {
          action: "close",
          connection_id: "connection-1",
          reason: "Example close",
        },
      }
    );

    assert.deepEqual(socket.closeCalls, [
      {
        code: 1000,
        reason: "Example close",
      },
    ]);
    assert.deepEqual(closeResponse, {
      object: "response.websocket.connection",
      action: "close",
      connection_id: "connection-1",
      code: 1000,
      reason: "Example close",
    });
    assert.equal(errorMessages.length, 0);
  });
});

test("responses websocket uses query auth and cleanup handlers close active connections", async () => {
  FakeWebSocket.reset();

  await withMockedWebSocket(FakeWebSocket, async (responsesMethods) => {
    const cleanupHandlers = [];
    const node = {
      send: () => { },
      error: () => { },
      registerCleanupHandler: (handler) => cleanupHandlers.push(handler),
    };

    const clientContext = {
      clientParams: {
        apiKey: "sk-test",
        baseURL: "https://api.example.com/v1",
        defaultHeaders: {
          Authorization: null,
        },
        defaultQuery: {
          api_token: "sk-test",
        },
      },
    };

    await responsesMethods.manageModelResponseWebSocket.call(clientContext, {
      _node: node,
      payload: {
        action: "connect",
        connection_id: "connection-query",
      },
    });

    const socket = FakeWebSocket.instances[0];
    assert.ok(socket);
    assert.equal(
      socket.url,
      "wss://api.example.com/v1/responses?api_token=sk-test"
    );
    assert.deepEqual(socket.options, {
      headers: {},
    });
    assert.equal(cleanupHandlers.length, 1);

    await cleanupHandlers[0]();

    assert.deepEqual(socket.closeCalls, [
      {
        code: 1000,
        reason: "Node-RED node closed",
      },
    ]);
  });
});

test("responses websocket validates action, event shape, and parse errors", async () => {
  FakeWebSocket.reset();

  await withMockedWebSocket(FakeWebSocket, async (responsesMethods) => {
    await assert.rejects(
      responsesMethods.manageModelResponseWebSocket.call(
        { clientParams: { apiKey: "sk-test" } },
        {
          _node: {
            send: () => { },
            error: () => { },
            registerCleanupHandler: () => { },
          },
          payload: {},
        }
      ),
      /msg\.payload\.action must be one of 'connect', 'send', or 'close'/
    );

    const errorMessages = [];
    const node = {
      send: () => { },
      error: (error) => errorMessages.push(error),
      registerCleanupHandler: () => { },
    };

    await responsesMethods.manageModelResponseWebSocket.call(
      { clientParams: { apiKey: "sk-test" } },
      {
        _node: node,
        payload: {
          action: "connect",
          connection_id: "connection-errors",
        },
      }
    );

    const socket = FakeWebSocket.instances[0];

    await assert.rejects(
      responsesMethods.manageModelResponseWebSocket.call(
        { clientParams: { apiKey: "sk-test" } },
        {
          _node: node,
          payload: {
            action: "send",
            connection_id: "connection-errors",
            event: {
              type: "response.cancel",
            },
          },
        }
      ),
      /msg\.payload\.event\.type must be 'response\.create'/
    );

    socket.emitRawMessage("not-json");
    await nextTick();

    assert.equal(errorMessages.length, 1);
    assert.match(errorMessages[0].message, /Could not parse Responses websocket event/);
  });
});

test("OpenAI API node runs registered cleanup handlers on close", async () => {
  const originalManageModelResponseWebSocket =
    OpenaiApi.prototype.manageModelResponseWebSocket;
  let cleanupCalls = 0;

  OpenaiApi.prototype.manageModelResponseWebSocket = async function ({ _node }) {
    _node.registerCleanupHandler(async () => {
      cleanupCalls += 1;
    });

    return { ok: true };
  };

  try {
    const harness = createNodeHarness();
    assert.ok(harness.OpenaiApiNode, "OpenAI API node should register");
    assert.ok(harness.ServiceHostNode, "Service Host node should register");

    const serviceNode = new harness.ServiceHostNode({
      id: "service-1",
      apiBase: "https://api.example.com/v1",
      apiBaseType: "str",
      secureApiKeyHeaderOrQueryName: "Authorization",
      secureApiKeyHeaderOrQueryNameType: "str",
      organizationId: "",
      organizationIdType: "str",
      secureApiKeyIsQuery: false,
      secureApiKeyValueType: "cred",
      credentials: {
        secureApiKeyValue: "sk-test",
      },
    });
    harness.configNodes.set("service-1", serviceNode);

    const apiNode = new harness.OpenaiApiNode({
      id: "openai-1",
      service: "service-1",
      method: "manageModelResponseWebSocket",
      property: "payload",
      propertyType: "msg",
    });

    apiNode.emit("input", {
      payload: {
        action: "connect",
        connection_id: "connection-1",
      },
    });

    await nextTick();
    await nextTick();

    assert.equal(apiNode.errorMessages.length, 0);
    assert.equal(apiNode.sentMessages.length, 1);

    await new Promise((resolve, reject) => {
      apiNode.emit("close", (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    assert.equal(cleanupCalls, 1);
  } finally {
    OpenaiApi.prototype.manageModelResponseWebSocket =
      originalManageModelResponseWebSocket;
  }
});
