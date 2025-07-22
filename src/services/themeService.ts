import { defaultThemes } from "../constants/dreamThemes.js";
import { CreateResult, ValidationResult } from "../models/common.js";
import { getLogger } from "../utils/logger.js";
import { themeStorage } from "../utils/storage.js";
import { validateThemeInput } from "../validation/themeValidation.js";

const logger = getLogger();

/**
 * Clears all themes from storage.
 * @returns Success status
 */
export function clearThemes(): boolean {
  const clearSuccess = themeStorage.clear();
  if (clearSuccess) {
    logger.info("Cleared all themes from storage.");
  }
  return clearSuccess;
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

export function validateExistingTheme(theme: string): ValidationResult {
  const validation = validateThemeInput(theme);
  const errors = { ...validation.errors }; // shallow copy

  // If validated, check theme exists
  if (validation.isValid && !themeExists(theme)) {
    errors.theme = "Theme does not exist.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates theme creation input.
 */
function validateNewTheme(theme: string): ValidationResult {
  const validation = validateThemeInput(theme);
  const errors = { ...validation.errors }; // shallow copy
  let suggestions: Record<string, string> | undefined = {
    ...validation.suggestions,
  };

  // If validated, ensure theme doesn't already exist
  if (validation.isValid && themeExists(theme)) {
    errors.theme = "Theme already exists.";
    suggestions = undefined;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions: suggestions,
  };
}

type CreateThemeResult = CreateResult<string>;

/**
 * Creates and save a new theme.
 * @param theme Theme name string
 * @returns Result with success status, errors and created theme
 */
export function createTheme(theme: string): CreateThemeResult {
  // Validate input
  const validation = validateNewTheme(theme);
  if (!validation.isValid) {
    return {
      ...validation,
      data: undefined,
    };
  }

  // Load existing themes
  const themeList = loadThemes();

  // Add new theme to list and save
  themeList.push(theme);
  const saveSuccess = themeStorage.save(themeList);

  if (!saveSuccess) {
    return { isValid: false, errors: { general: "Failed to save them." } };
  }

  logger.info(`Added theme '${theme}'.`);
  return {
    isValid: true,
    errors: {},
    data: theme,
  };
}

/**
 * Deletes a theme.
 * @param theme The name string of the theme to delete
 * @returns Success status
 */
export function deleteTheme(theme: string): boolean {
  const themeList = loadThemes();
  const index = themeList.findIndex((t) => t === theme);

  if (index === -1) {
    logger.warn(`Failed to find theme '${theme}'.`);
    return false;
  }

  themeList.splice(index, 1);
  const saveSuccess = themeStorage.save(themeList);

  if (saveSuccess) {
    logger.info(`Theme '${theme}' deleted successfully.`);
  }
  return saveSuccess;
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
  logger.info("Saved default themes.");
  return true;
}
