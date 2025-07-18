import { ValidationResult } from "../models/common.js";
import {
  loadUsername,
  logOut,
  redirectIfNotLoggedIn,
  updateUsername,
} from "../services/authService.js";
import { createTheme, deleteTheme } from "../services/themeService.js";
import { displayError, clearError } from "../ui/displayError.js";
import { renderThemes } from "../ui/renderList.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

/**
 * Setings page controller - manages username and theme list interactions.
 */

// Placeholders for elements shared between functions
let userForm: HTMLFormElement;
let nameInput: HTMLInputElement;
let nameButton: HTMLButtonElement;
let nameError: HTMLParagraphElement;
let themeUl: HTMLUListElement;
let themeForm: HTMLFormElement;
let themeInput: HTMLInputElement;
let themeButton: HTMLButtonElement;
let themeError: HTMLParagraphElement;
let statusDiv: HTMLDivElement;

// State management variable to prevent multiple submits
let isSubmitting = false;

/**
 * Handles username update form submission with error handling and submission prevention
 * @param e Form submission event
 */
function handleUsernameSubmit(e: SubmitEvent): void {
  e.preventDefault();

  // Prevent multiple submissions
  if (isSubmitting) return;

  isSubmitting = true;

  try {
    // Disable name button during request
    nameButton.disabled = true;
    nameButton.textContent = "Sparar...";

    // Clear previous errors
    clearError(nameInput, nameError);

    const result = updateUsername(nameInput.value);

    if (!result.isValid) {
      displayNameError(result);
    } else {
      // Display success message in name button temporarily
      nameButton.textContent = "Sparat!";
      nameButton.classList.add("bg-secondary-blue");
      statusDiv.textContent = "Användarnamn sparat!";

      // Re-enable name button after timeout
      setTimeout(() => {
        resetNameButton();
      }, 2000);
    }
  } catch (error) {
    logger.error("Update username error:", error);
    resetNameButton();
  } finally {
    isSubmitting = false;
  }
}

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

/**
 * Handles theme list interactions (delete) via event delegation.
 * @param e The click event
 */
function handleThemeListClick(e: MouseEvent): void {
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

function handleAddThemeSubmit(e: SubmitEvent) {
  e.preventDefault();

  // Prevent multiple submissions
  if (isSubmitting) return;

  isSubmitting = true;

  try {
    // Disable theme button during request
    themeButton.disabled = true;
    themeButton.textContent = "Sparar...";

    // Clear previous errors
    clearError(themeInput, themeError);

    const result = createTheme(themeInput.value);

    if (!result.isValid) {
      displayThemeError(result);
    } else {
      // Display success message in theme button temporarily
      themeButton.textContent = "Sparat!";
      themeButton.classList.add("bg-secondary-blue");
      statusDiv.textContent = "Teman tillagd!";

      // Re-enable theme button after timeout
      setTimeout(() => {
        resetThemeButton();
      }, 2000);
    }
  } catch (error) {
    logger.error("Add theme error:", error);
    resetThemeButton();
  } finally {
    isSubmitting = false;
  }
}

/**
 * Displays Username validation errors and applies username suggestion if available.
 * @param errors Object containing field-specific error messages
 * @param suggestion Optional suggested username to replace invalid input
 */
function displayNameError({ errors, suggestion }: ValidationResult): void {
  resetNameButton();

  if (errors.username) {
    displayError(errors.username, nameError);
    nameInput.setAttribute("aria-invalid", "true");
  }

  if (errors.username && suggestion) {
    nameInput.value = suggestion;
    nameInput.select();
  }
}

/**
 * Displays theme validation errors and applies suggestion if available.
 * @param errors Object containing field-specific error messages
 * @param suggestion Optional suggested theme to replace invalid input
 */
function displayThemeError({ errors, suggestion }: ValidationResult): void {
  resetThemeButton();

  if (errors.theme) {
    displayError(errors.theme, themeError);
    themeInput.setAttribute("aria-invalid", "true");
  }

  if (errors.theme && suggestion) {
    themeInput.value = suggestion;
    themeInput.select();
  }
}

/**
 * Resets nameButton to initial state
 */
function resetNameButton(): void {
  nameButton.textContent = "Spara";
  nameButton.disabled = false;
  nameButton.classList.remove("bg-secondary-blue");
}

/**
 * Resets themeButton to initial state
 */
function resetThemeButton(): void {
  themeButton.textContent = "Lägg till";
  themeButton.disabled = false;
  themeButton.classList.remove("bg-secondary-blue");
}

/**
 * Clears all storage data and loads login page.
 */
function handleLogOut(): void {
  const success = logOut();
  if (!success) {
    displayError("Problem logging out, please try again.");
  }
  window.location.replace("./login.html");
}

/**
 * Initialises Settings page with username display, theme list rendering and event listeners.
 */
function initialiseSettingsPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  userForm = getRequiredElement<HTMLFormElement>(".change-name");
  nameInput = getRequiredElement<HTMLInputElement>("#name-input");
  nameError = getRequiredElement<HTMLParagraphElement>(
    "#username-error-message"
  );
  nameButton = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    userForm
  );
  themeUl = getRequiredElement<HTMLUListElement>("#theme-list");
  themeForm = getRequiredElement<HTMLFormElement>(".add-theme");
  themeInput = getRequiredElement<HTMLInputElement>("#theme-input");
  themeButton = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    themeForm
  );
  themeError = getRequiredElement<HTMLParagraphElement>("#theme-error-message");
  statusDiv = getRequiredElement<HTMLDivElement>("#submit-status");

  // Display username in name input element
  nameInput.value = loadUsername();

  // Render dream list
  renderThemes(themeUl);

  // Add event listeners
  userForm.addEventListener("submit", handleUsernameSubmit);
  themeUl.addEventListener("click", handleThemeListClick);
  themeForm.addEventListener("submit", handleAddThemeSubmit);
  const logOutButton = getRequiredElement<HTMLButtonElement>(".logout");
  logOutButton.addEventListener("click", handleLogOut);
}

// Entry point: renders themes and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseSettingsPage);
