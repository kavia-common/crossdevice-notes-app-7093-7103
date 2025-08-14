export function toDateSafe(value) {
  /** Safely convert various date representations to a Date object, or null if invalid. */
  if (!value) return null;
  try {
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}
