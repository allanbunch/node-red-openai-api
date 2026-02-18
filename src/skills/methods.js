const OpenAI = require("openai").OpenAI;

async function createSkill(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.skills.create(parameters.payload);
  return response;
}

async function getSkill(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...params } = parameters.payload;
  const response = await openai.skills.retrieve(skill_id, params);
  return response;
}

async function modifySkill(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...body } = parameters.payload;
  const response = await openai.skills.update(skill_id, body);
  return response;
}

async function deleteSkill(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...params } = parameters.payload;
  const response = await openai.skills.delete(skill_id, params);
  return response;
}

async function listSkills(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.skills.list(parameters.payload);
  return [...list.data];
}

async function getSkillContent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...params } = parameters.payload;
  const response = await openai.skills.content.retrieve(skill_id, params);
  return response;
}

async function createSkillVersion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...body } = parameters.payload;
  const response = await openai.skills.versions.create(skill_id, body);
  return response;
}

async function getSkillVersion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, version, ...params } = parameters.payload;
  const response = await openai.skills.versions.retrieve(version, {
    skill_id,
    ...params,
  });
  return response;
}

async function listSkillVersions(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, ...params } = parameters.payload;
  const list = await openai.skills.versions.list(skill_id, params);
  return [...list.data];
}

async function deleteSkillVersion(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, version, ...params } = parameters.payload;
  const response = await openai.skills.versions.delete(version, {
    skill_id,
    ...params,
  });
  return response;
}

async function getSkillVersionContent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { skill_id, version, ...params } = parameters.payload;
  const response = await openai.skills.versions.content.retrieve(version, {
    skill_id,
    ...params,
  });
  return response;
}

module.exports = {
  createSkill,
  getSkill,
  modifySkill,
  deleteSkill,
  listSkills,
  getSkillContent,
  createSkillVersion,
  getSkillVersion,
  listSkillVersions,
  deleteSkillVersion,
  getSkillVersionContent,
};
