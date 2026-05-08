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
    /<input type="text" id="node-config-input-secureAdminApiKeyValue" placeholder="" \/>/
  );
  assert.match(
    template,
    /function initializeCredentialTypedInput\(fieldName\) \{/
  );
  assert.match(
    template,
    /function saveCredentialTypedInput\(fieldName\) \{/
  );
  assert.match(
    template,
    /initializeCredentialTypedInput\("secureApiKeyValue"\);/
  );
  assert.match(
    template,
    /initializeCredentialTypedInput\("secureAdminApiKeyValue"\);/
  );
  assert.match(
    template,
    /saveCredentialTypedInput\("secureApiKeyValue"\);/
  );
  assert.match(
    template,
    /saveCredentialTypedInput\("secureAdminApiKeyValue"\);/
  );
  assert.match(
    template,
    /<span data-i18n="OpenaiApi.label.adminApiKey"><\/span>/
  );
  assert.ok(!/\.prop\("type"/.test(template));
});
