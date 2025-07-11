import { Dream } from "../models/types.js";
import { getRequiredElement } from "../utils/domHelpers.js";

export function createDreamListItem(dream: Dream): HTMLLIElement {
  const tpl = getRequiredElement<HTMLTemplateElement>("#dream-tpl");
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;

  const checkbox = getRequiredElement<HTMLInputElement>("input", li);
  const label = getRequiredElement<HTMLLabelElement>("label", li);
  const span = getRequiredElement<HTMLSpanElement>(".dream-theme", li);

  checkbox.checked = dream.isChecked;
  label.textContent = dream.name;
  span.textContent = dream.theme;
  li.dataset.id = dream.id.toString();

  return li;
}
