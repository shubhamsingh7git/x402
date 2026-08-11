export enum IntelligenceStateEnum {
  COLLECTING = "COLLECTING",
  INDEXING = "INDEXING",
  LEARNING = "LEARNING",
  OPTIMIZING = "OPTIMIZING",
  RECOMMENDING = "RECOMMENDING",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  APPLIED = "APPLIED",
  ARCHIVED = "ARCHIVED",
}

export type IntelligenceState = keyof typeof IntelligenceStateEnum;
