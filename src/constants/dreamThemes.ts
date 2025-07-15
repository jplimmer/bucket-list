/**
 * Default available dream themes as readonly literal types.
 * Can be used to generate a union type via `typeof defaultThemes[number]`.
 */
export const defaultThemes = [
  "teknikdrömmar",
  "vardagsdrömmar",
  "husdrömmar",
  "sportdrömmar",
  "resdrömmar",
] as const;

/**
 * Union type of all default dream themes.
 */
export type DefaultTheme = (typeof defaultThemes)[number];
