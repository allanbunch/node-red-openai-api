var OpenaiApi = (function () {
    'use strict';

    const axios = require('axios');
    const FormData = require('form-data'); // Only if you handle form data

    class OpenaiApi {
        constructor(options) {
            this.apiKey = (typeof options === 'object') ? (options.apiKey ? options.apiKey : {}) : {};
        }
        request(method, url, body, headers, queryParameters, form) {
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
        }
        setApiKey(value, headerOrQueryName, isQuery) {
            this.apiKey.value = value;
            this.apiKey.headerOrQueryName = headerOrQueryName;
            this.apiKey.isQuery = isQuery;
        }
        setApiBase(apiBase) {
            this.domain = apiBase;
        }
        setAuthHeaders(headerParams) {
            var headers = headerParams ? headerParams : {};
            if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
                headers[this.apiKey.headerOrQueryName] = `Bearer ${this.apiKey.value}`;
            }
            return headers;
        }
        getFromEndpoint(path, parameters, expectedQueryParams, customHeaders) {
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
        }
        postToEndpoint(path, parameters, expectedQueryParams, contentType, filePath, customHeaders) {
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
        }
        deleteFromEndpoint(path, parameters, expectedQueryParams, customHeaders) {
            return new Promise((resolve, reject) => {
                parameters = parameters || {};
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
        }
        createChatCompletion(parameters) {
            const response = this.postToEndpoint('/chat/completions', parameters);
            return response;
        }
        createImage(parameters) {
            return this.postToEndpoint('/images/generations', parameters);
        }
        createImageEdit(parameters) {
            const filename = parameters.body.filename;
            delete parameters.body.filename;

            return this.postToEndpoint('/images/edits', parameters, null, 'form-data', filename);
        }
        createImageVariation(parameters) {
            const filename = parameters.body.filename;
            delete parameters.body.filename;

            return this.postToEndpoint('/images/variations', parameters, null, 'form-data', filename);
        }
        createEmbedding(parameters) {
            return this.postToEndpoint('/embeddings', parameters);
        }
        createSpeech(parameters) {
            return this.postToEndpoint('/audio/speech', parameters);
        }
        createTranscription(parameters) {
            const filename = parameters.body.filename;
            delete parameters.body.filename;

            return this.postToEndpoint('/audio/transcriptions', parameters, null, 'form-data', filename);
        }
        createTranslation(parameters) {
            const filename = parameters.body.filename;
            delete parameters.body.filename;

            return this.postToEndpoint('/audio/translations', parameters, null, 'form-data', filename);
        }
        listFiles(parameters) {
            const expectedQueryParameters = ['purpose'];
            return this.getFromEndpoint('/files', parameters, expectedQueryParameters);
        }
        createFile(parameters) {
            let filename;

            // reference the incoming filename
            filename = parameters.body.filename;
            delete parameters.body.filename;

            return this.postToEndpoint('/files', parameters, null, 'form-data', filename);
        }
        deleteFile(parameters) {
            const file_id = parameters.body.file_id;
            return this.deleteFromEndpoint(`/files/${file_id}`, parameters);
        }
        retrieveFile(parameters) {
            const file_id = parameters.body.file_id;
            return this.getFromEndpoint(`/files/${file_id}`, parameters);
        }
        downloadFile(parameters) {
            const file_id = parameters.body.file_id;
            return this.getFromEndpoint(`/files/${file_id}/content`, parameters);
        }
        createFineTuningJob(parameters) {
            return this.postToEndpoint('/fine_tuning/jobs', parameters);
        }
        listPaginatedFineTuningJobs(parameters) {
            const expectedQueryParameters = ['after', 'limit'];
            return this.getFromEndpoint('/fine_tuning/jobs', parameters, expectedQueryParameters);
        }
        retrieveFineTuningJob(parameters) {
            const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
            return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}`, parameters);
        }
        listFineTuningEvents(parameters) {
            const expectedQueryParameters = ['after', 'limit'];
            const fine_tuning_job_id = parameters.body.fine_tuning_job_id;

            return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, parameters, expectedQueryParameters);
        }
        cancelFineTuningJob(parameters) {
            const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
            return this.postToEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`, parameters);
        }
        listModels(parameters) {
            return this.getFromEndpoint('/models', parameters);
        }
        retrieveModel(parameters) {
            const model = parameters.body.model;

            return this.getFromEndpoint(`/models/${model}`, parameters);
        }
        deleteModel(parameters) {
            const model = parameters.body.model;

            return this.deleteFromEndpoint(`/models/${model}`, parameters);
        }
        createModeration(parameters) {
            return this.postToEndpoint('/moderations', parameters);
        }
        listAssistants(parameters) {
            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.getFromEndpoint('/assistants', parameters, expectedQueryParameters, customHeaders);
        }
        createAssistant(parameters) {
            var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint('/assistants', parameters, null, null, null, customHeaders);
        }
        getAssistant(parameters) {
            const assistantId = parameters.body.assistant_id;

            var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.getFromEndpoint(`/assistants/${assistantId}`, parameters, null, customHeaders);
        }
        modifyAssistant(parameters) {

            const assistant_id = parameters.body.assistant_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint(`/assistants/${assistant_id}`, parameters, null, null, null, customHeaders);
        }
        deleteAssistant(parameters) {
            const assistant_id = parameters.body.assistant_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.deleteFromEndpoint(`/assistants/${assistant_id}`, parameters, null, customHeaders);
        }
        createThread(parameters) {


            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            return this.postToEndpoint('/threads', parameters, null, null, null, customHeaders);
        }
        getThread(parameters) {
            const threadId = parameters.body.thread_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.getFromEndpoint(`/threads/${threadId}`, parameters, null, customHeaders);
        }
        modifyThread(parameters) {
            const threadId = parameters.body.thread_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint(`/threads/${threadId}`, parameters, null, null, null, customHeaders);
        }
        deleteThread(parameters) {
            const threadId = parameters.body.thread_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.deleteFromEndpoint(`/threads/${threadId}`, parameters, null, customHeaders);
        }
        listMessages(parameters) {
            const threadId = parameters.body.thread_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

            return this.getFromEndpoint(`/threads/${threadId}/messages`, parameters, expectedQueryParameters, customHeaders);
        }
        createMessage(parameters) {
            const threadId = parameters.body.thread_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint(`/threads/${threadId}/messages`, parameters, null, null, null, customHeaders);
        }
        getMessage(parameters) {

            const threadId = parameters.body.thread_id;
            const messageId = parameters.body.message_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}`, parameters, null, customHeaders);
        }
        modifyMessage(parameters) {

            const threadId = parameters.body.thread_id;
            const messageId = parameters.body.message_id;
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint(`/threads/${threadId}/messages/${messageId}`, parameters, null, null, null, customHeaders);
        }
        createThreadAndRun(parameters) {

            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

            return this.postToEndpoint('/threads/runs', parameters, null, null, null, customHeaders);
        }
        listRuns(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];
            const threadId = parameters.body.thread_id;

            return this.getFromEndpoint(`/threads/${threadId}/runs`, parameters, expectedQueryParameters, customHeaders);
        }
        createRun(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;

            return this.postToEndpoint(`/threads/${threadId}/runs`, parameters, null, null, null, customHeaders);
        }
        getRun(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;

            return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}`, parameters, null, customHeaders);
        }
        modifyRun(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;

            return this.postToEndpoint(`/threads/${threadId}/runs/${runId}`, parameters, null, null, null, customHeaders);
        }
        submitToolOuputsToRun(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;

            return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, parameters, null, null, null, customHeaders);
        }
        cancelRun(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;

            return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/cancel`, parameters, null, null, null, customHeaders);
        }
        listRunSteps(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;
            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

            return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps`, parameters, null, customHeaders);
        }
        getRunStep(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const runId = parameters.body.run_id;
            const stepId = parameters.body.step_id;

            return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, parameters, null, customHeaders);
        }
        listAssistantFiles(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const assistantId = parameters.body.assistant_id;
            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

            return this.getFromEndpoint(`/assistants/${assistantId}/files`, parameters, expectedQueryParameters, customHeaders);
        }
        createAssistantFile(parameters) {

            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const assistantId = parameters.body.assistant_id;

            return this.postToEndpoint(`/assistants/${assistantId}/files`, parameters, null, null, null, customHeaders);
        }
        getAssistantFile(parameters) {

            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const assistantId = parameters.body.assistant_id;
            const fileId = parameters.body.file_id;

            return this.getFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, parameters, null, customHeaders);
        }
        deleteAssistantFile(parameters) {

            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const assistantId = parameters.body.assistant_id;
            const fileId = parameters.body.file_id;

            return this.deleteFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, parameters, null, customHeaders);
        }
        listMessageFiles(parameters) {

            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const messageId = parameters.body.message_id;
            const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

            return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files`, parameters, expectedQueryParameters, customHeaders);
        }
        getMessageFile(parameters) {
            const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
            const threadId = parameters.body.thread_id;
            const messageId = parameters.body.message_id;
            const fileId = parameters.body.file_id;

            return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files/${fileId}`, parameters, null, customHeaders);
        }
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



























































    return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
