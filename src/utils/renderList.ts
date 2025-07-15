/**
 * Renders a list of items as HTML List Item elements in a container.
 * @param container Container element to render the list in
 * @param list Array of items to render
 * @param callback Function that converts each item to an HTMLLIElement
 */
export function renderList<T>(
  container: HTMLElement,
  list: T[],
  callback: (item: T) => HTMLLIElement
): void {
  const frag = document.createDocumentFragment();

  for (const item of list) {
    const li = callback(item);
    frag.append(li);
  }

  container.replaceChildren(frag);
}
