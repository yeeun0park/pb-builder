import type { HighlightBlock } from "@/lib/posSchema";

type Props = { block: HighlightBlock; color: string };

export const Highlight = ({ block, color }: Props) => {
  const visibleLines = block.lines.filter((l) => l.trim());
  if (visibleLines.length === 0) return null;
  return (
    <div style={{ color, fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.25, marginBottom: 16 }}>
      {visibleLines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};
