/*jshint -W069 */

const { threadId } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');
const FileType = require('file-type');

/**
 * The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
 * @class OpenaiApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
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

    /**
     * HTTP Request
     * @method
     * @name OpenaiApi#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
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

    /**
    * Set Api Key
    * @method
    * @name OpenaiApi#setApiKey
    * @param {string} value - apiKey's value
    * @param {string} headerOrQueryName - the header or query name to send the apiKey at
    * @param {boolean} isQuery - true if send the apiKey as query param, otherwise, send as header param
    */
    OpenaiApi.prototype.setApiKey = function (value, headerOrQueryName, isQuery) {
        this.apiKey.value = value;
        this.apiKey.headerOrQueryName = headerOrQueryName;
        this.apiKey.isQuery = isQuery;
    };
    /**
    * Set Auth headers
    * @method
    * @name OpenaiApi#setAuthHeaders
    * @param {object} headerParams - headers object
    */
    OpenaiApi.prototype.setAuthHeaders = function (headerParams) {
        var headers = headerParams ? headerParams : {};
        if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
            headers[this.apiKey.headerOrQueryName] = `Bearer ${this.apiKey.value}`;
        }
        return headers;
    };

    OpenaiApi.prototype.getFromEndpoint = function (path, parameters, expectedQueryParams, customHeaders) {
        return new Promise((resolve, reject) => {
            // parameters = parameters || {};
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


    /**
    * Creates a model response for the given chat conversation.
    * @method
    * @name OpenaiApi#createChatCompletion
    * @param {object} parameters - method options and parameters
    * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
    **/
    OpenaiApi.prototype.createChatCompletion = function (parameters) {
        const response = this.postToEndpoint('/chat/completions', parameters);
        return response;
    };

    /**
     * Creates an image given a prompt.
     * @method
     * @name OpenaiApi#createImage
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createImage = function (parameters) {
        return this.postToEndpoint('/images/generations', parameters);
    };

    /**
     * Creates an edited or extended image given an original image and a prompt.
     * @method
     * @name OpenaiApi#createImageEdit
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.image - The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
         * @param {string} parameters.prompt - A text description of the desired image(s). The maximum length is 1000 characters.
         * @param {string} parameters.mask - An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where `image` should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as `image`.
         * @param {string} parameters.model - The model to use for image generation. Only `dall-e-2` is supported at this time.
         * @param {integer} parameters.n - The number of images to generate. Must be between 1 and 10.
         * @param {string} parameters.size - The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`.
         * @param {string} parameters.responseFormat - The format in which the generated images are returned. Must be one of `url` or `b64_json`.
         * @param {string} parameters.user - A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
     */
    OpenaiApi.prototype.createImageEdit = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/images/edits', parameters, null, 'form-data', filename);
    };

    /**
     * Creates a variation of a given image.
     * @method
     * @name OpenaiApi#createImageVariation
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.image - The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
         * @param {} parameters.model - The model to use for image generation. Only `dall-e-2` is supported at this time.
         * @param {integer} parameters.n - The number of images to generate. Must be between 1 and 10. For `dall-e-3`, only `n=1` is supported.
         * @param {string} parameters.responseFormat - The format in which the generated images are returned. Must be one of `url` or `b64_json`.
         * @param {string} parameters.size - The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`.
         * @param {string} parameters.user - A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
    
     */
    OpenaiApi.prototype.createImageVariation = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/images/variations', parameters, null, 'form-data', filename);
    };
    /**
     * Creates an embedding vector representing the input text.
     * @method
     * @name OpenaiApi#createEmbedding
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createEmbedding = function (parameters) {
        return this.postToEndpoint('/embeddings', parameters);
    };
    /**
     * Generates audio from the input text.
     * @method
     * @name OpenaiApi#createSpeech
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createSpeech = function (parameters) {
        return this.postToEndpoint('/audio/speech', parameters);
    };
    /**
     * Transcribes audio into the input language.
     * @method
     * @name OpenaiApi#createTranscription
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.file - The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
         * @param {} parameters.model - ID of the model to use. Only `whisper-1` is currently available.
         * @param {string} parameters.language - The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.   
         * @param {string} parameters.prompt - An optional text to guide the model's style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
         * @param {string} parameters.responseFormat - The format of the transcript output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
         * @param {number} parameters.temperature - The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
     */
    OpenaiApi.prototype.createTranscription = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/audio/transcriptions', parameters, null, 'form-data', filename);
    };
    /**
     * Translates audio into English.
     * @method
     * @name OpenaiApi#createTranslation
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.file - The audio file object (not file name) translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
         * @param {} parameters.model - ID of the model to use. Only `whisper-1` is currently available.
         * @param {string} parameters.prompt - An optional text to guide the model's style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English.
         * @param {string} parameters.responseFormat - The format of the transcript output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
         * @param {number} parameters.temperature - The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
    
     */
    OpenaiApi.prototype.createTranslation = function (parameters) {
        const filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/audio/translations', parameters, null, 'form-data', filename);
    };

    /**
     * Returns a list of files that belong to the user's organization.
     * @method
     * @name OpenaiApi#listFiles
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.purpose - Only return files with the given purpose.
     */
    OpenaiApi.prototype.listFiles = function (parameters) {
        const expectedQueryParameters = ['purpose'];
        return this.getFromEndpoint('/files', parameters, expectedQueryParameters);
    };
    /**
     * Upload a file that can be used across various endpoints/features. The size of all the files uploaded by one organization can be up to 100 GB.
    
    The size of individual files for can be a maximum of 512MB. See the [Assistants Tools guide](/docs/assistants/tools) to learn more about the types of files supported. The Fine-tuning API only supports `.jsonl` files.
    
    Please [contact us](https://help.openai.com/) if you need to increase these storage limits.
    
     * @method
     * @name OpenaiApi#createFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.file - The File object (not file name) to be uploaded.
    
         * @param {string} parameters.purpose - The intended purpose of the uploaded file.
    
    Use "fine-tune" for [Fine-tuning](/docs/api-reference/fine-tuning) and "assistants" for [Assistants](/docs/api-reference/assistants) and [Messages](/docs/api-reference/messages). This allows us to validate the format of the uploaded file is correct for fine-tuning.
    
     */

    OpenaiApi.prototype.createFile = function (parameters) {
        let filename;

        // reference the incoming filename
        filename = parameters.body.filename;
        delete parameters.body.filename;

        return this.postToEndpoint('/files', parameters, null, 'form-data', filename);
    };

    /**
     * Delete a file.
     * @method
     * @name OpenaiApi#deleteFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fileId - The ID of the file to use for this request.
     */
    OpenaiApi.prototype.deleteFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.deleteFromEndpoint(`/files/${file_id}`);
    };
    /**
     * Returns information about a specific file.
     * @method
     * @name OpenaiApi#retrieveFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fileId - The ID of the file to use for this request.
     */
    OpenaiApi.prototype.retrieveFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.getFromEndpoint(`/files/${file_id}`);
    };
    /**
     * Returns the contents of the specified file.
     * @method
     * @name OpenaiApi#downloadFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fileId - The ID of the file to use for this request.
     */
    OpenaiApi.prototype.downloadFile = function (parameters) {
        const file_id = parameters.body.file_id;
        return this.getFromEndpoint(`/files/${file_id}/content`);
    };
    /**
     * Creates a job that fine-tunes a specified model from a given dataset.
    
    Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.
    
    [Learn more about fine-tuning](/docs/guides/fine-tuning)
    
     * @method
     * @name OpenaiApi#createFineTuningJob
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createFineTuningJob = function (parameters) {
        return this.postToEndpoint('/fine_tuning/jobs', parameters);
    };
    /**
     * List your organization's fine-tuning jobs
    
     * @method
     * @name OpenaiApi#listPaginatedFineTuningJobs
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.after - Identifier for the last job from the previous pagination request.
         * @param {integer} parameters.limit - Number of fine-tuning jobs to retrieve.
     */
    OpenaiApi.prototype.listPaginatedFineTuningJobs = function (parameters) {
        const expectedQueryParameters = ['after', 'limit'];
        return this.getFromEndpoint('/fine_tuning/jobs', parameters, expectedQueryParameters);
    };
    /**
     * Get info about a fine-tuning job.
    
    [Learn more about fine-tuning](/docs/guides/fine-tuning)
    
     * @method
     * @name OpenaiApi#retrieveFineTuningJob
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fineTuningJobId - The ID of the fine-tuning job.
    
     */
    OpenaiApi.prototype.retrieveFineTuningJob = function (parameters) {
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
        return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}`);
    };
    /**
     * Get status updates for a fine-tuning job.
    
     * @method
     * @name OpenaiApi#listFineTuningEvents
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fineTuningJobId - The ID of the fine-tuning job to get events for.
    
         * @param {string} parameters.after - Identifier for the last event from the previous pagination request.
         * @param {integer} parameters.limit - Number of events to retrieve.
     */
    OpenaiApi.prototype.listFineTuningEvents = function (parameters) {
        const expectedQueryParameters = ['after', 'limit'];
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;

        return this.getFromEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, parameters, expectedQueryParameters);
    };
    /**
     * Immediately cancel a fine-tune job.
    
     * @method
     * @name OpenaiApi#cancelFineTuningJob
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.fineTuningJobId - The ID of the fine-tuning job to cancel.
    
     */
    OpenaiApi.prototype.cancelFineTuningJob = function (parameters) {
        const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
        return this.postToEndpoint(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`);
    };

    /**
     * Lists the currently available models, and provides basic information about each one such as the owner and availability.
     * @method
     * @name OpenaiApi#listModels
     * @param {object} parameters - method options and parameters
     */
    OpenaiApi.prototype.listModels = function (parameters) {
        return this.getFromEndpoint('/models', parameters);
    };
    /**
     * Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
     * @method
     * @name OpenaiApi#retrieveModel
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.model - The ID of the model to use for this request
     */
    OpenaiApi.prototype.retrieveModel = function (parameters) {
        const model = parameters.body.model;

        return this.getFromEndpoint(`/models/${model}`);
    };
    /**
     * Delete a fine-tuned model. You must have the Owner role in your organization to delete a model.
     * @method
     * @name OpenaiApi#deleteModel
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.model - The model to delete
     */
    OpenaiApi.prototype.deleteModel = function (parameters) {
        const model = parameters.body.model;

        return this.deleteFromEndpoint(`/models/${model}`);
    };
    /**
     * Classifies if text violates OpenAI's Content Policy
     * @method
     * @name OpenaiApi#createModeration
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createModeration = function (parameters) {
        return this.postToEndpoint('/moderations', parameters);
    };
    /**
     * Returns a list of assistants.
     * @method
     * @name OpenaiApi#listAssistants
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listAssistants = function (parameters) {
        var expectedQueryParameters = ['limit', 'order', 'after', 'before'];
        var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint('/assistants', parameters, expectedQueryParameters, customHeaders);
    };

    /**
     * Create an assistant with a model and instructions.
     * @method
     * @name OpenaiApi#createAssistant
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createAssistant = function (parameters) {
        var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint('/assistants', parameters, null, null, null, customHeaders);
    };

    /**
     * Retrieves an assistant.
     * @method
     * @name OpenaiApi#getAssistant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant to retrieve.
     */
    OpenaiApi.prototype.getAssistant = function (parameters) {
        const assistantId = parameters.body.assistant_id;

        var customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/assistants/${assistantId}`, null, null, customHeaders);
    };
    /**
     * Modifies an assistant.
     * @method
     * @name OpenaiApi#modifyAssistant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant to modify.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.modifyAssistant = function (parameters) {

        const assistant_id = parameters.body.assistant_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/assistants/${assistant_id}`, parameters, null, null, null, customHeaders);
    };
    /**
     * Delete an assistant.
     * @method
     * @name OpenaiApi#deleteAssistant
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant to delete.
     */
    OpenaiApi.prototype.deleteAssistant = function (parameters) {
        const assistant_id = parameters.body.assistant_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.deleteFromEndpoint(`/assistants/${assistant_id}`, null, null, customHeaders);
    };
    /**
     * Create a thread.
     * @method
     * @name OpenaiApi#createThread
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createThread = function (parameters) {


        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        return this.postToEndpoint('/threads', parameters, null, null, null, customHeaders);
    };
    /**
     * Retrieves a thread.
     * @method
     * @name OpenaiApi#getThread
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to retrieve.
     */
    OpenaiApi.prototype.getThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/threads/${threadId}`, null, null, customHeaders);
    };
    /**
     * Modifies a thread.
     * @method
     * @name OpenaiApi#modifyThread
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to modify. Only the `metadata` can be modified.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.modifyThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}`, parameters, null, null, null, customHeaders);
    };
    /**
     * Delete a thread.
     * @method
     * @name OpenaiApi#deleteThread
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to delete.
     */
    OpenaiApi.prototype.deleteThread = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.deleteFromEndpoint(`/threads/${threadId}`, null, null, customHeaders);
    };
    /**
     * Returns a list of messages for a given thread.
     * @method
     * @name OpenaiApi#listMessages
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) the messages belong to.
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listMessages = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        const expectedQueryParameters = ['limit', 'order', 'after', 'before'];

        return this.getFromEndpoint(`/threads/${threadId}`, parameters, expectedQueryParameters, customHeaders);
    };
    /**
     * Create a message.
     * @method
     * @name OpenaiApi#createMessage
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) to create a message for.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createMessage = function (parameters) {
        const threadId = parameters.body.thread_id;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}/messages`, parameters, null, null, null, customHeaders)
    };
    /**
     * Retrieve a message.
     * @method
     * @name OpenaiApi#getMessage
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) to which this message belongs.
         * @param {string} parameters.messageId - The ID of the message to retrieve.
     */
    OpenaiApi.prototype.getMessage = function (parameters) {

        const threadId = parameters.body.thread_id;
        const messageId = parameters.messageId;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}`, null, null, customHeaders);
    };
    /**
     * Modifies a message.
     * @method
     * @name OpenaiApi#modifyMessage
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to which this message belongs.
         * @param {string} parameters.messageId - The ID of the message to modify.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.modifyMessage = function (parameters) {

        const threadId = parameters.body.thread_id;
        const messageId = parameters.messageId;
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint(`/threads/${threadId}/messages/${messageId}`, parameters, null, null, null, customHeaders);
    };
    /**
     * Create a thread and run it in one request.
     * @method
     * @name OpenaiApi#createThreadAndRun
     * @param {object} parameters - method options and parameters
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createThreadAndRun = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };

        return this.postToEndpoint('/threads/runs', parameters, null, null, null, customHeaders);
    };
    /**
     * Returns a list of runs belonging to a thread.
     * @method
     * @name OpenaiApi#listRuns
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread the run belongs to.
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listRuns = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;

        return this.getFromEndpoint(`/threads/${threadId}/runs`, null, null, customHeaders);
    };
    /**
     * Create a run.
     * @method
     * @name OpenaiApi#createRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to run.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;

        return this.postToEndpoint(`/threads/${threadId}/runs`, parameters, null, null, null, customHeaders);
    };
    /**
     * Retrieves a run.
     * @method
     * @name OpenaiApi#getRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) that was run.
         * @param {string} parameters.runId - The ID of the run to retrieve.
     */
    OpenaiApi.prototype.getRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}`, null, null, customHeaders);
    };
    /**
     * Modifies a run.
     * @method
     * @name OpenaiApi#modifyRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) that was run.
         * @param {string} parameters.runId - The ID of the run to modify.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.modifyRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}`, parameters, null, null, null, customHeaders);
    };
    /**
     * When a run has the `status: "requires_action"` and `required_action.type` is `submit_tool_outputs`, this endpoint can be used to submit the outputs from the tool calls once they're all completed. All outputs must be submitted in a single request.
    
     * @method
     * @name OpenaiApi#submitToolOuputsToRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the [thread](/docs/api-reference/threads) to which this run belongs.
         * @param {string} parameters.runId - The ID of the run that requires the tool output submission.
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.submitToolOuputsToRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, parameters, null, null, null, customHeaders);
    };
    /**
     * Cancels a run that is `in_progress`.
     * @method
     * @name OpenaiApi#cancelRun
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to which this run belongs.
         * @param {string} parameters.runId - The ID of the run to cancel.
     */
    OpenaiApi.prototype.cancelRun = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;

        return this.postToEndpoint(`/threads/${threadId}/runs/${runId}/cancel`, null, null, null, null, customHeaders);
    };
    /**
     * Returns a list of run steps belonging to a run.
     * @method
     * @name OpenaiApi#listRunSteps
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread the run and run steps belong to.
         * @param {string} parameters.runId - The ID of the run the run steps belong to.
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listRunSteps = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps`, null, null, customHeaders);
    };
    /**
     * Retrieves a run step.
     * @method
     * @name OpenaiApi#getRunStep
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to which the run and run step belongs.
         * @param {string} parameters.runId - The ID of the run to which the run step belongs.
         * @param {string} parameters.stepId - The ID of the run step to retrieve.
     */
    OpenaiApi.prototype.getRunStep = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const runId = parameters.runId;
        const stepId = parameters.stepId;

        return this.getFromEndpoint(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, null, null, customHeaders);
    };
    /**
     * Returns a list of assistant files.
     * @method
     * @name OpenaiApi#listAssistantFiles
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant the file belongs to.
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listAssistantFiles = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.assistantId;

        return this.getFromEndpoint(`/assistants/${assistantId}/files`, null, null, customHeaders);
    };

    /**
     * Create an assistant file by attaching a [File](/docs/api-reference/files) to an [assistant](/docs/api-reference/assistants).
     * @method
     * @name OpenaiApi#createAssistantFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant for which to create a File.
    
         * @param {} parameters.body - The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
     */
    OpenaiApi.prototype.createAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.assistantId;

        return this.postToEndpoint(`/assistants/${assistantId}/files`, parameters, null, null, null, customHeaders);
    };
    /**
     * Retrieves an AssistantFile.
     * @method
     * @name OpenaiApi#getAssistantFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant who the file belongs to.
         * @param {string} parameters.fileId - The ID of the file we're getting.
     */
    OpenaiApi.prototype.getAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.assistantId;
        const fileId = parameters.fileId;

        return this.getFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, null, null, customHeaders);
    };
    /**
     * Delete an assistant file.
     * @method
     * @name OpenaiApi#deleteAssistantFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.assistantId - The ID of the assistant that the file belongs to.
         * @param {string} parameters.fileId - The ID of the file to delete.
     */
    OpenaiApi.prototype.deleteAssistantFile = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const assistantId = parameters.assistantId;
        const fileId = parameters.fileId;

        return this.deleteFromEndpoint(`/assistants/${assistantId}/files/${fileId}`, null, null, customHeaders);
    };
    /**
     * Returns a list of message files.
     * @method
     * @name OpenaiApi#listMessageFiles
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread that the message and files belong to.
         * @param {string} parameters.messageId - The ID of the message that the files belongs to.
         * @param {integer} parameters.limit - A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
    
         * @param {string} parameters.order - Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.
    
         * @param {string} parameters.after - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
    
         * @param {string} parameters.before - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
    
     */
    OpenaiApi.prototype.listMessageFiles = function (parameters) {

        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const messageId = parameters.messageId;

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files`, null, null, customHeaders);
    };
    /**
     * Retrieves a message file.
     * @method
     * @name OpenaiApi#getMessageFile
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.body.thread_id - The ID of the thread to which the message and File belong.
         * @param {string} parameters.messageId - The ID of the message the file belongs to.
         * @param {string} parameters.fileId - The ID of the file being retrieved.
     */
    OpenaiApi.prototype.getMessageFile = function (parameters) {
        const customHeaders = { 'OpenAI-Beta': 'assistants=v1' };
        const threadId = parameters.body.thread_id;
        const messageId = parameters.messageId;
        const fileId = parameters.fileId;

        return this.getFromEndpoint(`/threads/${threadId}/messages/${messageId}/files/${fileId}`, null, null, customHeaders);
    };

    return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
