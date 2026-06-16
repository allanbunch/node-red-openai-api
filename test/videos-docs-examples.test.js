"use strict";

// This file covers the Videos user-facing surface.
// It checks that the importable example flow stays aligned with the current video and Sora capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const examplePath = path.join(__dirname, "..", "examples", "videos.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

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
