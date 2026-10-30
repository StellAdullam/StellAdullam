/**
 * Universal cryptographic SHA-256 hash utility using standard WebCrypto API.
 * Operates isomorphically across browsers, Node.js 18+, and Bun.
 */

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    bytes as unknown as BufferSource,
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifySha256(
  data: string | Uint8Array,
  expectedHex: string,
): Promise<boolean> {
  const actualHex = await sha256Hex(data);
  return actualHex.toLowerCase() === expectedHex.toLowerCase();
}
