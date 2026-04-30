import type { POSCard } from "./posSchema";

// 시안: 밥먹고파바고 3차_POS.jpg (split)
export const sampleBabMeokGoPaba = {
  layout: "split",
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
      style: { align: "center", fontSize: 22 },
    },
    {
      id: "bmgp-highlight",
      type: "highlight",
      lines: ["SET 최대 50% 혜택!"],
      style: { align: "center", fontSize: 24, marginBottom: 36 },
    },
    {
      id: "bmgp-text1",
      type: "textLine",
      text: "1차 쿠폰 발급 : 4/6 ~ 4/10",
      style: { align: "left" },
    },
    {
      id: "bmgp-text2",
      type: "textLine",
      text: "2차 쿠폰 발급 : 4/11 ~ 4/15",
      style: { align: "left", marginBottom: 32 },
    },
    {
      id: "bmgp-qr",
      type: "qrBlock",
      caption: "파바앱으로\n쿠폰 받으러 가기!",
      style: { align: "center" },
    },
  ],
} satisfies POSCard;

// 시안: 가정의달케이크사전예약_POS.jpg (split)
export const sampleFamilyMonth = {
  layout: "split",
  panelBg: "#E8E5F2",
  textPrimary: "#1A2D5A",
  textAccent: "#1A2D5A",
  pillBg: "#3A4FB8",
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "fm-title",
      type: "title",
      lines: ["가정의 달 케이크", "사전예약 하면"],
    },
    {
      id: "fm-highlight",
      type: "highlight",
      lines: ["아이스 아메리카노", "쿠폰 증정!"],
    },
    {
      id: "fm-pills",
      type: "pillRow",
      items: [
        { label: "사전 예약", value: "4/24(금) - 4/29(수)" },
        { label: "매장 픽업", value: "5/2(토) - 5/15(금)" },
      ],
    },
    {
      id: "fm-qr",
      type: "qrBlock",
      caption: "파바앱에서 다양한\n가정의 달 케이크 만나보기!",
    },
  ],
} satisfies POSCard;

// 시안: 파란장미케이크오브제_POS.jpg (split)
export const sampleParanRose = {
  layout: "split",
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
    },
    {
      id: "pr-highlight",
      type: "highlight",
      lines: ["파란장미 오브제", "1만원 혜택!"],
    },
    {
      id: "pr-pills",
      type: "pillRow",
      items: [
        { label: "사전 예약", value: "4/21(화) - 4/29(수)" },
        { label: "매장 픽업", value: "5/6(수) - 5/8(금)" },
      ],
    },
    {
      id: "pr-qr",
      type: "qrBlock",
      caption: "파바앱에서 한정수량\n사전예약 하기",
    },
  ],
} satisfies POSCard;

// 시안: 저당말차케이크_해피TV.jpg (split)
export const sampleMatchaCake = {
  layout: "split",
  panelBg: "#3D6B35", // 계획서 #4A6B3F → 시안 비교 후 조정. Task 10에서 재미세조정 예정.
  textPrimary: "#FFFFFF",
  textAccent: "#FFFFFF",
  pillBg: "#4A8C3F", // 계획서 원본값 유지 — panelBg와 함께 Task 10 재미세조정 예정.
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "mc-eyebrow",
      type: "eyebrow",
      text: "파바앱 ONLY",
    },
    {
      id: "mc-highlight",
      type: "highlight",
      lines: [
        "파란라벨 저당 말차케이크",
        "한정수량 & 선착순",
        "사전예약 5천원 즉시 혜택!",
      ],
    },
    {
      id: "mc-pills",
      type: "pillRow",
      items: [
        { label: "예약기간", value: "4/10(금) · 한정수량 소진 시" },
        { label: "픽업기간", value: "4/24(금) · 4/30(목)" },
      ],
    },
    {
      id: "mc-qr",
      type: "qrBlock",
      caption: "파바앱 혜택받고\n사전예약 하러 가기!",
    },
  ],
} satisfies POSCard;

// 시안: LAFC밋앤그릿_POS.jpg (fullbleed)
export const sampleLafc = {
  layout: "fullbleed",
  panelBg: "#1E2218",
  textPrimary: "#FFFFFF",
  textAccent: "#FFC700",
  pillBg: "#FFC700",
  pillText: "#1E2218",
  blocks: [
    {
      id: "lafc-title",
      type: "title",
      lines: [
        "LAFC 선수들을 직접 만나고",
        "손흥민 사인 받을 수 있는 특별한 기회",
      ],
    },
    {
      id: "lafc-highlight",
      type: "highlight",
      lines: ["파바앱 LAFC 응모이벤트", "단독 팬미팅 & 직관 여행 가자!"],
    },
    {
      id: "lafc-text1",
      type: "textLine",
      text: "4.27(월) - 6.19(금)",
    },
    {
      id: "lafc-text2",
      type: "textLine",
      text: "매장 또는 온라인 결제 시",
    },
    {
      id: "lafc-text3",
      type: "textLine",
      text: "파바앱 사용하면 자동 응모",
    },
    {
      id: "lafc-text4",
      type: "textLine",
      text: "당첨자 발표 : 6.25(목)",
    },
    {
      id: "lafc-ranks",
      type: "rankList",
      items: [
        {
          rank: 1,
          text: "LAFC 성덕 패키지 : 단독 팬미팅 & 직관 여행 (7명/동반 1인)",
        },
        { rank: 2, text: "LAFC 손흥민 친필 사인 유니폼 (5명)" },
        { rank: 3, text: "LA올레 케이크 교환권 (30명)" },
        { rank: 4, text: "파바앱 1만원 교환권 (50명)" },
      ],
    },
    {
      id: "lafc-qr",
      type: "qrBlock",
      caption: "파바앱 쓰고\n응모하기!",
    },
  ],
} satisfies POSCard;

export const samplePosCards: Record<string, POSCard> = {
  babMeokGoPaba: sampleBabMeokGoPaba,
  familyMonth: sampleFamilyMonth,
  paranRose: sampleParanRose,
  matchaCake: sampleMatchaCake,
  lafc: sampleLafc,
};
