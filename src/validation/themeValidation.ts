import { ValidationResult } from "../models/common.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";

export function validateThemeInput(theme: string): ValidationResult {
  const errors: Record<string, string> = {};
  let suggestions: Record<string, string> | undefined;

  // Sanitise theme input
  const sanitisation = sanitiseInput(theme);
  const cleanTheme = sanitisation.sanitisedInput;

  if (!sanitisation.isSafe) {
    errors.theme = sanitisation.issues.join("\n");
    suggestions = { theme: cleanTheme };
  }

  // Check input is not prompt option
  if (cleanTheme === "prompt") {
    errors.theme = "Please select a theme.";
    suggestions = undefined;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions,
  };
}
