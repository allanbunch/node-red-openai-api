"use strict";
const OpenaiApi = require("./lib.js");

function resolveApiKeyType(config, credentials) {
  return config.secureApiKeyValueType || credentials.secureApiKeyValueType || "cred";
}

function resolveApiKeyValue(config, credentials, apiKeyType) {
  if (apiKeyType === "cred") {
    return credentials.secureApiKeyValue;
  }

  const apiKeyRef = config.secureApiKeyValueRef;
  if (typeof apiKeyRef === "string" && apiKeyRef.trim() !== "") {
    return apiKeyRef;
  }

  if (apiKeyRef !== undefined && apiKeyRef !== null && apiKeyRef !== "") {
    return apiKeyRef;
  }

  return credentials.secureApiKeyValue;
}

module.exports = function (RED) {
  class OpenaiApiNode {
    constructor(config) {
      RED.nodes.createNode(this, config);

      let node = this;
      node.service = RED.nodes.getNode(config.service);
      node.config = config;

      node.on("input", function (msg) {
        if (!node.service) {
          node.error("OpenAI service host is not configured", msg);
          return;
        }

        Promise.all([
          node.service.evaluateTypedAsync("secureApiKeyValue", msg, node),
          node.service.evaluateTypedAsync("apiBase", msg, node),
          node.service.evaluateTypedAsync("organizationId", msg, node),
        ])
          .then(([clientApiKey, clientApiBase, clientOrganization]) => {
            if (!clientApiKey) {
              node.error("OpenAI API key is not configured", msg);
              return;
            }

            let client = new OpenaiApi(
              clientApiKey,
              clientApiBase,
              clientOrganization
            );

            let payload;

            const propertyType = node.config.propertyType || "msg";
            const propertyPath = node.config.property || "payload";

            if (propertyType === "msg") {
              payload = RED.util.getMessageProperty(msg, propertyPath);
            } else {
              // For flow and global contexts
              payload = node.context()[propertyType].get(propertyPath);
            }

            const serviceName = node.config.method; // Set the service name to call.

            let serviceParametersObject = {
              _node: node,
              payload: payload,
              msg: msg,
            };

            // Dynamically call the function based on the service name
            if (typeof client[serviceName] === "function") {
              node.status({
                fill: "blue",
                shape: "dot",
                text: "OpenaiApi.status.requesting",
              });

              client[serviceName](serviceParametersObject)
                .then((payload) => {
                  if (payload !== undefined) {
                    // Update `msg.payload` with the payload from the API response, then send resonse to client.
                    msg.payload = payload;
                    node.send(msg);
                    node.status({});
                  }
                })
                .catch(function (error) {
                  node.status({
                    fill: "red",
                    shape: "ring",
                    text: "node-red:common.status.error",
                  });
                  let errorMessage = error.message;
                  node.error(errorMessage, msg);
                });
            } else {
              console.error(`Function ${serviceName} does not exist on client.`);
            }
          })
          .catch((error) => {
            const errorMessage = error instanceof Error ? error.message : error;
            node.error(errorMessage, msg);
          });
      });
    }
  }

  RED.nodes.registerType("OpenAI API", OpenaiApiNode);
  class ServiceHostNode {
    constructor(n) {
      RED.nodes.createNode(this, n);

      this.apiBase = n.apiBase;
      this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
      this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
      this.organizationId = n.organizationId;

      const creds = this.credentials || {};
      const apiKeyType = resolveApiKeyType(n, creds);
      const apiKeyValue = resolveApiKeyValue(n, creds, apiKeyType);

      this.typedConfig = {
        apiBase: { value: n.apiBase, type: n.apiBaseType || "str" },
        secureApiKeyHeaderOrQueryName: {
          value: n.secureApiKeyHeaderOrQueryName,
          type: n.secureApiKeyHeaderOrQueryNameType || "str",
        },
        secureApiKeyValue: {
          value: apiKeyValue,
          type: apiKeyType,
        },
        organizationId: {
          value: n.organizationId,
          type: n.organizationIdType || "str",
        },
      };
    }

    // Helper to resolve property value at runtime
    evaluateTyped(prop, msg, node) {
      const entry = this.typedConfig[prop];
      if (!entry) {
        return undefined;
      }
      return RED.util.evaluateNodeProperty(
        entry.value,
        entry.type || "str",
        node || this,
        msg
      );
    }

    evaluateTypedAsync(prop, msg, node) {
      const entry = this.typedConfig[prop];
      if (!entry) {
        return Promise.resolve(undefined);
      }

      if (entry.type === "flow" || entry.type === "global") {
        return new Promise((resolve, reject) => {
          RED.util.evaluateNodeProperty(
            entry.value,
            entry.type || "str",
            node || this,
            msg,
            (error, value) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(value);
            }
          );
        });
      }

      return Promise.resolve(
        RED.util.evaluateNodeProperty(
          entry.value,
          entry.type || "str",
          node || this,
          msg
        )
      );
    }
  }

  RED.nodes.registerType("Service Host", ServiceHostNode, {
    credentials: {
      secureApiKeyValue: { type: "password" },
      temp: { type: "text" },
    },
  });
};
