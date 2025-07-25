/**
 * Displays an error message to the user.
 *
 * If an error container is provided, the message is rendered there via textContent.
 * Otherwise, it falls back to using `alert()`.
 * @param error The error object or message to display
 * @param errorContainer Optional DOM element to display the error in.
 */
export function displayError(error: unknown, errorContainer?: HTMLElement) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected error occurred.";

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("visually-hidden");

    if (!errorContainer.getAttribute("role")) {
      errorContainer.setAttribute("role", "alert");
    }

    if (!errorContainer.getAttribute("aria-live")) {
      errorContainer.setAttribute("aria-live", "polite");
    }

    if (!errorContainer.getAttribute("aria-atomic")) {
      errorContainer.setAttribute("aria-atomic", "true");
    }
  } else {
    alert(message);
  }
}

/**
 * Clears error message and resets validation state for given parameters.
 * @param input HTML Input element to be reset
 * @param error HTML element containing error to be cleared
 */
export function clearError(input: HTMLElement, error: HTMLElement): void {
  error.classList.add("visually-hidden");
  error.textContent = "";
  input.removeAttribute("aria-invalid");
}
