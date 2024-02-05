var OpenaiApi = (function () {
  "use strict";

  const axios = require("axios");
  const FormData = require("form-data"); // Only if you handle form data

  class OpenaiApi {
    constructor(options) {
      this.apiKey =
        typeof options === "object"
          ? options.apiKey
            ? options.apiKey
            : {}
          : {};
    }

    setApiKey(value, headerOrQueryName, isQuery) {
      this.apiKey.value = value;
      this.apiKey.headerOrQueryName = headerOrQueryName;
      this.apiKey.isQuery = isQuery;
    }
    setApiBase(apiBase) {
      this.domain = apiBase;
    }

    setOrganizationIdHeader(organizationId) {
      this.organizationId = organizationId;
    }

    setAuthHeaders(headerParams) {
      var headers = headerParams ? headerParams : {};
      if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
        headers[this.apiKey.headerOrQueryName] = `Bearer ${this.apiKey.value}`;
      }
      return headers;
    }

    setNodeRef(node) {
      this.node = node;
    }

    getFromEndpoint(path, parameters, expectedQueryParams, customHeaders = {}) {
      return new Promise((resolve, reject) => {
        var domain = this.domain;
        var organizationId = this.organizationId;
        var queryParameters = {};
        var baseHeaders = {};

        baseHeaders = this.setAuthHeaders(headers);
        baseHeaders["Accept"] = "application/json";
        if (organizationId) {
          customHeaders["OpenAI-Organization"] = organizationId;
        }

        var headers = {
          ...baseHeaders,
          ...customHeaders,
        };

        // Only add query parameters if they are expected and exist
        if (expectedQueryParams) {
          expectedQueryParams.forEach((param) => {
            if (parameters.body[param] !== undefined) {
              queryParameters[param] = parameters.body[param];
            }
          });
        }

        // Merge any additional query parameters from the parameters object
        queryParameters = mergeQueryParams(parameters, queryParameters);

        // Axios request configuration
        const config = {
          method: "GET",
          url: domain + path,
          headers: headers,
          params: queryParameters,
        };

        // Axios GET request
        axios(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    postToEndpoint(
      path,
      parameters,
      expectedQueryParams,
      contentType,
      filePath,
      customHeaders = {},
    ) {
      return new Promise((resolve, reject) => {
        const _path = require("path");

        parameters = parameters || {};
        var domain = this.domain;
        var organizationId = this.organizationId;
        var queryParameters = {},
          baseHeaders = {},
          data;

        baseHeaders = this.setAuthHeaders(baseHeaders);
        baseHeaders["Accept"] = "application/json";

        if (organizationId) {
          customHeaders["OpenAI-Organization"] = organizationId;
        }

        var headers = {
          ...baseHeaders,
          ...customHeaders,
        };

        // Determine the responseType

        let responseType;
        if (contentType === "form-data") {
          var formData = new FormData();

          responseType = "json";
          Object.entries(parameters.body).forEach(([key, value]) => {
            if (value instanceof Buffer) {
              if (!filePath) {
                throw new Error(
                  "msg.payload must include a `filename` property.",
                );
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
        } else if (contentType === "arraybuffer") {
          // Handle binary requests
          data = parameters.body || {};
          responseType = "arraybuffer";
        } else {
          // Handle json requests
          // headers["Content-Type"] = "application/json";
          data = parameters.body || {};
          responseType = "json";
        }

        // Add expected query parameters to the queryParameters object
        if (expectedQueryParams) {
          expectedQueryParams.forEach((param) => {
            if (parameters.body[param] !== undefined) {
              queryParameters[param] = parameters.body[param];
            }
          });
        }

        // Merge any additional query parameters from the parameters object
        queryParameters = mergeQueryParams(parameters.body, queryParameters);

        // Axios request configuration
        const config = {
          method: "POST",
          url: domain + path,
          headers: headers,
          params: queryParameters,
          data: data,
          responseType: responseType,
        };

        axios(config)
          .then((response) => {
            if (config.responseType === "stream") {
              // Handle the stream response
              response.data
                .on("data", (chunk) => {
                  // Convert chunk from Uint8Array to string
                  const chunkAsString = new TextDecoder().decode(chunk);

                  // Emit converted data chunks as Node-RED messages
                  this.node.send({ payload: chunkAsString });
                })
                .on("end", () => {
                  // Handle the end of the stream
                  resolve({ payload: "Stream ended" });
                })
                .on("error", (err) => {
                  // Handle any errors
                  reject(err);
                });
            } else {
              // Handle non-stream response (e.g., binary data or JSON)
              resolve(response);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    deleteFromEndpoint(
      path,
      parameters,
      expectedQueryParams,
      customHeaders = {},
    ) {
      return new Promise((resolve, reject) => {
        parameters = parameters || {};
        var domain = this.domain;
        var organizationId = this.organizationId;
        var queryParameters = {},
          baseHeaders = {};

        baseHeaders = this.setAuthHeaders(headers);
        baseHeaders["Accept"] = "application/json";

        if (organizationId) {
          customHeaders["OpenAI-Organization"] = organizationId;
        }

        var headers = {
          ...baseHeaders,
          ...customHeaders,
        };

        // Only add query parameters if they are expected and exist
        if (expectedQueryParams) {
          expectedQueryParams.forEach((param) => {
            if (parameters[param] !== undefined) {
              queryParameters[param] = parameters.body[param];
            }
          });
        }

        // Merge any additional query parameters from the parameters object
        queryParameters = mergeQueryParams(parameters, queryParameters);

        // Axios request configuration
        const config = {
          method: "DELETE",
          url: domain + path,
          headers: headers,
          params: queryParameters,
        };

        // Axios DELETE request
        axios(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    createChatCompletion(parameters) {
      const response = this.postToEndpoint("/chat/completions", parameters);
      return response;
    }
    createImage(parameters) {
      return this.postToEndpoint("/images/generations", parameters);
    }
    createImageEdit(parameters) {
      const filename = parameters.body.filename;
      delete parameters.body.filename;

      return this.postToEndpoint(
        "/images/edits",
        parameters,
        null,
        "form-data",
        filename,
      );
    }
    createImageVariation(parameters) {
      const filename = parameters.body.filename;
      delete parameters.body.filename;

      return this.postToEndpoint(
        "/images/variations",
        parameters,
        null,
        "form-data",
        filename,
      );
    }
    createEmbedding(parameters) {
      return this.postToEndpoint("/embeddings", parameters);
    }

    createSpeech(parameters) {
      return this.postToEndpoint(
        "/audio/speech",
        parameters,
        null,
        "arraybuffer",
      );
    }

    createTranscription(parameters) {
      const filename = parameters.body.filename;
      delete parameters.body.filename;

      return this.postToEndpoint(
        "/audio/transcriptions",
        parameters,
        null,
        "form-data",
        filename,
      );
    }
    createTranslation(parameters) {
      const filename = parameters.body.filename;
      delete parameters.body.filename;

      return this.postToEndpoint(
        "/audio/translations",
        parameters,
        null,
        "form-data",
        filename,
      );
    }
    listFiles(parameters) {
      const expectedQueryParameters = ["purpose"];
      return this.getFromEndpoint(
        "/files",
        parameters,
        expectedQueryParameters,
      );
    }
    createFile(parameters) {
      let filename;

      // reference the incoming filename
      filename = parameters.body.filename;
      delete parameters.body.filename;

      return this.postToEndpoint(
        "/files",
        parameters,
        null,
        "form-data",
        filename,
      );
    }
    deleteFile(parameters) {
      const file_id = parameters.body.file_id;
      delete parameters.body.file_id;
      return this.deleteFromEndpoint(`/files/${file_id}`, parameters);
    }
    retrieveFile(parameters) {
      const file_id = parameters.body.file_id;
      delete parameters.body.file_id;
      return this.getFromEndpoint(`/files/${file_id}`, parameters);
    }
    downloadFile(parameters) {
      const file_id = parameters.body.file_id;
      delete parameters.body.file_id;
      return this.getFromEndpoint(`/files/${file_id}/content`, parameters);
    }
    createFineTuningJob(parameters) {
      return this.postToEndpoint("/fine_tuning/jobs", parameters);
    }
    listPaginatedFineTuningJobs(parameters) {
      const expectedQueryParameters = ["after", "limit"];
      return this.getFromEndpoint(
        "/fine_tuning/jobs",
        parameters,
        expectedQueryParameters,
      );
    }
    retrieveFineTuningJob(parameters) {
      const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
      delete parameters.body.fine_tuning_job_id;
      return this.getFromEndpoint(
        `/fine_tuning/jobs/${fine_tuning_job_id}`,
        parameters,
      );
    }
    listFineTuningEvents(parameters) {
      const expectedQueryParameters = ["after", "limit"];
      const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
      delete parameters.body.fine_tuning_job_id;

      return this.getFromEndpoint(
        `/fine_tuning/jobs/${fine_tuning_job_id}/events`,
        parameters,
        expectedQueryParameters,
      );
    }
    cancelFineTuningJob(parameters) {
      const fine_tuning_job_id = parameters.body.fine_tuning_job_id;
      delete parameters.body.fine_tuning_job_id;
      return this.postToEndpoint(
        `/fine_tuning/jobs/${fine_tuning_job_id}/cancel`,
        parameters,
      );
    }
    listModels(parameters) {
      return this.getFromEndpoint("/models", parameters);
    }
    retrieveModel(parameters) {
      const model = parameters.body.model;
      delete parameters.body.model;
      return this.getFromEndpoint(`/models/${model}`, parameters);
    }
    deleteModel(parameters) {
      const model = parameters.body.model;
      delete parameters.body.model;
      return this.deleteFromEndpoint(`/models/${model}`, parameters);
    }
    createModeration(parameters) {
      return this.postToEndpoint("/moderations", parameters);
    }
    listAssistants(parameters) {
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };

      return this.getFromEndpoint(
        "/assistants",
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    createAssistant(parameters) {
      var customHeaders = { "OpenAI-Beta": "assistants=v1" };

      return this.postToEndpoint(
        "/assistants",
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    getAssistant(parameters) {
      const assistantId = parameters.body.assistant_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.assistant_id;
      return this.getFromEndpoint(
        `/assistants/${assistantId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    modifyAssistant(parameters) {
      const assistant_id = parameters.body.assistant_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.assistant_id;
      return this.postToEndpoint(
        `/assistants/${assistant_id}`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    deleteAssistant(parameters) {
      const assistant_id = parameters.body.assistant_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.assistant_id;
      return this.deleteFromEndpoint(
        `/assistants/${assistant_id}`,
        parameters,
        null,
        customHeaders,
      );
    }
    createThread(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      return this.postToEndpoint(
        "/threads",
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    getThread(parameters) {
      const threadId = parameters.body.thread_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      return this.getFromEndpoint(
        `/threads/${threadId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    modifyThread(parameters) {
      const threadId = parameters.body.thread_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      return this.postToEndpoint(
        `/threads/${threadId}`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    deleteThread(parameters) {
      const threadId = parameters.body.thread_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      return this.deleteFromEndpoint(
        `/threads/${threadId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    listMessages(parameters) {
      const threadId = parameters.body.thread_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      delete parameters.body.thread_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/messages`,
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    createMessage(parameters) {
      const threadId = parameters.body.thread_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      return this.postToEndpoint(
        `/threads/${threadId}/messages`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    getMessage(parameters) {
      const threadId = parameters.body.thread_id;
      const messageId = parameters.body.message_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      delete parameters.body.message_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/messages/${messageId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    modifyMessage(parameters) {
      const threadId = parameters.body.thread_id;
      const messageId = parameters.body.message_id;
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      delete parameters.body.thread_id;
      delete parameters.body.message_id;
      return this.postToEndpoint(
        `/threads/${threadId}/messages/${messageId}`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    createThreadAndRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };

      return this.postToEndpoint(
        "/threads/runs",
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    listRuns(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      const threadId = parameters.body.thread_id;
      delete parameters.body.thread_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/runs`,
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    createRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      delete parameters.body.thread_id;
      return this.postToEndpoint(
        `/threads/${threadId}/runs`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    getRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      delete parameters.body.thread_id;
      delete parameters.body.run_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/runs/${runId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    modifyRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      delete parameters.body.thread_id;
      delete parameters.body.run_id;
      return this.postToEndpoint(
        `/threads/${threadId}/runs/${runId}`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    submitToolOuputsToRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      delete parameters.body.thread_id;
      delete parameters.body.run_id;
      return this.postToEndpoint(
        `/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    cancelRun(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      delete parameters.body.thread_id;
      delete parameters.body.run_id;
      return this.postToEndpoint(
        `/threads/${threadId}/runs/${runId}/cancel`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    listRunSteps(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      delete parameters.body.thread_id;
      delete parameters.body.run_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/runs/${runId}/steps`,
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    getRunStep(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const runId = parameters.body.run_id;
      const stepId = parameters.body.step_id;
      delete parameters.body.thread_id;
      delete parameters.body.step_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/runs/${runId}/steps/${stepId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    listAssistantFiles(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const assistantId = parameters.body.assistant_id;
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      delete parameters.body.assistant_id;
      return this.getFromEndpoint(
        `/assistants/${assistantId}/files`,
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    createAssistantFile(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const assistantId = parameters.body.assistant_id;
      delete parameters.body.assistant_id;
      return this.postToEndpoint(
        `/assistants/${assistantId}/files`,
        parameters,
        null,
        null,
        null,
        customHeaders,
      );
    }
    getAssistantFile(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const assistantId = parameters.body.assistant_id;
      const fileId = parameters.body.file_id;
      delete parameters.body.assistant_id;
      delete parameters.body.file_id;
      return this.getFromEndpoint(
        `/assistants/${assistantId}/files/${fileId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    deleteAssistantFile(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const assistantId = parameters.body.assistant_id;
      const fileId = parameters.body.file_id;
      delete parameters.body.assistant_id;
      delete parameters.body.file_id;
      return this.deleteFromEndpoint(
        `/assistants/${assistantId}/files/${fileId}`,
        parameters,
        null,
        customHeaders,
      );
    }
    listMessageFiles(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const messageId = parameters.body.message_id;
      const expectedQueryParameters = ["limit", "order", "after", "before"];
      delete parameters.body.thread_id;
      delete parameters.body.message_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/messages/${messageId}/files`,
        parameters,
        expectedQueryParameters,
        customHeaders,
      );
    }
    getMessageFile(parameters) {
      const customHeaders = { "OpenAI-Beta": "assistants=v1" };
      const threadId = parameters.body.thread_id;
      const messageId = parameters.body.message_id;
      const fileId = parameters.body.file_id;
      delete parameters.body.thread_id;
      delete parameters.body.message_id;
      delete parameters.body.file_id;
      return this.getFromEndpoint(
        `/threads/${threadId}/messages/${messageId}/files/${fileId}`,
        parameters,
        null,
        customHeaders,
      );
    }
  }

  function mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(
        function (parameterName) {
          var parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        },
      );
    }
    return queryParameters;
  }

  return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
