export enum MarketplaceStatusEnum {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DEPRECATED = "DEPRECATED",
  ARCHIVED = "ARCHIVED",
}

export type MarketplaceStatus = keyof typeof MarketplaceStatusEnum;
