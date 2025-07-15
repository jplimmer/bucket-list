import { Dream } from "../models/types.js";
import { getDreamList } from "../utils/storage.js";
import { createDreamListItem } from "./dreamListItem.js";
import { renderList } from "../utils/renderList.js";

/**
 * Renders the complete dreams list into the specified container element.
 * @param container The HTML element to render the dreams list into
 * @throws Error when no dreams list is found in storage
 */
export function renderDreams(container: HTMLElement): void {
  const dreamList = getDreamList();
  if (!dreamList) throw new Error("No dream list found in storage.");

  renderList<Dream>(container, dreamList, createDreamListItem);
}
