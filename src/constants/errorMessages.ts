import { AUTH_CONFIG } from "./authConfig.js";

/** User-facing error messages for authentication validation. */
export const ERROR_MESSAGES = {
  /** Error shown when username is too short. */
  USERNAME_TOO_SHORT: `Username must be at least ${AUTH_CONFIG.USERNAME_MIN_LENGTH} characters.`,
  /** Error shown when password is too short. */
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters.`,
  /** Error shown when password lacks required number. */
  PASSWORD_REQUIRES_NUMBER: "Password must contain a number.",
} as const;
