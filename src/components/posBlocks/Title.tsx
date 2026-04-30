import type { TitleBlock } from "@/lib/posSchema";

type Props = { block: TitleBlock; color: string };

export const Title = ({ block, color }: Props) => {
  const visibleLines = block.lines.filter((l) => l.trim());
  if (visibleLines.length === 0) return null;
  const s = block.style ?? {};
  return (
    <div
      style={{
        color: s.color ?? color,
        fontSize: s.fontSize ?? 26,
        fontWeight: 700,
        letterSpacing: "-0.05em",
        lineHeight: s.lineHeight ?? 1.25,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom ?? 12,
        textAlign: s.align ?? "center",
      }}
    >
      {visibleLines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};
