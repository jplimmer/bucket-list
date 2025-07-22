import { getRequiredElement } from "../utils/domHelpers.js";
import { createNewUser, redirectIfLoggedIn } from "../services/authService.js";
import { togglePassword } from "../ui/togglePassword.js";
import { saveMockDreams } from "../constants/mockData.js";
import { getLogger } from "../utils/logger.js";
import { saveDefaultThemes } from "../services/themeService.js";
import { clearDreams } from "../services/dreamService.js";
import { getUseLocalStorage, setUseLocalStorage } from "../utils/storage.js";
import { FormElements } from "../models/formUI.js";
import { createButtonConfig, createFormInput } from "../ui/formHelpers.js";
import { createFormSubmitHandler } from "../ui/formHandlers.js";
import { ValidationResult } from "../models/common.js";
import {
  validatePassword,
  validateUsername,
} from "../validation/userValidation.js";

/**
 * Login page controller - handles form submission and password toggle.
 */

const logger = getLogger();

/**
 * Elements need for the login page functionality.
 */
interface LoginElements {
  loginFormElements: FormElements;
  rememberMeCheckBox: HTMLInputElement;
}

/**
 * Handles password visibility toggle-button clicks
 * @param e Click event
 */
function handlePasswordToggle(e: MouseEvent): void {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".toggle-password"
  );

  if (btn) {
    e.preventDefault();
    togglePassword(btn);
  }
}

/**
 * Creates FormElements configuration for the login form.
 */
function createLoginFormElements(): FormElements {
  const form = getRequiredElement<HTMLFormElement>("form");
  const usernameInput = getRequiredElement<HTMLInputElement>("#username");
  const passwordInput = getRequiredElement<HTMLInputElement>("#password");
  const button = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    form
  );
  const usernameError = getRequiredElement<HTMLParagraphElement>(
    "#username-error-message"
  );
  const passwordError = getRequiredElement<HTMLParagraphElement>(
    "#password-error-message"
  );

  return {
    form,
    inputs: {
      username: createFormInput(usernameInput, usernameError),
      password: createFormInput(passwordInput, passwordError),
    },
    buttonConfig: createButtonConfig(
      button,
      { original: "Logga in", loading: "Loggar in...", success: "Inloggad!" },
      "btn-success"
    ),
  };
}

/**
 * Initialises all DOM elements required for the login page.
 */
function initialiseElements(): LoginElements {
  return {
    loginFormElements: createLoginFormElements(),
    rememberMeCheckBox: getRequiredElement<HTMLInputElement>("#remember"),
  };
}

/**
 * Sets up login form submission handling, with UI validation and saving of default dreams and themes.
 */
function setupLoginForm(loginFormElements: FormElements): void {
  function onLoginFormSubmit(
    formData: Record<string, string>
  ): ValidationResult {
    // UI validation before calling the service
    const usernameResult = validateUsername(formData.username);
    const passwordResult = validatePassword(formData.password);

    if (!usernameResult.isValid || !passwordResult.isValid) {
      return {
        isValid: false,
        errors: { ...usernameResult.errors, ...passwordResult.errors },
        suggestions: { ...usernameResult.suggestions },
      };
    }

    return createNewUser(formData.username, formData.password);
  }

  // Create form handler
  const loginHandler = createFormSubmitHandler(
    loginFormElements,
    (formData) => onLoginFormSubmit(formData),
    () => {
      // Reset default themes
      saveDefaultThemes();

      // Reset mock dream list for user
      clearDreams();
      saveMockDreams();

      // Redirect to dashboard
      logger.info("User logged in.");
      window.location.href = "dashboard.html";
    }
  );

  // Add event listener with form handler
  loginFormElements.form.addEventListener("submit", loginHandler);
}

/**
 * Sets up password toggle click handling.
 */
function setupPasswordToggle(form: HTMLFormElement): void {
  form.addEventListener("click", handlePasswordToggle);
}

/**
 * Sets up 'remember me' click handling.
 */
function setupRememberMe(checkbox: HTMLInputElement): void {
  // Updates storage type in local storage.
  function handleRememberMeToggle(e: Event): void {
    setUseLocalStorage(checkbox.checked);
  }

  // Add event listener
  checkbox.addEventListener("change", handleRememberMeToggle);
}

/**
 * Initialises Login page event listeners and form validation.
 */
function initialiseLoginPage(): void {
  // Redirect if user already logged in
  redirectIfLoggedIn();

  // Find and set shared elements for module
  const elements = initialiseElements();

  // Set up login form handler and add events listeners
  setupLoginForm(elements.loginFormElements);
  setupPasswordToggle(elements.loginFormElements.form);
  setupRememberMe(elements.rememberMeCheckBox);

  // Set 'remember me' checkbox to current storage state (guard, should always be false)
  elements.rememberMeCheckBox.checked = getUseLocalStorage();
}

// Entry point: sets up DOM elements and event listeners
document.addEventListener("DOMContentLoaded", initialiseLoginPage);
