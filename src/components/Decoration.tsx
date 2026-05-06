import { useState } from "react";
import type { Decoration as DecorationType } from "@/lib/posSchema";

type Props = {
  decoration: DecorationType;
  update: (d: DecorationType) => void;
  remove: () => void;
};

type DragState = {
  kind: "move" | "resize";
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
};

export const Decoration = ({ decoration, update, remove }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);

  const startDrag = (e: React.PointerEvent, kind: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({
      kind,
      startX: e.clientX,
      startY: e.clientY,
      origX: decoration.x,
      origY: decoration.y,
      origW: decoration.width,
      origH: decoration.height,
    });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (drag.kind === "move") {
      update({ ...decoration, x: Math.round(drag.origX + dx), y: Math.round(drag.origY + dy) });
    } else {
      // 비율 유지 리사이즈: 마우스 이동을 데코의 대각선 방향에 투영해 단일 scale 계산
      // 양 축에 같은 scale을 곱하므로 비율이 절대 깨지지 않음
      const diagSq = drag.origW * drag.origW + drag.origH * drag.origH;
      const dot = dx * drag.origW + dy * drag.origH;
      const minScale = Math.max(20 / drag.origW, 20 / drag.origH);
      const maxScale = Math.min(800 / drag.origW, 800 / drag.origH);
      const scale = Math.max(minScale, Math.min(maxScale, 1 + dot / diagSq));
      update({
        ...decoration,
        width: Math.round(drag.origW * scale),
        height: Math.round(drag.origH * scale),
      });
    }
  };

  const onEnd = (e: React.PointerEvent) => {
    if (!drag) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDrag(null);
  };

  const showOverlays = hovered && !drag;

  return (
    <div
      onPointerDown={(e) => startDrag(e, "move")}
      onPointerMove={onMove}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: decoration.x,
        top: decoration.y,
        width: decoration.width,
        height: decoration.height,
        cursor: drag?.kind === "move" ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <img
        src={decoration.src}
        alt="decoration"
        draggable={false}
        style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
      />
      {showOverlays && (
        <button
          type="button"
          aria-label="삭제"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
          style={{
            position: "absolute",
            top: -10,
            left: -10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#ff4444",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            border: "2px solid white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      )}
      {showOverlays && (
        <div
          aria-label="크기 조절"
          onPointerDown={(e) => startDrag(e, "resize")}
          onPointerMove={onMove}
          onPointerUp={onEnd}
          onPointerCancel={onEnd}
          style={{
            position: "absolute",
            bottom: -6,
            right: -6,
            width: 14,
            height: 14,
            background: "#3A4FB8",
            border: "2px solid white",
            borderRadius: 2,
            cursor: "nwse-resize",
            touchAction: "none",
          }}
        />
      )}
    </div>
  );
};
