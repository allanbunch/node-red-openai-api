const OpenAI = require("openai").OpenAI;

async function listContainers(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.containers.list(parameters.payload);
  return [...list.data];
}

async function createContainer(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.containers.create(parameters.payload);
  return response;
}

async function retrieveContainer(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, ...params } = parameters.payload;
  const response = await openai.containers.retrieve(container_id, params);
  return response;
}

async function deleteContainer(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, ...params } = parameters.payload;
  const response = await openai.containers.del(container_id, params);
  return response;
}

module.exports = {
  createContainer,
  listContainers,
  retrieveContainer,
  deleteContainer,
};
