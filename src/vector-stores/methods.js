const OpenAI = require("openai").OpenAI;

async function createVectorStore(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.vectorStores.create(parameters.payload);

  return response;
}

async function listVectorStores(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.vectorStores.list(parameters.payload);
  const vectorStores = [...list.data];

  return vectorStores;
}

async function retrieveVectorStore(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.retrieve(vector_store_id, params);

  return response;
}

async function modifyVectorStore(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.update(vector_store_id, params);

  return response;
}

async function deleteVectorStore(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.del(vector_store_id, params);

  return response;
}

module.exports = {
  createVectorStore,
  listVectorStores,
  retrieveVectorStore,
  modifyVectorStore,
  deleteVectorStore,
};
