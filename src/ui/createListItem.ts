import { ASSETS_CONFIG } from "../constants/globalConfig.js";
import { Dream } from "../models/domain.js";
import { getRequiredElement } from "../utils/domHelpers.js";

/**
 * Creates an HTML List Item element for a dream based on an HTML template, with checkbox, label, theme and delete button.
 * @param dream The dream object to render
 * @returns The configured HTML list item element
 */
export function createDreamListItem(dream: Dream): HTMLLIElement {
  const tpl = getRequiredElement<HTMLTemplateElement>("#dream-tpl");
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  // li.setAttribute("role", "list");

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
  const delImg = getRequiredElement<HTMLImageElement>("img", li);
  delImg.src = ASSETS_CONFIG.ICONS.DELETE_TRASH;

  return li;
}

export function createThemeListItem(theme: string): HTMLLIElement {
  const tpl = getRequiredElement<HTMLTemplateElement>("#theme-template");
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;

  // Paragraph text
  const p = getRequiredElement<HTMLParagraphElement>("p", li);
  p.textContent = theme;

  // Button icon
  const delImg = getRequiredElement<HTMLImageElement>("img", li);
  delImg.src = ASSETS_CONFIG.ICONS.DELETE_TRASH;

  return li;
}
