import type { RankListBlock } from "@/lib/posSchema";

type Props = { block: RankListBlock; pillBg: string; pillText: string; textColor: string };

export const RankList = ({ block, pillBg, pillText, textColor }: Props) => {
  if (block.items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
      {block.items.map((item, i) => (
        <div key={`${item.rank}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 6,
            background: pillBg, color: pillText,
            fontSize: 11, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{item.rank}등</span>
          <span style={{ color: textColor, fontSize: 12, fontWeight: 700 }}>{item.text}</span>
        </div>
      ))}
    </div>
  );
};
