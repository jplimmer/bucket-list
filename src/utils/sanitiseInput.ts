import { INPUT_MAX_LENGTH } from "../constants/globalConfig.js";

export interface SanitisationResult {
  isValid: boolean;
  originalInput: string;
  sanitisedInput: string;
  issues: string[];
}

export function validateAndSanitiseInput(raw: string): SanitisationResult {
  const issues: string[] = [];
  let hasMaliciousContent = false;

  // Check for empty input
  if (!raw.trim()) {
    return {
      isValid: false,
      originalInput: raw,
      sanitisedInput: "",
      issues: ["Input cannot be empty"],
    };
  }

  // Create sanitised version
  let sanitised = raw;

  // Check for script tags
  if (/<script[^>]*>[\s\S]*?<\/script>/gi.test(sanitised)) {
    issues.push("Script tags detected and removed.");
    sanitised = sanitised.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    hasMaliciousContent = true;
  }

  // Check for other HTML tags
  if (/<\/?[^>]+(>|$)/g.test(sanitised)) {
    issues.push("HTML tags detected and removed.");
    sanitised = sanitised.replace(/<\/?[^>]+(>|$)/g, "");
    hasMaliciousContent = true;
  }

  // Trim whitespace
  const beforeTrim = sanitised;
  sanitised = sanitised.trim();

  if (beforeTrim !== sanitised) {
    issues.push("Leading or trailing whitespace trimmed.");
  }

  // Check length
  if (sanitised.length > INPUT_MAX_LENGTH) {
    issues.push(
      `Input too long (${sanitised.length} chars) and truncated to ${INPUT_MAX_LENGTH} characters.`
    );
    sanitised = sanitised.slice(0, INPUT_MAX_LENGTH);
  }

  // Check if sanitised version differs from original (after trimming)
  const isValid = issues.length === 0;

  return {
    isValid: isValid,
    originalInput: hasMaliciousContent ? "[CONTENT SANITISED]" : raw,
    sanitisedInput: sanitised,
    issues: issues,
  };
}
