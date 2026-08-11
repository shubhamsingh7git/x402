export const FEATURE_FLAGS = {
  BAZAAR: true,
  MARKETPLACE: true,
  MULTI_AGENT: false,
  LIVE_PAYMENTS: true,
  ADMIN_PANEL: true,
  ANALYTICS_V2: true,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (key: FeatureFlagKey): boolean => {
  return FEATURE_FLAGS[key] ?? false;
};
