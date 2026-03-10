"use strict";

// This is a legacy utility test file.
// It checks the small helper surfaces like validation, streaming helpers, and file utilities in plain terms.

const assert = require("assert");
const { validation, streaming, fileHelpers } = require("../src/index").utils;

describe("Utility Functions", () => {
  describe("Validation", () => {
    it("should validate required parameters", () => {
      const schema = {
        required: ["name"],
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
      };

      // Valid case
      expect(() =>
        validation.validateParams({ name: "Test" }, schema)
      ).not.toThrow();

      // Invalid case - missing required field
      expect(() => validation.validateParams({}, schema)).toThrow();

      // Invalid case - wrong type
      expect(() => validation.validateParams({ name: 123 }, schema)).toThrow();
    });
  });

  describe("Streaming", () => {
    it("should create a streaming handler", () => {
      const onData = jest.fn();
      const onError = jest.fn();
      const onFinish = jest.fn();

      const handler = streaming.createStreamHandler({
        onData,
        onError,
        onFinish,
      });

      expect(handler).toHaveProperty("controller");
      expect(handler).toHaveProperty("stream");

      // Mock data event
      const mockChunk = { choices: [{ delta: { content: "Hello" } }] };
      handler.onChunk(mockChunk);
      expect(onData).toHaveBeenCalledWith(mockChunk);

      // Mock done event
      handler.onDone();
      expect(onFinish).toHaveBeenCalled();
    });
  });

  describe("File Helpers", () => {
    it("should determine file type from path", () => {
      expect(fileHelpers.getFileTypeFromPath("image.png")).toBe("image");
      expect(fileHelpers.getFileTypeFromPath("audio.mp3")).toBe("audio");
      expect(fileHelpers.getFileTypeFromPath("document.pdf")).toBe("document");
    });

    it("should validate file size", () => {
      const mockFile = { size: 1024 * 1024 }; // 1MB

      // File under limit
      expect(fileHelpers.validateFileSize(mockFile, 2 * 1024 * 1024)).toBe(
        true
      );

      // File exceeds limit
      expect(fileHelpers.validateFileSize(mockFile, 512 * 1024)).toBe(false);
    });
  });
});
