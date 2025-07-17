/**
 * Result of a validation operation with error details and optional suggestion
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  suggestion?: string;
}

/**
 * Result of a create operation combining validation with optional created data
 */
export interface CreateResult<T> extends ValidationResult {
  data?: T;
}
