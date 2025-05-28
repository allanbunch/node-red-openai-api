const OpenAI = require("openai").OpenAI;

async function createModelResponse(parameters) {
  const { _node, ...params } = parameters;
  const openai = new OpenAI(this.clientParams);
  const response = await openai.responses.create(parameters.payload);

  if (params.payload.stream) {
    _node.status({
      fill: "green",
      shape: "dot",
      text: "OpenaiApi.status.streaming",
    });
    for await (const chunk of response) {
      if (typeof chunk === "object") {
        const newMsg = { ...parameters.msg, payload: chunk };
        _node.send(newMsg);
      }
    }
    _node.status({});
  } else {
    return response;
  }
}

async function getModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.retrieve(response_id, params);

  return response;
}

async function deleteModelResponse(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const response = await openai.responses.del(response_id, params);

  return response;
}

async function listInputItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { response_id, ...params } = parameters.payload;
  const list = await openai.responses.inputItems.list(response_id, params);

  return [...list.data];
}

module.exports = {
  createModelResponse,
  getModelResponse,
  deleteModelResponse,
  listInputItems,
};
