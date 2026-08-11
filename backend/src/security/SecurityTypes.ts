import { SessionStatusEnum, PolicyEffectEnum, ComplianceStatusEnum } from "./SecurityStatus";

export interface ISessionDTO {
  id?: string;
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: SessionStatusEnum;
  isMfaVerified: boolean;
  expiresAt: string | Date;
  createdAt?: string | Date;
}

export interface IMFADeviceDTO {
  id?: string;
  deviceId: string;
  userId: string;
  deviceType: "TOTP" | "WEBAUTHN" | "SMS" | string;
  deviceName: string;
  isTrusted: boolean;
  createdAt?: string | Date;
}

export interface IAuthorizationPolicyDTO {
  id?: string;
  policyId: string;
  policyName: string;
  subjectRole: string;
  resource: string;
  action: string;
  effect: PolicyEffectEnum;
  conditions?: Record<string, any>;
  createdAt?: string | Date;
}

export interface IThreatEventDTO {
  id?: string;
  threatId: string;
  threatType: "SUSPICIOUS_LOGIN" | "CREDENTIAL_ABUSE" | "API_ABUSE" | "BRUTE_FORCE" | string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  ipAddress: string;
  description: string;
  status: "ACTIVE" | "MITIGATED" | "IGNORED" | string;
  createdAt?: string | Date;
}

export interface ISecurityIncidentDTO {
  id?: string;
  incidentId: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  status: "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | string;
  affectedResources: string[];
  summary: string;
  createdAt?: string | Date;
}

export interface ISecurityAnalyticsDTO {
  activeSessions: number;
  mfaEnabledUsers: number;
  trustedDevices: number;
  activeSecurityPolicies: number;
  complianceScorePercent: number;
  activeThreats: number;
  openSecurityIncidents: number;
  encryptionKeyVersion: string;
  failedAuthAttempts: number;
  riskScoreAverage: number;
}
