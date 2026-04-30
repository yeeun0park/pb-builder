import type { POSCard } from "./posSchema";

// 시안: 밥먹고파바고 3차_POS.jpg (split)
// Title: 중간 크기 1줄, Highlight: Title보다 약간 크고 굵음, textLine: 작고 2줄 간격 좁음
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
      style: { align: "center", fontSize: 22, lineHeight: 1.3, marginBottom: 8 },
    },
    {
      id: "bmgp-highlight",
      type: "highlight",
      lines: ["SET 최대 50% 혜택!"],
      style: { align: "center", fontSize: 24, lineHeight: 1.2, marginBottom: 36 },
    },
    {
      id: "bmgp-text1",
      type: "textLine",
      text: "1차 쿠폰 발급 : 4/6 ~ 4/10",
      style: { fontSize: 16, lineHeight: 1.4 },
    },
    {
      id: "bmgp-text2",
      type: "textLine",
      text: "2차 쿠폰 발급 : 4/11 ~ 4/15",
      style: { fontSize: 16, lineHeight: 1.4, marginBottom: 32 },
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
// Title: 2줄 중간, Highlight: 2줄 매우 큼 (가장 강조), pillRow 2행
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
      style: { fontSize: 26, lineHeight: 1.3, marginBottom: 10 },
    },
    {
      id: "fm-highlight",
      type: "highlight",
      lines: ["아이스 아메리카노", "쿠폰 증정!"],
      style: { fontSize: 32, lineHeight: 1.25, marginBottom: 28 },
    },
    {
      id: "fm-pills",
      type: "pillRow",
      items: [
        { label: "사전 예약", value: "4/24(금) - 4/29(수)" },
        { label: "매장 픽업", value: "5/2(토) - 5/15(금)" },
      ],
      style: { marginBottom: 24 },
    },
    {
      id: "fm-qr",
      type: "qrBlock",
      caption: "파바앱에서 다양한\n가정의 달 케이크 만나보기!",
    },
  ],
} satisfies POSCard;

// 시안: 파란장미케이크오브제_POS.jpg (split)
// Eyebrow: 소형 1줄, Highlight: 2줄 최대 강조 (가장 큼), pillRow 2행
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
    },
  ],
} satisfies POSCard;

// 시안: 저당말차케이크_해피TV.jpg (split)
// Eyebrow: 소형 강조색, Highlight: 3줄 (길이 길어 fontSize 작게), pillRow 2행
export const sampleMatchaCake = {
  layout: "split",
  panelBg: "#3D6B35",
  textPrimary: "#FFFFFF",
  textAccent: "#FFFFFF",
  pillBg: "#4A8C3F",
  pillText: "#FFFFFF",
  blocks: [
    {
      id: "mc-eyebrow",
      type: "eyebrow",
      text: "파바앱 ONLY",
      style: { fontSize: 14, lineHeight: 1.4, marginBottom: 10 },
    },
    {
      id: "mc-highlight",
      type: "highlight",
      lines: [
        "파란라벨 저당 말차케이크",
        "한정수량 & 선착순",
        "사전예약 5천원 즉시 혜택!",
      ],
      style: { fontSize: 24, lineHeight: 1.3, marginBottom: 28 },
    },
    {
      id: "mc-pills",
      type: "pillRow",
      items: [
        { label: "예약기간", value: "4/10(금) · 한정수량 소진 시" },
        { label: "픽업기간", value: "4/24(금) · 4/30(목)" },
      ],
      style: { marginBottom: 24 },
    },
    {
      id: "mc-qr",
      type: "qrBlock",
      caption: "파바앱 혜택받고\n사전예약 하러 가기!",
    },
  ],
} satisfies POSCard;

// 시안: LAFC밋앤그릿_POS.jpg (fullbleed)
// Title: 2줄 소형(상단 설명), Highlight: 2줄 중형 강조, textLine: 4줄 소형,
// rankList → pillRow 변환 (rank→label "N등", text→value)
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
      style: { fontSize: 18, lineHeight: 1.35, marginBottom: 12 },
    },
    {
      id: "lafc-highlight",
      type: "highlight",
      lines: ["파바앱 LAFC 응모이벤트", "단독 팬미팅 & 직관 여행 가자!"],
      style: { fontSize: 26, lineHeight: 1.25, marginBottom: 20 },
    },
    {
      id: "lafc-text1",
      type: "textLine",
      text: "4.27(월) - 6.19(금)",
      style: { fontSize: 15, lineHeight: 1.4 },
    },
    {
      id: "lafc-text2",
      type: "textLine",
      text: "매장 또는 온라인 결제 시",
      style: { fontSize: 15, lineHeight: 1.4 },
    },
    {
      id: "lafc-text3",
      type: "textLine",
      text: "파바앱 사용하면 자동 응모",
      style: { fontSize: 15, lineHeight: 1.4 },
    },
    {
      id: "lafc-text4",
      type: "textLine",
      text: "당첨자 발표 : 6.25(목)",
      style: { fontSize: 15, lineHeight: 1.4, marginBottom: 20 },
    },
    {
      id: "lafc-pills",
      type: "pillRow",
      items: [
        { label: "1등", value: "LAFC 성덕 패키지 : 단독 팬미팅 & 직관 여행 (7명/동반 1인)" },
        { label: "2등", value: "LAFC 손흥민 친필 사인 유니폼 (5명)" },
        { label: "3등", value: "LA올레 케이크 교환권 (30명)" },
        { label: "4등", value: "파바앱 1만원 교환권 (50명)" },
      ],
      style: { marginBottom: 20 },
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
