import { useRef, useState } from "react";
import { MonitorSmartphone, RotateCcw, SlidersHorizontal, Sparkles, Star } from "lucide-react";
import { useCampaignStore } from "@/lib/store";
import { sampleParanLabel } from "@/lib/samples";
import type { EditorMode } from "@/lib/types";
import { AutoMode } from "./AutoMode";
import { DetailMode } from "./DetailMode";
import { HtmlDetailMode } from "./HtmlDetailMode";
import { POSMode } from "./POSMode";
import { Preview } from "./Preview";

type TabDef = {
  key: EditorMode;
  icon: typeof Sparkles;
  label: string;
};

const TABS: TabDef[] = [
  { key: "auto", icon: Sparkles, label: "AI 자동 생성" },
  { key: "detail", icon: SlidersHorizontal, label: "세부조정 및 수동제작" },
  { key: "pos", icon: MonitorSmartphone, label: "POS·해피TV" },
];

export const Editor = () => {
  const [mode, setMode] = useState<EditorMode>("auto");
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const loadJson = useCampaignStore((s) => s.loadJson);
  const reset = useCampaignStore((s) => s.reset);
  const previewRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex h-screen flex-col bg-porcelain-50">
      <header className="flex items-center justify-between border-b border-porcelain-200 bg-white px-7 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[20px] font-bold text-navy-600">
            PB 상세페이지 빌더
          </h1>
          <span className="text-[12px] text-porcelain-500">
            Paris Baguette 공식 톤 자동 생성
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadJson(sampleParanLabel)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-porcelain-300 bg-white px-3 text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:text-navy-600"
          >
            <Star className="h-3.5 w-3.5" />
            샘플 불러오기
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-porcelain-300 bg-white px-3 text-[12px] font-bold text-porcelain-600 transition hover:border-porcelain-500 hover:text-porcelain-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            초기화
          </button>
        </div>
      </header>
      <div className="flex border-b border-porcelain-200 bg-white px-4">
        {TABS.map(({ key, icon: Icon, label }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-[14px] transition ${
                active
                  ? "border-navy-600 font-bold text-navy-600"
                  : "border-transparent text-porcelain-600 hover:text-navy-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {key === "detail" && htmlOutput && (
                <span className="rounded-md bg-navy-600/10 px-1.5 py-0.5 text-[10px] font-bold text-navy-600">
                  HTML
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[480px] shrink-0 flex-col overflow-y-auto border-r border-porcelain-200 bg-white">
          {mode === "pos" ? (
            <POSMode previewRef={previewRef} />
          ) : mode === "auto" ? (
            <AutoMode onGenerated={() => {}} previewRef={previewRef} />
          ) : htmlOutput ? (
            <HtmlDetailMode previewRef={previewRef} />
          ) : (
            <DetailMode />
          )}
        </aside>
        <section className="flex-1 bg-porcelain-100">
          <Preview ref={previewRef} mode={mode} />
        </section>
      </div>
    </div>
  );
};
