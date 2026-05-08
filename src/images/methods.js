const OpenAI = require("openai").OpenAI;
const fs = require("fs");

function createReadStreamFromPath(path) {
  return fs.createReadStream(path);
}

function createImageInput(image) {
  if (Array.isArray(image)) {
    return image.map(createReadStreamFromPath);
  }

  return createReadStreamFromPath(image);
}

async function streamImageEvents(parameters, response) {
  const { _node, msg } = parameters;

  _node.status({
    fill: "green",
    shape: "dot",
    text: "OpenaiApi.status.streaming",
  });

  for await (const event of response) {
    if (typeof event === "object") {
      _node.send({ ...msg, payload: event });
    }
  }

  _node.status({});
}

async function createImage(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.images.generate(parameters.payload);

  if (parameters.payload.stream) {
    await streamImageEvents(parameters, response);
  } else {
    return response.data;
  }
}

async function createImageEdit(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { image, mask, ...params } = parameters.payload;

  params.image = createImageInput(image);
  if (mask) {
    params.mask = createReadStreamFromPath(mask);
  }
  const response = await openai.images.edit(params);

  if (parameters.payload.stream) {
    await streamImageEvents(parameters, response);
  } else {
    return response.data;
  }
}

async function createImageVariation(parameters) {
  const openai = new OpenAI(this.clientParams);
  let { image, ...params } = parameters.payload;

  params.image = createReadStreamFromPath(image);
  const response = await openai.images.createVariation(params);

  return response.data;
}

module.exports = {
  createImage,
  createImageEdit,
  createImageVariation,
};
