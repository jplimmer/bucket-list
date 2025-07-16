import { defaultThemes } from "../constants/dreamThemes.js";
import { userStorage } from "../utils/storage.js";
import { redirectIfNotLoggedIn } from "../services/authService.js";

// Redirect if not logged in
redirectIfNotLoggedIn();

const nameInput = document.getElementById("name-input") as HTMLInputElement;
nameInput.value = userStorage.load() ?? "";

const themeList = document.getElementById("theme-list") as HTMLUListElement;
if (themeList) {
  defaultThemes.forEach((theme) => {
    const li = document.createElement("li");
    li.innerHTML = `<p>${theme}</p> <img src="../assets/icons/trash_delete.png" />`;
    themeList.appendChild(li);
  });
}

// "logga ut"
const logOutBtn = document.querySelector(".logout");
logOutBtn?.addEventListener("click", logOut);

function logOut(): void {
  window.location.replace("login.html");
}
