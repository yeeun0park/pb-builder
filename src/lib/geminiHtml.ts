import type { MultiImageItem } from "@/components/ui/MultiImageInput";
import { getLogoDataUrl } from "./assets";
import { getEmbeddedFontCss } from "./fontBase64";

const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];
const endpointFor = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export type GeminiHtmlParams = {
  apiKey: string;
  title?: string;
  subhead?: string;
  period?: string;
  themeColor: string;
  description: string;
  images: MultiImageItem[];
};

const buildPrompt = (params: {
  title?: string;
  subhead?: string;
  period?: string;
  themeColor: string;
  description: string;
  images: { w: number; h: number; name?: string }[];
}) => {
  const imgList = params.images
    .map((img, i) => {
      const parts = [`${img.w}×${img.h}px (비율 ${(img.w / img.h).toFixed(2)}:1)`];
      if (img.name) parts.push(`파일명: "${img.name}"`);
      return `  {IMAGE_${i}}: ${parts.join(", ")}`;
    })
    .join("\n");
  const imgCount = params.images.length;

  return `당신은 **파리바게뜨 공식 프로모션 상세페이지** 전용 웹 디자이너다.
완성된 **HTML5 문서 한 벌**을 생성하라. JavaScript 없이, 모든 CSS는 <style> 태그에 임베드.

══════════════════════════════════════════════════════
[참고 실제 페이지] — 스타일·리듬을 참고할 것
- paris.co.kr/promotion/new-paran-label (파란라벨)
- paris.co.kr/promotion/cafe-de-dessert (카페 드 디저트)
- paris.co.kr/promotion/pb-blue-label-matcha (블루라벨 말차)

[실측 레퍼런스 구조]
| 페이지 | 섹션 수 | 비고 |
|---|---|---|
| 파란라벨 | 18개 | 풀블리드 이미지 위주 |
| 카페드디저트 | 6개 | 배경 전환(네이비/크림/화이트) |
| 블루라벨말차 | 7개 | 미니멀·제품 중심 |

공통 DNA:
- 풀블리드 이미지 + 넉넉한 여백
- 브랜드 컬러(네이비/골드/크림) 3색 팔레트
- 한·영 병기 헤드라인 ("CAKE SELECTION" + "케이크 셀렉션")
- Eyebrow 라벨 (gold, uppercase, letter-spacing 0.4em)
- 골드 세로 라인 구분자 (2px × 48px)
- 중앙 정렬 위주, 명확한 섹션 리듬
══════════════════════════════════════════════════════

[출력 HTML의 요구사항]
1. 완전한 <!DOCTYPE html>... </html> 한 벌
2. <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0"> 포함
3. 모든 스타일은 <head> 안 <style> 태그에 인라인
4. **font-family: 'PBGothic', sans-serif** (임포트는 호스트가 주입하므로 생략)
5. 섹션 너비: 풀폭 (호스트가 100% 강제). 배경색이 화면 양옆까지 깔리도록 디자인.
   섹션 안 콘텐츠는 자체 max-width로 가운데 모으면 OK (예: h1·p에 max-width: 720px; margin: auto).
   ⚠️ 크기는 절제 — 레퍼런스 톤(여유로운 분위기)에 맞추기:
   - h1: 28~40px (강조 시 44px), h2: 20~30px, 본문 p: 13~15px
   - 섹션 vertical padding: 56~96px (답답하지 않게)
   - 이미지는 호스트가 자동으로 max 540px·중앙 정렬 (오버레이 섹션 제외 풀커버)
   - 큰 글자·꽉 찬 이미지는 피하기

[💎 호스트가 제공하는 유틸리티 클래스 — 적극 활용]
이 클래스들을 활용하면 PB 톤이 자동 적용됨:

A. **<img class="pb-product-center" src="{IMAGE_X}">** — 제품 단독 사진(흰 배경, 피사체만)에 사용
   → 자동으로 가로 22% 중앙 정렬 (작게·예쁘게 — 절대 크게 하지 말 것)
   언제: 제품 1개만 깔끔하게 찍힌 사진일 때
   금지: 매장·인물·풍경·여러 제품 그리드 사진엔 절대 사용하지 말 것

B. **<div class="pb-info-card">...</div>** — 박스 카드 (혜택·이벤트·주의사항·CTA 정보)
   → 크림색 배경 + 둥근 모서리 + 패딩 + max-width 760px 중앙
   언제: "사전예약 혜택", "이벤트 안내", "주의사항", "참여 방법" 같은 정보 모음
   변형: <div class="pb-info-card dark"> 으로 네이비 배경 + 흰 텍스트

C. **이미지 다음 텍스트는 중앙 정렬**
   - 큰 풀블리드 이미지 바로 뒤 텍스트 섹션은 \`text-align: center\` 기본
   - "문장이 짧고 분위기 강조" 의도면 중앙
   - 본문이 길어 가독성이 우선이면 좌측 정렬 OK
6. 이미지는 placeholder 치환:
   - <img src="{IMAGE_0}">, <img src="{IMAGE_1}">, ... 형태로
   - 첫 이미지({IMAGE_0})는 Hero 배경 또는 풀블리드 인트로
   - 각 이미지를 최소 한 번씩 사용
7. 페이지 최하단에 <img src="{LOGO}" alt="PARIS BAGUETTE"> (중앙, max-width 220px)
8. **테마 컬러 ${params.themeColor}** 를 포인트 컬러로 사용 (제목·라인·eyebrow 등)
9. JavaScript 절대 사용 금지
10. 외부 폰트·CSS 링크 불필요 (PBGothic 임포트는 호스트가 처리)

[🎨 배경 컬러 엄격 규칙 — 브랜드 일관성 유지]
이미지가 첨부되어 색감을 볼 수 있어도, **배경은 안전한 중립 톤만** 사용한다.
배경이 이미지 컬러에 따라 튀면 브랜드 일관성이 깨지고 페이지 리듬이 무너짐.

허용 배경:
- #FFFFFF (순수 화이트) — 기본
- #FAF8F3 / #F5F0E6 / #F8F5EE (웜 크림) — 여유·부드러움
- #F5F5F5 / #F7F7F7 (쿨 오프화이트) — 모던·깔끔
- #1A2D5A / #0F1B36 (딥 네이비) — 고급·대비 섹션
- #1A1A1A / #2B2B2B (차콜/블랙) — 임팩트 섹션

금지 배경:
- ❌ 채도 높은 원색·파스텔 (분홍·민트·연보라·연노랑 등)
- ❌ 테마 컬러 ${params.themeColor} 자체를 넓은 배경으로 사용 (포인트만 가능)
- ❌ 그라디언트 배경 (특히 비비드 컬러)
- ❌ 이미지에서 뽑은 컬러로 배경 깔기 (일관성 깨짐)

배경 전환 리듬 권장:
- white → cream → navy → white 같은 중립 사이 교차
- 섹션 4~5개 지날 때마다 네이비/차콜로 대비 섹션 1개

[🖼️ 이미지 사용 규칙 — 엄격]
각 이미지({IMAGE_0} ~ {IMAGE_${params.images.length - 1}})는 **정확히 1회만** 사용.

- ❌ 같은 이미지를 두 번 이상 쓰지 말 것 (중복 금지)
- ❌ 어떤 이미지도 빠뜨리지 말 것 (N장이면 N장 모두 배치)
- ✅ 이미지 개수만큼 섹션을 만들어 순차적으로 분배
- ✅ 그리드(2~3열)를 쓸 때는 그리드 한 섹션에 여러 이미지 묶기 허용

[⚖️ 레이아웃 균형 규칙]
모든 섹션은 시각적으로 균형 잡혀야 한다.

- ❌ 2컬럼 split에서 한쪽만 이미지/텍스트이고 반대편이 비어있는 구조 금지
- ❌ 그리드에서 빈 칸 남기기 금지
- ❌ 이미지가 왼쪽 끝에 치우쳐 있고 오른쪽이 공백인 섹션 금지
- ✅ 좌우 분할 섹션은 양쪽 모두 내용(이미지+텍스트 또는 텍스트+이미지) 채우기
- ✅ 중앙 정렬 단일 컬럼이 균형 면에서 가장 안전
- ✅ 풀블리드 이미지는 width: 100%로 전체 너비 차지 (왼쪽·오른쪽 공백 없음)

[🚫 이미지 크롭 절대 금지 — 매우 중요]
모든 이미지는 **원본 비율을 100% 유지**해야 한다. 잘려서는 안 된다.

금지 사항:
- ❌ object-fit: cover 사용 금지 (이미지 가장자리가 잘림)
- ❌ background-image + background-size: cover 금지
- ❌ 이미지에 고정 height(예: height: 500px) 설정 금지
- ❌ 이미지 컨테이너에 고정 aspect-ratio 설정 후 이미지 채우기 금지
- ❌ overflow: hidden으로 가리는 방식 금지

권장 사항:
- ✅ <img>에 width: 100% + height: auto만 사용 (원본 비율 자동 유지)
- ✅ 이미지 컨테이너는 이미지 높이에 따라 자연스럽게 늘어나도록
- ✅ 이미지 위에 텍스트 오버레이가 필요하면:
    <div style="position: relative;">
      <img src="{IMAGE_0}" style="width: 100%; height: auto; display: block;">
      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white;">오버레이 텍스트</div>
    </div>
  이 경우에도 이미지가 먼저 원본 비율로 배치되고, 오버레이가 그 위에 얹어짐.

[🎯 텍스트·이미지 오버레이 — 조건부 허용]
이미지에 따라 두 패턴 중 하나를 선택:

**패턴 A — 이미지에 텍스트가 이미 구워져 있을 때 (제품 패키지·디자인된 KV)**:
이미지 한 블록 + 텍스트 한 블록을 **수직 분리**한다. 겹치지 않게.
\`\`\`
<section style="background: #FFFFFF;">
  <div style="padding: 80px 40px; text-align: center;">
    <h1>제목</h1>
    <p>부제</p>
  </div>
  <img src="{IMAGE_X}" style="width: 100%; height: auto; display: block;">
</section>
\`\`\`

**패턴 B — 이미지가 평범한 사진일 때 (매장 외관·인물·풍경·플레이팅 사진)**:
사진 위에 텍스트를 중앙 오버레이로 얹어 분위기를 만든다.
**반드시 아래 클래스 구조 그대로** 사용 (호스트가 어두운 그라디언트 + 흰 텍스트 자동 적용):
\`\`\`
<section class="pb-overlay-section">
  <img src="{IMAGE_X}" alt="">
  <div class="pb-overlay-content">
    <h2>큰 제목</h2>
    <p>짧은 부제</p>
  </div>
</section>
\`\`\`
- 인라인 \`style="position:absolute"\` 직접 작성 금지 — 반드시 위 클래스만 사용
- Hero, INTRO, CONCEPT 같은 분위기 섹션에 활용
- FEATURE/PRODUCT는 일반적으로 패턴 A (제품을 또렷이 보여주기 위해)

**섹션 분류 가이드**:
- 이미지를 보고 "텍스트 디자인이 들어 있다" → 패턴 A
- "그냥 사진" + 분위기 표현이 필요 → 패턴 B
- 확신이 안 서면 → 패턴 A (안전)

금지 (양 패턴 공통):
- ❌ 인라인 스타일에 background:rgba/linear-gradient (오직 클래스 패턴 B만 허용)
- ❌ opacity: 0.X (텍스트나 이미지에)
- ❌ filter: grayscale/brightness/blur/contrast
- ❌ mix-blend-mode

사용자가 업로드한 이미지의 원본 해상도·비율이 이미 알려져 있으므로(위 목록 참고), 잘리지 않는 레이아웃을 설계하라.

[콘텐츠 설계 원칙 — 클로드코드 수준의 디자인]
- **섹션을 6~10개**로 구성하여 리듬 있게
- 단순 이미지 나열이 아니라 **목적 있는 섹션**:
  - HERO: 로고/타이틀/태그 중앙, 임팩트 있는 큰 타이포
  - INTRO: 배경 이미지 위 텍스트 오버레이 (매장·브랜드 소개)
  - CONCEPT: 배경 컬러 전환 (네이비/크림/흑) + 큰 제목 + 설명
  - FEATURE/PRODUCT: 이미지 + 제품명(한·영 병기) + 설명 + (가격 형식 예: "3,500원~")
  - TAGLINE/QUOTE: 큰 인용·슬로건 (필요 시 장식 문자 "같은 스타일)
  - STORE INFO / CTA: 정보 그리드 (4칸 etc)
  - FOOTER: 로고 중앙
- **섹션 간 배경 전환** (white → cream → navy → white 등)
- **eyebrow 라벨** 사용 (uppercase, gold, letter-spacing 0.4em)
- **한·영 병기** 헤드라인이 브랜드 톤에 잘 맞음
- **골드/포인트 컬러 세로 라인**으로 시각적 앵커

[🎯 이미지-텍스트 매칭 규칙 — 매우 중요]
이 요청에는 실제 이미지들이 **함께 첨부**되어 있다 (visual input). 각 첨부 이미지는 placeholder 번호({IMAGE_0}, {IMAGE_1}, ...)에 **순서대로** 매핑된다.

- 이미지를 **직접 보고 내용을 파악**하라 (제품 사진인지, 매장 내부인지, 로고인지, 인물인지 등).
- 섹션에 배치할 텍스트는 반드시 **해당 섹션의 이미지 내용과 일치**해야 한다.
- 예시:
  - 이미지가 "케이크 진열대"면 → 그 섹션의 제목은 "CAKE SELECTION / 케이크 셀렉션" 같이 관련된 것
  - 이미지가 "매장 외관"이면 → 그 섹션은 매장 소개 텍스트
  - 이미지가 "음료"면 → 페어링·메뉴·음료 설명
- 파일명도 힌트다 (예: "케이크 셀렉션.png" = 케이크 관련 섹션).
- 설명글에서 해당 이미지와 관련된 문구를 뽑아 배치.

[사용자 입력]
제목: ${params.title || "(없음 — 설명에서 뽑아 사용)"}
부제: ${params.subhead || "(없음)"}
기간: ${params.period || "(없음)"}
테마 컬러: ${params.themeColor}
이미지 ${imgCount}장 (placeholder·해상도·비율·파일명):
${imgList}

[설명글 원문]
"""
${params.description}
"""

══════════════════════════════════════════════════════
[자체 점검 체크리스트 — HTML 생성 후 반드시 확인]
① 모든 이미지({IMAGE_0}~{IMAGE_${params.images.length - 1}})가 1번씩만 쓰였는가?
② 배경은 허용 중립 팔레트(white/cream/navy/charcoal)만 사용했는가?
③ 채도 높은 컬러 배경을 쓰지 않았는가?
④ 좌우 분할 섹션에서 한쪽이 비어있지 않은가?
⑤ 모든 <img>가 width:100%; height:auto 또는 이와 동등한 원본 비율 보존 방식인가?
⑥ object-fit: cover, background-size: cover, overflow: hidden을 쓰지 않았는가?
⑦ 페이지 최하단에 {LOGO} 이미지가 중앙 배치되었는가?
⑧ JavaScript를 쓰지 않았는가?
⑨ opacity, filter, 반투명 회색 박스·그라디언트를 이미지나 텍스트에 무작위로 얹지 않았는가?
⑩ 이미지·텍스트가 인라인 좌표로 임의 겹쳐있지 않은가? (오버레이는 반드시 class="pb-overlay-section" 패턴만)
⑪ 텍스트가 이미지 귀퉁이에 뜬금없이 배치되지 않았는가?

한 항목이라도 어기면 HTML을 수정해서 다시 출력하라.

[엄격한 출력 규칙]
- 응답은 **HTML 원문만**. 마크다운 코드펜스(\`\`\`html) 절대 금지.
- 설명·코멘트·서문 일체 없음. 첫 글자는 <!DOCTYPE html>.
- 이미지 src는 반드시 {IMAGE_0}, {IMAGE_1}, ..., {LOGO} 형식 그대로 (중괄호 포함).
- 색상: 배경은 중립(white/cream/navy/charcoal) + 포인트만 ${params.themeColor}.`;
};

