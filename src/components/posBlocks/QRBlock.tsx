import type { QRBlock as QRBlockType } from "@/lib/posSchema";

type Props = { block: QRBlockType; logoUrl: string; textColor: string };

export const QRBlock = ({ block, logoUrl, textColor }: Props) => {
  const s = block.style ?? {};
  const outerJustify =
    s.align === "left"
      ? "flex-start"
      : s.align === "right"
      ? "flex-end"
      : "center";
  // marginTop: style override가 있으면 px값, 없으면 "auto"로 밀어냄
  const marginTop: string | number =
    s.marginTop !== undefined ? s.marginTop : "auto";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        marginTop,
        marginBottom: s.marginBottom,
        justifyContent: outerJustify,
      }}
    >
      {block.qrDataUrl ? (
        <img src={block.qrDataUrl} alt="QR 코드" style={{ width: 130, height: 130 }} />
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {logoUrl ? (
          <img src={logoUrl} alt="PB 로고" style={{ width: 40, height: 40 }} />
        ) : null}
        <div
          style={{
            color: s.color ?? textColor,
            fontSize: s.fontSize ?? 13,
            fontWeight: 700,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          {block.caption}
        </div>
      </div>
    </div>
  );
};
