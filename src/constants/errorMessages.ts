import { AUTH_CONFIG } from "./authConfig.js";

export const ERROR_MESSAGES = {
  USERNAME_TOO_SHORT: `Username must be at least ${AUTH_CONFIG.USERNAME_MIN_LENGTH} characters.`,
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters.`,
  PASSWORD_REQUIRES_NUMBER: "Password must contain a number.",
};
