import { useCampaignStore } from "@/lib/store";
import { FullbleedForm } from "./sectionForms/FullbleedForm";
import { GridForm } from "./sectionForms/GridForm";
import { HeroForm } from "./sectionForms/HeroForm";
import { SplitForm } from "./sectionForms/SplitForm";
import { TextBlockForm } from "./sectionForms/TextBlockForm";

export const SectionForm = () => {
  const sections = useCampaignStore((s) => s.campaign.sections);
  const selectedId = useCampaignStore((s) => s.selectedSectionId);
  const selected = sections.find((s) => s.id === selectedId);

  if (!selected) {
    return (
      <div className="p-5 text-center text-[13px] text-porcelain-500">
        섹션을 선택하면 편집 폼이 여기에 나타납니다.
      </div>
    );
  }

  return (
    <div className="border-t border-porcelain-200 p-5">
      <h3 className="mb-3 text-[13px] font-bold text-porcelain-800">섹션 편집</h3>
      {selected.type === "hero" && <HeroForm section={selected} />}
      {selected.type === "fullbleed" && <FullbleedForm section={selected} />}
      {selected.type === "split" && <SplitForm section={selected} />}
      {selected.type === "textBlock" && <TextBlockForm section={selected} />}
      {selected.type === "grid" && <GridForm section={selected} />}
    </div>
  );
};
