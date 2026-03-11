const OpenAI = require("openai").OpenAI;

async function createChatKitSession(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.beta.chatkit.sessions.create(parameters.payload);

  return response;
}

async function cancelChatKitSession(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { session_id, ...params } = parameters.payload;
  const response = await openai.beta.chatkit.sessions.cancel(session_id, params);

  return response;
}

async function getChatKitThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.chatkit.threads.retrieve(thread_id, params);

  return response;
}

async function listChatKitThreads(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.beta.chatkit.threads.list(parameters.payload);

  return [...list.data];
}

async function deleteChatKitThread(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const response = await openai.beta.chatkit.threads.delete(thread_id, params);

  return response;
}

async function listChatKitThreadItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const list = await openai.beta.chatkit.threads.listItems(thread_id, params);

  return [...list.data];
}

module.exports = {
  createChatKitSession,
  cancelChatKitSession,
  getChatKitThread,
  listChatKitThreads,
  deleteChatKitThread,
  listChatKitThreadItems,
};
