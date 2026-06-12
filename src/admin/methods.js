const OpenAI = require("openai").OpenAI;

async function listOrganizationAuditLogs(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.auditLogs.list(parameters.payload);
    return [...list.data];
}

async function createOrganizationAdminApiKey(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.adminAPIKeys.create(parameters.payload);
    return response;
}

async function getOrganizationAdminApiKey(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { key_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.adminAPIKeys.retrieve(key_id, params);
    return response;
}

async function listOrganizationAdminApiKeys(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.adminAPIKeys.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationAdminApiKey(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { key_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.adminAPIKeys.delete(key_id, params);
    return response;
}

async function getOrganizationUsageAudioSpeeches(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.audioSpeeches(parameters.payload);
    return response;
}

async function getOrganizationUsageAudioTranscriptions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.audioTranscriptions(parameters.payload);
    return response;
}

async function getOrganizationUsageCodeInterpreterSessions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.codeInterpreterSessions(parameters.payload);
    return response;
}

async function getOrganizationUsageCompletions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.completions(parameters.payload);
    return response;
}

async function getOrganizationCosts(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.costs(parameters.payload);
    return response;
}

async function getOrganizationUsageEmbeddings(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.embeddings(parameters.payload);
    return response;
}

async function getOrganizationUsageFileSearchCalls(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.fileSearchCalls(parameters.payload);
    return response;
}

async function getOrganizationUsageImages(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.images(parameters.payload);
    return response;
}

async function getOrganizationUsageModerations(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.moderations(parameters.payload);
    return response;
}

async function getOrganizationUsageVectorStores(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.vectorStores(parameters.payload);
    return response;
}

async function getOrganizationUsageWebSearchCalls(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.usage.webSearchCalls(parameters.payload);
    return response;
}

async function getOrganizationDataRetention(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.dataRetention.retrieve(parameters.payload);
    return response;
}

async function modifyOrganizationDataRetention(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.dataRetention.update(parameters.payload);
    return response;
}

async function createOrganizationSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.spendAlerts.create(parameters.payload);
    return response;
}

async function modifyOrganizationSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { alert_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.spendAlerts.update(alert_id, body);
    return response;
}

async function listOrganizationSpendAlerts(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.spendAlerts.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { alert_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.spendAlerts.delete(alert_id, params);
    return response;
}

async function createOrganizationInvite(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.invites.create(parameters.payload);
    return response;
}

async function getOrganizationInvite(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { invite_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.invites.retrieve(invite_id, params);
    return response;
}

async function listOrganizationInvites(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.invites.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationInvite(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { invite_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.invites.delete(invite_id, params);
    return response;
}

async function getOrganizationUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.users.retrieve(user_id, params);
    return response;
}

async function modifyOrganizationUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.users.update(user_id, body);
    return response;
}

async function listOrganizationUsers(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.users.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.users.delete(user_id, params);
    return response;
}

async function createOrganizationUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.users.roles.create(user_id, body);
    return response;
}

async function getOrganizationUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.users.roles.retrieve(role_id, params);
    return response;
}

async function listOrganizationUserRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.users.roles.list(user_id, params);
    return [...list.data];
}

async function deleteOrganizationUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.users.roles.delete(role_id, params);
    return response;
}

async function createOrganizationGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.groups.create(parameters.payload);
    return response;
}

async function getOrganizationGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.retrieve(group_id, params);
    return response;
}

async function modifyOrganizationGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.groups.update(group_id, body);
    return response;
}

async function listOrganizationGroups(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.groups.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.delete(group_id, params);
    return response;
}

async function createOrganizationGroupUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.groups.users.create(group_id, body);
    return response;
}

async function getOrganizationGroupUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.users.retrieve(user_id, params);
    return response;
}

async function listOrganizationGroupUsers(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.groups.users.list(group_id, params);
    return [...list.data];
}

async function deleteOrganizationGroupUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.users.delete(user_id, params);
    return response;
}

async function createOrganizationGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.roles.create(group_id, params);
    return response;
}

async function getOrganizationGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.roles.retrieve(role_id, params);
    return response;
}

async function listOrganizationGroupRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.groups.roles.list(group_id, params);
    return [...list.data];
}

async function deleteOrganizationGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.groups.roles.delete(role_id, params);
    return response;
}

async function createOrganizationRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.roles.create(parameters.payload);
    return response;
}

async function getOrganizationRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.roles.retrieve(role_id, params);
    return response;
}

async function modifyOrganizationRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.roles.update(role_id, params);
    return response;
}

async function listOrganizationRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.roles.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.roles.delete(role_id, params);
    return response;
}

async function createOrganizationCertificate(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.certificates.create(parameters.payload);
    return response;
}

