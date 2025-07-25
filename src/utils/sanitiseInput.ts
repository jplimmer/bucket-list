import { INPUT_MAX_LENGTH } from "../constants/globalConfig.js";
import { SANITISATION_MESSAGES } from "../constants/messages.js";

/**
 * Result object returned by input sanitisation operations.
 */
export interface SanitisationResult {
  /** Whether the input has passed sanitisation without issues */
  isSafe: boolean;
  /** The original input string (may be sanitised for security) */
  originalInput: string;
  /** The cleaned and sanitised input string */
  sanitisedInput: string;
  /** Array of validation issues found during processing */
  issues: string[];
}

/**
 * Sanitises user input by removing potentially dangerous content.
 *
 * This function performs several security checks:
 * - Removes script tags to prevent XSS attacks
 * - Strips HTML tags to prevent injection
 * - Trunctates input to maximum allowed length
 * - Validates that input is not empty
 *
 * @param raw The raw input string to sanitise
 * @returns Object containing sanitisation results and sanitised input
 */
export function sanitiseInput(raw: string): SanitisationResult {
  const issues: string[] = [];
  let hasMaliciousContent = false;

  // Check for empty input
  if (!raw.trim()) {
    return {
      isSafe: false,
      originalInput: raw,
      sanitisedInput: "",
      issues: [SANITISATION_MESSAGES.EMPTY],
    };
  }

  // Create sanitised version
  let sanitised = raw;

  // Check for script tags
  if (/<script[^>]*>[\s\S]*?<\/script>/gi.test(sanitised)) {
    issues.push(SANITISATION_MESSAGES.SCRIPT);
    sanitised = sanitised.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    hasMaliciousContent = true;
  }

  // Check for other HTML tags
  if (/<\/?[^>]+(>|$)/g.test(sanitised)) {
    issues.push(SANITISATION_MESSAGES.HTML_TAGS);
    sanitised = sanitised.replace(/<\/?[^>]+(>|$)/g, "");
    hasMaliciousContent = true;
  }

  // Trim whitespace
  const beforeTrim = sanitised;
  sanitised = sanitised.trim();

  if (beforeTrim !== sanitised) {
    issues.push(SANITISATION_MESSAGES.TRIM_WHITESPACE);
  }

  // Check length
  if (sanitised.length > INPUT_MAX_LENGTH) {
    issues.push(SANITISATION_MESSAGES.INPUT_TOO_LONG(sanitised.length));
    sanitised = sanitised.slice(0, INPUT_MAX_LENGTH);
  }

  // Check if sanitised version differs from original (after trimming)
  const isValid = issues.length === 0;

  return {
    isSafe: isValid,
    originalInput: hasMaliciousContent ? "[CONTENT SANITISED]" : raw,
    sanitisedInput: sanitised,
    issues: issues,
  };
}
