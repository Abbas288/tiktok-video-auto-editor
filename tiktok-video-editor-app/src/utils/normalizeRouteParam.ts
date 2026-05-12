/**
 * Normalizes an Expo Router route parameter into a single string value.
 *
 * Expo Router params can be string arrays depending on how the route is opened.
 * Empty values are treated as missing params.
 *
 * @param value Route parameter from Expo Router.
 * @returns A normalized string id, or undefined if no usable value exists.
 */
export function normalizeRouteParam(
  value: string | string[] | undefined,
): string | undefined {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  return normalizedValue?.trim() || undefined;
}
