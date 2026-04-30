import type { POSCard, POSBlock } from "@/lib/posSchema";
import { Eyebrow, Title, Highlight, PillRow, TextLine, RankList, QRBlock } from "./posBlocks";

const PANEL_ALPHA_HEX = "E0"; // fullbleed 패널 88% 불투명

type Props = { card: POSCard; logoUrl: string };

export const POSCanvas = ({ card, logoUrl }: Props) => {
  const renderBlock = (b: POSBlock) => {
    switch (b.type) {
      case "eyebrow":
        return <Eyebrow key={b.id} block={b} color={card.textPrimary} />;
      case "title":
        return <Title key={b.id} block={b} color={card.textPrimary} />;
      case "highlight":
        return <Highlight key={b.id} block={b} color={card.textAccent} />;
      case "pillRow":
        return <PillRow key={b.id} block={b} pillBg={card.pillBg} pillText={card.pillText} textColor={card.textPrimary} />;
      case "textLine":
        return <TextLine key={b.id} block={b} color={card.textPrimary} />;
      case "rankList":
        return <RankList key={b.id} block={b} pillBg={card.pillBg} pillText={card.pillText} textColor={card.textPrimary} />;
      case "qrBlock":
        return <QRBlock key={b.id} block={b} logoUrl={logoUrl} textColor={card.textPrimary} />;
      default: {
        const _exhaustive: never = b;
        return _exhaustive;
      }
    }
  };

  const isFullbleed = card.layout === "fullbleed";
  const leftWidth = `${card.splitRatio * 100}%`;
  const rightWidth = `${(1 - card.splitRatio) * 100}%`;

  return (
    <div style={{
      width: 800, height: 600, position: "relative",
      background: isFullbleed
        ? (card.keyVisualUrl ? `url(${card.keyVisualUrl}) center/cover` : card.panelBg)
        : "#fff",
      fontFamily: "PBGothic, sans-serif",
    }}>
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        {!isFullbleed && (
          <div style={{
            width: leftWidth,
            background: card.keyVisualUrl ? `url(${card.keyVisualUrl}) center/cover` : "#f5f5f5",
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
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
        }}>
          {card.blocks.map(renderBlock)}
        </div>
      </div>
    </div>
  );
};
