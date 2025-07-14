import { Dream } from "../models/types.js";
import { getDreamList, saveDreamList } from "../utils/storage.js";

export function addDream() {}

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

function getDreamIndex(dreamList: Dream[], id: number): number {
  const index = dreamList.findIndex((dream) => dream.id === id);

  if (index === -1) {
    throw new Error("Matching index not found in dream list.");
  }
  return index;
}