async function getOrganizationCertificate(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { certificate_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.certificates.retrieve(certificate_id, params);
    return response;
}

async function modifyOrganizationCertificate(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { certificate_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.certificates.update(certificate_id, body);
    return response;
}

async function listOrganizationCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.certificates.list(parameters.payload);
    return [...list.data];
}

async function deleteOrganizationCertificate(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { certificate_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.certificates.delete(certificate_id, params);
    return response;
}

async function activateOrganizationCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.certificates.activate(parameters.payload);
    return [...list.data];
}

async function deactivateOrganizationCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.certificates.deactivate(parameters.payload);
    return [...list.data];
}

async function createOrganizationProject(parameters) {
    const openai = new OpenAI(this.clientParams);
    const response = await openai.admin.organization.projects.create(parameters.payload);
    return response;
}

async function getOrganizationProject(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.retrieve(project_id, params);
    return response;
}

async function modifyOrganizationProject(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.update(project_id, body);
    return response;
}

async function listOrganizationProjects(parameters) {
    const openai = new OpenAI(this.clientParams);
    const list = await openai.admin.organization.projects.list(parameters.payload);
    return [...list.data];
}

async function archiveOrganizationProject(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.archive(project_id, params);
    return response;
}

async function getProjectDataRetention(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.dataRetention.retrieve(project_id, params);
    return response;
}

async function modifyProjectDataRetention(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.dataRetention.update(project_id, body);
    return response;
}

async function createProjectSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.spendAlerts.create(project_id, body);
    return response;
}

async function modifyProjectSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { alert_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.spendAlerts.update(alert_id, params);
    return response;
}

async function listProjectSpendAlerts(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.spendAlerts.list(project_id, params);
    return [...list.data];
}

async function deleteProjectSpendAlert(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { alert_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.spendAlerts.delete(alert_id, params);
    return response;
}

async function getProjectModelPermissions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.modelPermissions.retrieve(project_id, params);
    return response;
}

async function modifyProjectModelPermissions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.modelPermissions.update(project_id, body);
    return response;
}

async function deleteProjectModelPermissions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.modelPermissions.delete(project_id, params);
    return response;
}

async function getProjectHostedToolPermissions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.hostedToolPermissions.retrieve(project_id, params);
    return response;
}

async function modifyProjectHostedToolPermissions(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.hostedToolPermissions.update(project_id, body);
    return response;
}

async function getProjectApiKey(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { api_key_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.apiKeys.retrieve(api_key_id, params);
    return response;
}

async function listProjectApiKeys(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.apiKeys.list(project_id, params);
    return [...list.data];
}

async function deleteProjectApiKey(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { api_key_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.apiKeys.delete(api_key_id, params);
    return response;
}

async function listProjectCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.certificates.list(project_id, params);
    return [...list.data];
}

async function activateProjectCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const list = await openai.admin.organization.projects.certificates.activate(project_id, body);
    return [...list.data];
}

async function deactivateProjectCertificates(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const list = await openai.admin.organization.projects.certificates.deactivate(project_id, body);
    return [...list.data];
}

async function createProjectServiceAccount(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.serviceAccounts.create(project_id, body);
    return response;
}

async function getProjectServiceAccount(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { service_account_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.serviceAccounts.retrieve(service_account_id, params);
    return response;
}

async function modifyProjectServiceAccount(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { service_account_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.serviceAccounts.update(service_account_id, params);
    return response;
}

async function listProjectServiceAccounts(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.serviceAccounts.list(project_id, params);
    return [...list.data];
}

async function deleteProjectServiceAccount(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { service_account_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.serviceAccounts.delete(service_account_id, params);
    return response;
}

async function createProjectUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.users.create(project_id, body);
    return response;
}

async function getProjectUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.retrieve(user_id, params);
    return response;
}

async function modifyProjectUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.update(user_id, params);
    return response;
}

async function listProjectUsers(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.users.list(project_id, params);
    return [...list.data];
}

async function deleteProjectUser(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.delete(user_id, params);
    return response;
}

async function createProjectUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.roles.create(user_id, params);
    return response;
}

async function getProjectUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.roles.retrieve(role_id, params);
    return response;
}

async function listProjectUserRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { user_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.users.roles.list(user_id, params);
    return [...list.data];
}

async function deleteProjectUserRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.users.roles.delete(role_id, params);
    return response;
}

async function createProjectGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.create(project_id, body);
    return response;
}

async function getProjectGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.retrieve(group_id, params);
    return response;
}

async function listProjectGroups(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.groups.list(project_id, params);
    return [...list.data];
}

async function deleteProjectGroup(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.delete(group_id, params);
    return response;
}

async function createProjectGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.roles.create(group_id, params);
    return response;
}

async function getProjectGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.roles.retrieve(role_id, params);
    return response;
}

async function listProjectGroupRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { group_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.groups.roles.list(group_id, params);
    return [...list.data];
}

async function deleteProjectGroupRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.groups.roles.delete(role_id, params);
    return response;
}

