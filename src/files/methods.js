const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function listFiles(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.files.list(parameters.payload);

  return [...list.data];
}

async function createFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { file, ...params } = parameters.payload;

  params.file = fs.createReadStream(file);

  const response = await openai.files.create(params);

  return response;
}

async function deleteFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { file_id, ...params } = parameters.payload;
  const response = await openai.files.del(file_id, params);

  return response;
}

async function retrieveFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { file_id, ...params } = parameters.payload;
  const response = await openai.files.retrieve(file_id, params);

  return response;
}

async function downloadFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { file_id, ...params } = parameters.payload;
  const response = await openai.files.content(file_id, params);

  return response;
}

module.exports = {
  listFiles,
  createFile,
  deleteFile,
  retrieveFile,
  downloadFile,
};
