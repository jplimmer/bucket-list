type StorageType = typeof localStorage | typeof sessionStorage;

interface StorageConfig {
  /** Type of storage to use for saving data. */
  STORAGE_TYPE: StorageType;
  /** Storage key for username. */
  USERNAME: string;
  /** Storage key for dream list. */
  DREAM_LIST: string;
}

/** Local storage keys for persisting user data. */
export const STORAGE_CONFIG: StorageConfig = {
  STORAGE_TYPE: localStorage,
  USERNAME: "username",
  DREAM_LIST: "dream-list",
} as const;
