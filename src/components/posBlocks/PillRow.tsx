import type { PillRowBlock } from "@/lib/posSchema";

type Props = {
  block: PillRowBlock;
  pillBg: string;
  pillText: string;
  textColor: string;
};

export const PillRow = ({ block, pillBg, pillText, textColor }: Props) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
    {block.items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          background: pillBg, color: pillText,
          padding: "3px 12px", borderRadius: 999,
          fontSize: 12, fontWeight: 700, letterSpacing: "-0.04em",
        }}>{item.label}</span>
        <span style={{ color: textColor, fontSize: 13, fontWeight: 700 }}>{item.value}</span>
      </div>
    ))}
  </div>
);
