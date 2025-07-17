import { Dream } from "../models/domain.js";
import { createDreamListItem, createThemeListItem } from "./createListItem.js";
import { getLogger } from "../utils/logger.js";
import { displayError } from "./displayError.js";
import { loadDreams } from "../services/dreamService.js";
import { loadThemes } from "../services/themeService.js";

const logger = getLogger();

/**
 * Renders a list of items as HTML List Item elements in a container.
 * @param container Container element to render the list in
 * @param list Array of items to render
 * @param callback Function that converts each item to an HTMLLIElement
 */
export function renderList<T>(
  container: HTMLElement,
  list: T[],
  callback: (item: T) => HTMLLIElement
): void {
  const frag = document.createDocumentFragment();

  for (const item of list) {
    const li = callback(item);
    frag.append(li);
  }

  container.replaceChildren(frag);
}

/**
 * Renders the complete dreams list into the specified container element.
 * @param container The HTML element to render the dreams list into
 * @throws Error when no dreams list is found in storage
 */
export function renderDreams(container: HTMLElement): void {
  try {
    const dreamList = loadDreams();
    renderList<Dream>(container, dreamList, createDreamListItem);
  } catch (error) {
    logger.error("Failed to render dreams:", error);
    displayError("Dreams could not be displayed, try refreshing the page.");
  }
}

/**
 * Renders the complete themes list into the specified container element.
 * @param container The HTML element to render the themes list into
 * @throws Error when no theme list is found in storage
 */
export function renderThemes(container: HTMLElement): void {
  try {
    const themeList = loadThemes();
    renderList<string>(container, themeList, createThemeListItem);
  } catch (error) {
    logger.error("Failed to render themes:", error);
    displayError("Themes could not be displayed, try refreshing the page.");
  }
}
