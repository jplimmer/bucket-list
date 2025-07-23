import { ASSETS_CONFIG } from "../constants/globalConfig.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { displayError } from "./displayError.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

/**
 * Toggles password visibility for the input associated with the button.
 * @param button The toggle button element.
 * @throws Error when the associated password input cannot be found.
 */
export function togglePassword(button: HTMLButtonElement): void {
  try {
    // Find the password input using data-target
    const passwordInput = findPasswordInput(button);
    if (!passwordInput) {
      logger.error("Associated password input not found for button:", button);
      displayError(AUTH_MESSAGES.ERROR.PASSWORD_NOT_SHOWN);
      return;
    }

    // Find the toggle icon within the button
    const toggleIcon = getRequiredElement<HTMLImageElement>("img", button);

    // Toggle password text visibility and icon
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.src = ASSETS_CONFIG.ICONS.EYE_SLASH;
    } else {
      passwordInput.type = "password";
      toggleIcon.src = ASSETS_CONFIG.ICONS.EYE;
    }
  } catch (error) {
    logger.error("Failed to toggle password visibility:", error);
    displayError(AUTH_MESSAGES.ERROR.PASSWORD_NOT_SHOWN);
  }
}

/**
 * Finds the password input element associated with a toggle button.
 * @param button The toggle button to find the associated input for
 * @returns The password input element, or null if not found
 */
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
