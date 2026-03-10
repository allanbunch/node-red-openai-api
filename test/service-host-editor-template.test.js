"use strict";

// This file is about the editor-side Service Host experience.
// It checks that the config UI still exposes the typed-input behavior we rely on for API keys and related fields.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const templatePath = path.join(__dirname, "..", "src", "node.html");
const template = fs.readFileSync(templatePath, "utf8");

test("service host API key editor uses native typedInput cred handling", () => {
  assert.match(
    template,
    /types: \["cred", "env", "msg", "flow", "global"\],/
  );
  assert.match(
    template,
    /<input type="text" id="node-config-input-secureApiKeyValue" placeholder="" \/>/
  );
  assert.match(
    template,
    /<input\s+type="text"\s+id="node-config-input-secureApiKeyHeaderOrQueryName"\s+placeholder="Authorization"\s+\/>/
  );
  assert.match(
    template,
    /if \(inputValue && inputValue !== "__PWRD__"\) \{/
  );
  assert.match(
    template,
    /const syncApiKeyInputValue = function \(\) \{/
  );
  assert.match(
    template,
    /if \(selectedType !== "cred" && currentValue === "__PWRD__"\) \{/
  );
  assert.match(
    template,
    /apiKeyInput\.typedInput\("value", apiKeyRef\.val\(\) \|\| ""\);/
  );
  assert.match(
    template,
    /if \(selectedType === "cred" && previousApiKeyType !== "cred"\) \{/
  );
  assert.match(
    template,
    /const inputValue = apiKeyInput\.typedInput\("value"\);/
  );
  assert.match(
    template,
    /const existingCredValue = apiKeyInput\.val\(\);/
  );
  assert.ok(!/apiKeyInput\.prop\("type"/.test(template));
});
