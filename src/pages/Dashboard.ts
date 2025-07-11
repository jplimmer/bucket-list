import { getRequiredElement } from "../utils/domHelpers.js";
import { getUsername } from "../utils/storage.js";

// Display username
const nameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
const userName = getUsername();
nameSpan.textContent = userName ? `, ${userName}` : "!";

// Render dream list
