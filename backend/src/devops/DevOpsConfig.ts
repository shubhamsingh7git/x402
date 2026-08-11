export const DEVOPS_CONFIG = {
  defaultKubernetesVersion: "v1.30.2",
  defaultHelmVersion: "v3.15.0",
  defaultTerraformVersion: "v1.9.0",
  deploymentStrategies: ["CANARY", "BLUE_GREEN", "ROLLING_UPDATE"],
  gitOpsSyncIntervalSeconds: 60,
  hpaCpuThresholdPercent: 80,
  hpaMemoryThresholdPercent: 85,
  cosignAlgorithm: "ECDSA_P256_SHA256",
};
