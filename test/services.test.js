"use strict";

const assert = require("assert");
const { createClient } = require("../src/client");
const { createApi } = require("../src/index");

// Mock the OpenAI API client
jest.mock("../src/client", () => {
  return {
    createClient: jest.fn().mockReturnValue({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({ id: "chat-123", choices: [] }),
        },
      },
      beta: {
        threads: {
          create: jest.fn().mockResolvedValue({ id: "thread-123" }),
          messages: {
            create: jest.fn().mockResolvedValue({ id: "message-123" }),
            list: jest
              .fn()
              .mockResolvedValue({ data: [{ id: "message-123" }] }),
            retrieve: jest.fn().mockResolvedValue({ id: "message-123" }),
            update: jest
              .fn()
              .mockResolvedValue({ id: "message-123", updated: true }),
          },
        },
      },
      batches: {
        create: jest.fn().mockResolvedValue({ id: "batch-123" }),
        retrieve: jest
          .fn()
          .mockResolvedValue({ id: "batch-123", status: "pending" }),
        list: jest.fn().mockResolvedValue({ data: [{ id: "batch-123" }] }),
        cancel: jest
          .fn()
          .mockResolvedValue({ id: "batch-123", cancelled: true }),
      },
    }),
  };
});

describe("API Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ChatService", () => {
    it("should create chat completion", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.chat.createChatCompletion({
        payload: { messages: [{ role: "user", content: "Hello" }] },
      });

      assert.strictEqual(result.id, "chat-123");
      expect(createClient).toHaveBeenCalledWith({ apiKey: "test-key" });
    });
  });

  describe("MessagesService", () => {
    it("should create a message", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.messages.createMessage({
        payload: { thread_id: "thread-123", content: "Hello" },
      });

      assert.strictEqual(result.id, "message-123");
    });

    it("should list messages", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.messages.listMessages({
        payload: { thread_id: "thread-123" },
      });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, "message-123");
    });

    it("should get a message", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.messages.getMessage({
        payload: { thread_id: "thread-123", message_id: "message-123" },
      });

      assert.strictEqual(result.id, "message-123");
    });

    it("should modify a message", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.messages.modifyMessage({
        payload: {
          thread_id: "thread-123",
          message_id: "message-123",
          metadata: { updated: true },
        },
      });

      assert.strictEqual(result.updated, true);
    });
  });

  describe("BatchesService", () => {
    it("should create a batch", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.batches.createBatch({
        payload: {
          requests: [
            { model: "gpt-4", messages: [{ role: "user", content: "Hello" }] },
          ],
        },
      });

      assert.strictEqual(result.id, "batch-123");
    });

    it("should retrieve a batch", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.batches.retrieveBatch({
        payload: { batch_id: "batch-123" },
      });

      assert.strictEqual(result.status, "pending");
    });

    it("should list batches", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.batches.listBatches({
        payload: {},
      });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, "batch-123");
    });

    it("should cancel a batch", async () => {
      const api = createApi({ apiKey: "test-key" });
      const result = await api.batches.cancelBatch({
        payload: { batch_id: "batch-123" },
      });

      assert.strictEqual(result.cancelled, true);
    });
  });
});
