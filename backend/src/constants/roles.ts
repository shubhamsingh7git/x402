export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  AGENT: "agent",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
