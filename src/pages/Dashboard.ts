import { getRequiredElement } from "../utils/domHelpers.js";
import { getDreamList, getUsername, saveDreamList } from "../utils/storage.js";
import { Dream } from "../models/types.js";
import { renderList } from "../ui/renderList.js";
import { createDreamListItem } from "../ui/dreamListItem.js";

// Mock variables
import { dreams } from "../constants/mockVariables.js";
saveDreamList(dreams);

document.addEventListener("DOMContentLoaded", () => {
  // Display username
  const nameSpan = getRequiredElement<HTMLSpanElement>("#user-name");
  const userName = getUsername();
  nameSpan.textContent = userName ? `, ${userName}` : "!";

  // Render dream list
  const dreamListContainer =
    getRequiredElement<HTMLUListElement>(".dream-list");
  const dreamList = getDreamList();
  if (dreamList) {
    renderList<Dream>(dreamListContainer, dreamList, createDreamListItem);
  }
});
