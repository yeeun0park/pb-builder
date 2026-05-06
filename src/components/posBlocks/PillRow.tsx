import type { PillRowBlock } from "@/lib/posSchema";

type Props = {
  block: PillRowBlock;
  pillBg: string;
  pillText: string;
  textColor: string;
};

export const PillRow = ({ block, pillBg, pillText, textColor }: Props) => {
  if (block.items.length === 0) return null;
  const s = block.style ?? {};
  // 외곽: width fit-content + margin auto로 패널 안에서 가로 정렬 (기본 center)
  // 각 항목 내부는 flex-start로 좌측 시작선 공유
  const align = s.align ?? "center";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 14,
        width: "fit-content",
        marginLeft: align === "left" ? undefined : "auto",
        marginRight: align === "right" ? undefined : "auto",
      }}
    >
      {block.items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              background: pillBg,
              color: pillText,
              padding: "4px 14px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
          <span style={{ color: textColor, fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
