"use strict";
const lib = require("./lib.js");

module.exports = function (RED) {
  class OpenaiApiNode {
    constructor(config) {
      RED.nodes.createNode(this, config);

      let node = this;
      node.service = RED.nodes.getNode(config.service);
      node.config = config;

      node.on("input", function (msg) {
        let client = new lib.OpenaiApi();
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
          organization: node.service.organizationId,
          apiBase: node.service.apiBase,
          apiKey: node.service.credentials.secureApiKeyValue || "",
          _node: node,
          payload: payload,
        };

        // Dynamically call the function based on the service name
        const functionName = `${serviceName}`;
        if (typeof client[functionName] === "function") {
          node.status({
            fill: "blue",
            shape: "dot",
            text: "OpenaiApi.status.requesting",
          });

          client[functionName](serviceParametersObject)
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
              node.error(errorMessage, { payload: {} });
            });
        } else {
          console.error(`Function ${functionName} does not exist on client.`);
        }
      });
    }
  }

  RED.nodes.registerType("OpenAI API", OpenaiApiNode);
  class ServiceHostNode {
    constructor(n) {
      RED.nodes.createNode(this, n);

      this.secureApiKeyValue = n.secureApiKeyValue;
      this.apiBase = n.apiBase;
      this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
      this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
      this.organizationId = n.organizationId;
    }
  }

  RED.nodes.registerType("Service Host", ServiceHostNode, {
    credentials: {
      secureApiKeyValue: { type: "password" },
      temp: { type: "text" },
    },
  });
};
