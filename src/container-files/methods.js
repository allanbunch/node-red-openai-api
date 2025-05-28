const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function listContainerFiles(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, ...params } = parameters.payload;
  const list = await openai.containers.files.list(container_id, params);
  return [...list.data];
}

async function addContainerFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { container_id, file, ...params } = parameters.payload;
  if (file) {
    params.file = fs.createReadStream(file);
  }
  const response = await openai.containers.files.create(container_id, params);
  return response;
}

async function retrieveContainerFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, file_id, ...params } = parameters.payload;
  const response = await openai.containers.files.retrieve(
    container_id,
    file_id,
    params
  );
  return response;
}

async function deleteContainerFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, file_id, ...params } = parameters.payload;
  const response = await openai.containers.files.del(
    container_id,
    file_id,
    params
  );
  return response;
}

async function downloadContainerFileContent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { container_id, file_id, ...params } = parameters.payload;
  const response = await openai.containers.files.content.retrieve(
    container_id,
    file_id,
    params
  );
  return response;
}

module.exports = {
  listContainerFiles,
  addContainerFile,
  retrieveContainerFile,
  deleteContainerFile,
  downloadContainerFileContent,
};
