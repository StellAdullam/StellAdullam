/**
 * URL slugify and alphanumeric sanitization utility.
 */

export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // separate accents from letters
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, ""); // trim - from end of text
}
