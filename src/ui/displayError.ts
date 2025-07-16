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
  } else {
    alert(message);
  }
}
