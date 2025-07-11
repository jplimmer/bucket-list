export interface Dream {
  id: number;
  name: string;
  theme: string;
  isChecked: boolean;
}

// Editable array of literal types (use with type T = typeof themes[number])
export const themes = [
  "teknikdrömmar",
  "vardagsdrömmar",
  "husdrömmar",
  "sportdrömmar",
  "resdrömmar",
] as const;
