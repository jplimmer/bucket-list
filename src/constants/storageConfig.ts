/** Storage type for persisting user data. */
export const STORAGE_CONFIG = {
  /** Type of storage to use for saving data. */
  STORAGE_TYPE: sessionStorage,
} as const;

/** Storage keys for persisting user data. */
export const STORAGE_KEYS = {
  /** Storage key for username. */
  USERNAME: "username",
  /** Storage key for dreams list. */
  DREAMS: "dreams",
  /** Storage key for themes list. */
  THEMES: "themes",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
