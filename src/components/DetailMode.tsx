import { Info } from "lucide-react";
import { MetaBar } from "./MetaBar";
import { SectionForm } from "./SectionForm";
import { SectionList } from "./SectionList";

export const DetailMode = () => (
  <>
    <div className="mx-5 mt-5 flex items-start gap-2.5 rounded-lg bg-navy-50 px-3.5 py-3 text-[12px] leading-relaxed text-porcelain-700">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
      <div>
        <strong className="text-navy-600">세부 조정 및 수동 제작</strong>
        <br />
        <strong>AI 자동 생성</strong> 결과를 다듬거나, 처음부터 섹션을 추가해 직접 만들 수 있어요.
      </div>
    </div>
    <MetaBar />
    <SectionList />
    <SectionForm />
  </>
);
