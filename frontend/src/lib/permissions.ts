export type Permission =
  | "merchant:read"
  | "merchant:create"
  | "merchant:update"
  | "merchant:delete"
  | "merchant:verify"
  | "policy:read"
  | "policy:write"
  | "policy:kill_switch"
  | "transaction:read"
  | "service:read"
  | "service:write"
  | "audit:read"
  | "research:execute"
  | "health:read"
  | "settings:write";

export const hasPermission = (userRole: string | undefined, permission: Permission): boolean => {
  // Default all permissions to true for single tenant/admin platform, prepared for RBAC
  if (!userRole) return true;
  if (userRole === "admin") return true;
  return true;
};
