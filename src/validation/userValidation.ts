import { AUTH_CONFIG } from "../constants/authConfig.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { ValidationResult } from "../models/common.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";

/**
 * Sanitises and validates username according to authentication rules.
 * @param username The username to validate
 * @returns Validation result with success status and error messages
 */
export function validateUsername(username: string): ValidationResult {
  const errors: Record<string, string> = {};
  let suggestions: Record<string, string> | undefined;

  // Sanitise input
  const sanitisation = sanitiseInput(username);
  const cleanUsername = sanitisation.sanitisedInput;

  if (!sanitisation.isSafe) {
    errors.username = sanitisation.issues.join("\n");
    suggestions = { username: cleanUsername };
  }

  // Validate sanitised username according to business logic
  if (cleanUsername.length < AUTH_CONFIG.USERNAME_MIN_LENGTH) {
    errors.username = [errors.username, AUTH_MESSAGES.ERROR.USERNAME_TOO_SHORT]
      .filter(Boolean)
      .join("\n");
  }
  // Check for spaces and replace with underscores
  if (/\s/.test(cleanUsername)) {
    errors.username = [errors.username, AUTH_MESSAGES.ERROR.CONTAINS_SPACES]
      .filter(Boolean)
      .join("\n");
    suggestions = { username: cleanUsername.replace(/\s/g, "_") };
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions: suggestions,
  };
}

/**
 * Validates password according to authentication rules.
 * @param password The password to validate
 * @returns Validation result with success status and error messages
 */

export function validatePassword(password: string): ValidationResult {
  const errors: Record<string, string> = {};

  // Sanitise input and return if failed
  const sanitisation = sanitiseInput(password);
  if (!sanitisation.isSafe) {
    errors.password = sanitisation.issues.join("\n");
    return {
      isValid: false,
      errors,
    };
  }

  // Validate safe password according to business logic
  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.password = [errors.password, AUTH_MESSAGES.ERROR.PASSWORD_TOO_SHORT]
      .filter(Boolean)
      .join("\n");
  }
  if (AUTH_CONFIG.PASSWORD_MUST_CONTAIN_NUMBER && !/\d/.test(password)) {
    errors.password = [
      errors.password,
      AUTH_MESSAGES.ERROR.PASSWORD_REQUIRES_NUMBER,
    ]
      .filter(Boolean)
      .join("\n");
  }
  // Check for spaces and replace with underscores
  if (/\s/.test(password)) {
    errors.username = [errors.username, AUTH_MESSAGES.ERROR.CONTAINS_SPACES]
      .filter(Boolean)
      .join("\n");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
