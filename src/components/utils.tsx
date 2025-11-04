/** Returns the local‑midnight timestamp for “today”. */
export const todayMidnight = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/**
 * Parse a date string (YYYY‑MM‑DD or ISO).
 * ‑ If it can be parsed, we normalise it to local midnight and return its timestamp.
 * ‑ If it is empty / invalid / null / undefined, return `null`.
 */
export const safeDate = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
