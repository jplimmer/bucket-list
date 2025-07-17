/**
 * Populates the select element with options from the provided list.
 * Replaces any existing options in the select element.
 * @param container The HTML Select element to populate with options
 * @param list The list of strings that represent the option values and text
 */
export function populateDropdown(
  container: HTMLSelectElement,
  list: string[]
): void {
  const frag = document.createDocumentFragment();

  for (const item of list) {
    const option = document.createElement("option");
    option.textContent = item;
    frag.appendChild(option);
  }

  container.replaceChildren(frag);
}
