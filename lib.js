let OpenaiApi = (function () {
  "use strict";

  const fs = require("fs");
  const OpenAI = require("openai").OpenAI;

  class OpenaiApi {
    constructor(apiKey, baseURL, organization) {
      this.clientParams = {
        apiKey: apiKey,
        baseURL: baseURL,
        organization: organization
      }
    }

    async createChatCompletion(parameters) {
      let node = parameters._node;
      delete parameters._node;

      const openai = new OpenAI(this.clientParams);
      const response = await openai.chat.completions.create({
        ...parameters.msg.payload,
      });

      if (parameters.msg.payload.stream) {
        node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming",
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            
            let {_msgid, ...newMsg} = parameters.msg;
            newMsg.payload = chunk;

            node.send(newMsg);
          }
        }
        node.status({});
      } else {
        return response;
      }
    }

    async createImage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.images.generate({
        ...parameters.msg.payload,
      });

      return response;
    }

    async createImageEdit(parameters) {
      const openai = new OpenAI(this.clientParams);

      parameters.msg.payload.image = fs.createReadStream(
        parameters.msg.payload.image,
      );
      if (parameters.msg.payload.mask) {
        parameters.msg.payload.mask = fs.createReadStream(
          parameters.msg.payload.mask,
        );
      }

      const response = await openai.images.edit({
        ...parameters.msg.payload,
      });

      return response;
    }

    async createImageVariation(parameters) {
      const openai = new OpenAI(this.clientParams);

      parameters.msg.payload.image = fs.createReadStream(
        parameters.msg.payload.image,
      );
      const response = await openai.images.createVariation({
        ...parameters.msg.payload,
      });

      return response;
    }

    async createEmbedding(parameters) {
      const openai = new OpenAI(this.clientParams);

      const response = await openai.embeddings.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async createSpeech(parameters) {
      const openai = new OpenAI(this.clientParams);

      const audio = await openai.audio.speech.create({
        ...parameters.msg.payload,
      });
      const response = Buffer.from(await audio.arrayBuffer());

      return response;
    }

    async createTranscription(parameters) {
      const openai = new OpenAI(this.clientParams);

      parameters.msg.payload.file = fs.createReadStream(
        parameters.msg.payload.file,
      );

      const response = await openai.audio.transcriptions.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async createTranslation(parameters) {
      const openai = new OpenAI(this.clientParams);

      parameters.msg.payload.file = fs.createReadStream(
        parameters.msg.payload.file,
      );
      const response = await openai.audio.translations.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async listFiles(parameters) {
      const openai = new OpenAI(this.clientParams);

      const list = await openai.files.list({
        ...parameters.msg.payload,
      });

      let files = [];
      for await (const file of list) {
        files.push(file);
      }

      return files;
    }

    async createFile(parameters) {
      const openai = new OpenAI(this.clientParams);

      parameters.msg.payload.file = fs.createReadStream(
        parameters.msg.payload.file,
      );
      const response = await openai.files.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async deleteFile(parameters) {
      const openai = new OpenAI(this.clientParams);

      const response = await openai.files.del({
        ...parameters.msg.payload,
      });

      return response;
    }

    async retrieveFile(parameters) {
      const openai = new OpenAI(this.clientParams);

      const file_id = parameters.msg.payload.file_id;
      delete parameters.msg.payload.file_id;

      const response = await openai.files.retrieve(file_id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async downloadFile(parameters) {
      const openai = new OpenAI(this.clientParams);

      const file_id = parameters.msg.payload.file_id;
      delete parameters.msg.payload.file_id;

      const response = await openai.files.retrieveContent(file_id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async createFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);

      const response = await openai.fineTuning.jobs.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async listPaginatedFineTuningJobs(parameters) {
      const openai = new OpenAI(this.clientParams);

      const list = await openai.fineTuning.jobs.list({
        ...parameters.msg.payload,
      });

      let response = [];
      for await (const fineTune of list) {
        response.push(fineTune);
      }

      return response;
    }

    async retrieveFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);

      const response = await openai.fineTuning.jobs.retrieve(
        parameters.msg.payload.fine_tuning_job_id,
      );

      return response;
    }

    async listFineTuningEvents(parameters) {
      const openai = new OpenAI(this.clientParams);

      let response = [];
      const list = await openai.fineTuning.jobs.listEvents(
        parameters.msg.payload.fine_tuning_job_id,
      );
      for await (const fineTuneEvent of list) {
        response.push(fineTuneEvent);
      }
      return response;
    }

    async cancelFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);

      const response = await openai.fineTuning.jobs.cancel(
        parameters.msg.payload.fine_tuning_job_id,
      );

      return response;
    }

    async listModels(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.models.list();

      return response.body;
    }

    async retrieveModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.msg.payload.model;
      const response = await openai.models.retrieve(model);

      return response;
    }

    async deleteModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.msg.payload.model;
      const response = await openai.models.del(model);

      return response;
    }

    async createModeration(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.moderations.create(parameters.msg.payload);
      return response;
    }

    async listAssistants(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.assistants.list({
        ...parameters.msg.payload,
      });

      return response.body;
    }

    async createAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.assistants.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async getAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.assistant_id;
      const response = await openai.beta.assistants.retrieve(id);

      return response;
    }

    async modifyAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.assistant_id;
      delete parameters.msg.payload.assistant_id;

      const response = await openai.beta.assistants.update(id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async deleteAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.assistant_id;
      const response = await openai.beta.assistants.del(id);

      return response;
    }

    async createThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.threads.create({
        ...parameters.msg.payload,
      });

      return response;
    }

    async getThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.thread_id;
      const response = await openai.beta.threads.retrieve(id);

      return response;
    }

    async modifyThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.thread_id;
      delete parameters.msg.payload.thread_id;

      const response = await openai.beta.threads.update(id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async deleteThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.thread_id;
      const response = await openai.beta.threads.del(id);

      return response;
    }

    async listMessages(parameters) {
      const openai = new OpenAI(this.clientParams);
      const id = parameters.msg.payload.thread_id;
      const response = await openai.beta.threads.messages.list(id);

      return response.body;
    }

    async createMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      delete parameters.msg.payload.thread_id;

      const response = await openai.beta.threads.messages.create(thread_id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async getMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const message_id = parameters.msg.payload.message_id;

      const response = await openai.beta.threads.messages.retrieve(
        thread_id,
        message_id,
      );

      return response;
    }

    async modifyMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const message_id = parameters.msg.payload.message_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.message_id;

      const response = await openai.beta.threads.messages.update(
        thread_id,
        message_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async createThreadAndRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.threads.createAndRun({
        ...parameters.msg.payload,
      });

      return response;
    }

    async listRuns(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thred_id = parameters.msg.payload.thread_id;
      delete parameters.msg.payload.thread_id;

      const response = await openai.beta.threads.runs.list(thred_id, {
        ...parameters.msg.payload,
      });

      return response.body;
    }

    async createRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      delete parameters.msg.payload.thread_id;

      const response = await openai.beta.threads.runs.create(thread_id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async getRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.run_id;

      const response = await openai.beta.threads.runs.retrieve(
        thread_id,
        run_id,
      );

      return response;
    }

    async modifyRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.run_id;

      const response = await openai.beta.threads.runs.update(
        thread_id,
        run_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async submitToolOuputsToRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.run_id;

      const response = await openai.beta.threads.runs.submitToolOutputs(
        thread_id,
        run_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async cancelRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.run_id;

      const response = await openai.beta.threads.runs.cancel(
        thread_id,
        run_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async listRunSteps(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.run_id;

      const response = await openai.beta.threads.runs.steps.list(
        thread_id,
        run_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response.body;
    }

    async getRunStep(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const run_id = parameters.msg.payload.run_id;
      const step_id = parameters.msg.payload.step_id;

      const response = await openai.beta.threads.runs.steps.retrieve(
        thread_id,
        run_id,
        step_id,
      );

      return response;
    }

    async listAssistantFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const assistant_id = parameters.msg.payload.assistant_id;
      delete parameters.msg.payload.assistant_id;

      const response = await openai.beta.assistants.files.list(assistant_id, {
        ...parameters.msg.payload,
      });

      return response.body;
    }

    async createAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const assistant_id = parameters.msg.payload.assistant_id;
      delete parameters.msg.payload.assistant_id;

      const response = await openai.beta.assistants.files.create(assistant_id, {
        ...parameters.msg.payload,
      });

      return response;
    }

    async getAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const assistant_id = parameters.msg.payload.assistant_id;
      const file_id = parameters.msg.payload.file_id;
      delete parameters.msg.payload.assistant_id;
      delete parameters.msg.payload.file_id;

      const response = await openai.beta.assistants.files.retrieve(
        assistant_id,
        file_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async deleteAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const assistant_id = parameters.msg.payload.assistant_id;
      const file_id = parameters.msg.payload.file_id;
      delete parameters.msg.payload.assistant_id;
      delete parameters.msg.payload.file_id;

      const response = await openai.beta.assistants.files.del(
        assistant_id,
        file_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async listMessageFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const message_id = parameters.msg.payload.message_id;
      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.message_id;

      const response = await openai.beta.threads.messages.files.list(
        thread_id,
        message_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }

    async getMessageFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const thread_id = parameters.msg.payload.thread_id;
      const message_id = parameters.msg.payload.message_id;
      const file_id = parameters.msg.payload.file_id;

      delete parameters.msg.payload.thread_id;
      delete parameters.msg.payload.message_id;
      delete parameters.msg.payload.file_id;

      const response = await openai.beta.threads.messages.files.retrieve(
        thread_id,
        message_id,
        file_id,
        {
          ...parameters.msg.payload,
        },
      );

      return response;
    }
  }

  return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
