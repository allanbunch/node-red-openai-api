const OpenAI = require("openai").OpenAI;

async function listAssistants(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.beta.assistants.list(parameters.payload);

  return [...list.data];
}

async function createAssistant(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.beta.assistants.create(parameters.payload);

  return response;
}

async function getAssistant(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { assistant_id, ...params } = parameters.payload;
  const response = await openai.beta.assistants.retrieve(assistant_id, params);

  return response;
}

async function modifyAssistant(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { assistant_id, ...params } = parameters.payload;
  const response = await openai.beta.assistants.update(assistant_id, params);

  return response;
}

async function deleteAssistant(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { assistant_id, ...params } = parameters.payload;
  const response = await openai.beta.assistants.del(assistant_id, params);

  return response;
}

module.exports = {
  listAssistants,
  createAssistant,
  getAssistant,
  modifyAssistant,
  deleteAssistant,
};
