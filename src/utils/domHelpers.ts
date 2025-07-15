/**
 * Finds an element by selector and throws if not found.
 * @param selector CSS selector string
 * @param root Root element or document to search within (defaults to document)
 * @returns The found element, typed as T
 * @throws Error if element is not found
 */
export function getRequiredElement<T extends HTMLElement>(
  selector: string,
  root: Document | HTMLElement = document
): T {
  const el = root.querySelector<T>(selector);
  if (!el)
    throw new Error(
      `${selector} not found in ${
        root instanceof Document ? "document" : "element"
      }.`
    );
  return el;
}
