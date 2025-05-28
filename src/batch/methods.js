const OpenAI = require("openai").OpenAI;

async function createBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.batches.create(parameters.payload);

  return response;
}

async function retrieveBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { batch_id, ...params } = parameters.payload;
  const response = await openai.batches.retrieve(batch_id, params);

  return response;
}

async function listBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.batches.list(parameters.payload);
  const batches = [...list.data];

  return batches;
}

async function cancelBatch(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { batch_id, ...params } = parameters.payload;
  const response = await openai.batches.cancel(batch_id, params);

  return response;
}

module.exports = {
  createBatch,
  retrieveBatch,
  listBatch,
  cancelBatch,
};
