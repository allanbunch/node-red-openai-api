"use strict";

// This file covers the Videos user-facing surface.
// It checks that README discovery text and the importable example flow stay aligned with the current video and Sora capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
const examplePath = path.join(__dirname, "..", "examples", "videos.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("README highlights the Videos example flow and current Sora video methods", () => {
  assert.match(readme, /examples\/videos\.json/);
  assert.match(
    readme,
    /Shows the current video flow surface, including create, character creation, edit, extend, remix, and asset download\./
  );
  assert.match(
    readme,
    /Videos \/ Sora support, including generation, remix, edit, extend, character creation, and downloadable assets/
  );
  assert.match(
    readme,
    /Use the node for OpenAI video work inside Node-RED, including current Sora video methods for generation, remix, edit, extend, character creation, and downloadable video assets\./
  );
});

test("Videos example flow covers the documented video lifecycle", () => {
  const methods = exampleNodes
    .filter((node) => node.type === "OpenAI API")
    .map((node) => node.method)
    .sort();

  assert.deepEqual(methods, [
    "createVideo",
    "createVideoCharacter",
    "downloadVideoContent",
    "editVideo",
    "extendVideo",
    "getVideoCharacter",
    "remixVideo",
  ]);

  const props = exampleNodes
    .filter((node) => node.type === "inject")
    .flatMap((node) => node.props || []);

  assert.equal(
    props.some((prop) => prop.p === "ai.model" && prop.v === "sora-2"),
    true
  );
  assert.equal(
    props.some((prop) => prop.p === "ai.name"),
    true
  );
  assert.equal(
    props.filter((prop) => prop.p === "ai.video.id").length,
    2
  );
  assert.equal(
    props.filter((prop) => prop.p === "ai.video_id").length,
    2
  );

  const guidanceText = exampleNodes
    .filter((node) => node.type === "tab" || node.type === "comment")
    .map((node) => `${node.name || ""}\n${node.info || ""}`)
    .join("\n");

  assert.match(guidanceText, /placeholder ids or file paths/i);
  assert.match(guidanceText, /Sora video creation from a prompt/i);
  assert.match(guidanceText, /character creation from an uploaded video clip/i);
  assert.match(guidanceText, /downloadable assets through `downloadVideoContent`/i);
});
