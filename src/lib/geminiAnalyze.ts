import { nanoid } from "nanoid";
import type { MultiImageItem } from "@/components/ui/MultiImageInput";
import type { Campaign, Section } from "./types";

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiSection = {
  type: "hero" | "fullbleed" | "split" | "textBlock" | "grid";
  imageIndex?: number;
  headline?: string;
  subhead?: string;
  body?: string;
  caption?: string;
  imageSide?: "left" | "right";
  bullets?: string[];
  columns?: number;
  gridItems?: { imageIndex: number; title?: string; caption?: string }[];
};

type GeminiResponse = {
  title?: string;
  subhead?: string;
  sections: GeminiSection[];
};

const responseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    subhead: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["hero", "fullbleed", "split", "textBlock", "grid"],
          },
          imageIndex: { type: "integer" },
          headline: { type: "string" },
          subhead: { type: "string" },
          body: { type: "string" },
          caption: { type: "string" },
          imageSide: { type: "string", enum: ["left", "right"] },
          bullets: { type: "array", items: { type: "string" } },
          columns: { type: "integer" },
          gridItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageIndex: { type: "integer" },
                title: { type: "string" },
                caption: { type: "string" },
              },
              required: ["imageIndex"],
            },
          },
        },
        required: ["type"],
      },
    },
  },
  required: ["sections"],
};

const buildPrompt = (params: {
  title?: string;
  subhead?: string;
  period?: string;
  description: string;
  imageDims: { w: number; h: number }[];
}) => {
  const imgList = params.imageDims
    .map(
      (d, i) =>
        `  ${i}: ${d.w}×${d.h} (${(d.w / d.h).toFixed(2)}:1)`,
    )
    .join("\n");
  const imgCount = params.imageDims.length;

  return `당신은 **파리바게뜨 공식 프로모션 상세페이지** 전용 레이아웃 디자이너다.
결과물은 아래 [실측 레퍼런스 구조]를 **그대로 재현**해야 한다.

══════════════════════════════════════════════════════
[실측 레퍼런스 구조] — paris.co.kr/promotion/ 3개 페이지 HTML 직접 분석

| 페이지 | 본문 풀블리드 이미지 수 | HTML 텍스트 섹션 수 |
|---|---|---|
| 파란라벨 | 18 | 0 |
| 카페 드 디저트 | 6 | 0 |
| 블루라벨 말차 | 7 | 0 |

→ **실제 페이지는 거의 100% 풀블리드 이미지 연속**이다.
→ 슬로건·혜택·재료·CTA 등 모든 텍스트는 **이미지 안에 구워져** 있다.
→ HTML에는 **<h1> 제목 한 줄 + 기간 한 줄만** 존재한다.

[실제 제목 샘플]
"NEW! 오늘도 건강하게 파란라벨 하세요💙"  ← 브랜드 액션 + 이모지 스타일

[실제 이미지 비율 분포]
- 0.45:1 (초세로) ~ 11:1 (초가로) 극단적으로 다양
- 좁은 가로 띠(5~11:1)는 보통 문구 배너, 세로(0.4~0.9:1)는 제품샷
══════════════════════════════════════════════════════

[이 결과물이 지켜야 할 절대 규칙]
1. **이미지 중심 구성**: 사용자가 ${imgCount}장의 이미지를 줬다면,
   그 중 ${Math.max(imgCount - 1, 0)}장 이상은 fullbleed로 소비되어야 한다.
2. **textBlock은 전체에 최대 1개** (인트로 용도, hero 바로 다음에 위치).
   설명글이 아무리 길어도 textBlock 2개 이상 만들지 말 것.
3. **이미지 사이에 텍스트 섹션 끼워넣기 절대 금지**.
   hero → (textBlock 최대 1개) → fullbleed 연속 → 끝.
4. **split, grid는 사용 자제**.
   - split은 "단일 제품 × 짧은 특징 설명 한 쌍"일 때만 1~2번 허용
   - grid는 사용자가 명시적으로 '3x3 제품 진열' 같은 요구가 있을 때만
   - 기본은 무조건 fullbleed
5. **hero headline**: 20자 이내 슬로건. 설명에서 가장 강렬한 한 문장을 뽑아 다듬음.
   이모지 💙☕🍃✨ 등 브랜드 톤에 맞게 자유롭게 섞어도 됨.
   예) "오늘도 건강하게, 파란라벨 하세요💙"
6. **설명글의 처리**:
   - 사용자 설명글을 **그대로 복사 금지**
   - 핵심 메시지를 압축해 hero headline + (선택) 인트로 textBlock(2~3문장)에만 담음
   - 나머지는 이미지가 말하게 둠 (실제 PB 방식)

[섹션 타입 정의]
- hero: 타이틀 카드. imageIndex=0 필수. headline 20자 이내, subhead 선택 한 줄.
- fullbleed: 본문 이미지 단독. caption은 꼭 필요할 때만 짧게(20자 이내). 기본은 caption 없이.
- split: 이미지+짧은 제품 설명. 특수 상황에만 사용.
- textBlock: 인트로 한정, 최대 1회. headline 선택, body 2~3문장.
- grid: 특수 상황에만 사용 (2~3열, 동일 카테고리 여러 제품).

[이상적 결과 구조 예시]
이미지 5장 + 설명글 주어졌을 때:
1. hero (imageIndex=0, 슬로건 headline)
2. textBlock (인트로 2-3문장)  ← 최대 1회
3. fullbleed (imageIndex=1)
4. fullbleed (imageIndex=2)
5. fullbleed (imageIndex=3)
6. fullbleed (imageIndex=4)
총 6개 섹션, textBlock 1개, 나머지는 전부 fullbleed.

══════════════════════════════════════════════════════
[사용자 입력]
제목 (지정): ${params.title || "(없음 — 설명에서 추출해 title 필드에 반환)"}
부제 (지정): ${params.subhead || "(없음)"}
캠페인 기간: ${params.period || "(없음)"}
이미지 ${imgCount}장 (인덱스·해상도·비율):
${imgList}

[설명글 원문]
"""
${params.description}
"""
══════════════════════════════════════════════════════

[출력]
- JSON만 반환. 설명 문장 없이.
- title: 최종 제목 (20자 이내 슬로건 권장)
- subhead: 선택
- sections: 위 규칙을 엄수한 섹션 배열
- 섹션 개수는 이미지 수 + 0~1개(인트로 textBlock) 범위`;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 40) || "campaign";

