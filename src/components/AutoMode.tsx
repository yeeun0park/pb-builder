import { useRef, useState } from "react";
import {
  ChevronDown,
  Code2,
  FileText,
  Image as ImageIcon,
  Info,
  Settings2,
  Wand2,
} from "lucide-react";
import { geminiGenerateHtml } from "@/lib/geminiHtml";
import {
  captureIframeAsJpeg,
  downloadHtmlFile,
  openPrintView,
} from "@/lib/htmlExport";
import { useCampaignStore } from "@/lib/store";
import { FieldLabel } from "./ui/FieldLabel";
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

const inputCls =
  "h-11 rounded-lg border border-porcelain-300 bg-white px-3 text-[14px] text-porcelain-800 transition focus:outline-none";

export const AutoMode = ({ onGenerated, previewRef }: Props) => {
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const setHtmlOutput = useCampaignStore((s) => s.setHtmlOutput);

  const [title, setTitle] = useState("");
  const [subhead, setSubhead] = useState("");
  const [period, setPeriod] = useState("");
  const [themeColor, setThemeColor] = useState("#09275A");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<MultiImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportingJpg, setExportingJpg] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const optionalFilledCount =
    (title.trim() ? 1 : 0) +
    (subhead.trim() ? 1 : 0) +
    (period.trim() ? 1 : 0) +
    (themeColor !== "#09275A" ? 1 : 0);

  const filenameBase = useRef("pb-campaign");

  const canGenerate =
    (title.trim().length > 0 || description.trim().length > 0) &&
    images.length > 0 &&
    !loading;

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const html = await geminiGenerateHtml({
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
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-start gap-2.5 rounded-lg bg-navy-50 px-3.5 py-3 text-[12px] leading-relaxed text-porcelain-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
        <div>
          <strong className="text-navy-600">HTML 자동 생성 (AI)</strong>
          <br />
          Gemini가 paris.co.kr 톤을 참고해 커스텀 HTML·CSS를 생성합니다. 1~2분 후 우측 프리뷰에서 결과를 확인하고 PDF·JPG로 내려받으세요.
        </div>
      </div>

      <FieldLabel label="설명글 (자유 형식, 통째로)">
        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="매장·제품·브랜드·혜택 등 자유롭게 작성. AI가 읽고 적절한 섹션으로 분배합니다."
          className="rounded-lg border border-porcelain-300 bg-white px-3 py-2.5 text-[14px] leading-relaxed text-porcelain-800 focus:outline-none"
        />
      </FieldLabel>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold text-porcelain-700">
          이미지 (순서대로)
        </span>
        <MultiImageInput items={images} onChange={setImages} />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-porcelain-200 bg-porcelain-50">
        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          aria-expanded={showOptional}
          className="flex items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-porcelain-100"
        >
          <span className="inline-flex items-center gap-2 text-[13px] font-bold text-porcelain-700">
            <Settings2 className="h-4 w-4 text-navy-600" />
            추가 정보 (선택)
            <span className="text-[11px] font-normal text-porcelain-500">
              제목·부제·기간·테마 컬러
            </span>
            {optionalFilledCount > 0 && (
              <span className="rounded-md bg-navy-600/10 px-1.5 py-0.5 text-[10px] font-bold text-navy-600">
                {optionalFilledCount}개 설정됨
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-porcelain-500 transition ${
              showOptional ? "rotate-180" : ""
            }`}
          />
        </button>
        {showOptional && (
          <div className="flex flex-col gap-4 border-t border-porcelain-200 bg-white px-4 py-4">
            <FieldLabel label="제목 (비우면 설명글에서 자동 추출)">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 파란라벨이라면 건강도 습관이 됩니다"
                className={inputCls}
              />
            </FieldLabel>

            <FieldLabel label="부제">
              <input
                type="text"
                value={subhead}
                onChange={(e) => setSubhead(e.target.value)}
                placeholder="예: 매일의 건강한 한 조각"
                className={inputCls}
              />
            </FieldLabel>

            <FieldLabel label="기간">
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2026-04-09 ~ 2026-12-31"
                className={inputCls}
              />
            </FieldLabel>

            <FieldLabel label="테마 컬러 (포인트 컬러)">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-porcelain-300"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </FieldLabel>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-accent-hot/30 bg-accent-hot-tint px-3.5 py-3 text-[12px] text-accent-hot">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!canGenerate}
        onClick={handleGenerate}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-600 px-5 text-[15px] font-bold text-white shadow-pb-sm transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-porcelain-300 disabled:text-porcelain-600 disabled:shadow-none"
      >
        <Wand2 className="h-4 w-4" />
        {loading
          ? "Gemini 분석·HTML 생성 중…"
          : canGenerate
            ? "AI로 상세페이지 HTML 생성"
            : "설명글 + 이미지 1장 이상 필요"}
      </button>

      {htmlOutput && (
        <div className="flex flex-col gap-2 border-t border-porcelain-200 pt-5">
          <span className="text-[13px] font-bold text-porcelain-700">
            내보내기
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handlePdf}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-porcelain-300 bg-white text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:text-navy-600"
              title="새 탭 열고 브라우저 인쇄 다이얼로그에서 'PDF로 저장' 선택"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button
              type="button"
              onClick={handleJpg}
              disabled={exportingJpg}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-porcelain-300 bg-white text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:text-navy-600 disabled:opacity-40"
            >
              <ImageIcon className="h-4 w-4" />
              {exportingJpg ? "변환 중…" : "JPG"}
            </button>
            <button
              type="button"
              onClick={handleHtml}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-porcelain-300 bg-white text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:text-navy-600"
            >
              <Code2 className="h-4 w-4" />
              HTML
            </button>
          </div>
          <p className="text-[11px] text-porcelain-500">
            PDF: 새 탭 인쇄 다이얼로그 → "PDF로 저장" 선택. 벡터 텍스트 유지.
          </p>
        </div>
      )}
    </div>
  );
};
