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
    s.align === "right"
      ? "flex-end"
      : s.align === "center"
      ? "center"
      : "flex-start";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 14,
        alignSelf: "center",
        width: "fit-content",
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
