import {
  loadUsername,
  redirectIfNotLoggedIn,
} from "../services/authService.js";
import { deleteTheme } from "../services/themeService.js";
import { displayError } from "../ui/displayError.js";
import { renderThemes } from "../ui/renderList.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";
import { clearAllStorage } from "../utils/storage.js";

const logger = getLogger();

/**
 * Setings page controller - manages username and theme list interactions.
 */

// Placeholders for elements shared between functions
let nameInput: HTMLInputElement;
let changeNameDiv: HTMLDivElement;
let themeUl: HTMLUListElement;
let addThemeDiv: HTMLDivElement;

/**
 * Handles theme deletion with error handling.
 * @param container HTML element where themes are rendered
 * @param theme The theme name to delete
 */
function handleThemeDeletion(container: HTMLElement, theme: string): void {
  if (deleteTheme(theme)) {
    renderThemes(container);
  } else {
    displayError("Theme could not be removed.");
  }
}

function handleThemeListClick(e: Event): void {
  const container = e.currentTarget as HTMLUListElement;
  const target = e.target as HTMLElement;

  // Find parent button of the target
  const btn = target.closest<HTMLButtonElement>("[data-action]");
  if (!btn) return;

  // Find parent list item of the button
  const listItem = btn.closest<HTMLLIElement>("li");
  if (!listItem)
    throw new Error(`No list item found for button: ${btn.outerHTML}`);

  // Find paragraph child of the list item
  const p = getRequiredElement<HTMLParagraphElement>("p", listItem);
  if (!p)
    throw new Error(
      `No paragraph element found for list item: ${listItem.outerHTML}`
    );

  const theme = p.textContent ?? "";
  const action = btn.dataset.action;

  switch (action) {
    case "delete-theme":
      handleThemeDeletion(container, theme);
      break;

    default:
      logger.warn("Unknown action:", action);
  }
}

/**
 * Clears all storage data and loads login page.
 */
function logOut(): void {
  clearAllStorage();
  window.location.replace("./login.html");
}

/**
 * Initialises Settings page with username display, theme list rendering and event listeners.
 */
function initialiseSettingsPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  nameInput = getRequiredElement<HTMLInputElement>("#name-input");
  changeNameDiv = getRequiredElement<HTMLDivElement>(".change-name");
  themeUl = getRequiredElement<HTMLUListElement>("#theme-list");
  addThemeDiv = getRequiredElement<HTMLDivElement>(".add-theme");

  // Display username in name input element
  nameInput.value = loadUsername();

  // Render dream list
  renderThemes(themeUl);

  // Add event listeners
  // changeNameDiv.addEventListener("",);
  themeUl.addEventListener("click", handleThemeListClick);
  // addThemeDiv.addEventListener("",);
  const logOutButton = getRequiredElement<HTMLButtonElement>(".logout");
  logOutButton.addEventListener("click", logOut);
}

// Entry point: renders themes and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseSettingsPage);
