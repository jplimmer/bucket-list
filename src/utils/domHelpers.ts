// Fetch element and raise error if not found
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
