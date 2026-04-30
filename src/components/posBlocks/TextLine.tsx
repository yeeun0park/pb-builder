import type { TextLineBlock } from "@/lib/posSchema";

type Props = { block: TextLineBlock; color: string };

export const TextLine = ({ block, color }: Props) => {
  if (!block.text) return null;
  return (
    <div style={{ color, fontSize: 17, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>
      {block.text}
    </div>
  );
};
