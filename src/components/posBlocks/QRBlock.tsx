import type { QRBlock as QRBlockType } from "@/lib/posSchema";

type Props = { block: QRBlockType; logoUrl: string; textColor: string };

export const QRBlock = ({ block, logoUrl, textColor }: Props) => {
  const s = block.style ?? {};
  const isVertical = block.layout === "vertical";
  const justify =
    s.align === "left"
      ? "flex-start"
      : s.align === "right"
      ? "flex-end"
      : "center";
  // marginTop: style override가 있으면 px값, 없으면 "auto"로 밀어냄
  const marginTop: string | number =
    s.marginTop !== undefined ? s.marginTop : "auto";

  // horizontal: 이전 동작 (좌측 정렬, 로고/캡션 옆 column)
  // vertical: 새 동작 (가운데 정렬, 로고/캡션 row 묶음 아래)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        // vertical: alignItems stretch로 자식 width 같게 (QR과 로고/캡션 묶음 폭 일치)
        alignItems: isVertical ? "stretch" : "flex-end",
        // vertical 외곽은 fit-content (QR width 130에 맞춤)
        width: isVertical ? "fit-content" : undefined,
        // 부모(패널) 안에서 가로 정렬은 alignSelf로
        alignSelf: isVertical ? justify : undefined,
        gap: isVertical ? 8 : 12,
        marginTop,
        marginBottom: s.marginBottom,
        justifyContent: isVertical ? undefined : (s.align ? justify : "flex-start"),
        transform: s.scale && s.scale !== 1 ? `scale(${s.scale})` : undefined,
        transformOrigin: "center top",
      }}
    >
      {block.qrDataUrl ? (
        <img src={block.qrDataUrl} alt="QR 코드" style={{ width: 130, height: 130 }} />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "row" : "column",
          // horizontal(column): 좌측 정렬로 복원 (이전 동작), vertical(row): 세로 가운데
          alignItems: isVertical ? "center" : "flex-start",
          // vertical: 부모 width 130 안에서 로고/캡션 묶음을 가운데 정렬
          justifyContent: isVertical ? "center" : undefined,
          gap: isVertical ? 8 : 4,
        }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="파바앱 로고" style={{ width: 40, height: 40 }} />
        ) : null}
        <div
          style={{
            color: s.color ?? textColor,
            fontSize: s.fontSize ?? 13,
            fontWeight: 700,
            lineHeight: s.lineHeight ?? 1.4,
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {block.caption}
        </div>
      </div>
    </div>
  );
};
