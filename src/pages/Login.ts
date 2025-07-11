import { getRequiredElement } from "../utils/domHelpers.js";
import { login } from "../services/auth.js";

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
    // Update and display error messages
    usernameError.textContent = result.errors.username || "";
    passwordError.textContent = result.errors.password || "";
    usernameError.classList.remove("hidden");
    passwordError.classList.remove("hidden");
    // If username error, replace user input with suggested valid input
    if (result.errors.username) {
      usernameInput.value = result.suggestion ?? "";
    }
  } else {
    // Hide error messages
    usernameError.classList.add("hidden");
    passwordError.classList.add("hidden");

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  }
});
