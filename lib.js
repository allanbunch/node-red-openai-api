var OpenaiApi = (function () {
  "use strict";

  const fs = require("fs");
  const OpenAI = require("openai").OpenAI;

  class OpenaiApi {
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

    async createTranscription(parameters) {

      const openai = new OpenAI({
        apiKey: parameters.apiKey,
        organization: parameters.organization
      });
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(parameters.file),
        model: parameters.model,
      });

      return transcription;
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


  return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
