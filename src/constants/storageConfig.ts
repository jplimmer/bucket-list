/** Storage keys for persisting user data. */
export const STORAGE_KEYS = {
  /** Storage key for storage type preference. */
  STORAGE_TYPE: "storageType",
  /** Storage key for username. */
  USERNAME: "username",
  /** Storage key for dreams list. */
  DREAMS: "dreams",
  /** Storage key for themes list. */
  THEMES: "themes",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
