import { BUTTON_ACTIONS } from "../constants/globalConfig.js";
import { FormElements } from "../models/formUI.js";
import {
  loadUsername,
  logOut,
  redirectIfNotLoggedIn,
  updateUsername,
} from "../services/authService.js";
import { createTheme, deleteTheme } from "../services/themeService.js";
import { displayError } from "../ui/displayError.js";
import { createFormSubmitHandler } from "../ui/formHandlers.js";
import {
  createButtonConfig,
  createFormInput,
  resetInputs,
} from "../ui/formHelpers.js";
import { renderThemes } from "../ui/renderList.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";

/**
 * Settings page controller - manages username and theme list interactions.
 */

const logger = getLogger();

/**
 * Elements needed for the settings page functionality.
 */
interface SettingsElements {
  userFormElements: FormElements;
  themeFormElements: FormElements;
  themeList: HTMLUListElement;
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
  if (!listItem) {
    logger.error(`No list item found for button: ${btn.outerHTML}`);
    return;
  }

  // Find paragraph child of the list item
  const p = getRequiredElement<HTMLParagraphElement>("p", listItem);
  if (!p) {
    logger.error(
      `No paragraph element found for list item: ${listItem.outerHTML}`
    );
  }

  const theme = p.textContent ?? "";
  const action = btn.dataset.action;

  switch (action) {
    case BUTTON_ACTIONS.DELETE_THEME:
      handleThemeDeletion(container, theme);
      break;

    default:
      logger.warn("Unknown action:", action);
  }
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
 * Creates FormElements configuration for the username change form.
 */
function createUserFormElements(announcer: HTMLElement): FormElements {
  const form = getRequiredElement<HTMLFormElement>(".change-name");
  const input = getRequiredElement<HTMLInputElement>("#name-input");
  const button = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    form
  );
  const error = getRequiredElement<HTMLParagraphElement>(
    "#username-error-message"
  );

  return {
    form,
    inputs: { username: createFormInput(input, error) },
    buttonConfig: createButtonConfig(
      button,
      {
        original: "Spara",
        loading: "Sparar...",
        success: "Sparat!",
      },
      "btn-success"
    ),
    announcer: announcer,
  };
}

/**
 * Creates FormElements configuration for the theme creation form.
 */
function createThemeFormELements(announcer: HTMLElement): FormElements {
  const form = getRequiredElement<HTMLFormElement>(".add-theme");
  const input = getRequiredElement<HTMLInputElement>("#theme-input");
  const button = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    form
  );
  const error = getRequiredElement<HTMLParagraphElement>(
    "#theme-error-message"
  );

  return {
    form,
    inputs: { theme: createFormInput(input, error) },
    buttonConfig: createButtonConfig(
      button,
      {
        original: "Lägg till",
        loading: "Sparar...",
        success: "Tillagd!",
      },
      "btn-success"
    ),
    announcer: announcer,
  };
}

/**
 * Initialises all DOM elements required for the settings page.
 */
function initialiseElements(): SettingsElements {
  const statusDiv = getRequiredElement<HTMLDivElement>("#submit-status");

  return {
    userFormElements: createUserFormElements(statusDiv),
    themeFormElements: createThemeFormELements(statusDiv),
    themeList: getRequiredElement<HTMLUListElement>("#theme-list"),
  };
}

/**
 * Sets up username form submission handling and loads current username.
 */
function setupUserForm(userFormElements: FormElements): void {
  // Create form handler
  const userHandler = createFormSubmitHandler(userFormElements, (formData) =>
    updateUsername(formData.username)
  );
  // Display user current username
  const usernameInput = userFormElements.inputs.username.element;
  usernameInput.value = loadUsername();
  // Add event listener with form handler
  userFormElements.form.addEventListener("submit", userHandler);
}

/**
 * Sets up theme form submission handling with list refresh and input reset.
 */
function setupThemeForm(
  themeFormElements: FormElements,
  themeList: HTMLUListElement
): void {
  // Create form handler
  const themeHandler = createFormSubmitHandler(
    themeFormElements,
    (formData) => createTheme(formData.theme),
    () => renderThemes(themeList),
    (inputs) => resetInputs(inputs)
  );
  // Add event listener with form handler
  themeFormElements.form.addEventListener("submit", themeHandler);
}

/**
 * Sets up theme list button click handling.
 */
function setupThemeList(themeList: HTMLUListElement): void {
  themeList.addEventListener("click", handleThemeListClick);
}

/**
 * Sets up logout button click handling.
 */
function setupLogout(): void {
  const logOutButton = getRequiredElement<HTMLButtonElement>(".logout");
  logOutButton.addEventListener("click", handleLogOut);
}

/**
 * Initialises Settings page with username display, theme list rendering and event listeners.
 */
function initialiseSettingsPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  const elements = initialiseElements();

  // Set up form handlers and add event listeners
  setupUserForm(elements.userFormElements);
  setupThemeForm(elements.themeFormElements, elements.themeList);
  setupThemeList(elements.themeList);
  setupLogout();

  // Render dream list
  renderThemes(elements.themeList);
}

// Entry point: renders themes and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseSettingsPage);
