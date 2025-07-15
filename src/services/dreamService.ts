import { Dream } from "../models/types.js";
import { getDreamList, saveDreamList } from "../utils/storage.js";

/**
 * Adds a new dream to the dream list.
 */
export function addDream() {}

/**
 * Removes a dream from the dream list by ID.
 * @param id The ID of the dream to delete
 * @throws Error when dream list is not found in storage or dream ID doesn't exist
 */
export function deleteDream(id: number): void {
  const dreamList = getDreamList();
  if (!dreamList) throw new Error("Dream list not found in storage.");

  const index = getDreamIndex(dreamList, id);
  dreamList.splice(index, 1);

  const saveSuccess = saveDreamList(dreamList);
  if (!saveSuccess) {
    console.error("Could not save updated dream list.");
  }
}

/**
 * Updates the checked status of a dream by ID.
 * @param id The ID of the dream to update
 * @param isChecked The new checked status
 * @throws Error when dream list is not found in storage or dream ID doesn't exist
 */
export function toggleDreamChecked(id: number, isChecked: boolean): void {
  const dreamList = getDreamList();
  if (!dreamList) throw new Error("Dream list not found in storage.");

  const index = getDreamIndex(dreamList, id);
  dreamList[index].isChecked = isChecked;

  const saveSuccess = saveDreamList(dreamList);
  if (!saveSuccess) {
    console.error("Could not save updated dream list.");
  }
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
