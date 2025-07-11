import { AUTH_CONFIG } from "../constants/authConfig.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";
import { validateAndSanitiseInput } from "../utils/sanitiseInput.js";
import { setUsername } from "../utils/storage.js";

export function login(
  username: string,
  password: string
): { success: boolean; errors: Record<string, string>; suggestion?: string } {
  // Create errors object to return if auth fails
  let suggestion = "";
  const errors: Record<string, string> = {};

  // Sanitise user inputs
  const usernameSanitisationResult = validateAndSanitiseInput(username);
  const passwordSanitisationResult = validateAndSanitiseInput(password);

  if (!usernameSanitisationResult.isValid) {
    errors.username = usernameSanitisationResult.issues.join("\n");
    suggestion = usernameSanitisationResult.sanitisedInput;
  }

  if (!passwordSanitisationResult.isValid) {
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
  setUsername(usernameSanitisationResult.sanitisedInput);
  return { success: true, errors };
}

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
