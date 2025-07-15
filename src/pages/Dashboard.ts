import { getRequiredElement } from "../utils/domHelpers.js";
import { displayUsername } from "../ui/displayUsername.js";
import { deleteDream, toggleDreamChecked } from "../services/dreamService.js";
import { renderDreams } from "../ui/renderDreams.js";
import { redirectIfNotLoggedIn } from "../services/authService.js";

/**
 * Dashboard page controller - manages dream list interactions and user display.
 */

// Redirect if not logged in
redirectIfNotLoggedIn();

/**
 * Handles dream deletion with error handling
 * @param container
 * @param dreamId The ID of the dream to delete
 */
async function handleDreamDeletion(
  container: HTMLElement,
  dreamId: number
): Promise<void> {
  try {
    await deleteDream(dreamId);
    console.log(`Dream ${dreamId} deleted successfully`);
    renderDreams(container);
  } catch (error) {
    console.error(`Error deleting dream ${dreamId}:`, error);
  }
}

/**
 * Handles dream checkbox toggle with error handling.
 * @param dreamId The ID of the dream to toggle
 * @param isChecked The new checked state
 * @param checkbox The checkbox element for rollback on error
 */
async function handleDreamToggle(
  dreamId: number,
  isChecked: boolean,
  checkbox: HTMLInputElement
): Promise<void> {
  const previousState = !isChecked;

  try {
    await toggleDreamChecked(dreamId, isChecked);
    console.log(
      `Dream ${dreamId} toggled to ${isChecked ? "checked" : "unchecked"}`
    );
  } catch (error) {
    console.error(`Error toggling dream ${dreamId}:`, error);

    // Rollback checkbox state
    checkbox.checked = previousState;
  }
}

/**
 * Handles dream list interactions (delete, toggle check) via event delegation.
 * @param e The click event
 */
async function handleDreamListClick(e: Event): Promise<void> {
  const container = e.currentTarget as HTMLUListElement;
  const target = e.target as HTMLElement;

  const btn = target.closest<HTMLElement>("[data-action]");
  if (!btn) return;

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
      await handleDreamDeletion(container, dreamId);
      break;

    case "toggle-check":
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        await handleDreamToggle(dreamId, target.checked, target);
      } else {
        console.error("Toggle action triggered on non-checkbox element.");
      }
      break;

    default:
      console.warn("Unknown action:", action);
  }
}

/**
 * Initialises dashboard with username display and dream list rendering.
 */
function initaliseDashboardPage(): void {
  // Find DOM elements
  const usernameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
  const dreamUl = getRequiredElement<HTMLUListElement>(".dream-list");

  // Display username in header
  displayUsername(usernameSpan);

  // Render dream list
  renderDreams(dreamUl);

  // Add dream-list click handler
  dreamUl.addEventListener("click", handleDreamListClick);
}

initaliseDashboardPage();
