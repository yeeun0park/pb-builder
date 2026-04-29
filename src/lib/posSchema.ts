import { z } from "zod";
import { nanoid } from "nanoid";

const HexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
const BlockId = z.string().min(1).default(() => nanoid(8));

export const EyebrowBlockSchema = z.object({
  id: BlockId,
  type: z.literal("eyebrow"),
  text: z.string().default(""),
});

export const TitleBlockSchema = z.object({
  id: BlockId,
  type: z.literal("title"),
  lines: z.array(z.string()).default([""]),
});

export const HighlightBlockSchema = z.object({
  id: BlockId,
  type: z.literal("highlight"),
  lines: z.array(z.string()).default([""]),
});

export const PillItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const PillRowBlockSchema = z.object({
  id: BlockId,
  type: z.literal("pillRow"),
  items: z.array(PillItemSchema).default([]),
});

export const TextLineBlockSchema = z.object({
  id: BlockId,
  type: z.literal("textLine"),
  text: z.string().default(""),
});

export const RankItemSchema = z.object({
  rank: z.number().int().min(1),
  text: z.string(),
});

export const RankListBlockSchema = z.object({
  id: BlockId,
  type: z.literal("rankList"),
  items: z.array(RankItemSchema).default([]),
});

export const QRBlockSchema = z.object({
  id: BlockId,
  type: z.literal("qrBlock"),
  qrDataUrl: z.string().optional(),
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
  keyVisualUrl: z.string().optional(),
  panelBg: HexColor.default("#E8E5F2"),
  textPrimary: HexColor.default("#1A1A1A"),
  textAccent: HexColor.default("#3A4FB8"),
  pillBg: HexColor.default("#3A4FB8"),
  pillText: HexColor.default("#FFFFFF"),
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
