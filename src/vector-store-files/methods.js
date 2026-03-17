const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function createVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.files.create(
    vector_store_id,
    params
  );

  return response;
}

async function createAndPollVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, pollIntervalMs, ...body } = parameters.payload;
  const response = await openai.vectorStores.files.createAndPoll(
    vector_store_id,
    body,
    { pollIntervalMs }
  );

  return response;
}

async function uploadVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file, ...params } = parameters.payload;
  const response = await openai.vectorStores.files.upload(
    vector_store_id,
    fs.createReadStream(file),
    params
  );

  return response;
}

async function uploadAndPollVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file, pollIntervalMs } = parameters.payload;
  const response = await openai.vectorStores.files.uploadAndPoll(
    vector_store_id,
    fs.createReadStream(file),
    { pollIntervalMs }
  );

  return response;
}

async function pollVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, pollIntervalMs } = parameters.payload;
  const response = await openai.vectorStores.files.poll(
    vector_store_id,
    file_id,
    { pollIntervalMs }
  );

  return response;
}

async function listVectorStoreFiles(parameters) {
  /* Returns a list of vector store files. */

  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const list = await openai.vectorStores.files.list(vector_store_id, params);

  return [...list.data];
}

async function retrieveVectorStoreFile(parameters) {
  /* Retrieves a vector store file. */

  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.files.retrieve(file_id, {
    vector_store_id,
    ...params,
  });

  return response;
}

async function modifyVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, ...body } = parameters.payload;
  const response = await openai.vectorStores.files.update(file_id, {
    vector_store_id,
    ...body,
  });

  return response;
}

async function getVectorStoreFileContent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, ...params } = parameters.payload;
  const list = await openai.vectorStores.files.content(file_id, {
    vector_store_id,
    ...params,
  });

  return [...list.data];
}

async function deleteVectorStoreFile(parameters) {
  /* Removes a file from the vector store. */

  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.files.del(file_id, {
    vector_store_id,
    ...params,
  });

  return response;
}

module.exports = {
  createVectorStoreFile,
  createAndPollVectorStoreFile,
  uploadVectorStoreFile,
  uploadAndPollVectorStoreFile,
  pollVectorStoreFile,
  listVectorStoreFiles,
  retrieveVectorStoreFile,
  modifyVectorStoreFile,
  getVectorStoreFileContent,
  deleteVectorStoreFile,
};
