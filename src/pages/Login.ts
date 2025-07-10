import { getRequiredElement } from "../utils/domHelpers.js";
import { getUsername, setUsername } from "../utils/storage.js";

function login(): void {
  const usernameInput = getRequiredElement<HTMLInputElement>("#username");
  const passwordInput = getRequiredElement<HTMLInputElement>("#password");

  setUsername(usernameInput.value);
}

const loginForm = getRequiredElement<HTMLFormElement>("form");
loginForm.addEventListener("submit", login);
