import type { HighlightBlock } from "@/lib/posSchema";

type Props = { block: HighlightBlock; color: string };

export const Highlight = ({ block, color }: Props) => (
  <div style={{ color, fontSize: 24, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.3, marginBottom: 14 }}>
    {block.lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);
