import type { TitleBlock } from "@/lib/posSchema";

type Props = { block: TitleBlock; color: string };

export const Title = ({ block, color }: Props) => (
  <div style={{ color, fontSize: 22, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.3, marginBottom: 10 }}>
    {block.lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);
