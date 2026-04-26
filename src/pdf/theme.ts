import type { Section } from "@/lib/types";

export const PAGE_WIDTH = 1200;

export const colors = {
  bg: "#FFFFFF",
  fg: "#1A1A1A",
  fgMuted: "#6B6B6B",
  divider: "#EDEDED",
  overlayDark: "rgba(0, 0, 0, 0.35)",
  overlayLight: "rgba(255, 255, 255, 0.35)",
};

export const fonts = {
  body: "PBGothic",
};

export const typography = {
  heroHeadline: { size: 56, weight: 700, lineHeight: 1.25, letterSpacing: -1.1 },
  heroSub: { size: 22, weight: 400, lineHeight: 1.5, letterSpacing: 0 },
  sectionHeadline: { size: 40, weight: 700, lineHeight: 1.3, letterSpacing: -0.6 },
  sectionSub: { size: 20, weight: 400, lineHeight: 1.6, letterSpacing: 0 },
  body: { size: 17, weight: 400, lineHeight: 1.75, letterSpacing: 0 },
  caption: { size: 16, weight: 400, lineHeight: 1.5, letterSpacing: 0 },
  period: { size: 15, weight: 400, lineHeight: 1.4, letterSpacing: 0.3 },
};

export const spacing = {
  textBlockPaddingY: 96,
  textBlockPaddingX: 80,
  splitPaddingY: 80,
  splitColumnGap: 56,
  gridGap2: 24,
  gridGap3: 20,
  gridPaddingX: 80,
  gridPaddingY: 80,
  footerPaddingY: 72,
  captionPaddingY: 24,
};

export const HERO_FALLBACK_HEIGHT = 780;
export const FULLBLEED_FALLBACK_HEIGHT = 800;
export const CAPTION_HEIGHT = 88;
export const SPLIT_IMG_MIN = 400;
export const SPLIT_IMG_MAX = 900;
export const FOOTER_HEIGHT = 72 * 2 + 20;
export const LOGO_WIDTH = 200;
export const LOGO_ASPECT = 25 / 339;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const estimateLines = (text: string, charsPerLine: number) => {
  if (!text) return 0;
  const explicitLines = text.split("\n");
  let total = 0;
  for (const line of explicitLines) {
    total += Math.max(1, Math.ceil(line.length / charsPerLine));
  }
  return total;
};

export const heroHeight = (imageMeta?: { w: number; h: number }): number => {
  if (!imageMeta || imageMeta.w <= 0) return HERO_FALLBACK_HEIGHT;
  return Math.round((PAGE_WIDTH * imageMeta.h) / imageMeta.w);
};

export const fullbleedImageHeight = (
  imageMeta?: { w: number; h: number },
): number => {
  if (!imageMeta || imageMeta.w <= 0) return FULLBLEED_FALLBACK_HEIGHT;
  return Math.round((PAGE_WIDTH * imageMeta.h) / imageMeta.w);
};

export const splitColumnWidth = (): number =>
  (PAGE_WIDTH - spacing.textBlockPaddingX * 2 - spacing.splitColumnGap) / 2;

export const splitImageHeight = (
  imageMeta?: { w: number; h: number },
): number => {
  const colW = splitColumnWidth();
  if (!imageMeta || imageMeta.w <= 0) return 540;
  const natural = Math.round((colW * imageMeta.h) / imageMeta.w);
  return clamp(natural, SPLIT_IMG_MIN, SPLIT_IMG_MAX);
};

const textBlockHeight = (
  headline: string | undefined,
  body: string,
): number => {
  const headlineHeight = headline
    ? typography.sectionHeadline.size * typography.sectionHeadline.lineHeight +
      32
    : 0;
  const bodyLines = estimateLines(body, 60);
  const bodyHeight =
    bodyLines * typography.body.size * typography.body.lineHeight;
  return spacing.textBlockPaddingY * 2 + headlineHeight + bodyHeight;
};

const gridHeight = (section: Extract<Section, { type: "grid" }>): number => {
  const cols = section.columns;
  const gap = cols === 2 ? spacing.gridGap2 : spacing.gridGap3;
  const contentWidth = PAGE_WIDTH - spacing.gridPaddingX * 2;
  const colWidth = (contentWidth - (cols - 1) * gap) / cols;
  const rows = Math.ceil(section.items.length / cols);
  const hasCaption = section.items.some((it) => it.title || it.caption);
  const itemHeight = colWidth + (hasCaption ? 70 : 0);
  const headlineHeight = section.headline
    ? typography.sectionHeadline.size * typography.sectionHeadline.lineHeight +
      32
    : 0;
  return (
    spacing.gridPaddingY * 2 +
    headlineHeight +
    rows * itemHeight +
    Math.max(0, rows - 1) * gap
  );
};

export const sectionHeight = (section: Section): number => {
  switch (section.type) {
    case "hero":
      return heroHeight(section.imageMeta);
    case "fullbleed": {
      const imgH = fullbleedImageHeight(section.imageMeta);
      return section.caption ? imgH + CAPTION_HEIGHT : imgH;
    }
    case "split":
      return splitImageHeight(section.imageMeta) + spacing.splitPaddingY * 2;
    case "textBlock":
      return textBlockHeight(section.headline, section.body);
    case "grid":
      return gridHeight(section);
  }
};

export const totalPageHeight = (sections: Section[]): number => {
  const sum = sections.reduce((acc, s) => acc + sectionHeight(s), 0);
  return sum + FOOTER_HEIGHT;
};
