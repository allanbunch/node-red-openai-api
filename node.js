"use strict";
const lib = require("./lib.js");

module.exports = function (RED) {
  class OpenaiApiNode {
    constructor(config) {
      RED.nodes.createNode(this, config);
      this.service = RED.nodes.getNode(config.service);
      this.method = config.method;

      let node = this;

      node.on("input", function (msg) {
        let client = new lib.OpenaiApi();

        const serviceName = node.method; // Specify the service to call
        let serviceParametersObject = {
          organization: node.service.organizationId,
          apiBase: node.service.apiBase,
          apiKey: node.service.credentials.secureApiKeyValue,
          payload: { ...msg.payload },
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
              let response = { payload: payload };
              node.send(response);
              node.status({});
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
