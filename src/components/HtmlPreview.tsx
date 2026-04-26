import { forwardRef } from "react";

type Props = {
  html: string;
};

export const HtmlPreview = forwardRef<HTMLIFrameElement, Props>(
  ({ html }, ref) => {
    if (!html) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-fg-muted">
          AI가 HTML을 생성하면 여기에 미리보기가 나타납니다.
        </div>
      );
    }
    return (
      <iframe
        ref={ref}
        srcDoc={html}
        title="PB 상세페이지 프리뷰"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#fff",
        }}
      />
    );
  },
);

HtmlPreview.displayName = "HtmlPreview";
