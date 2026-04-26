import { z } from "zod";

const HexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "hex 컬러 형식이어야 합니다");

const Slug = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, "영문 소문자·숫자·하이픈만 허용");

const Period = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}\s*~\s*\d{4}-\d{2}-\d{2}$/,
    "YYYY-MM-DD ~ YYYY-MM-DD 형식이어야 합니다",
  )
  .optional();

const Id = z.string().min(1);
const ImageSrc = z.string().min(1);

const ImageMetaSchema = z
  .object({ w: z.number().positive(), h: z.number().positive() })
  .optional();

export const HeroSectionSchema = z.object({
  id: Id,
  type: z.literal("hero"),
  image: ImageSrc,
  imageMeta: ImageMetaSchema,
  headline: z.string().min(1),
  subhead: z.string().optional(),
  period: Period,
  overlay: z.enum(["dark", "light", "none"]).default("dark"),
  align: z.enum(["center", "left"]).default("center"),
});

export const FullbleedSectionSchema = z.object({
  id: Id,
  type: z.literal("fullbleed"),
  image: ImageSrc,
  imageMeta: ImageMetaSchema,
  caption: z.string().optional(),
  link: z.string().url().optional(),
});

export const SplitSectionSchema = z.object({
  id: Id,
  type: z.literal("split"),
  image: ImageSrc,
  imageMeta: ImageMetaSchema,
  imageSide: z.enum(["left", "right"]).default("left"),
  headline: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string()).optional(),
});

export const TextBlockSectionSchema = z.object({
  id: Id,
  type: z.literal("textBlock"),
  headline: z.string().optional(),
  body: z.string().min(1),
  align: z.enum(["center", "left"]).default("center"),
  bg: z.enum(["white", "muted", "themeTint"]).default("white"),
});

export const GridItemSchema = z.object({
  image: ImageSrc,
  imageMeta: ImageMetaSchema,
  title: z.string().optional(),
  caption: z.string().optional(),
});

export const GridSectionSchema = z.object({
  id: Id,
  type: z.literal("grid"),
  columns: z.union([z.literal(2), z.literal(3)]),
  items: z.array(GridItemSchema).min(1),
  headline: z.string().optional(),
});

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  FullbleedSectionSchema,
  SplitSectionSchema,
  TextBlockSectionSchema,
  GridSectionSchema,
]);

export const CampaignSchema = z.object({
  title: z.string().min(1),
  slug: Slug,
  period: Period,
  themeColor: HexColor.default("#2B75B9"),
  sections: z.array(SectionSchema),
});

export const SectionTypeSchema = z.enum([
  "hero",
  "fullbleed",
  "split",
  "textBlock",
  "grid",
]);
