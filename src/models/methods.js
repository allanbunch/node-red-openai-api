const OpenAI = require("openai").OpenAI;

async function listModels(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.models.list(parameters.payload);

  return [...list.data];
}

async function retrieveModel(parameters) {
  const openai = new OpenAI(this.clientParams);
  const model = parameters.payload.model;
  const response = await openai.models.retrieve(model);

  return response;
}

async function deleteModel(parameters) {
  const openai = new OpenAI(this.clientParams);
  const model = parameters.payload.model;
  const response = await openai.models.del(model);

  return response;
}

module.exports = {
  listModels,
  retrieveModel,
  deleteModel,
};
