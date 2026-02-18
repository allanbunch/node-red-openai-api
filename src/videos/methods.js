const OpenAI = require("openai").OpenAI;

async function createVideo(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.videos.create(parameters.payload);
  return response;
}

async function getVideo(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { video_id, ...params } = parameters.payload;
  const response = await openai.videos.retrieve(video_id, params);
  return response;
}

async function listVideos(parameters) {
  const openai = new OpenAI(this.clientParams);
  const list = await openai.videos.list(parameters.payload);
  return [...list.data];
}

async function deleteVideo(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { video_id, ...params } = parameters.payload;
  const response = await openai.videos.delete(video_id, params);
  return response;
}

async function downloadVideoContent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { video_id, ...params } = parameters.payload;
  const response = await openai.videos.downloadContent(video_id, params);
  return response;
}

async function remixVideo(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { video_id, ...body } = parameters.payload;
  const response = await openai.videos.remix(video_id, body);
  return response;
}

module.exports = {
  createVideo,
  getVideo,
  listVideos,
  deleteVideo,
  downloadVideoContent,
  remixVideo,
};
