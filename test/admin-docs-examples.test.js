"use strict";

// This file covers the Admin user-facing surface.
// It checks that the Admin help and importable example flow stay aligned with the Admin capability already wired into the node.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const workloadIdentityAuditEventTypes = [
    "workload_identity_provider.created",
    "workload_identity_provider.updated",
    "workload_identity_provider.deleted",
    "workload_identity_provider_mapping.created",
    "workload_identity_provider_mapping.updated",
    "workload_identity_provider_mapping.deleted",
];

const adminHelp = fs.readFileSync(path.join(__dirname, "..", "src", "admin", "help.html"), "utf8");
const examplePath = path.join(__dirname, "..", "examples", "admin.json");
const exampleNodes = JSON.parse(fs.readFileSync(examplePath, "utf8"));

test("Admin help documents workload identity audit-log event filters", () => {
    assert.match(adminHelp, /event_types/);
    assert.match(adminHelp, /full SDK event detail objects/);

    for (const eventType of workloadIdentityAuditEventTypes) {
        assert.match(adminHelp, new RegExp(eventType.replace(/\./g, "\\.")));
    }
});

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

    const guidanceText = exampleNodes
        .filter((node) => node.type === "tab" || node.type === "comment")
        .map((node) => `${node.name || ""}\n${node.info || ""}`)
        .join("\n");

    assert.match(guidanceText, /Admin API Key/i);
    assert.match(guidanceText, /organization audit logs/i);
    assert.match(guidanceText, /project rate-limit inspection and updates/i);
    assert.match(guidanceText, /usage reporting/i);
    assert.match(guidanceText, /spend alert/i);
    assert.match(guidanceText, /project permission/i);
    assert.match(guidanceText, /proj_replace_me/);
    assert.match(guidanceText, /rlimit_replace_me/);
    assert.match(guidanceText, /alert_replace_me/);
    assert.match(guidanceText, /svc_replace_me/);
});
