const OpenAI = require("openai").OpenAI;

async function createConversation(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.conversations.create(parameters.payload);
  return response;
}

async function getConversation(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, ...params } = parameters.payload;
  const response = await openai.conversations.retrieve(conversation_id, params);
  return response;
}

async function modifyConversation(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, ...body } = parameters.payload;
  const response = await openai.conversations.update(conversation_id, body);
  return response;
}

async function deleteConversation(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, ...params } = parameters.payload;
  const response = await openai.conversations.delete(conversation_id, params);
  return response;
}

async function createConversationItem(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, ...body } = parameters.payload;
  const response = await openai.conversations.items.create(conversation_id, body);
  return response;
}

async function getConversationItem(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, item_id, ...params } = parameters.payload;
  const response = await openai.conversations.items.retrieve(item_id, {
    conversation_id,
    ...params,
  });
  return response;
}

async function listConversationItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, ...params } = parameters.payload;
  const list = await openai.conversations.items.list(conversation_id, params);
  return [...list.data];
}

async function deleteConversationItem(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { conversation_id, item_id, ...params } = parameters.payload;
  const response = await openai.conversations.items.delete(item_id, {
    conversation_id,
    ...params,
  });
  return response;
}

module.exports = {
  createConversation,
  getConversation,
  modifyConversation,
  deleteConversation,
  createConversationItem,
  getConversationItem,
  listConversationItems,
  deleteConversationItem,
};
