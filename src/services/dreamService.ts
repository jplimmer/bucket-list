import { CreateResult, ValidationResult } from "../models/common.js";
import { Dream } from "../models/domain.js";
import { generateId } from "../utils/generateId.js";
import { getLogger } from "../utils/logger.js";
import { dreamStorage } from "../utils/storage.js";
import { validateDreamForm } from "../validation/dreamValidation.js";

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
 * Checks if a dream with the specified name exists in current dream list from storage (case-insensitive).
 * Optionally checks for a matching theme as well.
 */
function dreamExists(name: string, theme?: string): boolean {
  const dreamList = loadDreams();

  return dreamList.some((dream) => {
    const nameMatches = dream.name.toLowerCase() === name.toLowerCase();
    const themeMatches =
      !theme || dream.theme.toLowerCase() === theme.toLowerCase(); // short-circuits if theme is undefined

    // Both conditions must be true
    return nameMatches && themeMatches;
  });
}

/**
 * Validates dream creation input.
 */
function validateNewDream(name: string, theme: string): ValidationResult {
  const validation = validateDreamForm(name, theme);
  const errors = { ...validation.errors }; // shallow copy
  let suggestions: Record<string, string> | undefined = {
    ...validation.suggestions,
  };

  // If validated, ensure dream doesn't already exist (in any category)
  if (validation.isValid && dreamExists(name)) {
    errors.dream = "Dream already exists.";
    suggestions = undefined;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions: suggestions,
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
  const validation = validateNewDream(name, theme);
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
    name: name,
    theme: theme,
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
