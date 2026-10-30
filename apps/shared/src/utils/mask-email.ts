/**
 * mask-email.ts
 * Email address masking utility for user profile cards,
 * KYC audit summaries, and notifications.
 */

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return trimmed;
  }

  const username = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);

  if (username.length <= 2) {
    return `${username[0]}*${domain}`;
  }

  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  const maskedMiddle = "*".repeat(Math.max(1, username.length - 2));

  return `${firstChar}${maskedMiddle}${lastChar}${domain}`;
}
