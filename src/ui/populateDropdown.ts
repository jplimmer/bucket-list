/**
 * Populates the select element with options from the provided list.
 * Replaces any existing options in the select element.
 * @param container The HTML Select element to populate with options
 * @param list The list of strings that represent the option values and text
 * @param prompt Optional string for a prompt as the first option - prompt value will be "promp".
 */
export function populateDropdown(
  container: HTMLSelectElement,
  list: string[],
  prompt?: string
): void {
  const frag = document.createDocumentFragment();

  if (prompt) {
    frag.appendChild(createDropdownPrompt(prompt));
  }

  for (const item of list) {
    const option = document.createElement("option");

    option.textContent = item;
    option.value = item.toLowerCase();

    frag.appendChild(option);
  }

  container.replaceChildren(frag);
}

/**
 * Creates HTML option element with value "prompt", to be inserted at the start of a dropdown,
 * @param text Text string for prompt option to display
 * @returns HTML Option element with textContent as text input string and value as "prompt"
 */
function createDropdownPrompt(text: string): HTMLOptionElement {
  const promptOption = document.createElement("option");
  promptOption.value = "prompt";
  promptOption.textContent = text;
  return promptOption;
}
