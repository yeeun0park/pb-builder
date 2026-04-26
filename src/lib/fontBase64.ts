const fetchAsDataUrl = async (path: string): Promise<string> => {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`폰트 로드 실패: ${path}`);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
};

let cached: Promise<string> | null = null;

export const getEmbeddedFontCss = (): Promise<string> => {
  if (cached) return cached;
  const base = import.meta.env.BASE_URL;
  cached = Promise.all([
    fetchAsDataUrl(`${base}fonts/PBGothicRg.ttf`),
    fetchAsDataUrl(`${base}fonts/PBGothicBd.ttf`),
  ]).then(
    ([rg, bd]) => `
@font-face {
  font-family: 'PBGothic';
  src: url('${rg}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'PBGothic';
  src: url('${bd}') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: block;
}
`.trim(),
  );
  return cached;
};
