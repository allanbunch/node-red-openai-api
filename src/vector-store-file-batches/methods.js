const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function createVectorStoreFileBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.fileBatches.create(
    vector_store_id,
    params
  );

  return response;
}

async function retrieveVectorStoreFileBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, batch_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.fileBatches.retrieve(
    vector_store_id,
    batch_id,
    params
  );

  return response;
}

async function cancelVectorStoreFileBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, batch_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.fileBatches.retrieve(
    vector_store_id,
    batch_id,
    params
  );

  return response;
}

async function listVectorStoreBatchFiles(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, batch_id, ...params } = parameters.payload;
  const list = await openai.vectorStores.fileBatches.listFiles(
    vector_store_id,
    batch_id,
    params
  );
  const batchFiles = [...list.data];

  return batchFiles;
}

async function uploadAndPollVectorStoreFileBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, files, file_ids, ...params } = parameters.payload;

  if (!files || !Array.isArray(files)) {
    throw new Error("Files is not defined or not an array");
  }

  // Validate file paths
  files.forEach((path) => {
    if (!fs.existsSync(path)) {
      throw new Error(`File does not exist: ${path}`);
    }
  });

  const fileStreams = files.map((path) => fs.createReadStream(path));

  const response = await openai.vectorStores.fileBatches.uploadAndPoll(
    vector_store_id,
    { files: fileStreams, fileIds: file_ids },
    params
  );

  return response;
}

module.exports = {
  createVectorStoreFileBatch,
  retrieveVectorStoreFileBatch,
  cancelVectorStoreFileBatch,
  listVectorStoreBatchFiles,
  uploadAndPollVectorStoreFileBatch,
};
