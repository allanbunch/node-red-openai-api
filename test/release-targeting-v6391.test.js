"use strict";

// Keeps the release target honest for the OpenAI Node SDK version and the
// README notes reviewers use to understand the release target.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");

test("package metadata targets the OpenAI Node SDK v6.39.1 release", () => {
  assert.equal(packageJson.version, "6.39.1");
  assert.equal(packageJson.dependencies.openai, "6.39.1");
});

test("README names the v6.39.1 target and release-facing parity deltas", () => {
  assert.match(readme, /currently targets the `openai` Node SDK `6\.39\.1`/);
  assert.match(readme, /OpenAI Node SDK v6\.39\.1/);
  assert.match(readme, /Responses compact `service_tier`/);
  assert.match(readme, /admin API expansion/i);
  assert.match(readme, /v6\.39\.1 SDK patch uptake/);
  assert.match(
    readme,
    /Older flows that send a singular `msg\.payload\.item` object no longer match the\s+supported contract and must be updated before moving to this release\./
  );
});
