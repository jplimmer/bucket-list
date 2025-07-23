import { ValidationResult } from "../models/common.js";
import { sanitiseInput } from "../utils/sanitiseInput.js";
import { validateThemeInput } from "./themeValidation.js";

export function validateDreamForm(
  name: string,
  theme: string
): ValidationResult {
  const errors: Record<string, string> = {};
  let suggestions: Record<string, string> | undefined;

  // Sanitise name input
  const sanitisation = sanitiseInput(name);
  const cleanDreamName = sanitisation.sanitisedInput;

  if (!sanitisation.isSafe) {
    errors.dream = sanitisation.issues.join("\n");
    suggestions = { dream: cleanDreamName };
  }

  // Check theme input exists and is not prompt option
  const validation = validateThemeInput(theme);
  if (!validation.isValid) {
    errors.theme = validation.errors.theme;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    suggestions: suggestions,
  };
}
