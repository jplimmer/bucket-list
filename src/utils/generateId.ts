/**
 * Generates a unique ID, either by incrementing a counter or finding the max ID in an array.
 * @param counter Counter to increment (optional)
 * @param array Array of objects with id property to find a max from (optional)
 * @returns Next available ID
 * @throws Error if neither counter nor array is provided
 */
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
