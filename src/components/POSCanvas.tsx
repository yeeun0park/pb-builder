import { useState } from "react";
import type { POSCard, POSBlock } from "@/lib/posSchema";
import { useCampaignStore } from "@/lib/store";
import { Eyebrow, Title, Highlight, PillRow, TextLine, RankList, QRBlock } from "./posBlocks";

const PANEL_ALPHA_HEX = "E0"; // fullbleed 패널 88% 불투명

type Props = { card: POSCard; logoUrl: string };

type DragState = { id: string; startY: number; deltaY: number } | null;

export const POSCanvas = ({ card, logoUrl }: Props) => {
  const updatePosBlock = useCampaignStore((s) => s.updatePosBlock);
  const [drag, setDrag] = useState<DragState>(null);

  const onPointerDown = (e: React.PointerEvent, blockId: string) => {
    if (e.target instanceof HTMLElement) {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") return;
    }
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: blockId, startY: e.clientY, deltaY: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setDrag((prev) => prev ? { ...prev, deltaY: e.clientY - prev.startY } : null);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    const block = card.blocks.find((b) => b.id === drag.id);
    if (block && Math.abs(drag.deltaY) > 2) {
      const currentMt = block.style?.marginTop ?? 0;
      const newMt = currentMt + Math.round(drag.deltaY);
      const nextStyle = { ...(block.style ?? {}), marginTop: newMt };
      const nextBlock = { ...block, style: nextStyle } as POSBlock;
      updatePosBlock(nextBlock);
    }
    setDrag(null);
  };

  const renderBlock = (b: POSBlock) => {
    const isDragging = drag?.id === b.id;
    const dragTransform = isDragging ? `translate(0, ${drag.deltaY}px)` : "";
    const scaleTransform = b.style?.scale && b.style.scale !== 1 ? `scale(${b.style.scale})` : "";
    const combined = [dragTransform, scaleTransform].filter(Boolean).join(" ");
    const wrapperStyle: React.CSSProperties = {
      cursor: "grab",
      transform: combined || undefined,
      transformOrigin: "center top",
      userSelect: "none",
      touchAction: "none",
    };

    let inner: React.ReactNode = null;
    switch (b.type) {
      case "eyebrow":
        inner = <Eyebrow block={b} color={card.textPrimary} />;
        break;
      case "title":
        inner = <Title block={b} color={card.textPrimary} />;
        break;
      case "highlight":
        inner = <Highlight block={b} color={card.textAccent} />;
        break;
      case "pillRow":
        inner = <PillRow block={b} pillBg={card.pillBg} pillText={card.pillText} textColor={card.textPrimary} />;
        break;
      case "textLine":
        inner = <TextLine block={b} color={card.textPrimary} />;
        break;
      case "rankList":
        inner = <RankList block={b} pillBg={card.pillBg} pillText={card.pillText} textColor={card.textPrimary} />;
        break;
      case "qrBlock":
        inner = <QRBlock block={b} logoUrl={logoUrl} textColor={card.textPrimary} />;
        break;
      default: {
        const _exhaustive: never = b;
        return _exhaustive;
      }
    }

    return (
      <div
        key={b.id}
        style={wrapperStyle}
        onPointerDown={(e) => onPointerDown(e, b.id)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {inner}
      </div>
    );
  };

  const isFullbleed = card.layout === "fullbleed";
  const leftWidth = `${card.splitRatio * 100}%`;
  const rightWidth = `${(1 - card.splitRatio) * 100}%`;
  const bgPos = `${card.keyVisualPosition.x}% ${card.keyVisualPosition.y}%`;

  return (
    <div style={{
      width: 800, height: 600, position: "relative",
      background: isFullbleed
        ? (card.keyVisualUrl ? `url(${card.keyVisualUrl}) ${bgPos}/cover` : card.panelBg)
        : "#fff",
      fontFamily: "PBGothic, sans-serif",
    }}>
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {!isFullbleed && (
          <div style={{
            width: leftWidth,
            background: card.keyVisualUrl ? `url(${card.keyVisualUrl}) ${bgPos}/cover` : "#f5f5f5",
          }} />
        )}
        <div style={{
          width: rightWidth,
          ...(isFullbleed ? {
            position: "absolute" as const,
            right: 0,
            top: 0,
            bottom: 0,
          } : {}),
          background: isFullbleed ? `${card.panelBg}${PANEL_ALPHA_HEX}` : card.panelBg,
          padding: "32px 28px 48px 28px",
          display: "flex",
          flexDirection: "column",
        }}>
          {card.blocks.map(renderBlock)}
        </div>
      </div>
    </div>
  );
};
