import type { EyebrowBlock } from "@/lib/posSchema";

type Props = { block: EyebrowBlock; color: string };

export const Eyebrow = ({ block, color }: Props) =>
  block.text ? (
    <div style={{ color, fontSize: 14, fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 6 }}>
      {block.text}
    </div>
  ) : null;
