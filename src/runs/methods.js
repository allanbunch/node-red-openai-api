const OpenAI = require("openai").OpenAI;

async function createThreadAndRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { _node, ...params } = parameters;
  const response = await openai.beta.threads.createAndRun(params.payload);

  if (params.payload.stream) {
    _node.status({
      fill: "green",
      shape: "dot",
      text: "OpenaiApi.status.streaming",
    });
    for await (const chunk of response) {
      if (typeof chunk === "object") {
        const newMsg = { ...parameters.msg, payload: chunk.data };
        _node.send(newMsg);
      }
    }
    _node.status({});
  } else {
    return response;
  }
}

async function listRuns(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, ...params } = parameters.payload;
  const list = await openai.beta.threads.runs.list(thread_id, params);

  return [...list.data];
}

async function createRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { _node, ..._params } = parameters;
  const { thread_id, ...params } = _params.payload;
  const response = await openai.beta.threads.runs.create(thread_id, params);

  if (params.stream) {
    _node.status({
      fill: "green",
      shape: "dot",
      text: "OpenaiApi.status.streaming",
    });
    for await (const chunk of response) {
      if (typeof chunk === "object") {
        const newMsg = { ...parameters.msg, payload: chunk.data };
        _node.send(newMsg);
      }
    }
    _node.status({});
  } else {
    return response;
  }
}

async function getRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, run_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.runs.retrieve(
    thread_id,
    run_id,
    params
  );

  return response;
}

async function modifyRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, run_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.runs.update(
    thread_id,
    run_id,
    params
  );

  return response;
}

async function submitToolOutputsToRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { _node, ..._params } = parameters;
  const { thread_id, run_id, ...params } = _params.payload;
  const response = await openai.beta.threads.runs.submitToolOutputs(
    thread_id,
    run_id,
    params
  );

  if (params.stream) {
    _node.status({
      fill: "green",
      shape: "dot",
      text: "OpenaiApi.status.streaming",
    });
    for await (const chunk of response) {
      if (typeof chunk === "object") {
        const newMsg = { ...parameters.msg, payload: chunk.data };
        _node.send(newMsg);
      }
    }
    _node.status({});
  } else {
    return response;
  }
}

async function cancelRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, run_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.runs.cancel(
    thread_id,
    run_id,
    params
  );

  return response;
}

async function listRunSteps(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, run_id, ...params } = parameters.payload;
  const list = await openai.beta.threads.runs.steps.list(
    thread_id,
    run_id,
    params
  );

  return [...list.data];
}

async function getRunStep(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { thread_id, run_id, step_id, ...params } = parameters.payload;
  const response = await openai.beta.threads.runs.steps.retrieve(
    thread_id,
    run_id,
    step_id,
    params
  );

  return response;
}

module.exports = {
  createThreadAndRun,
  listRuns,
  createRun,
  getRun,
  modifyRun,
  submitToolOutputsToRun,
  cancelRun,
  listRunSteps,
  getRunStep,
};
