export const DEVOPS_EVENTS = {
  DEPLOYMENT_STARTED: "devops:deploymentStarted",
  DEPLOYMENT_COMPLETED: "devops:deploymentCompleted",
  DEPLOYMENT_FAILED: "devops:deploymentFailed",
  ROLLBACK_STARTED: "devops:rollbackStarted",
  ROLLBACK_COMPLETED: "devops:rollbackCompleted",
  PIPELINE_STARTED: "devops:pipelineStarted",
  PIPELINE_COMPLETED: "devops:pipelineCompleted",
  BACKUP_COMPLETED: "devops:backupCompleted",
  RESTORE_COMPLETED: "devops:restoreCompleted",
  CLUSTER_HEALTH_CHANGED: "devops:clusterHealthChanged",
} as const;
