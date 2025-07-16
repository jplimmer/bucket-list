import { userStorage } from "../utils/storage.js";

/**
 * Updates the given container with the current user's name, if available.
 * If no username is found, the container is cleared.
 * @param container The HTML element where the username should be displayed.
 */
export function displayUsername(container: HTMLElement): void {
  const userName = userStorage.load();
  container.textContent = userName ? `, ${userName}` : "";
}
