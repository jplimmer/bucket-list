import { AUTH_CONFIG } from "../constants/authConfig.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";
import { CreateResult, ValidationResult } from "../models/common.js";
import { getLogger } from "../utils/logger.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";
import { clearAllStorage, userStorage } from "../utils/storage.js";

const logger = getLogger();

/**
 * Redirects to login page if no user is currently logged in.
 */
export function redirectIfNotLoggedIn(): void {
  logger.debug("Checking if user logged in...");
  const username = loadUsername();
  if (!username) {
    window.location.replace("./login.html");
    // Throw to prevent further execution on previous page
    throw new Error("No user logged in, redirecting to login page...");
  }
  logger.debug(`User '${username}' is logged in.`);
}

/**
 * Redirects to dashboard if user is already logged in.
 */
export function redirectIfLoggedIn(): void {
  logger.debug("Checking if user logged in...");
  const username = loadUsername();
  if (username) {
    window.location.replace("./dashboard.html");
    // Throw to prevent further execution on previous page
    throw new Error("User already logged in, redirecting to dashboard...");
  }
  logger.debug("No user currently logged in.");
}

/**
 * Clears username from storage.
 * @returns Success status
 */
export function clearUsername(): boolean {
  const clearSuccess = userStorage.clear();
  if (clearSuccess) {
    logger.info("Cleared username from storage.");
  }

  return clearSuccess;
}

/**
 * Loads username from storage.
 * @returns Username string, or empty string if loading fails.
 */
export function loadUsername(): string {
  return userStorage.load() || "";
}

type UsernameResult = CreateResult<string>;

/**
 * Validates and saves a username.
 * @param username New username string
 * @returns Result with success status, errors and updated Username
 */
export function updateUsername(username: string): UsernameResult {
  // Validate input
  const validation = validateUsername(username);
  if (!validation.isValid) {
    return {
      ...validation,
      data: undefined,
    };
  }

  // Save new username
  const saveSuccess = userStorage.save(username);
  if (!saveSuccess) {
    return { isValid: false, errors: { general: "Failed to save username." } };
  }

  logger.info("Username updated successfully.");
  return { isValid: true, errors: {}, data: username };
}

/**
 * Sanitises and validates username according to authentication rules.
 * @param username The username to validate
 * @returns Validation result with success status and error messages
 */
export function validateUsername(username: string): ValidationResult {
  const errors: Record<string, string> = {};
  let suggestion: string | undefined;

  // Sanitise input
  const sanitisation = sanitiseInput(username);
  if (!sanitisation.isSafe) {
    errors.username = sanitisation.issues.join("\n");
    suggestion = sanitisation.sanitisedInput;
  }

  const cleanUsername = sanitisation.sanitisedInput;

  // Validate sanitised username according to business logic
  if (cleanUsername.length < AUTH_CONFIG.USERNAME_MIN_LENGTH) {
    errors.username = [errors.username, ERROR_MESSAGES.USERNAME_TOO_SHORT]
      .filter(Boolean)
      .join("\n");
  }
  // Check for spaces and replace with underscores
  if (/\s/.test(cleanUsername)) {
    errors.username = [errors.username, ERROR_MESSAGES.CONTAINS_SPACES]
      .filter(Boolean)
      .join("\n");
    suggestion = cleanUsername.replace(/\s/g, "_");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestion,
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
    errors.password = [errors.password, ERROR_MESSAGES.PASSWORD_TOO_SHORT]
      .filter(Boolean)
      .join("\n");
  }
  if (AUTH_CONFIG.PASSWORD_MUST_CONTAIN_NUMBER && !/\d/.test(password)) {
    errors.password = [errors.password, ERROR_MESSAGES.PASSWORD_REQUIRES_NUMBER]
      .filter(Boolean)
      .join("\n");
  }
  // Check for spaces and replace with underscores
  if (/\s/.test(password)) {
    errors.username = [errors.username, ERROR_MESSAGES.CONTAINS_SPACES]
      .filter(Boolean)
      .join("\n");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitises and authenticates user credentials and updates username on success.
 * @param username The username to authenticate
 * @param password The password to authenticate
 * @returns Authentication result with success status, errors, and optional 'corrected' suggestion for username
 */
export function createNewUser(
  username: string,
  password: string
): ValidationResult {
  // Create errors object to return if auth fails
  const saveUsername = updateUsername(username);
  const passwordValidation = validatePassword(password);

  if (saveUsername.isValid && passwordValidation.isValid) {
    logger.info("Successfully created new user.");
    return {
      isValid: true,
      errors: {},
    };
  } else {
    // Clear username if successfully saved.
    clearUsername();
    return {
      isValid: false,
      errors: {
        username: saveUsername.errors.username,
        password: passwordValidation.errors.password,
      },
      suggestion: saveUsername.suggestion,
    };
  }
}

/**
 * Clears all storage data.
 * @returns Success status
 */
export function logOut(): boolean {
  const clearSuccess = clearAllStorage();
  if (!clearSuccess) {
    return false;
  }
  logger.info("Cleared all storage data");
  return true;
}
