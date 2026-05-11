import { useState, type RefObject } from "react";
import { Code2, FileText, Image as ImageIcon } from "lucide-react";
import {
  captureIframeAsJpeg,
  downloadHtmlFile,
  openPrintView,
} from "@/lib/htmlExport";

const sanitize = (s: string) =>
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

type Props = {
  previewRef: RefObject<HTMLIFrameElement | null>;
  htmlOutput: string;
  titleHint?: string;
};

export const HtmlExportPanel = ({ previewRef, htmlOutput, titleHint }: Props) => {
  const [exportingJpg, setExportingJpg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filenameBase = `${sanitize(titleHint || "pb-campaign")}_${todayStr()}`;

  const readLiveHtml = (): string => {
    const doc = previewRef.current?.contentDocument;
    if (!doc) return htmlOutput;
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  };

  const handlePdf = () => {
    if (!htmlOutput) return;
    openPrintView(readLiveHtml(), titleHint || "PB 상세페이지");
  };

  const handleJpg = async () => {
    if (!previewRef.current) {
      setError("프리뷰 iframe을 찾을 수 없습니다");
      return;
    }
    setExportingJpg(true);
    setError(null);
    try {
      await captureIframeAsJpeg(previewRef.current, `${filenameBase}.jpg`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setExportingJpg(false);
    }
  };

  const handleHtml = () => {
    if (!htmlOutput) return;
    downloadHtmlFile(readLiveHtml(), `${filenameBase}.html`);
  };

  return (
    <div className="flex flex-col gap-2 border-t border-porcelain-200 pt-5">
      <span className="text-[13px] font-bold text-porcelain-700">내보내기</span>
      {error && (
        <div className="rounded-lg border border-accent-hot/30 bg-accent-hot-tint px-3 py-2 text-[12px] text-accent-hot">
          {error}
        </div>
      )}
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
  );
};
