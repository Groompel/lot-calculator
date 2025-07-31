export const appConfig = {
  name: 'Trading Calculator',
  version: '1.0.0',
  company: 'Empire FX by rr.gali',

  // Default settings
  defaults: {
    symbol: 'XAUUSD',
    riskPercentage: 2,
    accountBalance: 10000,
  },

  // Limits and constraints
  limits: {
    maxRiskPercentage: 10,
    minRiskPercentage: 0.1,
    maxAccountBalance: 10000000,
    minAccountBalance: 100,
  },

  // Feature flags
  features: {
    socialLinks: true,
    analytics: false,
    multipleSymbols: true,
    advancedCalculations: true,
  },

  // Social links
  social: {
    twitter: '#',
    linkedin: '#',
    facebook: '#',
    instagram: '#',
  },

  // Theme configuration
  theme: {
    defaultColorScheme: 'auto' as const,
    enableColorSchemeToggle: true,
  },
} as const;
