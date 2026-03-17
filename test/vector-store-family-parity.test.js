"use strict";

// This file keeps the wider Vector Store family contract honest.
// It checks the remaining Vector Store Files and File Batch surfaces against the current SDK so the picker, wrappers, and docs stay aligned together.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

function withMockedOpenAI(FakeOpenAI, callback) {
  const openaiModule = require("openai");
  const originalDescriptor = Object.getOwnPropertyDescriptor(openaiModule, "OpenAI");

  Object.defineProperty(openaiModule, "OpenAI", {
    value: FakeOpenAI,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  const run = async () => {
    try {
      return await callback();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(openaiModule, "OpenAI", originalDescriptor);
      }
    }
  };

  return run();
}

function withMockedCreateReadStream(callback) {
  const originalCreateReadStream = fs.createReadStream;
  fs.createReadStream = (filePath) => ({
    path: filePath,
    destroy() {},
  });

  const run = async () => {
    try {
      return await callback();
    } finally {
      fs.createReadStream = originalCreateReadStream;
    }
  };

  return run();
}

const locale = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "locales", "en-US", "node.json"), "utf8")
);
const vectorStoreFilesHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "vector-store-files", "help.html"),
  "utf8"
);
const vectorStoreFileBatchesHelp = fs.readFileSync(
  path.join(__dirname, "..", "src", "vector-store-file-batches", "help.html"),
  "utf8"
);

test("vector store file methods map to the current OpenAI SDK surface", async () => {
  const calls = [];
  const tempFilePath = path.join(
    os.tmpdir(),
    `node-red-openai-api-vector-store-${process.pid}.txt`
  );
  fs.writeFileSync(tempFilePath, "vector store helper upload");

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.vectorStores = {
        files: {
          create: async (vectorStoreId, body) => {
            calls.push({ method: "vectorStores.files.create", vectorStoreId, body });
            return { id: "vsf_create", vector_store_id: vectorStoreId };
          },
          createAndPoll: async (vectorStoreId, body, options) => {
            calls.push({
              method: "vectorStores.files.createAndPoll",
              vectorStoreId,
              body,
              options,
            });
            return { id: "vsf_create_poll", status: "completed" };
          },
          upload: async (vectorStoreId, file, options) => {
            calls.push({
              method: "vectorStores.files.upload",
              vectorStoreId,
              filePath: file.path,
              options,
            });
            file.destroy();
            return { id: "vsf_upload", vector_store_id: vectorStoreId };
          },
          uploadAndPoll: async (vectorStoreId, file, options) => {
            calls.push({
              method: "vectorStores.files.uploadAndPoll",
              vectorStoreId,
              filePath: file.path,
              options,
            });
            file.destroy();
            return { id: "vsf_upload_poll", status: "completed" };
          },
          poll: async (vectorStoreId, fileId, options) => {
            calls.push({
              method: "vectorStores.files.poll",
              vectorStoreId,
              fileId,
              options,
            });
            return { id: fileId, status: "completed" };
          },
          retrieve: async (fileId, params) => {
            calls.push({ method: "vectorStores.files.retrieve", fileId, params });
            return { id: fileId, vector_store_id: params.vector_store_id };
          },
          update: async (fileId, body) => {
            calls.push({ method: "vectorStores.files.update", fileId, body });
            return { id: fileId, attributes: body.attributes };
          },
          content: async (fileId, params) => {
            calls.push({ method: "vectorStores.files.content", fileId, params });
            return {
              data: [
                { type: "text", text: "first chunk" },
                { type: "text", text: "second chunk" },
              ],
            };
          },
          del: async (fileId, params) => {
            calls.push({ method: "vectorStores.files.del", fileId, params });
            return { id: fileId, deleted: true };
          },
        },
      };
    }
  }

  try {
    await withMockedCreateReadStream(async () => {
      await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/vector-store-files/methods.js");
        delete require.cache[modulePath];
        const vectorStoreFileMethods = require("../src/vector-store-files/methods.js");

        const clientContext = {
          clientParams: {
            apiKey: "sk-test",
            baseURL: "https://api.example.com/v1",
          },
        };

        await vectorStoreFileMethods.createVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
            attributes: { team: "platform" },
            chunking_strategy: { type: "auto" },
          },
        });

        await vectorStoreFileMethods.createAndPollVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
            attributes: { team: "platform" },
            pollIntervalMs: 250,
          },
        });

        await vectorStoreFileMethods.uploadVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file: tempFilePath,
          },
        });

        await vectorStoreFileMethods.uploadAndPollVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file: tempFilePath,
            pollIntervalMs: 500,
          },
        });

        await vectorStoreFileMethods.pollVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
            pollIntervalMs: 750,
          },
        });

        await vectorStoreFileMethods.retrieveVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
          },
        });

        await vectorStoreFileMethods.modifyVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
            attributes: { team: "integrations", priority: 1 },
          },
        });

        const content = await vectorStoreFileMethods.getVectorStoreFileContent.call(
          clientContext,
          {
            payload: {
              vector_store_id: "vs_123",
              file_id: "file_123",
            },
          }
        );
        assert.deepEqual(content, [
          { type: "text", text: "first chunk" },
          { type: "text", text: "second chunk" },
        ]);

        await vectorStoreFileMethods.deleteVectorStoreFile.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_id: "file_123",
          },
        });

        delete require.cache[modulePath];
      });
    });
  } finally {
    fs.rmSync(tempFilePath, { force: true });
  }

  assert.deepEqual(
    calls.filter((entry) => entry.method !== "ctor"),
    [
      {
        method: "vectorStores.files.create",
        vectorStoreId: "vs_123",
        body: {
          file_id: "file_123",
          attributes: { team: "platform" },
          chunking_strategy: { type: "auto" },
        },
      },
      {
        method: "vectorStores.files.createAndPoll",
        vectorStoreId: "vs_123",
        body: {
          file_id: "file_123",
          attributes: { team: "platform" },
        },
        options: { pollIntervalMs: 250 },
      },
      {
        method: "vectorStores.files.upload",
        vectorStoreId: "vs_123",
        filePath: tempFilePath,
        options: {},
      },
      {
        method: "vectorStores.files.uploadAndPoll",
        vectorStoreId: "vs_123",
        filePath: tempFilePath,
        options: { pollIntervalMs: 500 },
      },
      {
        method: "vectorStores.files.poll",
        vectorStoreId: "vs_123",
        fileId: "file_123",
        options: { pollIntervalMs: 750 },
      },
      {
        method: "vectorStores.files.retrieve",
        fileId: "file_123",
        params: {
          vector_store_id: "vs_123",
        },
      },
      {
        method: "vectorStores.files.update",
        fileId: "file_123",
        body: {
          vector_store_id: "vs_123",
          attributes: { team: "integrations", priority: 1 },
        },
      },
      {
        method: "vectorStores.files.content",
        fileId: "file_123",
        params: {
          vector_store_id: "vs_123",
        },
      },
      {
        method: "vectorStores.files.del",
        fileId: "file_123",
        params: {
          vector_store_id: "vs_123",
        },
      },
    ]
  );
});

