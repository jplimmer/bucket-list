import {
  FormElements,
  ButtonConfig,
  FormState,
  FormInput,
  FormControl,
} from "../models/formUI.js";
import { ValidationResult } from "../models/common.js";
import { clearError, displayError } from "./displayError.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

/**
 * Creates a form submit handler with validation, loading states and error display.
 * Prevents duplicate submissions and manages UI feedback throughout the submission process.
 * @param elements Form elements (inputs, button, announcer) and their configurations
 * @param onSubmit Validation function that processes form data and returns validation result
 * @param onSuccess Optional callback executed after successful submission
 * @param onCleanup Optional cleanup callback that receives form controls after success
 * @returns Form submit event handler function
 */
export function createFormSubmitHandler(
  elements: FormElements,
  onSubmit: (formData: Record<string, string>) => ValidationResult,
  onSuccess?: () => void,
  onCleanup?: (inputs: Record<string, FormControl>) => void
) {
  const formState: FormState = {
    isSubmitting: false,
  };

  return function handleSubmit(e: SubmitEvent): void {
    e.preventDefault();

    // Prevent multiple submissions
    if (formState.isSubmitting) return;

    try {
      // Start submission
      formState.isSubmitting = true;
      setButtonLoading(elements.buttonConfig);

      // Clear all previous input errors
      for (const input of Object.values(elements.inputs)) {
        clearError(input.element, input.errorElement);
      }

      // Collect form data from all input elements
      const formData = Object.entries(elements.inputs).reduce(
        (acc, [key, input]) => {
          acc[key] = input.element.value;
          return acc;
        },
        {} as Record<string, string>
      );

      // Submit and handle result
      const result = onSubmit(formData);

      if (!result.isValid) {
        handleValidationError(result, elements);
      } else {
        handleSuccess(elements.buttonConfig, elements.announcer);
        if (onSuccess) onSuccess();
        if (onCleanup) {
          onCleanup(
            Object.fromEntries(
              Object.entries(elements.inputs).map(([key, input]) => [
                key,
                input.element,
              ])
            )
          );
        }
      }
    } catch (error) {
      logger.error("Form submission error:", error);
      resetButton(elements.buttonConfig);
    } finally {
      formState.isSubmitting = false;
    }
  };
}

/**
 * Handles button and optional announcer updates on successful form submission.
 */
function handleSuccess(
  buttonConfig: ButtonConfig,
  announcer?: HTMLElement
): void {
  const { button, texts, classes } = buttonConfig;
  button.textContent = texts.success;
  button.classList.add(classes.success);
  if (announcer) {
    announcer.textContent = texts.success;
  }

  setTimeout(() => resetButton(buttonConfig), 2000);
}

/**
 * Handles validation errors from form submission
 */
function handleValidationError(
  result: ValidationResult,
  elements: FormElements
): void {
  resetButton(elements.buttonConfig);

  // Display errors for each field
  for (const [field, error] of Object.entries(result.errors)) {
    const input = elements.inputs[field];
    if (input) {
      // Display error message
      displayError(error, input.errorElement);
      input.element.setAttribute("aria-invalid", "true");

      // Display field suggestion if available
      if (result.suggestions?.[field]) {
        input.element.value = result.suggestions[field];
      }

      // Set focus to field if not a <select> element
      if (
        input.element instanceof HTMLInputElement ||
        input.element instanceof HTMLTextAreaElement
      ) {
        input.element.select();
      }
    }
  }
}

/**
 * Sets button to loading state
 */
function setButtonLoading({ button, texts }: ButtonConfig): void {
  button.disabled = true;
  button.textContent = texts.loading;
}

/**
 * Resets button
 */
function resetButton({ button, texts, classes }: ButtonConfig): void {
  button.disabled = false;
  button.textContent = texts.original;
  button.classList.remove(classes.success);
}
