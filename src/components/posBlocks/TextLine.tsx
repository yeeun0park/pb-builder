import type { TextLineBlock } from "@/lib/posSchema";

type Props = { block: TextLineBlock; color: string };

export const TextLine = ({ block, color }: Props) => (
  <div style={{ color, fontSize: 13, fontWeight: 700, lineHeight: 1.6, marginBottom: 4 }}>
    {block.text}
  </div>
);
