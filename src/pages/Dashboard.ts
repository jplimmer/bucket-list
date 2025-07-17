import { getRequiredElement } from "../utils/domHelpers.js";
import { displayUsername } from "../ui/displayUsername.js";
import { deleteDream, updateDreamChecked } from "../services/dreamService.js";
import { renderDreams } from "../ui/renderList.js";
import { redirectIfNotLoggedIn } from "../services/authService.js";
import { getLogger } from "../utils/logger.js";
import { displayError } from "../ui/displayError.js";

const logger = getLogger();

/**
 * Dashboard page controller - manages dream list interactions and user display.
 */

/**
 * Handles dream deletion with error handling.
 * @param container HTML element where dreams are rendered
 * @param dreamId The ID of the dream to delete
 */
function handleDreamDeletion(container: HTMLElement, dreamId: number): void {
  try {
    deleteDream(dreamId);
    renderDreams(container);
  } catch (error) {
    logger.error(`Error deleting dream ${dreamId}:`, error);
    displayError("Dream could not be removed.");
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
  checkbox: HTMLInputElement
): void {
  const previousState = !isChecked;

  try {
    updateDreamChecked(dreamId, isChecked);
  } catch (error) {
    logger.error(`Error toggling dream ${dreamId}:`, error);

    // Rollback checkbox state
    checkbox.checked = previousState;
    displayError("Dream could not be (un)checked.");
  }
}

/**
 * Handles dream list interactions (delete, toggle check) via event delegation.
 * @param e The click event
 */
function handleDreamListClick(e: MouseEvent): void {
  const container = e.currentTarget as HTMLUListElement;
  const target = e.target as HTMLElement;

  // Find parent button of the target
  const btn = target.closest<HTMLElement>("[data-action]");
  if (!btn) return;

  // Find parent list item of the button
  const listItem = btn.closest<HTMLLIElement>("li[data-id]");
  if (!listItem)
    throw new Error(`No list item found for button: ${btn.outerHTML}`);

  const idStr = listItem.dataset.id;
  if (!idStr || isNaN(Number(idStr)))
    throw new Error(`Invalid or missing data-id: ${idStr}`);

  const dreamId = Number(idStr);
  const action = btn.dataset.action;

  // Call appropriate function for action, warn if action not recognised
  switch (action) {
    case "delete-dream":
      handleDreamDeletion(container, dreamId);
      break;

    case "toggle-check":
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        handleDreamToggle(dreamId, target.checked, target);
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
