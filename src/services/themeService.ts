import { defaultThemes } from "../constants/dreamThemes.js";
import { getLogger } from "../utils/logger.js";
import { themeStorage } from "../utils/storage.js";

const logger = getLogger();

/**
 * Clears all themes from storage.
 * @returns Success status
 */
export function clearThemes(): boolean {
  return themeStorage.clear();
}

/**
 * Loads all themes from storage.
 * @returns Array of string themes, or empty array if loading fails
 */
export function loadThemes(): string[] {
  return themeStorage.load() || [];
}

/**
 * Checks theme string exists in current theme list from storage (case-insensitive).
 */
export function themeExists(theme: string): boolean {
  const normalisedTheme = theme.toLowerCase();
  const themeList = loadThemes().map((t) => t.toLowerCase());
  return themeList.includes(normalisedTheme);
}

export function createTheme() {}

/**
 * Deletes a theme.
 * @param theme The name string of the theme to delete
 * @returns Success status
 */
export function deleteTheme(theme: string): boolean {
  const themeList = loadThemes();
  const index = themeList.findIndex((t) => t === theme);

  if (index === -1) {
    return false;
  }

  themeList.splice(index, 1);
  return themeStorage.save(themeList);
}

/**
 * Clears existing themes and saves default themes in storage.
 * Saves "dröm" as fallback if error saving default themes.
 * @returns Success status
 */
export function saveDefaultThemes(): boolean {
  if (!clearThemes()) {
    return false;
  }
  if (!themeStorage.save(defaultThemes)) {
    logger.warn("Failed to save default themes, trying fallback...");
    if (!themeStorage.save(["dröm"])) {
      logger.error("Failed to save default or fallback themes.");
      return false;
    }
  }
  return true;
}
