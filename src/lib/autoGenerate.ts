import { nanoid } from "nanoid";
import type { MultiImageItem } from "@/components/ui/MultiImageInput";
import type { Campaign, Section } from "./types";

export type AutoInput = {
  title?: string;
  subhead?: string;
  period?: string;
  themeColor: string;
  slug?: string;
  images: MultiImageItem[];
  description: string;
};

const trim = (s?: string) => {
  const t = s?.trim();
  return t && t.length > 0 ? t : undefined;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 40) || "campaign";

const splitParagraphs = (text: string): string[] => {
  const cleaned = text.trim();
  if (!cleaned) return [];

  const byDouble = cleaned.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  if (byDouble.length > 1) return byDouble;

  const bySingle = cleaned.split(/\n/).map((s) => s.trim()).filter(Boolean);
  if (bySingle.length > 1) return bySingle;

  const sentences = cleaned
    .split(/(?<=[.!?。!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return [cleaned];

  const grouped: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    grouped.push(sentences.slice(i, i + 2).join(" "));
  }
  return grouped;
};

const extractTitleAndRest = (
  text: string,
  userTitle?: string,
): { title: string; rest: string } => {
  const trimmed = text.trim();
  const userT = trim(userTitle);
  if (userT) return { title: userT, rest: trimmed };
  if (!trimmed) return { title: "새 캠페인", rest: "" };

  const firstLineMatch = trimmed.match(/^([^\n]+)\n/);
  if (firstLineMatch) {
    return {
      title: firstLineMatch[1].trim(),
      rest: trimmed.slice(firstLineMatch[0].length).trim(),
    };
  }

  const sentenceMatch = trimmed.match(/^(.+?[.!?。!?])\s+/);
  if (sentenceMatch) {
    return {
      title: sentenceMatch[1].trim().replace(/[.!?。!?]+$/, ""),
      rest: trimmed.slice(sentenceMatch[0].length).trim(),
    };
  }

  const head = trimmed.slice(0, 40);
  return { title: head, rest: trimmed.slice(40).trim() };
};

export const autoGenerate = (input: AutoInput): Campaign => {
  const { title, rest } = extractTitleAndRest(input.description, input.title);
  const paragraphs = splitParagraphs(rest);
  const [firstImage, ...restImages] = input.images;

  const sections: Section[] = [];

  sections.push({
    id: nanoid(8),
    type: "hero",
    image: firstImage?.image ?? "",
    imageMeta: firstImage?.imageMeta,
    headline: title,
    subhead: trim(input.subhead),
    period: trim(input.period),
    overlay: "dark",
    align: "center",
  });

  const paraQueue = [...paragraphs];
  const imgQueue = [...restImages];

  if (paraQueue.length > 0) {
    sections.push({
      id: nanoid(8),
      type: "textBlock",
      body: paraQueue.shift()!,
      align: "center",
      bg: "white",
    });
  }

  while (imgQueue.length > 0) {
    const img = imgQueue.shift()!;
    sections.push({
      id: nanoid(8),
      type: "fullbleed",
      image: img.image,
      imageMeta: img.imageMeta,
    });
    if (paraQueue.length > 0) {
      sections.push({
        id: nanoid(8),
        type: "textBlock",
        body: paraQueue.shift()!,
        align: "center",
        bg: "white",
      });
    }
  }

  if (paraQueue.length > 0) {
    sections.push({
      id: nanoid(8),
      type: "textBlock",
      body: paraQueue.join("\n\n"),
      align: "center",
      bg: "white",
    });
  }

  return {
    title,
    slug: input.slug || slugify(title),
    period: trim(input.period),
    themeColor: input.themeColor,
    sections,
  };
};
