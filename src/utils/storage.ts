import {
  STORAGE_CONFIG,
  STORAGE_KEYS,
  StorageKey,
} from "../constants/storageConfig.js";
import { Dream } from "../models/domain.js";
import { getLogger } from "./logger.js";
import { sanitiseInput } from "./sanitiseInput.js";

const logger = getLogger();

// Define storage schema for type safety
interface StorageSchema {
  [STORAGE_KEYS.USERNAME]: string;
  [STORAGE_KEYS.DREAMS]: Dream[];
  [STORAGE_KEYS.THEMES]: string[];
}

/**
 * Clears all data from localStorage.
 * @returns true if successful, false if an error occurred
 */
export function clearAllStorage(): boolean {
  try {
    STORAGE_CONFIG.STORAGE_TYPE.clear();
    return true;
  } catch (error) {
    logger.error(`Failed to clear ${STORAGE_CONFIG.STORAGE_TYPE}:`, error);
    return false;
  }
}

/**
 * Generic function to save data to storage, with optional sanitisation of string input.
 * @param key The storage key
 * @param value The value to save
 * @param sanitise Whether to sanitise the input (for strings only)
 * @returns true if saved successfully, false if error occurred
 */
function saveToStorage<K extends StorageKey>(
  key: K,
  value: StorageSchema[K],
  sanitise: boolean = true
): boolean {
  try {
    let storageValue = value;

    // Sanitise value if required
    if (sanitise && typeof value === "string") {
      const sanitisationResult = sanitiseInput(value);

      if (!sanitisationResult.isSafe) {
        const errors = sanitisationResult.issues.join("\n");
        logger.error(`Value for ${key} failed sanitisation checks:`, errors);
        return false;
      }

      storageValue = sanitisationResult.sanitisedInput as StorageSchema[K];
    }

    // Save to storage as JSON
    STORAGE_CONFIG.STORAGE_TYPE.setItem(key, JSON.stringify(storageValue));
    return true;
  } catch (error) {
    logger.error(`Failed to save ${key}:`, error);
    return false;
  }
}

/**
 * Generic function to retrieve and parse data from storage.
 * Attempts to clean up corrupted data if parsing fails.
 * @param key The storage key
 * @returns The value if found, null if not found or error occurred
 */
function getFromStorage<K extends StorageKey>(key: K): StorageSchema[K] | null {
  try {
    const storedValue = STORAGE_CONFIG.STORAGE_TYPE.getItem(key);
    if (!storedValue) return null;

    try {
      return JSON.parse(storedValue) as StorageSchema[K];
    } catch (parseError) {
      logger.error(`Failed to parse stored value for ${key}:`, parseError);
      // Clean up potentially corrupted data
      try {
        STORAGE_CONFIG.STORAGE_TYPE.removeItem(key);
      } catch (cleanupError) {
        logger.error(
          `Failed to clean up corrupted data for ${key}:`,
          cleanupError
        );
      }
      return null;
    }
  } catch (error) {
    logger.error(`Failed to retrieve ${key}:`, error);
    return null;
  }
}

/**
 * Removes a specific item from storage.
 * @param key The storage key to remove
 * @returns true if successful, false if error occurred
 */
function removeFromStorage<K extends StorageKey>(key: K): boolean {
  try {
    STORAGE_CONFIG.STORAGE_TYPE.removeItem(key);
    return true;
  } catch (error) {
    logger.error(`Failed to remove ${key}:`, error);
    return false;
  }
}

/**
 * Factory function that creates a type-safe storage interface for a given key.
 * @param key The storage key to create an interface for
 * @returns Object with save(), load() and clear() methods for the specified key
 */
function createStorage<K extends StorageKey>(key: K) {
  return {
    save: (data: StorageSchema[K]) => saveToStorage(key, data),
    load: () => getFromStorage(key),
    clear: () => removeFromStorage(key),
  };
}

// Export storage instances for modules to use
export const userStorage = createStorage(STORAGE_KEYS.USERNAME);
export const dreamStorage = createStorage(STORAGE_KEYS.DREAMS);
export const themeStorage = createStorage(STORAGE_KEYS.THEMES);
