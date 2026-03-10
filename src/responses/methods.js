const OpenAI = require("openai").OpenAI;
const { ResponsesWebSocket } = require("./websocket.js");

function getResponsesWebSocketConnections(node) {
  if (!node._responsesWebSocketConnections) {
    node._responsesWebSocketConnections = new Map();
  }

  return node._responsesWebSocketConnections;
}

function ensureResponsesWebSocketCleanup(node) {
  if (node._responsesWebSocketCleanupRegistered) {
    return;
  }

  if (typeof node.registerCleanupHandler !== "function") {
    throw new Error("OpenAI API node does not support cleanup registration");
  }

  node._responsesWebSocketCleanupRegistered = true;
  node.registerCleanupHandler(async () => {
    const connections = getResponsesWebSocketConnections(node);
    const closeOperations = [];

    for (const connection of connections.values()) {
      closeOperations.push(
        connection.close({
          code: 1000,
          reason: "Node-RED node closed",
        })
      );
    }

    await Promise.all(closeOperations);
    connections.clear();
  });
}

function requireConnectionId(payload) {
  if (typeof payload.connection_id !== "string" || payload.connection_id.trim() === "") {
    throw new Error("msg.payload.connection_id must be a non-empty string");
  }

  return payload.connection_id;
}

function createResponsesWebSocketEventMessage(connectionId, event) {
  return {
    payload: event,
    openai: {
      transport: "responses.websocket",
      direction: "server",
      connection_id: connectionId,
      event_type: event.type,
    },
  };
}

function attachResponsesWebSocketListeners(node, connectionId, connection) {
  connection.on("event", (event) => {
    node.send(createResponsesWebSocketEventMessage(connectionId, event));
  });

  connection.on("error", (error) => {
    node.error(error);
  });

  connection.on("close", () => {
    const connections = getResponsesWebSocketConnections(node);
    connections.delete(connectionId);
  });
}

async function connectResponsesWebSocket(parameters) {
  const node = parameters._node;
  const payload = parameters.payload || {};
  const connectionId = requireConnectionId(payload);
  const connections = getResponsesWebSocketConnections(node);

  if (connections.has(connectionId)) {
    throw new Error(
      `Responses websocket connection '${connectionId}' is already open on this node`
    );
  }

  ensureResponsesWebSocketCleanup(node);

  const connection = new ResponsesWebSocket(this.clientParams);
  const connectionDetails = await connection.open();

  attachResponsesWebSocketListeners(node, connectionId, connection);
  connections.set(connectionId, connection);

  return {
    object: "response.websocket.connection",
    action: "connect",
    connection_id: connectionId,
    url: connectionDetails.url,
  };
}

async function sendResponsesWebSocketEvent(parameters) {
  const node = parameters._node;
  const payload = parameters.payload || {};
  const connectionId = requireConnectionId(payload);
  const connections = getResponsesWebSocketConnections(node);
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error(
      `Responses websocket connection '${connectionId}' is not open on this node`
    );
  }

  if (!payload.event || typeof payload.event !== "object" || Array.isArray(payload.event)) {
    throw new Error("msg.payload.event must be an object");
  }

  if (payload.event.type !== "response.create") {
    throw new Error("msg.payload.event.type must be 'response.create'");
  }

  connection.send(payload.event);

  return {
    object: "response.websocket.client_event",
    action: "send",
    connection_id: connectionId,
    event_type: payload.event.type,
  };
}

async function closeResponsesWebSocket(parameters) {
  const node = parameters._node;
  const payload = parameters.payload || {};
  const connectionId = requireConnectionId(payload);
  const connections = getResponsesWebSocketConnections(node);
  const connection = connections.get(connectionId);

  if (!connection) {
    throw new Error(
      `Responses websocket connection '${connectionId}' is not open on this node`
    );
  }

  const closeDetails = await connection.close({
    code: payload.code,
    reason: payload.reason,
  });

  connections.delete(connectionId);

  return {
    object: "response.websocket.connection",
    action: "close",
    connection_id: connectionId,
    code: closeDetails.code,
    reason: closeDetails.reason,
  };
}

async function streamResponse(parameters, response) {
  const { _node, msg } = parameters;
  _node.status({
    fill: "green",
    shape: "dot",
    text: "OpenaiApi.status.streaming",
  });
  for await (const chunk of response) {
    if (typeof chunk === "object") {
      const newMsg = { ...msg, payload: chunk };
      _node.send(newMsg);
    }
  }
  _node.status({});
}

async function createModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.create(parameters.payload);

  if (parameters.payload.stream) {
    await streamResponse(parameters, response);
  } else {
    return response;
  }
}

async function getModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.retrieve(response_id, params);

  if (params.stream) {
    await streamResponse(parameters, response);
  } else {
    return response;
  }
}

async function deleteModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.delete(response_id, params);

  return response;
}

async function cancelModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.cancel(response_id, params);

  return response;
}

async function compactModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.compact(parameters.payload);

  return response;
}

async function listInputItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const list = await openai.responses.inputItems.list(response_id, params);

  return [...list.data];
}

async function countInputTokens(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.inputTokens.count(parameters.payload);

  return response;
}

async function manageModelResponseWebSocket(parameters) {
  const payload = parameters.payload || {};

  if (typeof payload.action !== "string" || payload.action.trim() === "") {
    throw new Error(
      "msg.payload.action must be one of 'connect', 'send', or 'close'"
    );
  }

  if (payload.action === "connect") {
    return connectResponsesWebSocket.call(this, parameters);
  }

  if (payload.action === "send") {
    return sendResponsesWebSocketEvent.call(this, parameters);
  }

  if (payload.action === "close") {
    return closeResponsesWebSocket.call(this, parameters);
  }

  throw new Error("msg.payload.action must be one of 'connect', 'send', or 'close'");
}

module.exports = {
  createModelResponse,
  getModelResponse,
  deleteModelResponse,
  cancelModelResponse,
  compactModelResponse,
  listInputItems,
  countInputTokens,
  manageModelResponseWebSocket,
};