async function createProjectRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...body } = parameters.payload;
    const response = await openai.admin.organization.projects.roles.create(project_id, body);
    return response;
}

async function getProjectRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.roles.retrieve(role_id, params);
    return response;
}

async function modifyProjectRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.roles.update(role_id, params);
    return response;
}

async function listProjectRoles(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.roles.list(project_id, params);
    return [...list.data];
}

async function deleteProjectRole(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { role_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.roles.delete(role_id, params);
    return response;
}

async function listProjectRateLimits(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { project_id, ...params } = parameters.payload;
    const list = await openai.admin.organization.projects.rateLimits.listRateLimits(project_id, params);
    return [...list.data];
}

async function modifyProjectRateLimit(parameters) {
    const openai = new OpenAI(this.clientParams);
    const { rate_limit_id, ...params } = parameters.payload;
    const response = await openai.admin.organization.projects.rateLimits.updateRateLimit(rate_limit_id, params);
    return response;
}

const adminMethods = {
    listOrganizationAuditLogs,
    createOrganizationAdminApiKey,
    getOrganizationAdminApiKey,
    listOrganizationAdminApiKeys,
    deleteOrganizationAdminApiKey,
    getOrganizationUsageAudioSpeeches,
    getOrganizationUsageAudioTranscriptions,
    getOrganizationUsageCodeInterpreterSessions,
    getOrganizationUsageCompletions,
    getOrganizationCosts,
    getOrganizationUsageEmbeddings,
    getOrganizationUsageFileSearchCalls,
    getOrganizationUsageImages,
    getOrganizationUsageModerations,
    getOrganizationUsageVectorStores,
    getOrganizationUsageWebSearchCalls,
    getOrganizationDataRetention,
    modifyOrganizationDataRetention,
    createOrganizationSpendAlert,
    modifyOrganizationSpendAlert,
    listOrganizationSpendAlerts,
    deleteOrganizationSpendAlert,
    createOrganizationInvite,
    getOrganizationInvite,
    listOrganizationInvites,
    deleteOrganizationInvite,
    getOrganizationUser,
    modifyOrganizationUser,
    listOrganizationUsers,
    deleteOrganizationUser,
    createOrganizationUserRole,
    getOrganizationUserRole,
    listOrganizationUserRoles,
    deleteOrganizationUserRole,
    createOrganizationGroup,
    getOrganizationGroup,
    modifyOrganizationGroup,
    listOrganizationGroups,
    deleteOrganizationGroup,
    createOrganizationGroupUser,
    getOrganizationGroupUser,
    listOrganizationGroupUsers,
    deleteOrganizationGroupUser,
    createOrganizationGroupRole,
    getOrganizationGroupRole,
    listOrganizationGroupRoles,
    deleteOrganizationGroupRole,
    createOrganizationRole,
    getOrganizationRole,
    modifyOrganizationRole,
    listOrganizationRoles,
    deleteOrganizationRole,
    createOrganizationCertificate,
    getOrganizationCertificate,
    modifyOrganizationCertificate,
    listOrganizationCertificates,
    deleteOrganizationCertificate,
    activateOrganizationCertificates,
    deactivateOrganizationCertificates,
    createOrganizationProject,
    getOrganizationProject,
    modifyOrganizationProject,
    listOrganizationProjects,
    archiveOrganizationProject,
    getProjectDataRetention,
    modifyProjectDataRetention,
    createProjectSpendAlert,
    modifyProjectSpendAlert,
    listProjectSpendAlerts,
    deleteProjectSpendAlert,
    getProjectModelPermissions,
    modifyProjectModelPermissions,
    deleteProjectModelPermissions,
    getProjectHostedToolPermissions,
    modifyProjectHostedToolPermissions,
    getProjectApiKey,
    listProjectApiKeys,
    deleteProjectApiKey,
    listProjectCertificates,
    activateProjectCertificates,
    deactivateProjectCertificates,
    createProjectServiceAccount,
    getProjectServiceAccount,
    modifyProjectServiceAccount,
    listProjectServiceAccounts,
    deleteProjectServiceAccount,
    createProjectUser,
    getProjectUser,
    modifyProjectUser,
    listProjectUsers,
    deleteProjectUser,
    createProjectUserRole,
    getProjectUserRole,
    listProjectUserRoles,
    deleteProjectUserRole,
    createProjectGroup,
    getProjectGroup,
    listProjectGroups,
    deleteProjectGroup,
    createProjectGroupRole,
    getProjectGroupRole,
    listProjectGroupRoles,
    deleteProjectGroupRole,
    createProjectRole,
    getProjectRole,
    modifyProjectRole,
    listProjectRoles,
    deleteProjectRole,
    listProjectRateLimits,
    modifyProjectRateLimit,
};

Object.values(adminMethods).forEach((method) => {
    method.authentication = "admin";
});

module.exports = adminMethods;
