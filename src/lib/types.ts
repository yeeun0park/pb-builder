import { z } from "zod";
import {
  CampaignSchema,
  FullbleedSectionSchema,
  GridItemSchema,
  GridSectionSchema,
  HeroSectionSchema,
  SectionSchema,
  SectionTypeSchema,
  SplitSectionSchema,
  TextBlockSectionSchema,
} from "./schema";

export type HeroSection = z.infer<typeof HeroSectionSchema>;
export type FullbleedSection = z.infer<typeof FullbleedSectionSchema>;
export type SplitSection = z.infer<typeof SplitSectionSchema>;
export type TextBlockSection = z.infer<typeof TextBlockSectionSchema>;
export type GridItem = z.infer<typeof GridItemSchema>;
export type GridSection = z.infer<typeof GridSectionSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type SectionType = z.infer<typeof SectionTypeSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;

export type EditorMode = "auto" | "detail" | "pos";
