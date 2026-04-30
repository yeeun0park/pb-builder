import type { EyebrowBlock } from "@/lib/posSchema";

type Props = { block: EyebrowBlock; color: string };

export const Eyebrow = ({ block, color }: Props) =>
  block.text ? (
    <div style={{ color, fontSize: 16, fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 8 }}>
      {block.text}
    </div>
  ) : null;
