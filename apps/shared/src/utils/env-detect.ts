/**
 * Runtime environment detection helpers for universal code execution across browser, Node.js, and Bun.
 */

export const isBrowser = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
};

export const isNode = (): boolean => {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null &&
    !isBun()
  );
};

export const isBun = (): boolean => {
  return (
    typeof process !== "undefined" &&
    (process.versions as Record<string, string | undefined>)?.bun != null
  );
};

export const isTest = (): boolean => {
  return (
    (typeof process !== "undefined" && process.env?.NODE_ENV === "test") ||
    typeof (globalThis as Record<string, unknown>).describe === "function"
  );
};

export const isProduction = (): boolean => {
  return (
    typeof process !== "undefined" && process.env?.NODE_ENV === "production"
  );
};

export const isDevelopment = (): boolean => {
  return !isProduction() && !isTest();
};
