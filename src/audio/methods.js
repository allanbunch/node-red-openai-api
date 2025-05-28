const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function createSpeech(parameters) {
  const openai = new OpenAI(this.clientParams);
  const audio = await openai.audio.speech.create(parameters.payload);
  const response = Buffer.from(await audio.arrayBuffer());

  return response;
}

async function createTranscription(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { file, ...params } = parameters.payload;

  params.file = fs.createReadStream(file);

  const response = await openai.audio.transcriptions.create(params);

  return response;
}

async function createTranslation(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { file, ...params } = parameters.payload;

  params.file = fs.createReadStream(file);

  const response = await openai.audio.translations.create(params);

  return response;
}

module.exports = {
  createSpeech,
  createTranscription,
  createTranslation,
};
