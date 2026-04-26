import { useRef, useState } from "react";
import { geminiGenerateHtml } from "@/lib/geminiHtml";
import { getGeminiKey, hasGeminiKey } from "@/lib/geminiKey";
import {
  captureIframeAsJpeg,
  downloadHtmlFile,
  openPrintView,
} from "@/lib/htmlExport";
import { useCampaignStore } from "@/lib/store";
import { FieldLabel } from "./ui/FieldLabel";
import { GeminiKeyPanel } from "./GeminiKeyPanel";
import {
  type MultiImageItem,
  MultiImageInput,
} from "./ui/MultiImageInput";

type Props = {
  onGenerated: () => void;
  previewRef: React.RefObject<HTMLIFrameElement>;
};

const sanitizeFilename = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "pb-campaign";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

export const AutoMode = ({ onGenerated, previewRef }: Props) => {
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const setHtmlOutput = useCampaignStore((s) => s.setHtmlOutput);

  const [title, setTitle] = useState("");
  const [subhead, setSubhead] = useState("");
  const [period, setPeriod] = useState("");
  const [themeColor, setThemeColor] = useState("#2B75B9");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<MultiImageItem[]>([]);
  const [keyRev, setKeyRev] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportingJpg, setExportingJpg] = useState(false);

  const filenameBase = useRef("pb-campaign");

  const canGenerate =
    hasGeminiKey() &&
    (title.trim().length > 0 || description.trim().length > 0) &&
    images.length > 0 &&
    !loading;

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const html = await geminiGenerateHtml({
        apiKey: getGeminiKey(),
        title,
        subhead,
        period,
        themeColor,
        description,
        images,
      });
      setHtmlOutput(html);
      filenameBase.current = `${sanitizeFilename(title || description.slice(0, 20))}_${todayStr()}`;
      onGenerated();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const readLiveHtml = (): string => {
    const doc = previewRef.current?.contentDocument;
    if (!doc) return htmlOutput;
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  };

  const handlePdf = () => {
    if (!htmlOutput) return;
    openPrintView(readLiveHtml(), title || "PB 상세페이지");
  };

  const handleJpg = async () => {
    if (!previewRef.current) {
      setError("프리뷰 iframe을 찾을 수 없습니다");
      return;
    }
    setExportingJpg(true);
    setError(null);
    try {
      await captureIframeAsJpeg(
        previewRef.current,
        `${filenameBase.current}.jpg`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setExportingJpg(false);
    }
  };

  const handleHtml = () => {
    if (!htmlOutput) return;
    downloadHtmlFile(readLiveHtml(), `${filenameBase.current}.html`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-fg-muted">
        <strong className="text-fg">HTML 자동 생성 (AI)</strong>
        <br />
        Gemini가 레퍼런스(paris.co.kr)를 참고해 완전 커스텀 HTML·CSS를 생성합니다.
        결과는 우측 프리뷰에서 확인하고, 하단 버튼으로 PDF·JPG로 내려받을 수 있습니다.
      </div>

      <GeminiKeyPanel onChange={() => setKeyRev((v) => v + 1)} />

      <div key={keyRev} />

      <FieldLabel label="제목 (비우면 설명글에서 자동 추출)">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 파란라벨이라면 건강도 습관이 됩니다"
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>

      <FieldLabel label="부제 (선택)">
        <input
          type="text"
          value={subhead}
          onChange={(e) => setSubhead(e.target.value)}
          placeholder="예: 매일의 건강한 한 조각"
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>

      <FieldLabel label="기간 (선택)">
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="2026-04-09 ~ 2026-12-31"
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>

      <FieldLabel label="테마 컬러 (포인트 컬러)">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-divider"
          />
          <input
            type="text"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="flex-1 rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
          />
        </div>
      </FieldLabel>

      <div className="flex flex-col gap-2 border-t border-divider pt-4">
        <span className="text-sm font-bold">이미지 (순서대로)</span>
        <MultiImageInput items={images} onChange={setImages} />
      </div>

      <FieldLabel label="설명글 (자유 형식, 통째로)">
        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="매장·제품·브랜드·혜택 등 자유롭게 작성. AI가 읽고 적절한 섹션으로 분배합니다."
          className="rounded border border-divider px-2 py-1.5 text-sm leading-relaxed focus:border-theme focus:outline-none"
        />
      </FieldLabel>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!canGenerate}
        onClick={handleGenerate}
        className="rounded bg-theme px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading
          ? "Gemini 분석·HTML 생성 중…"
          : !hasGeminiKey()
            ? "Gemini API 키 설정 필요"
            : canGenerate
              ? "AI로 상세페이지 HTML 생성"
              : "설명글 + 이미지 1장 이상 필요"}
      </button>

      {htmlOutput && (
        <div className="flex flex-col gap-2 border-t border-divider pt-4">
          <span className="text-sm font-bold">내보내기</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handlePdf}
              className="rounded border border-divider bg-white px-3 py-2 text-xs hover:border-theme hover:text-theme"
              title="새 탭 열고 브라우저 인쇄 다이얼로그에서 'PDF로 저장' 선택"
            >
              📄 PDF 저장
            </button>
            <button
              type="button"
              onClick={handleJpg}
              disabled={exportingJpg}
              className="rounded border border-divider bg-white px-3 py-2 text-xs hover:border-theme hover:text-theme disabled:opacity-40"
            >
              {exportingJpg ? "변환 중…" : "🖼️ JPG 저장"}
            </button>
            <button
              type="button"
              onClick={handleHtml}
              className="rounded border border-divider bg-white px-3 py-2 text-xs hover:border-theme hover:text-theme"
            >
              💻 HTML 저장
            </button>
          </div>
          <p className="text-xs text-fg-muted">
            PDF: 새 탭 인쇄 다이얼로그 → "PDF로 저장" 선택.
            벡터 텍스트 유지됩니다.
          </p>
        </div>
      )}
    </div>
  );
};
