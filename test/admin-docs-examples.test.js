"use strict";

// This file covers the Admin user-facing surface.
// It checks that README discovery text and the importable example flow stay aligned with the Admin capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
const examplePath = path.join(__dirname, "..", "examples", "admin.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("README highlights Admin support and example flow", () => {
    assert.match(readme, /examples\/admin\.json/);
    assert.match(
        readme,
        /Shows the Admin surface for organization and project controls, including project listing, audit-log retrieval, rate-limit inspection, and rate-limit updates\./
    );
    assert.match(
        readme,
        /Admin API support, including Admin API key routing, organization audit logs, organization project controls, project rate-limit operations, and a first-class Admin method family in the editor/
    );
    assert.match(readme, /- Admin\b/);
});

test("Admin example flow covers the documented organization and project controls", () => {
    const methods = exampleNodes
        .filter((node) => node.type === "OpenAI API")
        .map((node) => node.method)
        .sort();

    assert.deepEqual(methods, [
        "listOrganizationAuditLogs",
        "listOrganizationProjects",
        "listProjectRateLimits",
        "modifyProjectRateLimit",
    ]);

    const props = exampleNodes
        .filter((node) => node.type === "inject")
        .flatMap((node) => node.props || []);

    assert.equal(
        props.some((prop) => prop.p === "payload.include_archived" && prop.v === "false"),
        true
    );
    assert.equal(
        props.filter((prop) => prop.p === "payload.project_id").length,
        2
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.rate_limit_id" && prop.v === "rlimit_replace_me"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.effective_at" && prop.v.includes('"gt":1710000000')),
        true
    );

    const guidanceText = exampleNodes
        .filter((node) => node.type === "tab" || node.type === "comment")
        .map((node) => `${node.name || ""}\n${node.info || ""}`)
        .join("\n");

    assert.match(guidanceText, /Admin API Key/i);
    assert.match(guidanceText, /organization audit logs/i);
    assert.match(guidanceText, /project rate-limit updates/i);
    assert.match(guidanceText, /proj_replace_me/);
    assert.match(guidanceText, /rlimit_replace_me/);
});