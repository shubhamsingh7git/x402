export const MARKETPLACE_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
  reputation: {
    weights: {
      communityReviews: 0.40,
      slaCompliance: 0.30,
      executionSuccess: 0.20,
      verificationStatus: 0.10,
    },
    defaultScore: 85.0,
    minReviewScore: 1.0,
    maxReviewScore: 5.0,
  },
  certificationTypes: ["VERIFIED", "ENTERPRISE", "OFFICIAL", "COMMUNITY", "EXPERIMENTAL"],
  statusFlow: {
    DRAFT: ["SUBMITTED", "ARCHIVED"],
    SUBMITTED: ["APPROVED", "REJECTED", "DRAFT"],
    APPROVED: ["ACTIVE", "SUSPENDED"],
    ACTIVE: ["SUSPENDED", "DEPRECATED"],
    SUSPENDED: ["ACTIVE", "ARCHIVED"],
    DEPRECATED: ["ARCHIVED"],
    ARCHIVED: [],
  },
};
