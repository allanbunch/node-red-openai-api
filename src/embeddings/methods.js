const OpenAI = require("openai").OpenAI;

async function createEmbedding(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.embeddings.create(parameters.payload);

  return response.data;
}

module.exports = {
  createEmbedding,
};
