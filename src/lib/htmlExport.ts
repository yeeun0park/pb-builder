// html2canvas is dynamically imported in captureIframeAsJpeg to keep the
// initial bundle small (saves ~300kB on first load for users who never
// export JPG).

export const openPrintView = (html: string, title: string): void => {
  const win = window.open("", "_blank", "width=1280,height=900");
  if (!win) {
    alert("팝업이 차단되었습니다. 주소 표시줄의 차단을 해제해주세요.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.document.title = title || "PB 상세페이지";

  const injectSinglePageStyle = () => {
    const doc = win.document;
    const body = doc.body;
    if (!body) return;
    const w = Math.max(body.scrollWidth, doc.documentElement.scrollWidth, 1200);
    const h = Math.max(body.scrollHeight, doc.documentElement.scrollHeight, 1);
    const style = doc.createElement("style");
    style.setAttribute("data-pb-single-page", "1");
    style.textContent = `
      @page { size: ${w}px ${h}px; margin: 0; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; width: ${w}px !important; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        * { page-break-inside: avoid !important; break-inside: avoid !important; }
        body > * { page-break-after: avoid !important; break-after: avoid !important; }
      }
    `;
    doc.head.appendChild(style);
  };

  const waitForImagesAndPrint = () => {
    const doc = win.document;
    const imgs = Array.from(doc.images);
    const pending = imgs.filter((img) => !img.complete);
    if (pending.length === 0) {
      injectSinglePageStyle();
      // 추가 페인트 사이클 후 인쇄 (페이지 사이즈 반영)
      setTimeout(() => {
        win.focus();
        try {
          win.print();
        } catch {
          /* ignore */
        }
      }, 300);
      return;
    }
    let remaining = pending.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) {
        injectSinglePageStyle();
        setTimeout(() => {
          win.focus();
          try {
            win.print();
          } catch {
            /* ignore */
          }
        }, 300);
      }
    };
    pending.forEach((img) => {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  };

  if (win.document.readyState === "complete") {
    setTimeout(waitForImagesAndPrint, 200);
  } else {
    win.addEventListener("load", () => setTimeout(waitForImagesAndPrint, 200));
  }
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

export interface CaptureOptions {
  width?: number;
  height?: number;
  filename?: string;
  targetSelector?: string;
}

export const captureIframeAsJpeg = async (
  iframe: HTMLIFrameElement,
  filenameOrOptions?: string | CaptureOptions,
): Promise<void> => {
  const opts: CaptureOptions =
    typeof filenameOrOptions === "string"
      ? { filename: filenameOrOptions }
      : (filenameOrOptions ?? {});

  const doc = iframe.contentDocument;
  if (!doc || !doc.body) throw new Error("프리뷰 iframe을 읽을 수 없습니다");

  const target = opts.targetSelector
    ? (doc.querySelector(opts.targetSelector) as HTMLElement | null)
    : doc.body;
  if (!target) throw new Error("캡처 대상을 찾을 수 없습니다");

  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(target, {
    useCORS: true,
    backgroundColor: "#ffffff",
    scale: 2,
    width: opts.width,
    height: opts.height,
    windowWidth: opts.width ?? doc.documentElement.scrollWidth,
    windowHeight: opts.height ?? doc.documentElement.scrollHeight,
  });
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92),
  );
  if (!blob) throw new Error("JPG 변환 실패");
  triggerDownload(blob, opts.filename ?? "export.jpg");
};

export const downloadHtmlFile = (html: string, filename: string): void => {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  triggerDownload(blob, filename);
};
