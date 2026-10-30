/**
 * base64.ts
 * Cross-platform Base64 and Base64URL string encoding and decoding utilities
 * compatible with Node.js, Bun, and browser WebCrypto environments.
 */

export function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64(base64Str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64Str, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(atob(base64Str)));
}

export function toBase64Url(str: string): string {
  return toBase64(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function fromBase64Url(base64UrlStr: string): string {
  let base64 = base64UrlStr.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return fromBase64(base64);
}
