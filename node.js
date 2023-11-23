'use strict';
const lib = require('./lib.js');

module.exports = function (RED) {
    class OpenaiApiNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.service = RED.nodes.getNode(config.service);
            this.method = config.method;

            let node = this;

            node.on('input', function (msg) {
                let errorFlag = false;
                let client = new lib.OpenaiApi();
                if (!errorFlag && this.service) {
                    client.setApiBase(this.service.apiBase);
                }

                if (!errorFlag && this.service && this.service.credentials && this.service.credentials.secureApiKeyValue) {
                    if (this.service.secureApiKeyIsQuery) {
                        client.setApiKey(this.service.credentials.secureApiKeyValue,
                            this.service.secureApiKeyHeaderOrQueryName, true);
                    } else {
                        client.setApiKey(this.service.credentials.secureApiKeyValue,
                            this.service.secureApiKeyHeaderOrQueryName, false);
                    }
                }

                if (!errorFlag){
                    client.setNodeRef(node);
                }

                if (!errorFlag) {
                    client.body = msg.payload;
                }

                let result;

                if (!errorFlag) {
                    const serviceName = node.method; // Specify the service you want to process
                    let serviceParametersObject = {};

                    // Dynamically call the function based on the service name
                    const functionName = `${serviceName}`;
                    if (typeof client[functionName] === 'function') {
                        serviceParametersObject.body = msg.payload || {};
                        result = client[functionName](serviceParametersObject);
                    } else {
                        console.error(`Function ${functionName} does not exist on client.`);
                    }
                }

                if (!errorFlag && result === undefined) {
                    node.error('Method is not specified.', msg);
                    errorFlag = true;
                }

                let setData = function (msg, response) {
                    if (response) {
                        if (response.status) {
                            msg.statusCode = response.status;
                        }
                        if (response.headers) {
                            msg.headers = response.headers;
                        }
                        if (response.config && response.config.url) {
                            msg.responseUrl = response.config.url;
                        }
                        if (response.data) {
                            msg.payload = response.data;
                        }
                    }
                    return msg;
                };

                if (!errorFlag) {
                    node.status({ fill: 'blue', shape: 'dot', text: 'OpenaiApi.status.requesting' });
                    result.then(function (response) {
                        node.send(setData(msg, response));
                        node.status({});
                    }).catch(function (error) {
                        let message = error.message;
                        let errorData = error.response || {}; // Fallback to an empty object if response is not available
                        node.error(message, setData(msg, errorData));
                        node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                    });
                }
            });
        }
    }

    RED.nodes.registerType('OpenAI API', OpenaiApiNode);
    class ServiceHostNode {
        constructor(n) {
            RED.nodes.createNode(this, n);

            this.secureApiKeyValue = n.secureApiKeyValue;
            this.apiBase = n.apiBase;
            this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
            this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
        }
    }

    RED.nodes.registerType('Service Host', ServiceHostNode, {
        credentials: {
            secureApiKeyValue: { type: 'password' },
            temp: { type: 'text' }
        }
    });
};
