export const CONTROL_PLANE_EVENTS = {
  ORG_CREATED: "controlplane:organizationCreated",
  WORKSPACE_CREATED: "controlplane:workspaceCreated",
  PROJECT_CREATED: "controlplane:projectCreated",
  TEAM_CREATED: "controlplane:teamCreated",
  ROLE_UPDATED: "controlplane:roleUpdated",
  API_KEY_CREATED: "controlplane:apiKeyCreated",
  SECRET_ROTATED: "controlplane:secretRotated",
  FEATURE_FLAG_UPDATED: "controlplane:featureFlagUpdated",
} as const;
