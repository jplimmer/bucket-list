import { STORAGE_CONFIG } from "../constants/storageConfig.js";
import { Dream } from "../models/types.js";
import { validateAndSanitiseInput } from "./sanitiseInput.js";

export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
    return false;
  }
}

export function saveUsername(username: string): boolean {
  try {
    const usernameSanitisationResult = validateAndSanitiseInput(username);

    if (!usernameSanitisationResult.isValid) {
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

export function getUsername(): string | null {
  try {
    return localStorage.getItem(STORAGE_CONFIG.USERNAME);
  } catch (error) {
    console.error("localStorage access failed:", error);
    return null;
  }
}

export function saveDreamList(dreamList: Dream[]): boolean {
  try {
    localStorage.setItem(STORAGE_CONFIG.DREAM_LIST, JSON.stringify(dreamList));
    return true;
  } catch (error) {
    console.error("Failed to save dream list:", error);
    return false;
  }
}

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
