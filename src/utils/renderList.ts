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
