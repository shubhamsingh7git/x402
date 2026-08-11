export const BAZAAR_EVENTS = {
  PROVIDER_CREATED: "bazaar:providerCreated",
  PROVIDER_UPDATED: "bazaar:providerUpdated",
  PROVIDER_REMOVED: "bazaar:providerRemoved",
  CAPABILITY_CREATED: "bazaar:capabilityCreated",
  RANK_CHANGED: "bazaar:providerRankChanged",
  SEARCH_COMPLETED: "bazaar:searchCompleted",
} as const;

export type BazaarEventKey = typeof BAZAAR_EVENTS[keyof typeof BAZAAR_EVENTS];
