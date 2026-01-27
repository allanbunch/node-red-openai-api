"use strict";

const nodeModule = require("../node.js");

describe("Service Host typed API key", () => {
  let ServiceHostNode;
  let RED;

  beforeEach(() => {
    ServiceHostNode = undefined;
    RED = {
      nodes: {
        createNode: jest.fn((node, config) => {
          node.credentials = config.credentials || {};
        }),
        registerType: jest.fn((name, ctor) => {
          if (name === "Service Host") {
            ServiceHostNode = ctor;
          }
        }),
      },
      util: {
        evaluateNodeProperty: jest.fn((value, type) => {
          if (type === "str") {
            return value;
          }
          return `resolved:${type}:${value}`;
        }),
      },
    };

    nodeModule(RED);
  });

  it("uses credential value when type is string", () => {
    const node = new ServiceHostNode({
      apiBase: "https://api.openai.com/v1",
      apiBaseType: "str",
      secureApiKeyHeaderOrQueryName: "Authorization",
      secureApiKeyHeaderOrQueryNameType: "str",
      secureApiKeyValueType: "str",
      organizationId: "",
      organizationIdType: "str",
      secureApiKeyIsQuery: false,
      credentials: { secureApiKeyValue: "sk-test" },
    });

    const result = node.evaluateTyped("secureApiKeyValue", {}, node);

    expect(result).toBe("sk-test");
    expect(RED.util.evaluateNodeProperty).toHaveBeenCalledWith(
      "sk-test",
      "str",
      node,
      {}
    );
  });

  it("resolves env reference when type is env", () => {
    const node = new ServiceHostNode({
      apiBase: "https://api.openai.com/v1",
      apiBaseType: "str",
      secureApiKeyHeaderOrQueryName: "Authorization",
      secureApiKeyHeaderOrQueryNameType: "str",
      secureApiKeyValueType: "env",
      organizationId: "",
      organizationIdType: "str",
      secureApiKeyIsQuery: false,
      credentials: { secureApiKeyValue: "OPENAI_API_KEY" },
    });

    const result = node.evaluateTyped("secureApiKeyValue", {}, node);

    expect(result).toBe("resolved:env:OPENAI_API_KEY");
    expect(RED.util.evaluateNodeProperty).toHaveBeenCalledWith(
      "OPENAI_API_KEY",
      "env",
      node,
      {}
    );
  });
});
