import { z } from "zod";
import { nanoid } from "nanoid";

const HexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
const BlockId = z.string().min(1).default(() => nanoid(8));

export const BlockStyleSchema = z.object({
  align: z.enum(["left", "center", "right"]).optional(),
  fontSize: z.number().int().min(8).max(72).optional(),
  lineHeight: z.number().min(0.8).max(3).optional(),
  marginTop: z.number().int().min(0).max(200).optional(),
  marginBottom: z.number().int().min(0).max(200).optional(),
  color: HexColor.optional(),
  scale: z.number().min(0.3).max(3).optional(),
});

export type BlockStyle = z.infer<typeof BlockStyleSchema>;

export const EyebrowBlockSchema = z.object({
  id: BlockId,
  type: z.literal("eyebrow"),
  text: z.string().default(""),
  style: BlockStyleSchema.optional(),
});

export const TitleBlockSchema = z.object({
  id: BlockId,
  type: z.literal("title"),
  lines: z.array(z.string()).default([""]),
  style: BlockStyleSchema.optional(),
});

export const HighlightBlockSchema = z.object({
  id: BlockId,
  type: z.literal("highlight"),
  lines: z.array(z.string()).default([""]),
  style: BlockStyleSchema.optional(),
});

export const PillItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const PillRowBlockSchema = z.object({
  id: BlockId,
  type: z.literal("pillRow"),
  items: z.array(PillItemSchema).default([]),
  style: BlockStyleSchema.optional(),
});

export const TextLineBlockSchema = z.object({
  id: BlockId,
  type: z.literal("textLine"),
  text: z.string().default(""),
  style: BlockStyleSchema.optional(),
});

export const TextGroupBlockSchema = z.object({
  id: BlockId,
  type: z.literal("textGroup"),
  lines: z.array(z.string()).default([""]),
  style: BlockStyleSchema.optional(),
});

export const RankItemSchema = z.object({
  rank: z.number().int().min(1),
  text: z.string(),
});

export const RankListBlockSchema = z.object({
  id: BlockId,
  type: z.literal("rankList"),
  items: z.array(RankItemSchema).default([]),
  style: BlockStyleSchema.optional(),
});

export const QRBlockSchema = z.object({
  id: BlockId,
  type: z.literal("qrBlock"),
  qrDataUrl: z.string().optional(),
  caption: z.string().default(""),
  style: BlockStyleSchema.optional(),
});

export const POSBlockSchema = z.discriminatedUnion("type", [
  EyebrowBlockSchema,
  TitleBlockSchema,
  HighlightBlockSchema,
  PillRowBlockSchema,
  TextLineBlockSchema,
  TextGroupBlockSchema,
  RankListBlockSchema,
  QRBlockSchema,
]);

export const POSCardSchema = z.object({
  layout: z.enum(["split", "fullbleed"]).default("split"),
  keyVisualUrl: z.string().optional(),
  keyVisualPosition: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }).default({ x: 50, y: 50 }),
  splitRatio: z.number().min(0.3).max(0.8).default(0.6),
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
export type TextGroupBlock = z.infer<typeof TextGroupBlockSchema>;
export type RankItem = z.infer<typeof RankItemSchema>;
export type RankListBlock = z.infer<typeof RankListBlockSchema>;
export type QRBlock = z.infer<typeof QRBlockSchema>;
export type POSBlock = z.infer<typeof POSBlockSchema>;
export type POSCard = z.infer<typeof POSCardSchema>;
