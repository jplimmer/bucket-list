import { Dream } from "../models/types.js";
import { dreamStorage } from "../utils/storage.js";
import { createDreamListItem } from "./dreamListItem.js";
import { renderList } from "../utils/renderList.js";
import { getLogger } from "../utils/logger.js";
import { displayError } from "../utils/displayError.js";

const logger = getLogger();

/**
 * Renders the complete dreams list into the specified container element.
 * @param container The HTML element to render the dreams list into
 * @throws Error when no dreams list is found in storage
 */
export function renderDreams(container: HTMLElement): void {
  try {
    const dreamList = dreamStorage.load();

    if (!dreamList) {
      logger.debug("No dream list found in storage.");
      displayError("No dreams found. Add one to get started!");
      return;
    }

    renderList<Dream>(container, dreamList, createDreamListItem);
  } catch (error) {
    logger.error("Failed to render dreams:", error);
    displayError("Dreams could not be displayed, try refreshing the page.");
  }
}
