import { getRequiredElement } from "../utils/domHelpers.js";

export function togglePassword(button: HTMLButtonElement) {
  // Find the password input using data-target
  const passwordInput = findPasswordInput(button);
  if (!passwordInput) throw new Error("Associated password input not found.");

  // Find the toggle icon within the button
  const toggleIcon = getRequiredElement<HTMLImageElement>("img", button);

  // Toggle password text visibility and icon
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src = "../assets/images/eye-slash-icon.svg";
  } else {
    passwordInput.type = "password";
    toggleIcon.src = "../assets/images/eye-icon.svg";
  }
}

function findPasswordInput(button: HTMLButtonElement): HTMLInputElement | null {
  // Look for data attribute 'target' pointing to input ID
  const targetId = button.dataset.target;
  if (targetId) {
    const input = document.querySelector<HTMLInputElement>(`#${targetId}`);
    if (input) return input;
  }

  // If data attribute not found, look for sibling input element instead
  const parent = button.parentElement;
  if (parent) {
    return getRequiredElement<HTMLInputElement>("input", parent);
  }

  // If still no input element found, return null
  return null;
}
