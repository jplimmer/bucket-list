import { getRequiredElement } from "../utils/domHelpers.js";
import { login } from "../services/authService.js";
import { togglePassword } from "../ui/togglePassword.js";
import { saveMockDreams } from "../constants/mockVariables.js";

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

// Call login on form submit, display errors if unsuccessful
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

// Call toggle password on icon click
loginForm.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".toggle-password"
  );

  if (btn) {
    e.preventDefault();
    togglePassword(btn);
  }
});

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

function clearLoginErrors(): void {
  usernameError.classList.add("hidden");
  passwordError.classList.add("hidden");
}
