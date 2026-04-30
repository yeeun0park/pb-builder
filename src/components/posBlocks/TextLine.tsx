import type { TextLineBlock } from "@/lib/posSchema";

type Props = { block: TextLineBlock; color: string };

export const TextLine = ({ block, color }: Props) => {
  if (!block.text) return null;
  const s = block.style ?? {};
  return (
    <div
      style={{
        color: s.color ?? color,
        fontSize: s.fontSize ?? 17,
        fontWeight: 700,
        lineHeight: s.lineHeight ?? 1.5,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 6,
        textAlign: s.align ?? "center",
      }}
    >
      {block.text}
    </div>
  );
};
