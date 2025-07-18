import { getRequiredElement } from "../utils/domHelpers.js";
import { createNewUser, redirectIfLoggedIn } from "../services/authService.js";
import { togglePassword } from "../ui/togglePassword.js";
import { saveMockDreams } from "../constants/mockData.js";
import { getLogger } from "../utils/logger.js";
import { saveDefaultThemes } from "../services/themeService.js";
import { clearError, displayError } from "../ui/displayError.js";
import { clearDreams } from "../services/dreamService.js";
import { setUseLocalStorage } from "../utils/storage.js";

/**
 * Login page controller - handles form submission and password toggle.
 */

const logger = getLogger();

// Placeholders for elements shared between functions
let loginForm: HTMLFormElement;
let usernameInput: HTMLInputElement;
let passwordInput: HTMLInputElement;
let usernameError: HTMLParagraphElement;
let passwordError: HTMLParagraphElement;
let rememberCheckBox: HTMLInputElement;

// State management variable to prevent multiple submits
let isSubmitting = false;

/**
 * Handles login form submission with error handling and submission prevention
 * @param e Form submission event
 */
async function handleLoginSubmit(e: SubmitEvent): Promise<void> {
  e.preventDefault();

  // Prevent multiple submissions
  if (isSubmitting) return;

  isSubmitting = true;
  const submitButton = getRequiredElement<HTMLButtonElement>(
    'button[type="submit"]',
    loginForm
  );

  try {
    // Disable submit button during request
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Loggar in...";
    }

    clearLoginErrors();

    const result = await createNewUser(
      usernameInput.value,
      passwordInput.value
    );

    if (!result.isValid) {
      displayLoginErrors(result.errors, result.suggestion);
    } else {
      // Reset default themes
      saveDefaultThemes();

      // Reset mock dream list for user
      if (!clearDreams())
        throw new Error("Failed to clear dreams from storage.");
      saveMockDreams();

      // Redirect to dashboard
      logger.info("User logged in.");
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    logger.error("Login error:", error);
    displayError("Login error:" + error);
  } finally {
    isSubmitting = false;

    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Logga in";
    }
  }
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
 * Handles remember user checkbox clicks
 * @param e Click event
 */
function handleRememberUserToggle(e: Event): void {
  setUseLocalStorage(rememberCheckBox.checked);
}

/**
 * Displays login validation errors and applies username suggestion if available.
 * @param errors Object containing field-specific error messages
 * @param suggestion Optional suggested username to replace invalid input
 */
function displayLoginErrors(
  errors: Record<string, string>,
  suggestion?: string
): void {
  // Clear previous errors
  clearLoginErrors();

  // Display field-specific errors
  if (errors.username) {
    displayError(errors.username, usernameError);
    usernameInput.setAttribute("aria-invalid", "true");
  }

  if (errors.password) {
    displayError(errors.password, passwordError);
    passwordInput.setAttribute("aria-invalid", "true");
  }

  // Apply username suggestion if available
  if (errors.username && suggestion) {
    usernameInput.value = suggestion;
    usernameInput.select();
  }
}

/**
 * Clears all login error messages and resets validation states.
 */
function clearLoginErrors(): void {
  clearError(usernameInput, usernameError);
  clearError(passwordInput, passwordError);
}

/**
 * Initialises Login page event listeners and form validation.
 */
function initialiseLoginPage(): void {
  // Redirect if user already logged in
  redirectIfLoggedIn();

  // Find and set shared elements for module
  loginForm = getRequiredElement<HTMLFormElement>("form");
  usernameInput = getRequiredElement<HTMLInputElement>("#username");
  passwordInput = getRequiredElement<HTMLInputElement>("#password");
  usernameError = getRequiredElement<HTMLParagraphElement>(
    "#username-error-message"
  );
  passwordError = getRequiredElement<HTMLParagraphElement>(
    "#password-error-message"
  );
  rememberCheckBox = getRequiredElement<HTMLInputElement>("#remember");

  // Add form submission handler
  loginForm.addEventListener("submit", handleLoginSubmit);

  // Add password toggle handler
  loginForm.addEventListener("click", handlePasswordToggle);

  // Add remember user toggle handler
  rememberCheckBox.addEventListener("change", handleRememberUserToggle);
}

// Entry point: sets up DOM elements and event listeners
document.addEventListener("DOMContentLoaded", initialiseLoginPage);
