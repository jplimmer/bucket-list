import { AUTH_CONFIG } from "../constants/authConfig.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";
import { getUsername, saveUsername } from "../utils/storage.js";

/** Redirects to login page if no user is currently logged in.
 * @throws Error when no user is logged in
 */
export function redirectIfNotLoggedIn(): void {
  console.log("Checking if user logged in...");
  const username = getUsername();
  if (!username) {
    window.location.replace("/login.html");
    throw new Error("No user logged in, redirecting...");
  }
  console.log(`User '${username}' is logged in.`);
}

/**
 * Sanitises and authenticates user credentials and saves username on success.
 * @param username The username to authenticate
 * @param password The password to authenticate
 * @returns Authentication result with success status, errors, and optional 'corrected' suggestion for username
 */
export function login(
  username: string,
  password: string
): { success: boolean; errors: Record<string, string>; suggestion?: string } {
  // Create errors object to return if auth fails
  let suggestion = "";
  const errors: Record<string, string> = {};

  // Sanitise user inputs
  const usernameSanitisationResult = sanitiseInput(username);
  const passwordSanitisationResult = sanitiseInput(password);

  if (!usernameSanitisationResult.isSafe) {
    errors.username = usernameSanitisationResult.issues.join("\n");
    suggestion = usernameSanitisationResult.sanitisedInput;
  }

  if (!passwordSanitisationResult.isSafe) {
    errors.password = passwordSanitisationResult.issues.join("\n");
  }

  // Validate sanitised inputs according to businesss logic
  const usernameValidation = validateUsername(
    usernameSanitisationResult.sanitisedInput
  );
  const passwordValidation = validatePassword(
    passwordSanitisationResult.sanitisedInput
  );

  if (!usernameValidation.success) {
    // Use validation errors unless sanitisation errors already exist
    errors.usernames ||= usernameValidation.errors.join("\n");
  }

  if (!passwordValidation.success) {
    // Use validation errors unless sanitisation errors already exist
    errors.password ||= passwordValidation.errors.join("\n");
  }

  // Auth fail: return 'success: false' and errors
  if (Object.keys(errors).length > 0) {
    return { success: false, errors, suggestion };
  }

  // Auth success: save username and return 'success: true'
  const saveSuccess = saveUsername(usernameSanitisationResult.sanitisedInput);
  if (!saveSuccess) {
    errors.username = "Failed to save username to storage.";
    return { success: false, errors };
  }

  return { success: true, errors };
}

/**
 * Validates username according to authentication rules.
 * @param username The username to validate
 * @returns Validation result with success status and error messages
 */
export function validateUsername(username: string): {
  success: boolean;
  errors: string[];
} {
  const errors = [];

  if (username.length < AUTH_CONFIG.USERNAME_MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.USERNAME_TOO_SHORT);
  }

  // Auth fail: return 'success: false' and errors
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Auth success: return 'success: true'
  return { success: true, errors };
}

/**
 * Validates password according to authentication rules.
 * @param password The password to validate
 * @returns Validation result with success status and error messages
 */

export function validatePassword(password: string): {
  success: boolean;
  errors: string[];
} {
  const errors = [];

  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }

  if (AUTH_CONFIG.PASSWORD_MUST_CONTAIN_NUMBER && !/\d/.test(password)) {
    errors.push(ERROR_MESSAGES.PASSWORD_REQUIRES_NUMBER);
  }

  // Auth fail: return 'success: false' and errors
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Auth success: return 'success: true'
  return { success: true, errors };
}
