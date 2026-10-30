export const DEFAULT_ALLOWED_ORIGINS: string[] = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'https://stelladullam.vercel.app',
  'https://stelladullam-land.vercel.app',
  'https://stelladullam.com',
  'https://app.stelladullam.com',
  'https://land.stelladullam.com',
];

/**
 * Validates whether a request origin matches the permitted CORS whitelist.
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true; // allow same-origin and CLI/curl

  const configured = process.env.ALLOWED_ORIGINS;
  const whitelist = configured
    ? configured.split(',').map((o) => o.trim())
    : DEFAULT_ALLOWED_ORIGINS;

  return whitelist.includes(origin);
}
