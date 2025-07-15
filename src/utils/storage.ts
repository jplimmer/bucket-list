import { STORAGE_CONFIG } from "../constants/storageConfig.js";
import { Dream } from "../models/types.js";
import { sanitiseInput } from "./sanitiseInput.js";

/**
 * Clears all data from localStorage.
 * @returns true if successful, false if an error occurred
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
    return false;
  }
}

/**
 * Saves a username to localStorage after sanitisation.
 * @param username The username string to save
 * @returns true if saved successfully, false if sanitisation failed or storage error occurred
 */
export function saveUsername(username: string): boolean {
  try {
    const usernameSanitisationResult = sanitiseInput(username);

    if (!usernameSanitisationResult.isSafe) {
      const errors = usernameSanitisationResult.issues.join("\n");
      console.error("Username failed sanitisation checks:", errors);
      return false;
    }

    localStorage.setItem(
      STORAGE_CONFIG.USERNAME,
      usernameSanitisationResult.sanitisedInput
    );
    return true;
  } catch (error) {
    console.error("Failed to save username:", error);
    return false;
  }
}

/**
 * Retrieves the stored username from localStorage.
 * @returns the username string if found, null if not found or storage error occurred
 */
export function getUsername(): string | null {
  try {
    return localStorage.getItem(STORAGE_CONFIG.USERNAME);
  } catch (error) {
    console.error("localStorage access failed:", error);
    return null;
  }
}

/**
 * Saves a list of dreams to localStorage as JSON.
 * @param dreamList Array of Dream objects to save
 * @returns true if saved successfully, false if error occurred
 */
export function saveDreamList(dreamList: Dream[]): boolean {
  try {
    localStorage.setItem(STORAGE_CONFIG.DREAM_LIST, JSON.stringify(dreamList));
    return true;
  } catch (error) {
    console.error("Failed to save dream list:", error);
    return false;
  }
}

/**
 * Retrieves and parses the dream list from localStorage.
 * Automatically cleans up corrupted data if parsing fails.
 * @returns array of Dream objects if found and valid, null if not found or corrupted
 */
export function getDreamList(): Dream[] | null {
  try {
    const storedList = localStorage.getItem(STORAGE_CONFIG.DREAM_LIST);
    if (!storedList) return null;

    const dreams: Dream[] = JSON.parse(storedList);
    return dreams;
  } catch (error) {
    console.error("Failed to retrieve or parse dream list:", error);
    // Clean up potentially corrupted data
    try {
      localStorage.removeItem(STORAGE_CONFIG.DREAM_LIST);
    } catch (cleanupError) {
      console.error("Failed to clean up corrupted dream list:", error);
    }
    return null;
  }
}
