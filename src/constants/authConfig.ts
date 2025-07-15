/** Authentication validation rules and constraints. */
export const AUTH_CONFIG = {
  /** Minimum required username length. */
  USERNAME_MIN_LENGTH: 1,
  /** Minimum required password length. */
  PASSWORD_MIN_LENGTH: 6,
  /** Whether passwords must contain at least one number. */
  PASSWORD_MUST_CONTAIN_NUMBER: true,
} as const;
