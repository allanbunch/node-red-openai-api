const OpenAI = require("openai").OpenAI;

async function createVectorStoreFile(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, ...params } = parameters.payload;
  const response = await openai.vectorStores.files.create(
    vector_store_id,
    params
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
  const { vector_store_id, file_id } = parameters.payload;
  const response = openai.vectorStores.files.retrieve(vector_store_id, file_id);

  return response;
}

async function deleteVectorStoreFile(parameters) {
  /* Removes a file from the vector store. */

  const openai = new OpenAI(this.clientParams);
  const { vector_store_id, file_id, ...params } = parameters.payload;
  const response = openai.vectorStores.files.del(
    vector_store_id,
    file_id,
    params
  );

  return response;
}

module.exports = {
  createVectorStoreFile,
  listVectorStoreFiles,
  retrieveVectorStoreFile,
  deleteVectorStoreFile,
};
