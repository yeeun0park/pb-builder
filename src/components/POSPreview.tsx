import { forwardRef, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { useCampaignStore } from "@/lib/store";
import { getPapaappLogoDataUrl } from "@/lib/assets";
import { getEmbeddedFontCss } from "@/lib/fontBase64";
import { POSCanvas } from "./POSCanvas";

export const POSPreview = forwardRef<HTMLIFrameElement>((_, ref) => {
  const card = useCampaignStore((s) => s.posCard);
  const [logoUrl, setLogoUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useEffect(() => {
    getPapaappLogoDataUrl().then(setLogoUrl);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const mount = async () => {
      // 1. style은 한 번만 주입
      if (!doc.getElementById("pos-style")) {
        const fontCss = await getEmbeddedFontCss();
        if (cancelled) return;
        doc.head.innerHTML = `
          <style id="pos-style">
            ${fontCss}
            html, body { margin: 0; padding: 0; background: #f0f0f0; }
            body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            #pos-root { width: 800px; height: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          </style>
        `;
        doc.body.innerHTML = `<div id="pos-root"></div>`;
      }
      if (cancelled) return;

      // 2. ReactDOM.Root 가드는 #pos-style과 분리 — rootRef가 없을 때만 생성
      if (!rootRef.current) {
        const mountNode = doc.getElementById("pos-root");
        if (!mountNode) return;
        rootRef.current = ReactDOM.createRoot(mountNode);
      }

      // 3. render는 매번 (card/logoUrl 변경 반영)
      rootRef.current.render(<POSCanvas card={card} logoUrl={logoUrl} />);
    };

    mount();

    // card/logoUrl 변경 시 cleanup은 cancelled만 처리 — unmount 안 함
    return () => {
      cancelled = true;
    };
  }, [card, logoUrl]);

  // 컴포넌트 진짜 unmount 시에만 root 정리
  useEffect(() => {
    return () => {
      rootRef.current?.unmount();
      rootRef.current = null;
    };
  }, []);

  return (
    <iframe
      ref={(el) => {
        iframeRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      title="POS Preview"
      style={{ width: "100%", height: "100%", border: "none", background: "#f0f0f0" }}
    />
  );
});

POSPreview.displayName = "POSPreview";
