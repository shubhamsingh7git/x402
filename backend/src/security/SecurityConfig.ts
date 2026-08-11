export const SECURITY_CONFIG = {
  jwtExpirationSeconds: 3600,
  refreshTokenExpirationDays: 30,
  mfaAlgorithms: ["TOTP", "WEBAUTHN", "SMS"],
  encryptionAlgorithm: "aes-256-gcm",
  kmsKeyVersion: "v1.0.0",
  complianceFrameworks: ["GDPR", "SOC2", "ISO27001", "HIPAA", "PCI_DSS"],
  threatSeverityLevels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
  policyEffectTypes: ["PERMIT", "DENY"],
};
