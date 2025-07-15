import { getRequiredElement } from "../utils/domHelpers.js";
import { login } from "../services/authService.js";
import { togglePassword } from "../ui/togglePassword.js";
import { saveMockDreams } from "../constants/mockData.js";

/**
 * Login page controller - handles form submission and password toggle.
 */

// Find DOM elements
const loginForm = getRequiredElement<HTMLFormElement>("form");
const usernameInput = getRequiredElement<HTMLInputElement>("#username");
const passwordInput = getRequiredElement<HTMLInputElement>("#password");
const usernameError = getRequiredElement<HTMLParagraphElement>(
  "#username-error-message"
);
const passwordError = getRequiredElement<HTMLParagraphElement>(
  "#password-error-message"
);

/**
 * Handles login form submission and error display
 */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const result = await login(usernameInput.value, passwordInput.value);

  if (!result.success) {
    displayLoginErrors(result.errors, result.suggestion);
  } else {
    clearLoginErrors();

    // Set mock variables for user
    saveMockDreams();

    // Redirect to dashboard
    console.log("User logged in.");
    window.location.href = "dashboard.html";
  }
});

/**
 * Handles password visibility toggle-button clicks
 */
loginForm.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".toggle-password"
  );

  if (btn) {
    e.preventDefault();
    togglePassword(btn);
  }
});

/**
 * Displays login validation errors and applies username suggestion if available.
 * @param errors Object containing field-specific error messages
 * @param suggestion Optional suggested username to replace invalid input
 */
function displayLoginErrors(
  errors: Record<string, string>,
  suggestion?: string
): void {
  usernameError.textContent = errors.username || "";
  passwordError.textContent = errors.password || "";
  usernameError.classList.remove("hidden");
  passwordError.classList.remove("hidden");

  // If username error, replace user input with suggested valid input
  if (errors.username && suggestion) {
    usernameInput.value = suggestion;
  }
}

/**
 * Clears all login error messages from display.
 */
function clearLoginErrors(): void {
  usernameError.classList.add("hidden");
  passwordError.classList.add("hidden");
}
