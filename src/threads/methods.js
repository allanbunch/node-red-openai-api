const OpenAI = require("openai").OpenAI;

async function createThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.beta.threads.create(parameters.payload);

  return response;
}

async function getThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.retrieve(thread_id, params);

  return response;
}

async function modifyThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.update(thread_id, params);

  return response;
}

async function deleteThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.del(thread_id, params);

  return response;
}

module.exports = {
  createThread,
  getThread,
  modifyThread,
  deleteThread,
};
