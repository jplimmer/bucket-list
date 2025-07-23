import { DREAM_MESSAGES, THEME_MESSAGES } from "../constants/messages.js";
import { ValidationResult } from "../models/common.js";
import { FormElements } from "../models/formUI.js";
import { redirectIfNotLoggedIn } from "../services/authService.js";
import { createDream } from "../services/dreamService.js";
import { loadThemes } from "../services/themeService.js";
import { displayUsername } from "../ui/displayUsername.js";
import { displayError } from "../ui/displayError.js";
import {
  createFormSubmitHandler,
  createButtonConfig,
  createFormInput,
  resetInputs,
} from "../ui/index.js";
import { populateDropdown } from "../ui/populateDropdown.js";
import { getRequiredElement, getLogger } from "../utils/index.js";
import { validateDreamForm } from "../validation/dreamValidation.js";

/**
 * AddDream page controller - manages adding of new dreams and user display.
 */

const logger = getLogger();

/**
 * Populates theme select element with themes from storage and a prompt option.
 */
function populateThemes(container: HTMLSelectElement) {
  // Get themes
  const themes = loadThemes();
  if (!themes) {
    displayError(THEME_MESSAGES.ERROR.NO_THEMES_FOUND);
    return;
  }

  // Populate themeSelect
  try {
    const prompt = "-- Välj ett tema --";
    populateDropdown(container, themes, prompt);
  } catch (error) {
    logger.error("Failed to populate themeSelect:", error);
    displayError(THEME_MESSAGES.ERROR.NO_THEMES_DISPLAYED);
  }
}

/**
 * Creates FormElements configuration for the add-dream form.
 */
function createAddDreamFormElements(): FormElements {
  const form = getRequiredElement<HTMLFormElement>("#add-dream");
  const dreamInput = getRequiredElement<HTMLInputElement>("#dream");
  const themeSelect = getRequiredElement<HTMLSelectElement>("#dream-select");
  const button = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    form
  );
  const dreamError = getRequiredElement<HTMLParagraphElement>(
    "#dream-error-message"
  );
  const themeError = getRequiredElement<HTMLParagraphElement>(
    "#theme-error-message"
  );

  const statusDiv = getRequiredElement<HTMLDivElement>("#submit-status");

  return {
    form,
    inputs: {
      dream: createFormInput(dreamInput, dreamError),
      theme: createFormInput(themeSelect, themeError),
    },
    buttonConfig: createButtonConfig(
      button,
      DREAM_MESSAGES.BUTTONS.ADD_DREAM_TEXTS,
      "btn-success"
    ),
    announcer: statusDiv,
  };
}

/**
 * Sets up add-dream form submission handling, with UI validation and input reset on success.
 */
function setupAddDreamForm(addDreamFormElements: FormElements): void {
  function onAddDreamSubmit(
    formData: Record<string, string>
  ): ValidationResult {
    // UI validation before calling the service
    const result = validateDreamForm(formData.dream, formData.theme);
    if (!result.isValid) return result;

    return createDream(formData.dream, formData.theme);
  }

  // Create form handler
  const addDreamHandler = createFormSubmitHandler(
    addDreamFormElements,
    (formData) => onAddDreamSubmit(formData),
    undefined,
    (inputs) => resetInputs(inputs)
  );

  // Add event listener with form handler
  addDreamFormElements.form.addEventListener("submit", addDreamHandler);
}

/**
 * Initialises AddDream page with username display, dropdown and event listener.
 */
function initialiseAddDreamPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  const elements = createAddDreamFormElements();

  // Set up form handler with event listener
  setupAddDreamForm(elements);

  // Display username in header
  const usernameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
  displayUsername(usernameSpan);

  // Populate theme dropdown (with type guard)
  const themeSelect = elements.inputs.theme.element;
  if (themeSelect instanceof HTMLSelectElement) {
    populateThemes(themeSelect);
  }
}

// Entry point: populates dropdown and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseAddDreamPage);
