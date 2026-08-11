export const SECURITY_EVENTS = {
  INCIDENT_CREATED: "security:incidentCreated",
  THREAT_DETECTED: "security:threatDetected",
  SESSION_REVOKED: "security:sessionRevoked",
  POLICY_UPDATED: "security:policyUpdated",
  COMPLIANCE_UPDATED: "security:complianceUpdated",
  KEY_ROTATED: "security:keyRotated",
  MFA_ENABLED: "security:mfaEnabled",
  DEVICE_TRUSTED: "security:deviceTrusted",
} as const;
