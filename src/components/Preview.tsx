import { PDFViewer } from "@react-pdf/renderer";
import { forwardRef, useEffect, useState } from "react";
import { getLogoDataUrl } from "@/lib/assets";
import { useCampaignStore } from "@/lib/store";
import { CampaignDocument } from "@/pdf/Document";
import { HtmlPreview } from "./HtmlPreview";

type Props = {
  mode: "auto" | "detail";
};

export const Preview = forwardRef<HTMLIFrameElement, Props>(({ mode }, ref) => {
  const campaign = useCampaignStore((s) => s.campaign);
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    getLogoDataUrl().then(setLogoSrc);
  }, []);

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
    <PDFViewer
      style={{ width: "100%", height: "100%", border: "none" }}
      showToolbar
    >
      <CampaignDocument campaign={campaign} logoSrc={logoSrc} />
    </PDFViewer>
  );
});

Preview.displayName = "Preview";
