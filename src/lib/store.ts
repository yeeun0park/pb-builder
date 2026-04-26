import { nanoid } from "nanoid";
import { create } from "zustand";
import { CampaignSchema } from "./schema";
import type { Campaign, Section, SectionType } from "./types";

const createEmptySection = (type: SectionType): Section => {
  const id = nanoid(8);
  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        image: "",
        headline: "",
        overlay: "dark",
        align: "center",
      };
    case "fullbleed":
      return { id, type: "fullbleed", image: "" };
    case "split":
      return {
        id,
        type: "split",
        image: "",
        imageSide: "left",
        headline: "",
        body: "",
      };
    case "textBlock":
      return {
        id,
        type: "textBlock",
        body: "",
        align: "center",
        bg: "white",
      };
    case "grid":
      return {
        id,
        type: "grid",
        columns: 2,
        items: [{ image: "" }, { image: "" }],
      };
  }
};

const defaultCampaign = (): Campaign => ({
  title: "새 캠페인",
  slug: "new-campaign",
  themeColor: "#2B75B9",
  sections: [],
});

type State = {
  campaign: Campaign;
  selectedSectionId: string | null;
  htmlOutput: string;
};

type Actions = {
  updateMeta: (patch: Partial<Omit<Campaign, "sections">>) => void;
  addSection: (type: SectionType, atIndex?: number) => string;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updateSection: <T extends Section>(id: string, patch: Partial<T>) => void;
  selectSection: (id: string | null) => void;
  loadJson: (json: unknown) => { ok: true } | { ok: false; error: string };
  exportJson: () => Campaign;
  setHtmlOutput: (html: string) => void;
  reset: () => void;
};

export const useCampaignStore = create<State & Actions>((set, get) => ({
  campaign: defaultCampaign(),
  selectedSectionId: null,
  htmlOutput: "",

  setHtmlOutput: (html) => set({ htmlOutput: html }),

  updateMeta: (patch) =>
    set((s) => ({ campaign: { ...s.campaign, ...patch } })),

  addSection: (type, atIndex) => {
    const section = createEmptySection(type);
    set((s) => {
      const next = [...s.campaign.sections];
      const idx = atIndex ?? next.length;
      next.splice(idx, 0, section);
      return {
        campaign: { ...s.campaign, sections: next },
        selectedSectionId: section.id,
      };
    });
    return section.id;
  },

  removeSection: (id) =>
    set((s) => ({
      campaign: {
        ...s.campaign,
        sections: s.campaign.sections.filter((sec) => sec.id !== id),
      },
      selectedSectionId:
        s.selectedSectionId === id ? null : s.selectedSectionId,
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((s) => {
      const next = [...s.campaign.sections];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { campaign: { ...s.campaign, sections: next } };
    }),

  updateSection: (id, patch) =>
    set((s) => ({
      campaign: {
        ...s.campaign,
        sections: s.campaign.sections.map((sec) =>
          sec.id === id ? ({ ...sec, ...patch } as Section) : sec,
        ),
      },
    })),

  selectSection: (id) => set({ selectedSectionId: id }),

  loadJson: (json) => {
    const result = CampaignSchema.safeParse(json);
    if (!result.success) {
      return { ok: false, error: result.error.message };
    }
    set({ campaign: result.data, selectedSectionId: null });
    return { ok: true };
  },

  exportJson: () => get().campaign,

  reset: () =>
    set({
      campaign: defaultCampaign(),
      selectedSectionId: null,
      htmlOutput: "",
    }),
}));
