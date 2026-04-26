const KEY_STORAGE = "pb_gemini_api_key";

export const getGeminiKey = (): string => {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
};

export const setGeminiKey = (k: string): void => {
  try {
    const trimmed = k.trim();
    if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed);
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* noop */
  }
};

export const clearGeminiKey = (): void => {
  try {
    localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* noop */
  }
};

export const hasGeminiKey = (): boolean => getGeminiKey().length > 0;

export const maskKey = (k: string): string => {
  if (!k) return "";
  if (k.length < 10) return "••••";
  return `${k.slice(0, 4)}${"•".repeat(10)}${k.slice(-4)}`;
};
