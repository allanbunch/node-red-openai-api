let OpenaiApi = (function () {
  "use strict";

  const fs = require("fs");
  const OpenAI = require("openai").OpenAI;

  class OpenaiApi {
    async createChatCompletion(parameters) {
      let node = parameters._node;
      delete parameters._node;

      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }

      const openai = new OpenAI(clientParams);
      const response = await openai.chat.completions.create({
        ...parameters.payload,
      });

      if (parameters.payload.stream) {
        for await (const chunk of response) {
          node.send(chunk);
        }
        return { code: 0, status: "complete" };
      } else {
        return response;
      }
    }

    async createImage(parameters) {

      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }

      const openai = new OpenAI(clientParams);
      const response = await openai.images.generate({
        ...parameters.payload,
      });

      return response;
    }

    async createImageEdit(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      parameters.payload.image = fs.createReadStream(parameters.payload.image);
      if (parameters.payload.mask) {
        parameters.payload.mask = fs.createReadStream(parameters.payload.mask);
      }

      const response = await openai.images.edit({
        ...parameters.payload,
      });

      return response;
    }

    async createImageVariation(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      parameters.payload.image = fs.createReadStream(parameters.payload.image);
      const response = await openai.images.createVariation({
        ...parameters.payload,
      });

      return response;
    }

    async createEmbedding(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.embeddings.create({
        ...parameters.payload,
      });

      return response;
    }

    async createSpeech(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const audio = await openai.audio.speech.create({ ...parameters.payload });
      const response = Buffer.from(await audio.arrayBuffer());

      return response;
    }

    async createTranscription(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      parameters.payload.file = fs.createReadStream(parameters.payload.file);

      const response = await openai.audio.transcriptions.create({
        ...parameters.payload,
      });

      return response;
    }

    async createTranslation(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      parameters.payload.file = fs.createReadStream(parameters.payload.file);
      const response = await openai.audio.translations.create({
        ...parameters.payload,
      });

      return response;
    }

    async listFiles(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const list = await openai.files.list({
        ...parameters.payload,
      });

      let files = [];
      for await (const file of list) {
        files.push(file);
      }

      return files;
    }

    async createFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      parameters.payload.file = fs.createReadStream(parameters.payload.file);
      const response = await openai.files.create({
        ...parameters.payload,
      });

      return response;
    }
    async deleteFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.files.del({
        ...parameters.payload,
      });

      return response;
    }
    async retrieveFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const file_id = parameters.payload.file_id;
      delete parameters.payload.file_id;

      const response = await openai.files.retrieve(file_id, {
        ...parameters.payload,
      });

      return response;
    }
    async downloadFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const file_id = parameters.payload.file_id;
      delete parameters.payload.file_id;

      const response = await openai.files.retrieveContent(file_id, {
        ...parameters.payload,
      });

      return response;
    }
    async createFineTuningJob(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.fineTuning.jobs.create({
        ...parameters.payload,
      });

      return response;
    }
    async listPaginatedFineTuningJobs(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const list = await openai.fineTuning.jobs.list({
        ...parameters.payload,
      });

      let response = [];
      for await (const fineTune of list) {
        response.push(fineTune);
      }

      return response;
    }
    async retrieveFineTuningJob(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.fineTuning.jobs.retrieve(
        parameters.payload.fine_tuning_job_id,
      );

      return response;
    }
    async listFineTuningEvents(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      let response = [];
      const list = await openai.fineTuning.jobs.listEvents(
        parameters.payload.fine_tuning_job_id,
      );
      for await (const fineTuneEvent of list) {
        response.push(fineTuneEvent);
      }
      return response;
    }
    async cancelFineTuningJob(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.fineTuning.jobs.cancel(
        parameters.payload.fine_tuning_job_id,
      );

      return response;
    }
    async listModels(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.models.list();

      return response.body;
    }
    async retrieveModel(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const model = parameters.payload.model;
      const response = await openai.models.retrieve(model);

      return response;
    }
    async deleteModel(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const model = parameters.payload.model;
      const response = await openai.models.del(model);

      return response;
    }
    async createModeration(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.moderations.create(parameters.payload);
      return response;
    }
    async listAssistants(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.beta.assistants.list({
        ...parameters.payload,
      });

      return response.body;
    }
    async createAssistant(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.beta.assistants.create({
        ...parameters.payload,
      });

      return response;
    }
    async getAssistant(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.assistant_id;
      const response = await openai.beta.assistants.retrieve(id);

      return response;
    }
    async modifyAssistant(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.assistant_id;
      delete parameters.payload.assistant_id;

      const response = await openai.beta.assistants.update(id, {
        ...parameters.payload,
      });

      return response;
    }
    async deleteAssistant(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.assistant_id;
      const response = await openai.beta.assistants.del(id);

      return response;
    }
    async createThread(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.beta.threads.create({
        ...parameters.payload,
      });

      return response;
    }
    async getThread(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.thread_id;
      const response = await openai.beta.threads.retrieve(id);

      return response;
    }
    async modifyThread(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.thread_id;
      delete parameters.payload.thread_id;

      const response = await openai.beta.threads.update(id, {
        ...parameters.payload,
      });

      return response;
    }
    async deleteThread(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.thread_id;
      const response = await openai.beta.threads.del(id);

      return response;
    }
    async listMessages(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const id = parameters.payload.thread_id;
      const response = await openai.beta.threads.messages.list(id);

      return response.body;
    }
    async createMessage(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      delete parameters.payload.thread_id;

      const response = await openai.beta.threads.messages.create(thread_id, {
        ...parameters.payload,
      });

      return response;
    }
    async getMessage(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const message_id = parameters.payload.message_id;

      const response = await openai.beta.threads.messages.retrieve(
        thread_id,
        message_id,
      );

      return response;
    }
    async modifyMessage(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const message_id = parameters.payload.message_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.message_id;

      const response = await openai.beta.threads.messages.update(
        thread_id,
        message_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async createThreadAndRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const response = await openai.beta.threads.createAndRun({
        ...parameters.payload,
      });

      return response;
    }
    async listRuns(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thred_id = parameters.payload.thread_id;
      delete parameters.payload.thread_id;

      const response = await openai.beta.threads.runs.list(thred_id, {
        ...parameters.payload,
      });

      return response.body;
    }
    async createRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      delete parameters.payload.thread_id;

      const response = await openai.beta.threads.runs.create(thread_id, {
        ...parameters.payload,
      });

      return response;
    }
    async getRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.run_id;

      const response = await openai.beta.threads.runs.retrieve(
        thread_id,
        run_id,
      );

      return response;
    }
    async modifyRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.run_id;

      const response = await openai.beta.threads.runs.update(
        thread_id,
        run_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async submitToolOuputsToRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.run_id;

      const response = await openai.beta.threads.runs.submitToolOutputs(
        thread_id,
        run_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async cancelRun(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.run_id;

      const response = await openai.beta.threads.runs.cancel(
        thread_id,
        run_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async listRunSteps(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.run_id;

      const response = await openai.beta.threads.runs.steps.list(
        thread_id,
        run_id,
        {
          ...parameters.payload,
        },
      );

      return response.body;
    }
    async getRunStep(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const run_id = parameters.payload.run_id;
      const step_id = parameters.payload.step_id;

      const response = await openai.beta.threads.runs.steps.retrieve(
        thread_id,
        run_id,
        step_id,
      );

      return response;
    }
    async listAssistantFiles(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const assistant_id = parameters.payload.assistant_id;
      delete parameters.payload.assistant_id;

      const response = await openai.beta.assistants.files.list(assistant_id, {
        ...parameters.payload,
      });

      return response.body;
    }
    async createAssistantFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const assistant_id = parameters.payload.assistant_id;
      delete parameters.payload.assistant_id;

      const response = await openai.beta.assistants.files.create(assistant_id, {
        ...parameters.payload,
      });

      return response;
    }
    async getAssistantFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const assistant_id = parameters.payload.assistant_id;
      const file_id = parameters.payload.file_id;
      delete parameters.payload.assistant_id;
      delete parameters.payload.file_id;

      const response = await openai.beta.assistants.files.retrieve(
        assistant_id,
        file_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async deleteAssistantFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const assistant_id = parameters.payload.assistant_id;
      const file_id = parameters.payload.file_id;
      delete parameters.payload.assistant_id;
      delete parameters.payload.file_id;

      const response = await openai.beta.assistants.files.del(
        assistant_id,
        file_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async listMessageFiles(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const message_id = parameters.payload.message_id;
      delete parameters.payload.thread_id;
      delete parameters.payload.message_id;

      const response = await openai.beta.threads.messages.files.list(
        thread_id,
        message_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
    async getMessageFile(parameters) {
      const clientParams = {
        apiKey: parameters.apiKey,
        baseURL: parameters.apiBase,
        organization: parameters.organization,
      }
      const openai = new OpenAI(clientParams);

      const thread_id = parameters.payload.thread_id;
      const message_id = parameters.payload.message_id;
      const file_id = parameters.payload.file_id;

      delete parameters.payload.thread_id;
      delete parameters.payload.message_id;
      delete parameters.payload.file_id;

      const response = await openai.beta.threads.messages.files.retrieve(
        thread_id,
        message_id,
        file_id,
        {
          ...parameters.payload,
        },
      );

      return response;
    }
  }

  return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
