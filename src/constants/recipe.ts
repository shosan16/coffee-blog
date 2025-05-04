export const ROAST_LEVELS = {
  LIGHT: 'light',
  LIGHT_MEDIUM: 'light-medium',
  MEDIUM: 'medium',
  MEDIUM_DARK: 'medium-dark',
  DARK: 'dark',
} as const;

export const GRIND_SIZES = {
  EXTRA_FINE: 'extra-fine',
  FINE: 'fine',
  MEDIUM_FINE: 'medium-fine',
  MEDIUM: 'medium',
  MEDIUM_COARSE: 'medium-coarse',
  COARSE: 'coarse',
} as const;

export type RoastLevel = (typeof ROAST_LEVELS)[keyof typeof ROAST_LEVELS];
export type GrindSize = (typeof GRIND_SIZES)[keyof typeof GRIND_SIZES];
