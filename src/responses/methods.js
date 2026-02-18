const OpenAI = require("openai").OpenAI;

async function streamResponse(parameters, response) {
  const { _node, msg } = parameters;
  _node.status({
    fill: "green",
    shape: "dot",
    text: "OpenaiApi.status.streaming",
  });
  for await (const chunk of response) {
    if (typeof chunk === "object") {
      const newMsg = { ...msg, payload: chunk };
      _node.send(newMsg);
    }
  }
  _node.status({});
}

async function createModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.create(parameters.payload);

  if (parameters.payload.stream) {
    await streamResponse(parameters, response);
  } else {
    return response;
  }
}

async function getModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.retrieve(response_id, params);

  if (params.stream) {
    await streamResponse(parameters, response);
  } else {
    return response;
  }
}

async function deleteModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.delete(response_id, params);

  return response;
}

async function cancelModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.cancel(response_id, params);

  return response;
}

async function compactModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.compact(parameters.payload);

  return response;
}

async function listInputItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const list = await openai.responses.inputItems.list(response_id, params);

  return [...list.data];
}

async function countInputTokens(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.inputTokens.count(parameters.payload);

  return response;
}

module.exports = {
  createModelResponse,
  getModelResponse,
  deleteModelResponse,
  cancelModelResponse,
  compactModelResponse,
  listInputItems,
  countInputTokens,
};
