let cached: Promise<string> | null = null;

const toBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const getLogoDataUrl = (): Promise<string> => {
  if (cached) return cached;
  cached = fetch(`${import.meta.env.BASE_URL}logo/pb-logo.png`)
    .then((r) => {
      if (!r.ok) throw new Error(`logo fetch failed: ${r.status}`);
      return r.blob();
    })
    .then(toBase64);
  return cached;
};

let cachedPapaapp: Promise<string> | null = null;

export const getPapaappLogoDataUrl = (): Promise<string> => {
  if (cachedPapaapp) return cachedPapaapp;
  cachedPapaapp = fetch(`${import.meta.env.BASE_URL}logo/papaapp-logo.png`)
    .then((r) => {
      if (!r.ok) throw new Error(`papaapp logo fetch failed: ${r.status}`);
      return r.blob();
    })
    .then(toBase64);
  return cachedPapaapp;
};
