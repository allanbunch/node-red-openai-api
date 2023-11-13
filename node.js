'use strict';
const { str } = require('ajv');
var lib = require('./lib.js');

module.exports = function (RED) {
    function OpenaiApiNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;

        const services = {
            createChatCompletion: {
                body: 'msg',
            },
            createImage: {
                body: 'msg'
            },
            createImageEdit: {
                body: 'msg'
            },
            createImageVariation: {
                body: 'msg'
            },
            createEmbedding: {
                body: 'msg'
            },
            createSpeech: {
                body: 'msg'
            },
            createTranscription: {
                body: 'msg'
            },
            createTranslation: {
                body: 'msg'
            },
            listFiles: {
                body: 'msg'
            },
            createFile: {
                body: 'msg'
            },
            deleteFile: {
                body: 'msg'
            },
            retrieveFile: {
                body: 'msg'
            },
            downloadFile: {
                body: 'msg'
            },
            createFineTuningJob: {
                body: 'msg'
            },
            listPaginatedFineTuningJobs: {
                body: 'msg'
            },
            retrieveFineTuningJob: {
                body: 'msg'
            },
            listFineTuningEvents: {
                body: 'msg'
            },
            cancelFineTuningJob: {
                body: 'msg'
            },
            retrieveModel: {
                body: 'msg'
            },
            deleteModel: {
                body: 'msg'
            },
            createModeration: {
                body: 'msg'
            },
            listAssistants: {
                body: 'msg'
            },
            createAssistant: {
                body: 'msg'
            },
            getAssistant: {
                body: 'msg'
            },
            modifyAssistant: {
                body: 'msg'
            },
            deleteAssistant: {
                body: 'msg'
            },
            createThread: {
                body: 'msg'
            },
            getThread: {
                body: 'msg'
            },
            modifyThread: {
                body: 'msg'
            },
            deleteThread: {
                body: 'msg'
            },
            listMessages: {
                body: 'msg'
            },
            createMessage: {
                body: 'msg'
            },
            getMessage: {
                body: 'msg'
            },
            modifyMessage: {
                body: 'msg'
            },
            createThreadAndRun: {
                body: 'msg'
            },
            listRuns: {
                body: 'msg'
            },
            createRun: {
                body: 'msg'
            },
            getRun: {
                body: 'msg'
            },
            modifyRun: {
                body: 'msg'
            },
            submitToolOuputsToRun: {
                body: 'msg'
            },
            cancelRun: {
                body: 'msg'
            },
            listRunSteps: {
                body: 'msg'
            },
            getRunStep: {
                body: 'msg'
            },
            listAssistantFiles: {
                body: 'msg'
            },
            createAssistantFile: {
                body: 'msg'
            },
            getAssistantFile: {
                body: 'msg'
            },
            deleteAssistantFile: {
                body: 'msg'
            },
            listMessageFiles: {
                body: 'msg'
            },
            getMessageFile: {
                body: 'msg'
            }
        };

        Object.keys(services).forEach(service => {
            Object.keys(services[service]).forEach(prop => {
                this[`${service}_${prop}`] = config[`${service}_${prop}`];
                this[`${service}_${prop}Type`] = config[`${service}_${prop}Type`] || services[service][prop];
            });
        });

        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client = new lib.OpenaiApi();
            if (!errorFlag && this.service && this.service.credentials && this.service.credentials.secureApiKeyValue) {
                if (this.service.secureApiKeyIsQuery) {
                    client.setApiKey(this.service.credentials.secureApiKeyValue,
                        this.service.secureApiKeyHeaderOrQueryName, true);
                } else {
                    client.setApiKey(this.service.credentials.secureApiKeyValue,
                        this.service.secureApiKeyHeaderOrQueryName, false);
                }
            }

            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;

            if (!errorFlag) {
                const serviceName = node.method; // Specify the service you want to process
                const serviceProperties = services[serviceName];
                let serviceParametersObject = {};

                // Dynamically call the function based on the service name
                const functionName = `${serviceName}`;
                if (typeof client[functionName] === 'function') {
                    serviceParametersObject.body = msg.payload;
                    result = client[functionName](serviceParametersObject);
                } else {
                    console.error(`Function ${functionName} does not exist on client.`);
                }
            }

            if (!errorFlag && result === undefined) {
                node.error('Method is not specified.', msg);
                errorFlag = true;
            }

            var setData = function (msg, response) {
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
                    var message = error.message;
                    var errorData = error.response || {}; // Fallback to an empty object if response is not available
                    node.error(message, setData(msg, errorData));
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType('openai-api', OpenaiApiNode);
    function OpenaiApiServiceNode(n) {
        RED.nodes.createNode(this, n);

        this.secureApiKeyValue = n.secureApiKeyValue;
        this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
        this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
    }

    RED.nodes.registerType('openai-api-service', OpenaiApiServiceNode, {
        credentials: {
            secureApiKeyValue: { type: 'password' },
            temp: { type: 'text' }
        }
    });
};
