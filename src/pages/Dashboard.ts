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

// Find DOM elements
const usernameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
const dreamUl = getRequiredElement<HTMLUListElement>(".dream-list");

/**
 * Initialises dashboard with username display and dream list rendering.
 */
document.addEventListener("DOMContentLoaded", () => {
  displayUsername(usernameSpan);
  renderDreams(dreamUl);
});

/**
 * Handles dream list interactions (delete, toggle check) via event delegation.
 */
dreamUl.addEventListener("click", (e) => {
  const container = e.currentTarget as HTMLUListElement;
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!btn) return;

  const listItem = btn.closest<HTMLLIElement>("li[data-id]");
  if (!listItem)
    throw new Error(`No list item found related to element ${btn.outerHTML}`);

  const idStr = listItem.dataset.id;
  if (!idStr || isNaN(Number(idStr)))
    throw new Error(`Invalid or missing data-id: ${idStr}`);

  const id = Number(idStr);
  const action = btn.dataset.action;

  if (action === "delete-dream") {
    deleteDream(id);
    renderDreams(container);
  }

  if (action === "toggle-check") {
    const checkbox = e.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    toggleDreamChecked(id, isChecked);
  }
});
