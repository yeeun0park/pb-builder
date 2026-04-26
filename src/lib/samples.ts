import type { Campaign } from "./types";

export const sampleParanLabel: Campaign = {
  title: "파란라벨이라면 건강도 습관이 됩니다",
  slug: "paran-label-sample",
  period: "2026-04-09 ~ 2026-12-31",
  themeColor: "#2B75B9",
  sections: [
    {
      id: "hero1",
      type: "hero",
      image: "",
      headline: "파란라벨이라면 건강도 습관이 됩니다",
      subhead: "매일의 건강한 한 조각",
      period: "2026-04-09 ~ 2026-12-31",
      overlay: "dark",
      align: "center",
    },
    {
      id: "intro",
      type: "textBlock",
      headline: "건강한 습관의 시작",
      body:
        "파란라벨은 국내산 재료와 담백한 맛으로\n매일의 한 끼를 가볍게 만듭니다.",
      align: "center",
      bg: "white",
    },
    {
      id: "body1",
      type: "fullbleed",
      image: "",
      caption: "오늘의 파란라벨 라인업",
    },
    {
      id: "split1",
      type: "split",
      image: "",
      imageSide: "left",
      headline: "국내산 통곡물, 담백한 맛",
      body:
        "통곡물을 그대로 담아 씹을수록 고소한 풍미.\n첨가물을 줄인 레시피로 부담 없이 즐기세요.",
    },
    {
      id: "grid1",
      type: "grid",
      columns: 2,
      headline: "추천 제품",
      items: [
        { image: "", title: "통곡물 식빵", caption: "담백한 한 끼" },
        { image: "", title: "무가당 베이글", caption: "매일의 아침" },
      ],
    },
  ],
};
