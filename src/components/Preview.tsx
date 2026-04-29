import { forwardRef, lazy, Suspense, useEffect, useState } from "react";
import { getLogoDataUrl } from "@/lib/assets";
import { useCampaignStore } from "@/lib/store";
import type { EditorMode } from "@/lib/types";
import { HtmlPreview } from "./HtmlPreview";
import { POSPreview } from "./POSPreview";

const PdfPreview = lazy(() => import("./PdfPreview"));

type Props = {
  mode: EditorMode;
};

export const Preview = forwardRef<HTMLIFrameElement, Props>(({ mode }, ref) => {
  const campaign = useCampaignStore((s) => s.campaign);
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    getLogoDataUrl().then(setLogoSrc);
  }, []);

  if (mode === "pos") {
    return <POSPreview ref={ref} />;
  }

  if (htmlOutput) {
    return <HtmlPreview ref={ref} html={htmlOutput} />;
  }

  if (mode === "auto") {
    return <HtmlPreview ref={ref} html="" />;
  }

  if (!logoSrc) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-fg-muted">
        로고 로딩 중…
      </div>
    );
  }

  if (campaign.sections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-fg-muted">
        섹션을 추가하면 프리뷰가 여기에 나타납니다.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-fg-muted">
          PDF 뷰어 로딩 중…
        </div>
      }
    >
      <PdfPreview campaign={campaign} logoSrc={logoSrc} />
    </Suspense>
  );
});

Preview.displayName = "Preview";
