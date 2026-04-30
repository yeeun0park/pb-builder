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
        gap: 8,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 14,
      }}
    >
      {block.items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: rowJustify,
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
            }}
          >
            {item.label}
          </span>
          <span style={{ color: textColor, fontSize: 16, fontWeight: 700 }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
