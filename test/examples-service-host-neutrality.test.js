"use strict";

// This file keeps the importable examples clean.
// It checks that example flows do not ship with a bundled Service Host config node or a prewired host selection that people did not choose themselves.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const examplesRoot = path.join(__dirname, "..", "examples");
const exampleFiles = listJsonFiles(examplesRoot);
const exampleFlows = exampleFiles.map((filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");

  return {
    relativePath: path.relative(path.join(__dirname, ".."), filePath),
    raw,
    nodes: JSON.parse(raw),
  };
});

function listJsonFiles(directoryPath) {
  return fs.readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return listJsonFiles(entryPath);
      }

      return entry.name.endsWith(".json") ? [entryPath] : [];
    })
    .sort();
}

test("example flows do not bundle a Service Host config node", () => {
  for (const exampleFlow of exampleFlows) {
    const bundledServiceHosts = exampleFlow.nodes.filter(
      (node) => node.type === "Service Host"
    );

    assert.equal(
      bundledServiceHosts.length,
      0,
      `${exampleFlow.relativePath} should not include a bundled Service Host node`
    );
  }
});

test("example OpenAI API nodes are left unconfigured for Service Host selection", () => {
  for (const exampleFlow of exampleFlows) {
    const openaiNodes = exampleFlow.nodes.filter(
      (node) => node.type === "OpenAI API"
    );

    for (const openaiNode of openaiNodes) {
      assert.equal(
        openaiNode.service,
        "",
        `${exampleFlow.relativePath} should leave ${openaiNode.name || openaiNode.id} with an empty service selection`
      );
    }
  }
});

test("example flows do not mention the old OpenAI Auth config-node name", () => {
  for (const exampleFlow of exampleFlows) {
    assert.doesNotMatch(
      exampleFlow.raw,
      /OpenAI Auth/,
      `${exampleFlow.relativePath} should not mention the old OpenAI Auth config node`
    );
  }
});
