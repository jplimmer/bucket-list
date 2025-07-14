import { Dream } from "../models/types.js";
import { getDreamList } from "../utils/storage.js";
import { createDreamListItem } from "./dreamListItem.js";
import { renderList } from "../utils/renderList.js";

export function renderDreams(container: HTMLElement): void {
  const dreamList = getDreamList();
  if (!dreamList) throw new Error("No dream list found in storage.");

  renderList<Dream>(container, dreamList, createDreamListItem);
}
