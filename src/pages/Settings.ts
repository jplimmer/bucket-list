import { defaultThemes } from "../constants/dreamThemes.js";
import {
  loadUsername,
  redirectIfNotLoggedIn,
} from "../services/authService.js";
import { renderThemes } from "../ui/renderList.js";
import { getRequiredElement } from "../utils/domHelpers.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

/**
 * Setings page controller - manages username and theme list interactions.
 */

// Placeholders for elements shared between functions
let nameInput: HTMLInputElement;
let changeNameDiv: HTMLDivElement;
let themeUl: HTMLUListElement;
let addThemeDiv: HTMLDivElement;

// "logga ut"
const logOutBtn = document.querySelector(".logout");
logOutBtn?.addEventListener("click", logOut);

function logOut(): void {
  // window.location.replace("login.html");
}

function initialiseSettingsPage(): void {
  // Redirect if not logged in
  redirectIfNotLoggedIn();

  // Find and set shared elements for module
  nameInput = getRequiredElement<HTMLInputElement>("#name-input");
  changeNameDiv = getRequiredElement<HTMLDivElement>(".change-name");
  themeUl = getRequiredElement<HTMLUListElement>("#theme-list");
  addThemeDiv = getRequiredElement<HTMLDivElement>(".add-theme");

  // Display username in name input element
  nameInput.value = loadUsername();

  // Render dream list
  renderThemes(themeUl);

  // Add event listeners
  // changeNameDiv.addEventListener("",);
  // dreamUl.addEventListener("click", );
  // addThemeDiv.addEventListener("",);
}

// Entry point: renders themes and sets up event listeners
document.addEventListener("DOMContentLoaded", initialiseSettingsPage);
