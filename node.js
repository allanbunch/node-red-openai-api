"use strict";
const OpenaiApi = require("./lib.js");

function resolveCredentialType(config, credentials, valueProp) {
  return config[`${valueProp}Type`] || credentials[`${valueProp}Type`] || "cred";
}

function resolveCredentialValue(config, credentials, valueProp, credentialType) {
  if (credentialType === "cred") {
    return credentials[valueProp];
  }

  const credentialRef = config[`${valueProp}Ref`];
  if (typeof credentialRef === "string" && credentialRef.trim() !== "") {
    return credentialRef;
  }

  if (
    credentialRef !== undefined &&
    credentialRef !== null &&
    credentialRef !== ""
  ) {
    return credentialRef;
  }

  return credentials[valueProp];
}

function resolveCredentialEntry(config, credentials, valueProp) {
  const credentialType = resolveCredentialType(config, credentials, valueProp);
  return {
    type: credentialType,
    value: resolveCredentialValue(config, credentials, valueProp, credentialType),
  };
}

function normalizeApiKeyHeaderOrQueryName(headerOrQueryName) {
  if (typeof headerOrQueryName !== "string") {
    return "Authorization";
  }

  const trimmedHeaderOrQueryName = headerOrQueryName.trim();
  return trimmedHeaderOrQueryName || "Authorization";
}

function resolveApiKeyQueryMode(isQueryValue) {
  return isQueryValue === true || isQueryValue === "true";
}

function methodUsesAdminApiKey(serviceMethod) {
  return serviceMethod?.authentication === "admin";
}

module.exports = function (RED) {
  class OpenaiApiNode {
    constructor(config) {
      RED.nodes.createNode(this, config);

      let node = this;
      node.service = RED.nodes.getNode(config.service);
      node.config = config;
      node._cleanupHandlers = [];
      node.registerCleanupHandler = function (handler) {
        node._cleanupHandlers.push(handler);
      };

      node.on("input", function (msg) {
        if (!node.service) {
          node.error("OpenAI service host is not configured", msg);
          return;
        }

        Promise.all([
          node.service.evaluateTypedAsync("secureApiKeyValue", msg, node),
          node.service.evaluateTypedAsync("secureAdminApiKeyValue", msg, node),
          node.service.evaluateTypedAsync("apiBase", msg, node),
          node.service.evaluateTypedAsync("organizationId", msg, node),
          node.service.evaluateTypedAsync(
            "secureApiKeyHeaderOrQueryName",
            msg,
            node
          ),
        ])
          .then(
            ([
              clientApiKey,
              clientAdminApiKey,
              clientApiBase,
              clientOrganization,
              clientApiKeyHeaderOrQueryName,
            ]) => {
              const serviceName = node.config.method;
              const serviceMethod = OpenaiApi.prototype[serviceName];
              const usesAdminApiKey = methodUsesAdminApiKey(serviceMethod);

              if (usesAdminApiKey && !clientAdminApiKey) {
                node.error("OpenAI Admin API key is not configured", msg);
                return;
              }

              if (!usesAdminApiKey && !clientApiKey) {
                node.error("OpenAI API key is not configured", msg);
                return;
              }

              const resolvedApiKeyHeaderOrQueryName =
                normalizeApiKeyHeaderOrQueryName(clientApiKeyHeaderOrQueryName);
              const apiKeyIsQuery = resolveApiKeyQueryMode(
                node.service.secureApiKeyIsQuery
              );

              let client = new OpenaiApi(
                {
                  apiKey: usesAdminApiKey ? null : clientApiKey,
                  adminAPIKey: usesAdminApiKey ? clientAdminApiKey : null,
                  baseURL: clientApiBase,
                  organization: clientOrganization,
                  apiKeyTransport: usesAdminApiKey
                    ? undefined
                    : {
                      headerOrQueryName: resolvedApiKeyHeaderOrQueryName,
                      isQuery: apiKeyIsQuery,
                    },
                }
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
            }
          )
          .catch((error) => {
            const errorMessage = error instanceof Error ? error.message : error;
            node.error(errorMessage, msg);
          });
      });

      node.on("close", function (done) {
        Promise.all(node._cleanupHandlers.map((handler) => handler())).then(
          () => done()
        ).catch(done);
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
      const apiKey = resolveCredentialEntry(n, creds, "secureApiKeyValue");
      const adminApiKey = resolveCredentialEntry(
        n,
        creds,
        "secureAdminApiKeyValue"
      );

      this.typedConfig = {
        apiBase: { value: n.apiBase, type: n.apiBaseType || "str" },
        secureApiKeyHeaderOrQueryName: {
          value: n.secureApiKeyHeaderOrQueryName,
          type: n.secureApiKeyHeaderOrQueryNameType || "str",
        },
        secureApiKeyValue: {
          value: apiKey.value,
          type: apiKey.type,
        },
        secureAdminApiKeyValue: {
          value: adminApiKey.value,
          type: adminApiKey.type,
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
      secureAdminApiKeyValue: { type: "password" },
      temp: { type: "text" },
    },
  });
};
