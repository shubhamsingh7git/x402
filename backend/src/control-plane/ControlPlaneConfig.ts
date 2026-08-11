export const CONTROL_PLANE_CONFIG = {
  defaultOrganizationId: "org_default_01",
  defaultWorkspaceId: "ws_default_01",
  defaultProjectId: "proj_default_01",
  defaultMaxMembersPerOrg: 50,
  defaultMaxWorkspacesPerOrg: 10,
  defaultMaxProjectsPerWorkspace: 20,
  defaultApiKeyExpirationDays: 90,
  supportedScopes: [
    "planner:read",
    "planner:execute",
    "marketplace:write",
    "bazaar:search",
    "execution:start",
    "admin",
    "analytics:read",
  ],
  featureFlagScopes: ["GLOBAL", "ORGANIZATION", "WORKSPACE", "PROJECT", "ENVIRONMENT"],
};
