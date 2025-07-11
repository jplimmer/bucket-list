export function generateId<T extends { id: number }>(
  counter?: number,
  array?: T[]
): number {
  if (counter !== undefined) return ++counter;

  if (array !== undefined) {
    return array.length
      ? array.reduce((m, item) => Math.max(m, item.id), 0) + 1
      : 1;
  }
  throw new Error(
    "Missing argument: either 'counter' or 'array' must be provided."
  );
}
