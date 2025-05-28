const OpenAI = require("openai").OpenAI;
const fs = require("fs");

async function createImage(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.images.generate(parameters.payload);

  return response.data;
}

async function createImageEdit(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { image, mask, ...params } = parameters.payload;

  params.image = fs.createReadStream(image);
  if (mask) {
    params.mask = fs.createReadStream(mask);
  }
  const response = await openai.images.edit(params);

  return response.data;
}

async function createImageVariation(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { image, ...params } = parameters.payload;

  params.image = fs.createReadStream(image);
  const response = await openai.images.createVariation(params);

  return response.data;
}

module.exports = {
  createImage,
  createImageEdit,
  createImageVariation,
};
