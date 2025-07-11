// här är det bara level-up!
import { themes } from "../models/types.js";
import { getUsername } from "../utils/storage.js";

const nameInput = document.getElementById("name-input") as HTMLInputElement;
nameInput.value = getUsername() ?? "";

const themeList = document.getElementById("theme-list") as HTMLUListElement;
if (themeList) {
  themes.forEach((theme) => {
    const li = document.createElement("li");
    li.innerHTML = `<p>${theme}</p> <img src="../assets/images/trash_delete.png" />`;
    themeList.appendChild(li);
  });
}

// "logga ut"
const logOutBtn = document.querySelector(".logout");
logOutBtn?.addEventListener("click", logOut);

function logOut(): void {
  window.location.replace("login.html");
}
