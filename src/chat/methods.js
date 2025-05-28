const OpenAI = require("openai").OpenAI;

async function createChatCompletion(parameters) {
  const { _node, ...params } = parameters;
  const openai = new OpenAI(this.clientParams);
  const response = await openai.chat.completions.create(params.payload);

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

async function getChatCompletion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { completion_id, ...options } = parameters.payload;

  const response = await openai.chat.completions.retrieve(
    completion_id,
    options
  );

  return response;
}

async function getChatMessages(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { completion_id, ...options } = parameters.payload;

  const response = await openai.chat.completions.messages.list(
    completion_id,
    options
  );

  return response.data;
}

async function listChatCompletions(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.chat.completions.list(parameters.payload);

  return response.data;
}

async function updateChatCompletion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { completion_id, ...body } = parameters.payload;

  const response = await openai.chat.completions.update(completion_id, body);

  return response;
}

async function deleteChatCompletion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { completion_id, ...options } = parameters.payload;

  const response = await openai.chat.completions.del(completion_id, options);

  return response;
}

module.exports = {
  createChatCompletion,
  getChatCompletion,
  getChatMessages,
  listChatCompletions,
  updateChatCompletion,
  deleteChatCompletion,
};
