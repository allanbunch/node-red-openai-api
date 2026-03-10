"use strict";

const EventEmitter = require("node:events");
const { WebSocket } = require("ws");

function buildResponsesWebSocketURL(clientParams) {
  const baseURL = clientParams.baseURL || "https://api.openai.com/v1";
  const path = "/responses";
  const url = new URL(baseURL + (baseURL.endsWith("/") ? path.slice(1) : path));
  const defaultQuery = clientParams.defaultQuery || {};

  for (const [key, value] of Object.entries(defaultQuery)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  if (url.protocol === "https:") {
    url.protocol = "wss:";
  } else if (url.protocol === "http:") {
    url.protocol = "ws:";
  }

  return url;
}

function buildResponsesWebSocketHeaders(clientParams) {
  const headers = {};
  const defaultHeaders = clientParams.defaultHeaders || {};
  const hasAuthorizationOverride = Object.prototype.hasOwnProperty.call(
    defaultHeaders,
    "Authorization"
  );

  for (const [headerName, headerValue] of Object.entries(defaultHeaders)) {
    if (headerValue !== undefined && headerValue !== null) {
      headers[headerName] = headerValue;
    }
  }

  if (!clientParams.defaultQuery && !hasAuthorizationOverride) {
    headers.Authorization = `Bearer ${clientParams.apiKey}`;
  }

  if (clientParams.organization) {
    headers["OpenAI-Organization"] = clientParams.organization;
  }

  return headers;
}

function createEventParseError(error) {
  const parseError = new Error("Could not parse Responses websocket event");
  parseError.cause = error;
  return parseError;
}

class ResponsesWebSocket extends EventEmitter {
  constructor(clientParams) {
    super();
    this.clientParams = clientParams;
    this.url = buildResponsesWebSocketURL(clientParams);
    this.headers = buildResponsesWebSocketHeaders(clientParams);
    this.socket = null;
  }

  async open() {
    if (this.socket) {
      throw new Error("Responses websocket connection is already open");
    }

    const socket = new WebSocket(this.url, { headers: this.headers });

    await new Promise((resolve, reject) => {
      socket.once("open", () => {
        this.socket = socket;
        this.attachSocketListeners(socket);
        resolve();
      });
      socket.once("error", reject);
    });

    return {
      url: this.url.toString(),
    };
  }

  attachSocketListeners(socket) {
    socket.on("message", (data) => {
      let event;

      try {
        event = JSON.parse(data.toString());
      } catch (error) {
        this.emit("error", createEventParseError(error));
        return;
      }

      this.emit("event", event);
    });

    socket.on("error", (error) => {
      this.emit("error", error);
    });

    socket.on("close", (code, reason) => {
      if (this.socket === socket) {
        this.socket = null;
      }

      this.emit("close", {
        code,
        reason: reason.toString(),
      });
    });
  }

  send(event) {
    if (!this.socket) {
      throw new Error("Responses websocket connection is not open");
    }

    this.socket.send(JSON.stringify(event));
  }

  async close(props = {}) {
    if (!this.socket) {
      throw new Error("Responses websocket connection is not open");
    }

    const socket = this.socket;
    const closeCode = props.code ?? 1000;
    const closeReason = props.reason ?? "OK";

    await new Promise((resolve, reject) => {
      socket.once("close", resolve);
      socket.once("error", reject);
      socket.close(closeCode, closeReason);
    });

    return {
      code: closeCode,
      reason: closeReason,
    };
  }
}

module.exports = {
  ResponsesWebSocket,
};
