/*jshint -W069 */


var OpenaiApi = (function () {
    'use strict';

    const axios = require('axios');
    const FormData = require('form-data'); // Only if you handle form data

    function OpenaiApi(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'https://api.openai.com/v1';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.apiKey = (typeof options === 'object') ? (options.apiKey ? options.apiKey : {}) : {};
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function (parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    OpenaiApi.prototype.request = function (method, url, body, headers, queryParameters, form) {
        // Create an instance of axios with default headers
        const axiosInstance = axios.create({
            headers: headers
        });

        // Initialize the data to be sent
        let data = body;

        // Handle 'multipart/form-data'
        if (Object.keys(form).length > 0 && headers['Content-Type'] === 'multipart/form-data') {
            const formData = new FormData();
            for (const key of Object.keys(parameters)) {
                formData.append(key, parameters.body[key]);
            };
            data = formData;
        } else if (typeof body === 'object' && !(body instanceof Buffer)) {
            // Ensure the headers are set for JSON
            headers['Content-Type'] = 'application/json';
        }

        // Remove body data for GET requests
        if (method === "GET") {
            data = undefined;
        }

        // Make the axios request
        return axiosInstance({
            method: method,
            url: url,
            params: queryParameters,
            data: data
        })
            .then(response => {
                // Check for JSON response and parse if necessary
                if (/^application\/(.*\+)?json/.test(response.headers['content-type'])) {
                    return { response: response, body: response.data };
                } else {
                    // For non-JSON responses, resolve with the raw response
                    return { response: response, body: response.data };
                }
            })
            .catch(error => {
                // Handle errors
                if (error.response) {
                    // The server responded with a status code that falls out of the range of 2xx
                    throw { response: error.response, body: error.response.data };
                } else if (error.request) {
                    // The request was made but no response was received
                    throw new Error('No response received');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    throw new Error(error.message);
                }
            });
    };

    OpenaiApi.prototype.setApiKey = function (value, headerOrQueryName, isQuery) {
        this.apiKey.value = value;
        this.apiKey.headerOrQueryName = headerOrQueryName;
        this.apiKey.isQuery = isQuery;
    };

    OpenaiApi.prototype.setAuthHeaders = function (headerParams) {
        var headers = headerParams ? headerParams : {};
        if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
            headers[this.apiKey.headerOrQueryName] = `Bearer ${this.apiKey.value}`;
        }
        return headers;
    };

    OpenaiApi.prototype.getFromEndpoint = function (path, parameters, expectedQueryParams, customHeaders) {
        return new Promise((resolve, reject) => {
            var domain = this.domain;
            var queryParameters = {}, baseHeaders = {};

            baseHeaders = this.setAuthHeaders(headers);
            baseHeaders['Accept'] = 'application/json';

            var headers = {
                ...baseHeaders,
                ...customHeaders
            };


            // Only add query parameters if they are expected and exist
            if (expectedQueryParams) {
                expectedQueryParams.forEach(param => {
                    if (parameters.body[param] !== undefined) {
                        queryParameters[param] = parameters.body[param];
                    }
                });
            }

            // Merge any additional query parameters from the parameters object
            queryParameters = mergeQueryParams(parameters, queryParameters);

            // Axios request configuration
            const config = {
                method: 'GET',
                url: domain + path,
                headers: headers,
                params: queryParameters
            };

            // Axios GET request
            axios(config)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };


    OpenaiApi.prototype.postToEndpoint = function (path, parameters, expectedQueryParams, contentType, filePath, customHeaders) {
        return new Promise((resolve, reject) => {
            const _path = require('path');

            parameters = parameters || {};
            var domain = this.domain;
            var queryParameters = {}, baseHeaders = {}, data;

            baseHeaders = this.setAuthHeaders({});
            baseHeaders['Accept'] = 'application/json';

            var headers = {
                ...baseHeaders,
                ...customHeaders
            };

            // Determine the Content-Type
            if (contentType === 'form-data') {
                var formData = new FormData();

                Object.entries(parameters.body).forEach(([key, value]) => {
                    if (value instanceof Buffer) {
                        if (!filePath) {
                            throw new Error('msg.payload must include a `filename` property.');
                        }

                        const filename = _path.basename(filePath);
                        formData.append(key, value, filename);
                    } else {
                        if (parameters.body[key] !== undefined) {
                            formData.append(key, value);
                        }
                    }
                });

                data = formData;

                let formHeaders = formData.getHeaders();
                Object.assign(headers, formHeaders);
            } else {
                // Handle JSON payloads
                headers['Content-Type'] = 'application/json';
                data = parameters.body || {};
            }

            // Add expected query parameters to the queryParameters object
            if (expectedQueryParams) {
                expectedQueryParams.forEach(param => {
                    if (parameters.body[param] !== undefined) {
                        queryParameters[param] = parameters.body[param];
                    }
                });
            }

            // Merge any additional query parameters from the parameters object
            queryParameters = mergeQueryParams(parameters.body, queryParameters);

            // Axios request configuration
            const config = {
                method: 'POST',
                url: domain + path,
                headers: headers,
                params: queryParameters,
                data: data
            };

            // Axios POST request
            axios(config)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    OpenaiApi.prototype.deleteFromEndpoint = function (path, parameters, expectedQueryParams, customHeaders) {
        return new Promise((resolve, reject) => {
            parameters = parameters || {};
            var domain = this.domain;
            var queryParameters = {}, baseHeaders = {};

            baseHeaders = this.setAuthHeaders(headers);
            baseHeaders['Accept'] = 'application/json';

            var headers = {
                ...baseHeaders,
                ...customHeaders
            }

            // Only add query parameters if they are expected and exist
            if (expectedQueryParams) {
                expectedQueryParams.forEach(param => {
                    if (parameters[param] !== undefined) {
                        queryParameters[param] = parameters.body[param];
                    }
                });
            }

            // Merge any additional query parameters from the parameters object
            queryParameters = mergeQueryParams(parameters, queryParameters);

            // Axios request configuration
            const config = {
                method: 'DELETE',
                url: domain + path,
                headers: headers,
                params: queryParameters
            };

            // Axios DELETE request
            axios(config)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    OpenaiApi.prototype.createChatCompletion = function (parameters) {
        const response = this.postToEndpoint('/chat/completions', parameters);
        return response;
    };

    OpenaiApi.prototype.createImage = function (parameters) {
        return this.postToEndpoint('/images/generations', parameters);
    };

    OpenaiApi.prototype.createImageEdit = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/images/edits', parameters, null, 'form-data', filename);
    };

    OpenaiApi.prototype.createImageVariation = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/images/variations', parameters, null, 'form-data', filename);
    };

    OpenaiApi.prototype.createEmbedding = function (parameters) {
        return this.postToEndpoint('/embeddings', parameters);
    };

    OpenaiApi.prototype.createSpeech = function (parameters) {
        return this.postToEndpoint('/audio/speech', parameters);
    };

    OpenaiApi.prototype.createTranscription = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/audio/transcriptions', parameters, null, 'form-data', filename);
    };

    OpenaiApi.prototype.createTranslation = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/audio/translations', parameters, null, 'form-data', filename);
    };

    OpenaiApi.prototype.listFiles = function (parameters) {
        const expectedQueryParameters = ['purpose'];
        return this.getFromEndpoint('/files', parameters, expectedQueryParameters);
    };

    OpenaiApi.prototype.createFile = function (parameters) {
        let filename;

        // reference the incoming filename
        filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/files', parameters, null, 'form-data', filename);
    };

    OpenaiApi.prototype.deleteFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.deleteFromEndpoint(`/files/${file_id}`, parameters);
    };

    OpenaiApi.prototype.retrieveFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.getFromEndpoint(`/files/${file_id}`, parameters);
    };

    OpenaiApi.prototype.downloadFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.getFromEndpoint(`/files/${file_id}/content`, parameters);
    };

    OpenaiApi.prototype.createFineTuningJob = function (parameters) {
        return this.postToEndpoint('/fine_tuning/jobs', parameters);
    };

    OpenaiApi.prototype.listPaginatedFineTuningJobs = function (parameters) {
        const expectedQueryParameters = ['after', 'limit'];
        return this.getFromEndpoint('/fine_tuning/jobs', parameters, expectedQueryParameters);
    };

    OpenaiApi.prototype.retrieveFineTuningJob = function (parameters) {
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
        return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}`, parameters);
    };

    OpenaiApi.prototype.listFineTuningEvents = function (parameters) {
        const expectedQueryParameters = ['after', 'limit'];
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;

        return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, parameters, expectedQueryParameters);
    };

    OpenaiApi.prototype.cancelFineTuningJob = function (parameters) {
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
        return this.postToEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`, parameters);
    };

    OpenaiApi.prototype.listModels = function (parameters) {
        return this.getFromEndpoint('/models', parameters);
    };

    OpenaiApi.prototype.retrieveModel = function (parameters) {
        const model = parameters.body.model;

        return this.getFromEndpoint(`/models/${model}`, parameters);
    };

    OpenaiApi.prototype.deleteModel = function (parameters) {
        const model = parameters.body.model;

        return this.deleteFromEndpoint(`/models/${model}`, parameters);
    };

    OpenaiApi.prototype.createModeration = function (parameters) {
        return this.postToEndpoint('/moderations', parameters);
    };

    OpenaiApi.prototype.listAssistants = function (parameters) {
        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint('/assistants', parameters, expectedQueryParameters, customHeaders);
    };

    OpenaiApi.prototype.createAssistant = function (parameters) {
        var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint('/assistants', parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.getAssistant = function (parameters) {
        const assistantId = parameters.body.assistant_id;

        var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/assistants/${assistantId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.modifyAssistant = function (parameters) {

        const assistant_id = parameters.body.assistant_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/assistants/${assistant_id}`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.deleteAssistant = function (parameters) {
        const assistant_id = parameters.body.assistant_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.deleteFromEndpoint(`/assistants/${assistant_id}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.createThread = function (parameters) {


        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        return this.postToEndpoint('/threads', parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.getThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/threads/${threadId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.modifyThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.deleteThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.deleteFromEndpoint(`/threads/${threadId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.listMessages = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

        return this.getFromEndpoint(`/threads/${threadId}/messages`, parameters, expectedQueryParameters, customHeaders);
    };

    OpenaiApi.prototype.createMessage = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}/messages`, parameters, null, null, null, customHeaders)
    };

    OpenaiApi.prototype.getMessage = function (parameters) {

        const threadId = parameters.body.thread_id;
        const messageId = parameters.body.message_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.modifyMessage = function (parameters) {

        const threadId = parameters.body.thread_id;
        const messageId = parameters.body.message_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}/messages/${messageId}`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.createThreadAndRun = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint('/threads/runs', parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.listRuns = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];
        const threadId = parameters.body.thread_id;

        return this.getFromEndpoint(`/threads/${threadId}/runs`, parameters, expectedQueryParameters, customHeaders);
    };

    OpenaiApi.prototype.createRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;

        return this.postToEndpoint(`/threads/${threadId}/runs`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.getRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.modifyRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.submitToolOuputsToRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.cancelRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/cancel`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.listRunSteps = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;
        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.getRunStep = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.body.run_id;
        const stepId = parameters.body.step_id;

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.listAssistantFiles = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.body.assistant_id;
        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

        return this.getFromEndpoint(`/assistants/${assistantId}/files`, parameters, expectedQueryParameters, customHeaders);
    };

    OpenaiApi.prototype.createAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.body.assistant_id;

        return this.postToEndpoint(`/assistants/${assistantId}/files`, parameters, null, null, null, customHeaders);
    };

    OpenaiApi.prototype.getAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.body.assistant_id;
        const fileId = parameters.body.file_id;

        return this.getFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.deleteAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.body.assistant_id;
        const fileId = parameters.body.file_id;

        return this.deleteFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, parameters, null, customHeaders);
    };

    OpenaiApi.prototype.listMessageFiles = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const messageId = parameters.body.message_id;
        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files`, parameters, expectedQueryParameters, customHeaders);
    };

    OpenaiApi.prototype.getMessageFile = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const messageId = parameters.body.message_id;
        const fileId = parameters.body.file_id;

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files/${fileId}`, parameters, null, customHeaders);
    };

    return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
