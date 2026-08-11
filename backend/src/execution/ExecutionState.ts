export enum ExecutionStateEnum {
  CREATED = "CREATED",
  DISCOVERING = "DISCOVERING",
  RANKING = "RANKING",
  EXECUTING = "EXECUTING",
  WAITING_FALLBACK = "WAITING_FALLBACK",
  CONSENSUS = "CONSENSUS",
  PAYMENT = "PAYMENT",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type ExecutionState = keyof typeof ExecutionStateEnum;
