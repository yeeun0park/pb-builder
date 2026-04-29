import type { QRBlock as QRBlockType } from "@/lib/posSchema";

type Props = { block: QRBlockType; logoUrl: string; textColor: string };

export const QRBlock = ({ block, logoUrl, textColor }: Props) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: "auto" }}>
    {block.qrDataUrl ? (
      <img src={block.qrDataUrl} alt="QR 코드" style={{ width: 110, height: 110 }} />
    ) : null}
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {logoUrl ? <img src={logoUrl} alt="PB 로고" style={{ width: 36, height: 36 }} /> : null}
      <div style={{ color: textColor, fontSize: 11, fontWeight: 700, lineHeight: 1.4, whiteSpace: "pre-line" }}>
        {block.caption}
      </div>
    </div>
  </div>
);
