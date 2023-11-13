'use strict';
const { str } = require('ajv');
var lib = require('./lib.js');

module.exports = function (RED) {
    function OpenaiApiNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;

        const entities = {
            createChatCompletion: {
                body: 'msg',
            },
            createImage: {
                prompt: 'str',
                model: 'str',
                n: 'num',
                quality: 'str',
                response_format: 'str',
                size: 'str',
                style: 'str',
                user: 'str'
            },
            createImageEdit: {
                image: 'bin',
                prompt: 'str',
                mask: 'str',
                model: 'str',
                n: 'num',
                size: 'str',
                response_format: 'json',
                user: 'str'
            },
            createImageVariation: {
                image: 'str',
                model: 'str',
                n: 'num',
                response_format: 'json',
                size: 'str',
                user: 'str'
            },
            createEmbedding: {
                input: 'str',
                model: 'str',
                encoding_format: 'str',
                user: 'str'
            },
            createSpeech: {
                model: 'str',
                input: 'str',
                voice: 'str',
                response_format: 'json',
                speed: 'num'
            },
            createTranscription: {
                file: 'bin',
                model: 'str',
                language: 'str',
                prompt: 'str',
                response_format: 'json',
                temperature: 'num'
            },
            createTranslation: {
                file: 'bin',
                model: 'str',
                prompt: 'str',
                response_format: 'json',
                temperature: 'num'
            },
            listFiles: {
                purpose: 'str'
            },
            createFile: {
                file: 'bin',
                purpose: 'str'
            },
            deleteFile: {
                file_id: 'str'
            },
            retrieveFile: {
                file_id: 'str'
            },
            downloadFile: {
                file_id: 'str'
            },
            createFineTuningJob: {
                model: 'str',
                training_file: 'bin',
                hyperparameters: 'json',
                suffix: 'str',
                validation_file: 'bin'
            },
            listPaginatedFineTuningJobs: {
                after: 'str',
                limit: 'num'
            },
            retrieveFineTuningJob: {
                fine_tuning_job_id: 'str'
            },
            listFineTuningEvents: {
                fine_tuning_job_id: 'str',
                after: 'str',
                limit: 'num'
            },
            cancelFineTuningJob: {
                fine_tuning_job_id: 'str'
            },
            retrieveModel: {},
            deleteModel: {
                model: 'str'
            },
            createModeration: {
                input: 'str',
                model: 'str'
            },
            listAssistants: {
                assistant_id: 'str'
            },
            createAssistant: {
                model: 'str',
                name: 'str',
                description: 'str',
                instructions: 'str',
                tools: 'str',
                file_ids: 'str',
                metadata: 'str'
            },
            getAssistant: {
                assistant_id: 'str'
            },
            modifyAssistant: {
                assistant_id: 'str',
                model: 'str',
                name: 'str',
                description: 'str',
                instructions: 'str',
                tools: 'str',
                file_ids: 'str',
                metadata: 'str'
            },
            deleteAssistant: {
                assistant_id: 'str'
            },
            createThread: {
                messages: 'json',
                metadata: 'str'
            },
            getThread: {
                thread_id: 'str'
            },
            modifyThread: {
                thread_id: 'str',
                metadata: 'str'
            },
            deleteThread: {
                thread_id: 'str'
            },
            listMessages: {
                thread_id: 'str',
                limit: 'num',
                order: 'str',
                after: 'str',
                before: 'str'
            },
            createMessage: {
                thread_id: 'str',
                role: 'str',
                content: 'str',
                file_ids: 'str',
                metadata: 'str'
            },
            getMessage: {
                thread_id: 'str',
                message_id: 'str'
            },
            modifyMessage: {
                thread_id: 'str',
                message_id: 'str',
                metadata: 'str'
            },
            createThreadAndRun: {
                assistant_id: 'str',
                thread: 'str',
                model: 'str',
                instructions: 'str',
                tools: 'str',
                metadata: 'str'
            },
            listRuns: {
                thread_id: 'str',
                limit: 'num',
                order: 'str',
                after: 'str',
                before: 'str'
            },
            createRun: {
                thread_id: 'str',
                assistant_id: 'str',
                model: 'str',
                instructions: 'str',
                tools: 'json',
                metadata: 'str'
            },
            getRun: {
                thread_id: 'str',
                run_id: 'str'
            },
            modifyRun: {
                thread_id: 'str',
                run_id: 'str',
                metadata: 'str'
            },
            submitToolOuputsToRun: {
                thread_id: 'str',
                run_id: 'str',
                tool_outputs: 'json'
            },
            cancelRun: {
                thread_id: 'str',
                run_id: 'str'
            },
            listRunSteps: {
                thread_id: 'str',
                run_id: 'str',
                limit: 'num',
                order: 'str',
                after: 'str',
                before: 'str'
            },
            getRunStep: {
                thread_id: 'str',
                run_id: 'str',
                step_id: 'str'
            },
            listAssistantFiles: {
                assistant_id: 'str',
                limit: 'num',
                order: 'str',
                after: 'str',
                before: 'str'
            },
            createAssistantFile: {
                assistant_id: 'str',
                file_id: 'str'
            },
            getAssistantFile: {
                assistant_id: 'str',
                file_id: 'str'
            },
            deleteAssistantFile: {
                assistant_id: 'str',
                file_id: 'str'
            },
            listMessageFiles: {
                thread_id: 'str',
                message_id: 'str',
                limit: 'num',
                order: 'str',
                after: 'str',
                before: 'str'
            },
            getMessageFile: {
                thread_id: 'str',
                message_id: 'str',
                file_id: 'str'
            }
        };

        Object.keys(entities).forEach(entity => {
            Object.keys(entities[entity]).forEach(prop => {
                this[`${entity}_${prop}`] = config[`${entity}_${prop}`];
                this[`${entity}_${prop}Type`] = config[`${entity}_${prop}Type`] || entities[entity][prop];
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
                const entityName = node.method; // Specify the entity you want to process
                const entityProperties = entities[entityName];
                let entityParametersObject = {};

                Object.keys(entityProperties).forEach(prop => {
                    let value = this[`${entityName}_${prop}`];

                    // Parse as JSON if the entity property type is 'json'
                    if (entityProperties[prop] === 'json') {
                        try {
                            value = JSON.parse(value);
                        } catch (error) {
                            console.error(`Error parsing JSON for ${prop}:`, error);
                            // Handle or skip the property in case of parsing error
                            return;
                        }
                    } else if (entityProperties[prop] === 'num') {
                        try {
                            value = parseFloat(value);
                        } catch (error) {
                            console.error(`Error parsing number for ${prop}:`, error);
                            // Handle or skip the property in case of parsing error
                            return;
                        }
                    } else if (value === '' || value === 'str' || value === undefined) {
                        // Skip properties if the value is '' or 'str' or undefined
                        return;
                    }

                    entityParametersObject[prop] = msg[value];
                });

                // Dynamically call the function based on the entity name
                const functionName = `${entityName}`;
                if (typeof client[functionName] === 'function') {
                    result = client[functionName](entityParametersObject);
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