test("vector store file batch helpers map to the current OpenAI SDK surface", async () => {
  const calls = [];
  const firstTempFilePath = path.join(
    os.tmpdir(),
    `node-red-openai-api-vector-batch-1-${process.pid}.txt`
  );
  const secondTempFilePath = path.join(
    os.tmpdir(),
    `node-red-openai-api-vector-batch-2-${process.pid}.txt`
  );
  fs.writeFileSync(firstTempFilePath, "vector store batch helper upload one");
  fs.writeFileSync(secondTempFilePath, "vector store batch helper upload two");

  class FakeOpenAI {
    constructor(clientParams) {
      calls.push({ method: "ctor", clientParams });
      this.vectorStores = {
        fileBatches: {
          create: async (vectorStoreId, body) => {
            calls.push({ method: "vectorStores.fileBatches.create", vectorStoreId, body });
            return { id: "vsfb_create", vector_store_id: vectorStoreId };
          },
          createAndPoll: async (vectorStoreId, body, options) => {
            calls.push({
              method: "vectorStores.fileBatches.createAndPoll",
              vectorStoreId,
              body,
              options,
            });
            return { id: "vsfb_create_poll", status: "completed" };
          },
          retrieve: async (batchId, params) => {
            calls.push({
              method: "vectorStores.fileBatches.retrieve",
              batchId,
              params,
            });
            return { id: batchId, vector_store_id: params.vector_store_id };
          },
          poll: async (vectorStoreId, batchId, options) => {
            calls.push({
              method: "vectorStores.fileBatches.poll",
              vectorStoreId,
              batchId,
              options,
            });
            return { id: batchId, status: "completed" };
          },
          cancel: async (batchId, params) => {
            calls.push({
              method: "vectorStores.fileBatches.cancel",
              batchId,
              params,
            });
            return { id: batchId, status: "cancelled" };
          },
          listFiles: async (batchId, params) => {
            calls.push({
              method: "vectorStores.fileBatches.listFiles",
              batchId,
              params,
            });
            return {
              data: [{ id: "vsf_1" }, { id: "vsf_2" }],
            };
          },
          uploadAndPoll: async (vectorStoreId, payload, options) => {
            calls.push({
              method: "vectorStores.fileBatches.uploadAndPoll",
              vectorStoreId,
              filePaths: payload.files.map((file) => file.path),
              fileIds: payload.fileIds,
              options,
            });
            payload.files.forEach((file) => file.destroy());
            return { id: "vsfb_upload_poll", status: "completed" };
          },
        },
      };
    }
  }

  try {
    await withMockedCreateReadStream(async () => {
      await withMockedOpenAI(FakeOpenAI, async () => {
        const modulePath = require.resolve("../src/vector-store-file-batches/methods.js");
        delete require.cache[modulePath];
        const vectorStoreFileBatchMethods = require("../src/vector-store-file-batches/methods.js");

        const clientContext = {
          clientParams: {
            apiKey: "sk-test",
            baseURL: "https://api.example.com/v1",
          },
        };

        await vectorStoreFileBatchMethods.createVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            files: [
              {
                file_id: "file_1",
                attributes: { category: "release" },
              },
            ],
          },
        });

        await vectorStoreFileBatchMethods.createAndPollVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            file_ids: ["file_1", "file_2"],
            attributes: { category: "release" },
            pollIntervalMs: 200,
          },
        });

        await vectorStoreFileBatchMethods.retrieveVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            batch_id: "vsfb_123",
          },
        });

        await vectorStoreFileBatchMethods.pollVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            batch_id: "vsfb_123",
            pollIntervalMs: 400,
          },
        });

        await vectorStoreFileBatchMethods.cancelVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            batch_id: "vsfb_123",
          },
        });

        const listedFiles = await vectorStoreFileBatchMethods.listVectorStoreBatchFiles.call(
          clientContext,
          {
            payload: {
              vector_store_id: "vs_123",
              batch_id: "vsfb_123",
              filter: "completed",
            },
          }
        );
        assert.deepEqual(listedFiles, [{ id: "vsf_1" }, { id: "vsf_2" }]);

        await vectorStoreFileBatchMethods.uploadAndPollVectorStoreFileBatch.call(clientContext, {
          payload: {
            vector_store_id: "vs_123",
            files: [firstTempFilePath, secondTempFilePath],
            file_ids: ["file_existing"],
            pollIntervalMs: 600,
            maxConcurrency: 3,
          },
        });

        delete require.cache[modulePath];
      });
    });
  } finally {
    fs.rmSync(firstTempFilePath, { force: true });
    fs.rmSync(secondTempFilePath, { force: true });
  }

  assert.deepEqual(
    calls.filter((entry) => entry.method !== "ctor"),
    [
      {
        method: "vectorStores.fileBatches.create",
        vectorStoreId: "vs_123",
        body: {
          files: [
            {
              file_id: "file_1",
              attributes: { category: "release" },
            },
          ],
        },
      },
      {
        method: "vectorStores.fileBatches.createAndPoll",
        vectorStoreId: "vs_123",
        body: {
          file_ids: ["file_1", "file_2"],
          attributes: { category: "release" },
        },
        options: { pollIntervalMs: 200 },
      },
      {
        method: "vectorStores.fileBatches.retrieve",
        batchId: "vsfb_123",
        params: {
          vector_store_id: "vs_123",
        },
      },
      {
        method: "vectorStores.fileBatches.poll",
        vectorStoreId: "vs_123",
        batchId: "vsfb_123",
        options: { pollIntervalMs: 400 },
      },
      {
        method: "vectorStores.fileBatches.cancel",
        batchId: "vsfb_123",
        params: {
          vector_store_id: "vs_123",
        },
      },
      {
        method: "vectorStores.fileBatches.listFiles",
        batchId: "vsfb_123",
        params: {
          vector_store_id: "vs_123",
          filter: "completed",
        },
      },
      {
        method: "vectorStores.fileBatches.uploadAndPoll",
        vectorStoreId: "vs_123",
        filePaths: [firstTempFilePath, secondTempFilePath],
        fileIds: ["file_existing"],
        options: { pollIntervalMs: 600, maxConcurrency: 3 },
      },
    ]
  );
});