const stripCodeFences = (s: string): string => {
  let out = s.trim();
  out = out.replace(/^```(?:html|HTML)?\s*\n?/, "");
  out = out.replace(/\n?```\s*$/, "");
  return out.trim();
};

const substituteAssets = (
  html: string,
  images: MultiImageItem[],
  logoDataUrl: string,
): string => {
  let out = html;
  images.forEach((img, i) => {
    const pattern = new RegExp(`\\{IMAGE_${i}\\}`, "g");
    out = out.replace(pattern, img.image);
  });
  out = out.replace(/\{LOGO\}/g, logoDataUrl);
  return out;
};

const stripOverlayStyles = (html: string): string => {
  return html.replace(/style="([^"]*)"/gi, (_match, styles: string) => {
    let cleaned = styles;

    cleaned = cleaned.replace(
      /background(?:-color)?\s*:\s*rgba\s*\([^)]*\)\s*;?/gi,
      "",
    );
    cleaned = cleaned.replace(
      /background(?:-image)?\s*:\s*linear-gradient\s*\([^)]*\)\s*;?/gi,
      "",
    );
    cleaned = cleaned.replace(
      /background(?:-image)?\s*:\s*radial-gradient\s*\([^)]*\)\s*;?/gi,
      "",
    );
    cleaned = cleaned.replace(/opacity\s*:\s*[\d.]+\s*;?/gi, "");
    cleaned = cleaned.replace(/filter\s*:\s*[^;"]+;?/gi, "");
    cleaned = cleaned.replace(/mix-blend-mode\s*:\s*[^;"]+;?/gi, "");

    const hasOverlayPattern =
      /position\s*:\s*absolute/i.test(cleaned) &&
      (/inset\s*:\s*0/i.test(cleaned) ||
        (/top\s*:\s*0/i.test(cleaned) && /left\s*:\s*0/i.test(cleaned)));
    if (hasOverlayPattern) {
      cleaned = cleaned.replace(/position\s*:\s*absolute\s*;?/gi, "");
      cleaned = cleaned.replace(/inset\s*:\s*[^;"]+;?/gi, "");
      cleaned = cleaned.replace(/(?:top|left|right|bottom)\s*:\s*[^;"]+;?/gi, "");
    }

    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
    return `style="${cleaned}"`;
  });
};

const injectFontCss = (html: string, fontCss: string): string => {
  const inject = `<style>${fontCss}
html, body { margin: 0; padding: 0; font-family: 'PBGothic', -apple-system, BlinkMacSystemFont, sans-serif; word-break: keep-all; overflow-wrap: break-word; line-height: 1.65; letter-spacing: -0.07em; }
body { padding: 0 !important; margin: 0 !important; }
body * { letter-spacing: -0.07em; }
/* 섹션은 뷰포트 풀폭 (배경색이 양옆까지 깔리게) */
body, body > *, body > * > *, body > * > * > * { max-width: none !important; }
section, main, article, header, footer { width: 100% !important; }
body > div, body > main, body > article { width: 100% !important; }
/* 텍스트 사이즈 — 변경 없음 */
body h1 { font-size: clamp(26px, 3.4vw, 40px) !important; line-height: 1.22 !important; }
body h2 { font-size: clamp(20px, 2.4vw, 30px) !important; line-height: 1.28 !important; }
body h3 { font-size: clamp(17px, 1.9vw, 22px) !important; line-height: 1.32 !important; }
body p { font-size: clamp(13px, 1.2vw, 15px) !important; line-height: 1.75 !important; }
body li { font-size: clamp(13px, 1.2vw, 15px) !important; line-height: 1.75 !important; }
/* 이미지 — 50% 축소 (max 540px, 중앙 정렬) */
img { display: block; max-width: 100%; height: auto !important; object-fit: contain !important; }
section img { max-width: 540px !important; margin-left: auto !important; margin-right: auto !important; }
img.pb-allow-crop { height: revert !important; object-fit: cover !important; }
img.pb-product-center { max-width: 22% !important; min-width: 140px !important; margin-left: auto !important; margin-right: auto !important; }
@media (max-width: 768px) { img.pb-product-center { max-width: 38% !important; } }
/* 오버레이 섹션 이미지는 풀커버 유지 (배경 역할) */
section.pb-overlay-section img { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
.pb-info-card { background: #FAF8F3 !important; border-radius: 12px !important; padding: 32px 28px !important; max-width: 760px !important; margin: 24px auto !important; }
.pb-info-card.dark { background: #1A2D5A !important; color: #ffffff !important; }
.pb-info-card.dark * { color: #ffffff !important; }
/* 오버레이·불투명도·필터 기본 차단 (안전망) */
* { opacity: 1 !important; filter: none !important; mix-blend-mode: normal !important; }
/* 허용된 텍스트-이미지 오버레이 패턴 */
section.pb-overlay-section { position: relative !important; }
section.pb-overlay-section img {
  width: 100% !important;
  height: auto !important;
  display: block !important;
  object-fit: cover !important;
}
section.pb-overlay-section .pb-overlay-content {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  color: #ffffff !important;
  padding: 40px !important;
  background: rgba(0, 0, 0, var(--pb-overlay-strength, 0.45)) !important;
}
section.pb-overlay-section .pb-overlay-content * { color: #ffffff !important; }
section.pb-overlay-section h1,
section.pb-overlay-section h2,
section.pb-overlay-section h3 {
  margin: 0 0 12px !important;
  line-height: 1.2 !important;
}
</style>`;

  if (html.includes("</head>")) {
    return html.replace("</head>", `${inject}</head>`);
  }
  return inject + html;
};

export const geminiGenerateHtml = async (
  params: GeminiHtmlParams,
): Promise<string> => {
  if (params.images.length === 0) {
    throw new Error("이미지가 최소 1장 필요합니다");
  }
  const imagesMeta = params.images.map((i) => ({
    w: i.imageMeta.w,
    h: i.imageMeta.h,
    name: i.name,
  }));
  const prompt = buildPrompt({
    title: params.title,
    subhead: params.subhead,
    period: params.period,
    themeColor: params.themeColor,
    description: params.description,
    images: imagesMeta,
  });

  const parseDataUri = (dataUri: string) => {
    const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
  };

  const imageParts = params.images
    .map((img) => parseDataUri(img.image))
    .filter((x): x is { mimeType: string; data: string } => x !== null)
    .map((p) => ({
      inline_data: { mime_type: p.mimeType, data: p.data },
    }));

  const requestBody = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, ...imageParts],
      },
    ],
    generationConfig: {
      responseMimeType: "text/plain",
      temperature: 0.4,
      maxOutputTokens: 16000,
    },
  });

  const callOne = async (model: string): Promise<string> => {
    const RETRYABLE = new Set([429, 500, 502, 503, 504]);
    const ATTEMPTS = 3;
    const DELAYS_MS = [0, 2000, 5000];
    let lastError = "";
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      if (DELAYS_MS[attempt] > 0) {
        await new Promise((r) => setTimeout(r, DELAYS_MS[attempt]));
      }
      const resp = await fetch(
        `${endpointFor(model)}?key=${encodeURIComponent(params.apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        },
      );
      if (resp.ok) {
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("응답이 비어있습니다");
        return text;
      }
      const errText = (await resp.text()).slice(0, 200);
      lastError = `${resp.status}: ${errText}`;
      if (!RETRYABLE.has(resp.status)) {
        if (resp.status === 401 || resp.status === 403) {
          throw new Error(`API 키가 유효하지 않습니다 (${resp.status})`);
        }
        if (resp.status === 400 || resp.status === 404) {
          throw new Error(`MODEL_UNAVAILABLE: ${lastError}`);
        }
        throw new Error(`Gemini API ${lastError}`);
      }
    }
    throw new Error(`RETRY_EXHAUSTED: ${model} ${lastError}`);
  };

  const callWithFallback = async (): Promise<string> => {
    let lastMsg = "";
    for (const model of MODEL_CHAIN) {
      try {
        return await callOne(model);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        lastMsg = msg;
        if (msg.includes("API 키가")) throw e;
        if (msg.startsWith("RETRY_EXHAUSTED") || msg.startsWith("MODEL_UNAVAILABLE")) {
          console.warn(`[Gemini] ${model} 실패, 다음 모델 시도:`, msg);
          continue;
        }
        throw e;
      }
    }
    throw new Error(
      `Gemini 서버가 계속 혼잡합니다 (${MODEL_CHAIN.length}개 모델 모두 실패). 몇 분 후 다시 시도해주세요. [${lastMsg}]`,
    );
  };

  const raw = await callWithFallback();

  let html = stripCodeFences(raw);

  if (!html.toLowerCase().includes("<!doctype") && !html.toLowerCase().includes("<html")) {
    throw new Error("HTML 문서 형식이 아닙니다");
  }

  const [fontCss, logoDataUrl] = await Promise.all([
    getEmbeddedFontCss(),
    getLogoDataUrl(),
  ]);

  html = substituteAssets(html, params.images, logoDataUrl);
  html = stripOverlayStyles(html);
  html = injectFontCss(html, fontCss);

  return html;
};
