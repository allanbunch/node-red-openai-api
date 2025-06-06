"use strict";

const assistants = require("./assistants/methods.js");
const audio = require("./audio/methods.js");
const batch = require("./batch/methods.js");
const chat = require("./chat/methods.js");
const container_files = require("./container-files/methods.js");
const containers = require("./containers/methods.js");
const embeddings = require("./embeddings/methods.js");
const files = require("./files/methods.js");
const fine_tuning = require("./fine-tuning/methods.js");
const images = require("./images/methods.js");
const messages = require("./messages/methods.js");
const models = require("./models/methods.js");
const moderations = require("./moderations/methods.js");
const responses = require("./responses/methods.js");
const runs = require("./runs/methods.js");
const threads = require("./threads/methods.js");
const uploads = require("./uploads/methods.js");
const vectorStoreFileBatches = require("./vector-store-file-batches/methods.js");
const vectorStoreFiles = require("./vector-store-files/methods.js");
const vectorStores = require("./vector-stores/methods.js");

class OpenaiApi {
  constructor(apiKey, baseURL, organization) {
    this.clientParams = {
      apiKey,
      baseURL,
      organization,
    };
  }
}

// Attach all exported methods as instance methods
Object.assign(
  OpenaiApi.prototype,
  assistants,
  audio,
  batch,
  chat,
  container_files,
  containers,
  embeddings,
  files,
  fine_tuning,
  images,
  messages,
  models,
  moderations,
  responses,
  runs,
  threads,
  uploads,
  vectorStoreFileBatches,
  vectorStoreFiles,
  vectorStores
);

// Export the class
module.exports = OpenaiApi;
