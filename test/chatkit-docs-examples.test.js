"use strict";

// This file covers the ChatKit user-facing surface.
// It checks that the importable example flow stays aligned with the ChatKit capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const examplePath = path.join(
  __dirname,
  "..",
  "examples",
  "chatkit",
  "sessions-and-threads.json"
);
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("ChatKit example flow covers the documented session and thread lifecycle", () => {
  const methods = exampleNodes
    .filter((node) => node.type === "OpenAI API")
    .map((node) => node.method)
    .sort();

  assert.deepEqual(methods, [
    "cancelChatKitSession",
    "createChatKitSession",
    "deleteChatKitThread",
    "getChatKitThread",
    "listChatKitThreadItems",
    "listChatKitThreads",
  ]);

  const props = exampleNodes
    .filter((node) => node.type === "inject")
    .flatMap((node) => node.props || []);

  assert.equal(
    props.some((prop) => prop.p === "payload.workflow.id"),
    true
  );
  assert.equal(
    props.some((prop) => prop.p === "payload.session_id"),
    true
  );
  assert.equal(
    props.filter((prop) => prop.p === "payload.thread_id").length,
    3
  );

});
