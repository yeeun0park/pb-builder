import { z } from "zod";
import { nanoid } from "nanoid";

export const EyebrowBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("eyebrow"),
  text: z.string().default(""),
});

export const TitleBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("title"),
  lines: z.array(z.string()).default([""]),
});

export const HighlightBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("highlight"),
  lines: z.array(z.string()).default([""]),
});

export const PillItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const PillRowBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("pillRow"),
  items: z.array(PillItemSchema).default([]),
});

export const TextLineBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("textLine"),
  text: z.string().default(""),
});

export const RankItemSchema = z.object({
  rank: z.number().int().min(1),
  text: z.string(),
});

export const RankListBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("rankList"),
  items: z.array(RankItemSchema).default([]),
});

export const QRBlockSchema = z.object({
  id: z.string().default(() => nanoid(8)),
  type: z.literal("qrBlock"),
  qrDataUrl: z.string().default(""),
  caption: z.string().default(""),
});

export const POSBlockSchema = z.discriminatedUnion("type", [
  EyebrowBlockSchema,
  TitleBlockSchema,
  HighlightBlockSchema,
  PillRowBlockSchema,
  TextLineBlockSchema,
  RankListBlockSchema,
  QRBlockSchema,
]);

export const POSCardSchema = z.object({
  layout: z.enum(["split", "fullbleed"]).default("split"),
  keyVisualUrl: z.string().default(""),
  panelBg: z.string().default("#E8E5F2"),
  textPrimary: z.string().default("#1A1A1A"),
  textAccent: z.string().default("#3A4FB8"),
  pillBg: z.string().default("#3A4FB8"),
  pillText: z.string().default("#FFFFFF"),
  blocks: z.array(POSBlockSchema).default([]),
});

export type EyebrowBlock = z.infer<typeof EyebrowBlockSchema>;
export type TitleBlock = z.infer<typeof TitleBlockSchema>;
export type HighlightBlock = z.infer<typeof HighlightBlockSchema>;
export type PillItem = z.infer<typeof PillItemSchema>;
export type PillRowBlock = z.infer<typeof PillRowBlockSchema>;
export type TextLineBlock = z.infer<typeof TextLineBlockSchema>;
export type RankItem = z.infer<typeof RankItemSchema>;
export type RankListBlock = z.infer<typeof RankListBlockSchema>;
export type QRBlock = z.infer<typeof QRBlockSchema>;
export type POSBlock = z.infer<typeof POSBlockSchema>;
export type POSCard = z.infer<typeof POSCardSchema>;
