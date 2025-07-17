import { redirectIfNotLoggedIn } from "../services/authService.js";
import { createDream } from "../services/dreamService.js";
import { displayUsername } from "../ui/displayUsername.js";
import { displayError } from "../ui/displayError.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";
import { populateDropdown } from "../ui/populateDropdown.js";
import { loadThemes } from "../services/themeService.js";

const logger = getLogger();

/**
 * AddDream page controller - manages adding of new dreams and user display.
 */

// Placeholders for elements shared between functions
let addDreamForm: HTMLFormElement;
let dreamInput: HTMLInputElement;
let themeSelect: HTMLSelectElement;
let submitButton: HTMLButtonElement;
let dreamError: HTMLParagraphElement;
let themeError: HTMLParagraphElement;

// State management variable to prevent multiple submits
let isSubmitting = false;

function populateThemes(container: HTMLSelectElement) {
  // Get themes
  const themes = loadThemes();
  if (!themes) {
    displayError(
      "Inga teman hittades, lägg till ett tema i inställningarna för att komma igång!"
    );
    return;
  }

  // Populate themeSelect
  try {
    const prompt = "-- Välj ett tema --";
    populateDropdown(themeSelect, themes, prompt);
  } catch (error) {
    logger.error("Failed to populate themeSelect:", error);
    displayError(
      "There was an issue loading your dream themes, please refresh the page."
    );
  }
}

/**
 * Handles add dream submission with error handling and submission prevention.
 * @param e Form submission event
 */
function handleAddDreamSubmit(e: SubmitEvent): void {
  e.preventDefault();

  // Prevent multiple submissions
  if (isSubmitting) return;

  isSubmitting = true;

  try {
    // Disable submit button during request
    submitButton.disabled = true;
    submitButton.textContent = "Lägger till din dröm...";

    clearAddDreamErrors();

    // Validate theme is chosen
    if (themeSelect.value === "prompt") {
      displayAddDreamErrors({
        dreamTheme: "Vänligen välj ett tema för din dröm.",
      });
      themeSelect.focus();
      return;
    }

    const result = createDream(dreamInput.value, themeSelect.value);

    if (!result.isValid) {
      displayAddDreamErrors(result.errors, result.suggestion);
    } else {
      // Display success message in submit button temporarily
      submitButton.textContent = "Dröm tillagd!";
      submitButton.classList.add("bg-secondary-blue");

      // Focus on dream input for next dream
      dreamInput.value = "";
      themeSelect.selectedIndex = 0;
      dreamInput.focus();

      // Re-enable submit button after timeout
      setTimeout(() => {
        resetSubmitButton();
      }, 2000);
    }
  } catch (error) {
    logger.error("Create Dream error:", error);
    resetSubmitButton();
  } finally {
    isSubmitting = false;
  }
}

/**
 * Displays AddDream validation errors and applies dream name suggestion if available.
 * @param errors Object containing field-specific error messages
 * @param suggestion Optional suggested dream name to replace invalid input
 */
function displayAddDreamErrors(
  errors: Record<string, string>,
  suggestion?: string
): void {
  // Reset submit button
  resetSubmitButton();

  // Clear previous errors
  clearAddDreamErrors();

  // Display field-specific errors
  if (errors.dreamName) {
    dreamError.textContent = errors.dreamName;
    dreamError.classList.remove("hidden");
    dreamInput.setAttribute("aria-invalid", "true");
  }

  if (errors.dreamTheme) {
    themeError.textContent = errors.dreamTheme;
    themeError.classList.remove("hidden");
    themeSelect.setAttribute("aria-invalid", "true");
  }
}

/**
 * Clears all AddDream error messages and resets validation states.
 */
function clearAddDreamErrors(): void {
  dreamError.classList.add("hidden");
  themeError.classList.add("hidden");
  dreamError.textContent = "";
  themeError.textContent = "";

  // Reset ARIA attributes
  dreamInput.removeAttribute("aria-invalid");
  themeSelect.removeAttribute("aria-invalid");
}

/**
 * Resets submit button to initial state
 */
function resetSubmitButton(): void {
  submitButton.disabled = false;
  submitButton.textContent = "Lägg till";
  submitButton.classList.remove("bg-secondary-blue");
}

/**
 * Initialises AddDream page with username display, dropdown and event listener.
 */
function initialiseAddDreamPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  addDreamForm = getRequiredElement<HTMLFormElement>("#add-dream");
  dreamInput = getRequiredElement<HTMLInputElement>("#dream");
  themeSelect = getRequiredElement<HTMLSelectElement>("#dream-select");
  submitButton = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    addDreamForm
  );
  dreamError = getRequiredElement<HTMLParagraphElement>("#dream-error-message");
  themeError = getRequiredElement<HTMLParagraphElement>("#theme-error-message");

  // Display username in header
  const usernameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
  displayUsername(usernameSpan);

  // Populate theme dropdown
  populateThemes(themeSelect);

  // Add form submit handler
  addDreamForm.addEventListener("submit", handleAddDreamSubmit);
}

// Entry point: populates dropdown and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseAddDreamPage);