test("vector store file and file-batch picker/help surfaces advertise the current SDK contract", () => {
  assert.equal(
    locale.OpenaiApi.parameters.modifyVectorStoreFile,
    "modify vector store file"
  );
  assert.equal(
    locale.OpenaiApi.parameters.getVectorStoreFileContent,
    "get vector store file content"
  );
  assert.equal(
    locale.OpenaiApi.parameters.createAndPollVectorStoreFileBatch,
    "create and poll vector store file batch"
  );
  assert.equal(
    locale.OpenaiApi.parameters.pollVectorStoreFileBatch,
    "poll vector store file batch"
  );

  assert.match(vectorStoreFilesHelp, /Create and Poll Vector Store File/);
  assert.match(vectorStoreFilesHelp, /Upload Vector Store File/);
  assert.match(vectorStoreFilesHelp, /Upload and Poll Vector Store File/);
  assert.match(vectorStoreFilesHelp, /Poll Vector Store File/);
  assert.match(vectorStoreFilesHelp, /Modify Vector Store File/);
  assert.match(vectorStoreFilesHelp, /Get Vector Store File Content/);
  assert.match(vectorStoreFilesHelp, /attributes/);
  assert.match(vectorStoreFilesHelp, /chunking_strategy/);
  assert.match(vectorStoreFilesHelp, /pollIntervalMs/);

  assert.match(vectorStoreFileBatchesHelp, /Create and Poll Vector Store File Batch/);
  assert.match(vectorStoreFileBatchesHelp, /Poll Vector Store File Batch/);
  assert.match(vectorStoreFileBatchesHelp, /Upload and Poll Vector Store File Batch/);
  assert.match(vectorStoreFileBatchesHelp, /maxConcurrency/);
  assert.match(vectorStoreFileBatchesHelp, /chunking_strategy/);
  assert.match(vectorStoreFileBatchesHelp, /files/);
});
