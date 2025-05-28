const OpenAI = require("openai").OpenAI;

async function createModeration(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.moderations.create(parameters.payload);
  return response;
}

module.exports = {
  createModeration,
};
