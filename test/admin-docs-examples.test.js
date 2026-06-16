"use strict";

// This file covers the Admin user-facing surface.
// It checks that the importable example flow stays aligned with the Admin capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const examplePath = path.join(__dirname, "..", "examples", "admin.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("Admin example flow covers the documented organization and project controls", () => {
    const methods = exampleNodes
        .filter((node) => node.type === "OpenAI API")
        .map((node) => node.method)
        .sort();

    assert.deepEqual(methods, [
        "createProjectSpendAlert",
        "getOrganizationUsageWebSearchCalls",
        "listOrganizationAuditLogs",
        "listOrganizationProjects",
        "listProjectRateLimits",
        "listProjectSpendAlerts",
        "modifyOrganizationDataRetention",
        "modifyProjectHostedToolPermissions",
        "modifyProjectModelPermissions",
        "modifyProjectRateLimit",
        "modifyProjectServiceAccount",
        "modifyProjectSpendAlert",
    ]);

    const props = exampleNodes
        .filter((node) => node.type === "inject")
        .flatMap((node) => node.props || []);

    assert.equal(
        props.some((prop) => prop.p === "payload.include_archived" && prop.v === "false"),
        true
    );
    assert.equal(props.filter((prop) => prop.p === "payload.project_id").length >= 8, true);
    assert.equal(
        props.some((prop) => prop.p === "payload.rate_limit_id" && prop.v === "rlimit_replace_me"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.effective_at" && prop.v.includes('"gt":1710000000')),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.start_time" && prop.v === "1710000000"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.bucket_width" && prop.v === "1d"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.retention_type" && prop.v === "modified_abuse_monitoring"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.alert_id" && prop.v === "alert_replace_me"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.notification_channel" && prop.v.includes("admin@example.com")),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.mode" && prop.v === "allow_list"),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.model_ids" && prop.v.includes("gpt-4.1-mini")),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.web_search" && prop.v.includes('"enabled":true')),
        true
    );
    assert.equal(
        props.some((prop) => prop.p === "payload.service_account_id" && prop.v === "svc_replace_me"),
        true
    );

});
