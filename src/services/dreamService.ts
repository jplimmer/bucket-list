import { ValidationResult, CreateResult } from "../models/common.js";
import { Dream } from "../models/domain.js";
import { generateId } from "../utils/generateId.js";
import { getLogger } from "../utils/logger.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";
import { dreamStorage } from "../utils/storage.js";
import { validateExistingTheme } from "./themeService.js";

const logger = getLogger();

/**
 * Clears all dreams from storage.
 * @returns Success status
 */
export function clearDreams(): boolean {
  const clearSuccess = dreamStorage.clear();
  if (clearSuccess) {
    logger.info("Cleared all dreams from storage.");
  }
  return clearSuccess;
}

/**
 * Loads all dreams from storage.
 * @returns Array of `Dream` objects, or empty array if loading fails
 */
export function loadDreams(): Dream[] {
  return dreamStorage.load() || [];
}

/**
 * Validates dream creation inputs.
 */
function validateDreamInputs(name: string, theme: string): ValidationResult {
  const errors: Record<string, string> = {};
  let suggestion: Record<string, string> | undefined;

  // Sanitise name input
  const sanitisation = sanitiseInput(name);
  const cleanDreamName = sanitisation.sanitisedInput;

  if (!sanitisation.isSafe) {
    errors.dream = sanitisation.issues.join("\n");
    suggestion = { dreamName: cleanDreamName };
  }

  // Validate theme exists
  const validation = validateExistingTheme(theme);
  if (!validation.isValid) {
    errors.theme = validation.errors.theme;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions: suggestion,
  };
}

type CreateDreamResult = CreateResult<Dream>;

/**
 * Creates and saves a new dream.
 * @param name Dream name
 * @param theme Dream theme
 * @param isChecked Dream checked status, defaults to false
 * @returns Result with success status, errors and created dream
 */
export function createDream(
  name: string,
  theme: string,
  isChecked: boolean = false
): CreateDreamResult {
  // Validate input
  const validation = validateDreamInputs(name, theme);
  if (!validation.isValid) {
    return {
      ...validation,
      data: undefined,
    };
  }

  // Load existing dreams
  const dreamList = loadDreams();

  // Create new dream
  const newDream: Dream = {
    id: generateId(undefined, dreamList),
    name: name.trim(),
    theme: theme.trim(),
    isChecked: isChecked,
  };

  // Add to list and save
  dreamList.push(newDream);
  const saveSuccess = dreamStorage.save(dreamList);

  if (!saveSuccess) {
    return { isValid: false, errors: { general: "Failed to save dream." } };
  }

  logger.info(`Added dream with id ${newDream.id}`);
  return {
    isValid: true,
    errors: {},
    data: newDream,
  };
}

/**
 * Deletes a dream by ID.
 * @param id The ID of the dream to delete
 * @returns Success status
 */
export function deleteDream(id: number): boolean {
  const dreamList = loadDreams();
  const index = dreamList.findIndex((dream) => dream.id === id);

  if (index === -1) {
    logger.warn(`Failed to find dream id ${id}.`);
    return false;
  }

  dreamList.splice(index, 1);
  const saveSuccess = dreamStorage.save(dreamList);

  if (saveSuccess) {
    logger.info(`Dream id ${id} deleted successfully.`);
  }
  return saveSuccess;
}

/**
 * Updates dream checked status.
 * @param id ID of the dream to update
 * @param isChecked New checked status
 * @returns Success status
 */
export function updateDreamChecked(id: number, isChecked: boolean): boolean {
  const dreamList = loadDreams();
  const dream = dreamList.find((dream) => dream.id === id);

  if (!dream) {
    logger.warn(`Failed to find dream id ${id}.`);
    return false;
  }

  dream.isChecked = isChecked;
  const saveSuccess = dreamStorage.save(dreamList);

  if (saveSuccess) {
    logger.info(`Updated dream id ${id} to isChecked: ${isChecked}.`);
  }
  return saveSuccess;
}
