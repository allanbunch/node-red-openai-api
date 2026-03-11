"use strict";

// This file covers the ChatKit user-facing surface.
// It checks that README discovery text and the importable example flow stay aligned with the ChatKit capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
const examplePath = path.join(
  __dirname,
  "..",
  "examples",
  "chatkit",
  "sessions-and-threads.json"
);
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("README highlights ChatKit / Agent Builder support and example flow", () => {
  assert.match(
    readme,
    /examples\/chatkit\/sessions-and-threads\.json/
  );
  assert.match(
    readme,
    /ChatKit \/ Agent Builder support, including session creation and cancellation, plus thread and thread-item inspection for published workflows/
  );
  assert.match(
    readme,
    /Shows how to create and cancel ChatKit sessions for a published Agent Builder workflow, then inspect the resulting threads and thread items\./
  );
  assert.match(readme, /- ChatKit\b/);
});

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

  const guidanceText = exampleNodes
    .filter((node) => node.type === "tab" || node.type === "comment")
    .map((node) => `${node.name || ""}\n${node.info || ""}`)
    .join("\n");

  assert.match(guidanceText, /published workflow id/i);
  assert.match(guidanceText, /thread operations need a real `cthr_...` id/i);
  assert.match(guidanceText, /session cancellation needs a real `cksess_...` id/i);
});
