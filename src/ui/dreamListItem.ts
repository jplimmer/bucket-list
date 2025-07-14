import { Dream } from "../models/types.js";
import { getRequiredElement } from "../utils/domHelpers.js";

export function createDreamListItem(dream: Dream): HTMLLIElement {
  const tpl = getRequiredElement<HTMLTemplateElement>("#dream-tpl");
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  li.setAttribute("role", "list");

  li.dataset.id = dream.id.toString();
  const itemId = `dream-check-${dream.id.toString()}`;

  // Checkbox
  const checkbox = getRequiredElement<HTMLInputElement>("input", li);
  checkbox.id = itemId;
  checkbox.checked = dream.isChecked;

  // Label
  const label = getRequiredElement<HTMLLabelElement>("label", li);
  label.htmlFor = itemId;
  // Prepend to avoid overwriting child <span> element
  label.prepend(dream.name);

  // Dream-theme span
  const span = getRequiredElement<HTMLSpanElement>(".dream-theme", li);
  span.textContent = dream.theme;

  // Delete button
  const delBtn = getRequiredElement<HTMLButtonElement>("button", li);
  delBtn.setAttribute("aria-label", `Ta bort '${dream.name}'`);

  return li;
}
