const OpenAI = require("openai").OpenAI;

async function createFineTuningJob(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.fineTuning.jobs.create(parameters.payload);

  return response;
}

async function listPaginatedFineTuningJobs(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.fineTuning.jobs.list(parameters.payload);

  return [...list.data];
}

async function retrieveFineTuningJob(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { fine_tuning_job_id, ...params } = parameters.payload;
  const response = await openai.fineTuning.jobs.retrieve(
    fine_tuning_job_id,
    params
  );

  return response;
}

async function listFineTuningEvents(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { fine_tuning_job_id, ...params } = parameters.payload;
  const list = await openai.fineTuning.jobs.listEvents(
    fine_tuning_job_id,
    params
  );

  return [...list.data];
}

async function listFineTuningCheckpoints(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { fine_tuning_job_id, ...params } = parameters.payload;
  const list = await openai.fineTuning.jobs.checkpoints.list(
    fine_tuning_job_id,
    params
  );

  return [...list.data];
}

async function cancelFineTuningJob(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { fine_tuning_job_id, ...params } = parameters.payload;
  const response = await openai.fineTuning.jobs.cancel(
    fine_tuning_job_id,
    params
  );

  return response;
}

module.exports = {
  createFineTuningJob,
  listPaginatedFineTuningJobs,
  retrieveFineTuningJob,
  listFineTuningEvents,
  listFineTuningCheckpoints,
  cancelFineTuningJob,
};
