import type { RankListBlock } from "@/lib/posSchema";

type Props = { block: RankListBlock; pillBg: string; pillText: string; textColor: string };

export const RankList = ({ block, pillBg, pillText, textColor }: Props) => {
  if (block.items.length === 0) return null;
  const s = block.style ?? {};
  const rowJustify =
    s.align === "left"
      ? "flex-start"
      : s.align === "right"
      ? "flex-end"
      : "center";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 12,
      }}
    >
      {block.items.map((item, i) => (
        <div
          key={`${item.rank}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: rowJustify,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: pillBg,
              color: pillText,
              fontSize: 11,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {item.rank}등
          </span>
          <span style={{ color: textColor, fontSize: 12, fontWeight: 700 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};