const convertSection = (
  s: GeminiSection,
  images: MultiImageItem[],
): Section | null => {
  const getImg = (idx?: number) => {
    if (idx === undefined || idx < 0 || idx >= images.length) return undefined;
    return images[idx];
  };
  const id = nanoid(8);
  switch (s.type) {
    case "hero": {
      const img = getImg(s.imageIndex ?? 0);
      return {
        id,
        type: "hero",
        image: img?.image ?? "",
        imageMeta: img?.imageMeta,
        headline: s.headline || "제목",
        subhead: s.subhead || undefined,
        overlay: "dark",
        align: "center",
      };
    }
    case "fullbleed": {
      const img = getImg(s.imageIndex);
      if (!img) return null;
      return {
        id,
        type: "fullbleed",
        image: img.image,
        imageMeta: img.imageMeta,
        caption: s.caption || undefined,
      };
    }
    case "split": {
      const img = getImg(s.imageIndex);
      if (!img || !s.headline || !s.body) return null;
      return {
        id,
        type: "split",
        image: img.image,
        imageMeta: img.imageMeta,
        imageSide: s.imageSide ?? "left",
        headline: s.headline,
        body: s.body,
        bullets: s.bullets && s.bullets.length > 0 ? s.bullets : undefined,
      };
    }
    case "textBlock": {
      if (!s.body) return null;
      return {
        id,
        type: "textBlock",
        headline: s.headline || undefined,
        body: s.body,
        align: "center",
        bg: "white",
      };
    }
    case "grid": {
      const items = (s.gridItems ?? [])
        .map((g) => {
          const img = getImg(g.imageIndex);
          return img
            ? {
                image: img.image,
                imageMeta: img.imageMeta,
                title: g.title,
                caption: g.caption,
              }
            : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
      if (items.length === 0) return null;
      const cols = s.columns === 3 ? 3 : 2;
      return {
        id,
        type: "grid",
        columns: cols,
        items,
        headline: s.headline || undefined,
      };
    }
  }
};

export type GeminiParams = {
  apiKey: string;
  title?: string;
  subhead?: string;
  period?: string;
  themeColor: string;
  description: string;
  images: MultiImageItem[];
};

export const geminiAnalyze = async (
  params: GeminiParams,
): Promise<Campaign> => {
  if (params.images.length === 0) {
    throw new Error("이미지가 최소 1장 필요합니다");
  }
  const imageDims = params.images.map((i) => i.imageMeta);
  const prompt = buildPrompt({
    title: params.title,
    subhead: params.subhead,
    period: params.period,
    description: params.description,
    imageDims,
  });

  const resp = await fetch(
    `${ENDPOINT}?key=${encodeURIComponent(params.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.4,
        },
      }),
    },
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini API ${resp.status}: ${err.slice(0, 200)}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어있습니다");

  let parsed: GeminiResponse;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini JSON 파싱 실패");
  }

  const sections: Section[] = [];
  for (const s of parsed.sections) {
    const converted = convertSection(s, params.images);
    if (converted) sections.push(converted);
  }

  if (sections.length === 0) {
    throw new Error("분석 결과 섹션이 생성되지 않았습니다");
  }

  const firstHero = sections.find((s) => s.type === "hero");
  const extractedTitle =
    params.title?.trim() ||
    parsed.title ||
    (firstHero?.type === "hero" ? firstHero.headline : "새 캠페인");

  const extractedSubhead =
    params.subhead?.trim() ||
    parsed.subhead ||
    (firstHero?.type === "hero" ? firstHero.subhead : undefined);

  if (firstHero?.type === "hero") {
    firstHero.headline = extractedTitle;
    firstHero.subhead = extractedSubhead;
    firstHero.period = params.period?.trim() || undefined;
  }

  return {
    title: extractedTitle,
    slug: slugify(extractedTitle),
    period: params.period?.trim() || undefined,
    themeColor: params.themeColor,
    sections,
  };
};
