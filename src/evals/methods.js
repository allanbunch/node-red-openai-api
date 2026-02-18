const OpenAI = require("openai").OpenAI;

async function createEval(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.evals.create(parameters.payload);
  return response;
}

async function getEval(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, ...params } = parameters.payload;
  const response = await openai.evals.retrieve(eval_id, params);
  return response;
}

async function modifyEval(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, ...body } = parameters.payload;
  const response = await openai.evals.update(eval_id, body);
  return response;
}

async function deleteEval(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, ...params } = parameters.payload;
  const response = await openai.evals.delete(eval_id, params);
  return response;
}

async function listEvals(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.evals.list(parameters.payload);
  return [...list.data];
}

async function createEvalRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, ...body } = parameters.payload;
  const response = await openai.evals.runs.create(eval_id, body);
  return response;
}

async function getEvalRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, run_id, ...params } = parameters.payload;
  const response = await openai.evals.runs.retrieve(run_id, {
    eval_id,
    ...params,
  });
  return response;
}

async function listEvalRuns(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, ...params } = parameters.payload;
  const list = await openai.evals.runs.list(eval_id, params);
  return [...list.data];
}

async function deleteEvalRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, run_id, ...params } = parameters.payload;
  const response = await openai.evals.runs.delete(run_id, {
    eval_id,
    ...params,
  });
  return response;
}

async function cancelEvalRun(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, run_id, ...params } = parameters.payload;
  const response = await openai.evals.runs.cancel(run_id, {
    eval_id,
    ...params,
  });
  return response;
}

async function getEvalRunOutputItem(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, run_id, output_item_id, ...params } = parameters.payload;
  const response = await openai.evals.runs.outputItems.retrieve(output_item_id, {
    eval_id,
    run_id,
    ...params,
  });
  return response;
}

async function listEvalRunOutputItems(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { eval_id, run_id, ...params } = parameters.payload;
  const list = await openai.evals.runs.outputItems.list(run_id, {
    eval_id,
    ...params,
  });
  return [...list.data];
}

module.exports = {
  createEval,
  getEval,
  modifyEval,
  deleteEval,
  listEvals,
  createEvalRun,
  getEvalRun,
  listEvalRuns,
  deleteEvalRun,
  cancelEvalRun,
  getEvalRunOutputItem,
  listEvalRunOutputItems,
};
