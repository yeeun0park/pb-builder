import type { TextGroupBlock } from "@/lib/posSchema";

type Props = { block: TextGroupBlock; color: string };

export const TextGroup = ({ block, color }: Props) => {
  const visible = block.lines.filter((l) => l.trim());
  if (visible.length === 0) return null;
  const s = block.style ?? {};
  const baseFontSize = s.fontSize ?? 17;
  return (
    <div
      style={{
        color: s.color ?? color,
        fontSize: baseFontSize,
        fontWeight: 700,
        lineHeight: s.lineHeight ?? 1.5,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 6,
        textAlign: s.align ?? "center",
        transform: s.scale && s.scale !== 1 ? `scale(${s.scale})` : undefined,
        transformOrigin: "center top",
      }}
    >
      {visible.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};
