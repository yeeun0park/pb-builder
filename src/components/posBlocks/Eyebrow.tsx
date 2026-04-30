import type { EyebrowBlock } from "@/lib/posSchema";

type Props = { block: EyebrowBlock; color: string };

export const Eyebrow = ({ block, color }: Props) => {
  if (!block.text) return null;
  const s = block.style ?? {};
  return (
    <div
      style={{
        color: s.color ?? color,
        fontSize: s.fontSize ?? 16,
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: s.lineHeight,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 8,
        textAlign: s.align ?? "left",
      }}
    >
      {block.text}
    </div>
  );
};
