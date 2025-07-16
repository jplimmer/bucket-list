import { Dream } from "../models/types.js";
import { generateId } from "../utils/generateId.js";
import { getLogger } from "../utils/logger.js";
import { dreamStorage } from "../utils/storage.js";

const logger = getLogger();

/**
 *
 * @returns An array of `Dream` objects or an empty array
 */
export function loadDreams(): Dream[] {
  const dreamList = dreamStorage.load();
  if (!dreamList) {
    logger.error("Dream list could not be loaded from storage.");
    return [];
  }
  return dreamList;
}

/**
 * Finds the index of a dream in the dream list by ID.
 * @param dreamList The list of dreams to search
 * @param id The ID of the dream to find
 * @returns The index of the dream in the list
 * @throws Error when no matching dream ID is found
 */
function getDreamIndex(dreamList: Dream[], id: number): number {
  const index = dreamList.findIndex((dream) => dream.id === id);

  if (index === -1) {
    throw new Error("Matching index not found in dream list.");
  }
  return index;
}

/**
 * Adds a new dream to the dream list.
 * @param name The name string of the new dream
 * @param theme The theme string of the new dream
 */
export function addDream(name: string, theme: string): void {
  const dreamList = loadDreams();

  const newId = generateId(undefined, dreamList);
  dreamList.push({
    id: newId,
    name: name,
    theme: theme,
    isChecked: false,
  });

  const saveSuccess = dreamStorage.save(dreamList);
  if (!saveSuccess) throw new Error("Could not save updated dream list.");
}

/**
 * Removes a dream from the dream list by ID.
 * @param id The ID of the dream to delete
 * @throws Error when dream list is not found in storage or dream ID doesn't exist
 */
export function deleteDream(id: number): void {
  const dreamList = loadDreams();

  const index = getDreamIndex(dreamList, id);
  dreamList.splice(index, 1);

  const saveSuccess = dreamStorage.save(dreamList);
  if (!saveSuccess) throw new Error("Could not save updated dream list.");
}

/**
 * Updates the checked status of a dream by ID.
 * @param id The ID of the dream to update
 * @param isChecked The new checked status
 * @throws Error when dream list is not found in storage or dream ID doesn't exist
 */
export function toggleDreamChecked(id: number, isChecked: boolean): void {
  const dreamList = loadDreams();

  const index = getDreamIndex(dreamList, id);
  dreamList[index].isChecked = isChecked;

  const saveSuccess = dreamStorage.save(dreamList);
  if (!saveSuccess) throw new Error("Could not save updated dream list.");
}
