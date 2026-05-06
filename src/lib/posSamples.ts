import type { POSCard } from "./posSchema";

// 시안: 밥먹고파바고 3차_POS.jpg (split)
// Title: 중간 크기 1줄, Highlight: Title보다 약간 크고 굵음, textLine: 작고 2줄 간격 좁음
export const sampleBabMeokGoPaba = {
  layout: "split",
  splitRatio: 0.57,
  keyVisualPosition: { x: 50, y: 50 },
  panelBg: "#F5EFD8",
  textPrimary: "#1A2D5A",
  textAccent: "#1A2D5A",
  pillBg: "#1A2D5A",
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "bmgp-title",
      type: "title",
      lines: ["밥 먹고 파바 고?"],
      style: { align: "center", fontSize: 25, lineHeight: 1.3, marginBottom: 16, scale: 1.5 },
    },
    {
      id: "bmgp-highlight",
      type: "highlight",
      lines: ["SET 최대 50% 혜택!"],
      style: { align: "center", fontSize: 27, lineHeight: 1.2, marginTop: 2, marginBottom: 36 },
    },
    {
      id: "bmgp-text1",
      type: "textLine",
      text: "1차 쿠폰 발급 : 4/6 ~ 4/10",
      style: { fontSize: 20, lineHeight: 1.4 },
    },
    {
      id: "bmgp-text2",
      type: "textLine",
      text: "2차 쿠폰 발급 : 4/11 ~ 4/15",
      style: { fontSize: 20, lineHeight: 1.4, marginBottom: 32 },
    },
    {
      id: "bmgp-qr",
      type: "qrBlock",
      caption: "파바앱으로\n쿠폰 받으러 가기!",
      layout: "horizontal",
      style: { align: "center", scale: 1.15 },
    },
  ],
  decorations: [],
} satisfies POSCard;

// 시안: 밥먹고파바고 4차_POS.jpg (split)
// 배경: 연보라(#C8B8E8), 패널: 흰색(#FFFFFF), 텍스트: 진네이비(#1A2D5A)
// eyebrow + title + highlight + textLine x3 + qrBlock 구조
export const sampleBabMeokGoPaba4 = {
  layout: "split",
  splitRatio: 0.6,
  keyVisualPosition: { x: 50, y: 50 },
  panelBg: "#FFFFFF",
  textPrimary: "#1A2D5A",
  textAccent: "#1A2D5A",
  pillBg: "#1A2D5A",
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "bmgp4-eyebrow",
      type: "eyebrow",
      text: "매주 월요일 오전 10시 오픈!",
      style: { align: "center", fontSize: 13, lineHeight: 1.4, marginBottom: 8 },
    },
    {
      id: "bmgp4-title",
      type: "title",
      lines: ["밥 먹고 파바 고?"],
      style: { align: "center", fontSize: 39, lineHeight: 1.3, marginBottom: 6 },
    },
    {
      id: "bmgp4-highlight",
      type: "highlight",
      lines: ["SET 최대 50% 선착순 혜택!"],
      style: { align: "center", fontSize: 22, lineHeight: 1.2, marginBottom: 16 },
    },
    {
      id: "bmgp4-text-group",
      type: "textGroup",
      lines: ["05.04 ~ 05.31"],
      style: { align: "center", fontSize: 21, lineHeight: 1.5, marginTop: 0, marginBottom: 24, scale: 1.05 },
    },
    {
      id: "bmgp4-highlight-detail",
      type: "highlight",
      lines: ["제조음료 + 인기디저트", "9,300원 이상 구매 시 4,650원 OFF"],
      style: { fontSize: 17 },
    },
    {
      id: "bmgp4-qr",
      type: "qrBlock",
      caption: "파바앱에서\n선착순 쿠폰 받기",
      layout: "vertical",
      style: { align: "center", scale: 1.25 },
    },
  ],
  decorations: [],
} satisfies POSCard;

// 시안: 파란장미케이크오브제_POS.jpg (split)
// Eyebrow: 소형 1줄, Highlight: 2줄 최대 강조 (가장 큼), pillRow 2행
export const sampleParanRose = {
  layout: "split",
  splitRatio: 0.6,
  keyVisualPosition: { x: 50, y: 50 },
  panelBg: "#E8E5F2",
  textPrimary: "#1A2D5A",
  textAccent: "#1A2D5A",
  pillBg: "#3A4FB8",
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "pr-eyebrow",
      type: "eyebrow",
      text: "파란장미 케이크 사전예약 하면",
      style: { fontSize: 14, lineHeight: 1.4, marginBottom: 8 },
    },
    {
      id: "pr-highlight",
      type: "highlight",
      lines: ["파란장미 오브제", "1만원 혜택!"],
      style: { fontSize: 34, lineHeight: 1.2, marginBottom: 28 },
    },
    {
      id: "pr-pills",
      type: "pillRow",
      items: [
        { label: "사전 예약", value: "4/21(화) - 4/29(수)" },
        { label: "매장 픽업", value: "5/6(수) - 5/8(금)" },
      ],
      style: { marginBottom: 24 },
    },
    {
      id: "pr-qr",
      type: "qrBlock",
      caption: "파바앱에서 한정수량\n사전예약 하기",
      layout: "horizontal",
      style: { align: "center", scale: 1.15 },
    },
  ],
  decorations: [],
} satisfies POSCard;

export const samplePosCards: Record<string, POSCard> = {
  babMeokGoPaba: sampleBabMeokGoPaba,
  babMeokGoPaba4: sampleBabMeokGoPaba4,
  paranRose: sampleParanRose,
};
