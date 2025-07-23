import { BUTTON_ACTIONS } from "../constants/globalConfig.js";
import { DREAM_MESSAGES } from "../constants/messages.js";
import { redirectIfNotLoggedIn } from "../services/authService.js";
import { deleteDream, updateDreamChecked } from "../services/dreamService.js";
import { displayError } from "../ui/displayError.js";
import { displayUsername } from "../ui/displayUsername.js";
import { renderDreams } from "../ui/renderList.js";
import { getRequiredElement, getLogger } from "../utils/index.js";

/**
 * Dashboard page controller - manages dream list interactions and user display.
 */

const logger = getLogger();

/**
 * Handles dream deletion with error handling.
 * @param container HTML element where dreams are rendered
 * @param dreamId The ID of the dream to delete
 */
function handleDreamDeletion(
  container: HTMLElement,
  dreamId: number,
  announcer?: HTMLElement
): void {
  try {
    deleteDream(dreamId);
    if (announcer) {
      announcer.textContent = `Dröm ${dreamId} bortagen!`;
    }
    renderDreams(container);
  } catch (error) {
    logger.error(`Error deleting dream ${dreamId}:`, error);
    displayError(DREAM_MESSAGES.ERROR.NOT_DELETED);
  }
}

/**
 * Handles dream checkbox toggle with error handling.
 * @param dreamId The ID of the dream to toggle
 * @param isChecked The new checked state
 * @param checkbox The checkbox element for rollback on error
 */
function handleDreamToggle(
  dreamId: number,
  isChecked: boolean,
  checkbox: HTMLInputElement,
  announcer?: HTMLElement
): void {
  const previousState = !isChecked;

  try {
    updateDreamChecked(dreamId, isChecked);
    if (announcer) {
      announcer.textContent = `Dröm ${dreamId} markerad som ${
        isChecked ? "slutförd" : "inte slutförd"
      }!`;
    }
  } catch (error) {
    logger.error(`Error toggling dream ${dreamId}:`, error);

    // Rollback checkbox state
    checkbox.checked = previousState;
    displayError(DREAM_MESSAGES.ERROR.NOT_TOGGLED);
  }
}

/**
 * Extracts dream ID from a list item, via the dataset.id attribute.
 */
function getDreamIdFromListItem(listItem: HTMLLIElement): number {
  const idStr = listItem.dataset.id;
  if (!idStr || isNaN(Number(idStr)))
    throw new Error(`Invalid or missing data-id: ${idStr}`);

  return Number(idStr);
}

/**
 * Handles dream list interactions (delete, toggle check) via event delegation.
 * @param e The click event
 */
function handleDreamListClick(e: MouseEvent): void {
  const container = e.currentTarget as HTMLUListElement;
  const target = e.target as HTMLElement;
  const announcer = getRequiredElement<HTMLDivElement>("#update-status");

  // Find parent button of the target
  const btn = target.closest<HTMLElement>("[data-action]");
  if (!btn) return;

  // Find parent list item of the button
  const listItem = btn.closest<HTMLLIElement>("li[data-id]");
  if (!listItem)
    throw new Error(`No list item found for button: ${btn.outerHTML}`);

  const dreamId = getDreamIdFromListItem(listItem);
  const action = btn.dataset.action;

  // Call appropriate function for action, warn if action not recognised
  switch (action) {
    case BUTTON_ACTIONS.DELETE_DREAM:
      handleDreamDeletion(container, dreamId, announcer);
      break;

    case BUTTON_ACTIONS.TOGGLE_CHECK:
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        handleDreamToggle(dreamId, target.checked, target, announcer);
      } else {
        logger.error("Toggle action triggered on non-checkbox element.");
      }
      break;

    default:
      logger.warn("Unknown action:", action);
  }
}

/**
 * Initialises Dashboard page with username display, dream list rendering and event listener.
 */
function initialiseDashboardPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Display username in header
  const usernameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
  displayUsername(usernameSpan);

  // Render dream list
  const dreamUl = getRequiredElement<HTMLUListElement>(".dream-list");
  renderDreams(dreamUl);

  // Add dream-list click handler
  dreamUl.addEventListener("click", handleDreamListClick);
}

// Entry point: renders dream list and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseDashboardPage);
