import { useRef, useState } from "react";
import { useCampaignStore } from "@/lib/store";
import { sampleParanLabel } from "@/lib/samples";
import type { EditorMode } from "@/lib/types";
import { AutoMode } from "./AutoMode";
import { DetailMode } from "./DetailMode";
import { HtmlDetailMode } from "./HtmlDetailMode";
import { POSMode } from "./POSMode";
import { Preview } from "./Preview";

export const Editor = () => {
  const [mode, setMode] = useState<EditorMode>("auto");
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const loadJson = useCampaignStore((s) => s.loadJson);
  const reset = useCampaignStore((s) => s.reset);
  const previewRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-divider bg-white px-6 py-3">
        <h1 className="text-lg font-bold">PB 상세페이지 초안 디자인 생성</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadJson(sampleParanLabel)}
            className="rounded border border-divider px-3 py-1.5 text-xs hover:border-theme hover:text-theme"
          >
            샘플 불러오기
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded border border-divider px-3 py-1.5 text-xs hover:border-red-400 hover:text-red-600"
          >
            초기화
          </button>
        </div>
      </header>
      <div className="flex border-b border-divider bg-white">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`border-b-2 px-6 py-2.5 text-sm ${
            mode === "auto"
              ? "border-theme font-bold text-theme"
              : "border-transparent text-fg-muted hover:text-fg"
          }`}
        >
          🤖 AI 자동 생성
        </button>
        <button
          type="button"
          onClick={() => setMode("detail")}
          className={`border-b-2 px-6 py-2.5 text-sm ${
            mode === "detail"
              ? "border-theme font-bold text-theme"
              : "border-transparent text-fg-muted hover:text-fg"
          }`}
        >
          🛠️ 세부 조정
          {htmlOutput && (
            <span className="ml-1 rounded bg-theme/10 px-1.5 py-0.5 text-[10px] text-theme">
              HTML
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMode("pos")}
          className={`border-b-2 px-6 py-2.5 text-sm ${
            mode === "pos"
              ? "border-theme font-bold text-theme"
              : "border-transparent text-fg-muted hover:text-fg"
          }`}
        >
          📌 POS/해피TV 화면 만들기
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[480px] shrink-0 flex-col overflow-y-auto border-r border-divider bg-white">
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
        <section className="flex-1 bg-gray-100">
          <Preview ref={previewRef} mode={mode} />
        </section>
      </div>
    </div>
  );
};
