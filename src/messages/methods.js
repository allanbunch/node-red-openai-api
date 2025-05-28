const OpenAI = require("openai").OpenAI;

async function listMessages(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const list = await openai.beta.threads.messages.list(thread_id, params);

  return [...list.data];
}

async function createMessage(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.messages.create(thread_id, params);

  return response;
}

async function getMessage(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, message_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.messages.retrieve(
    thread_id,
    message_id,
    params
  );

  return response;
}

async function modifyMessage(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, message_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.messages.update(
    thread_id,
    message_id,
    params
  );

  return response;
}

module.exports = {
  listMessages,
  createMessage,
  getMessage,
  modifyMessage,
};
