# OUTPUT_SPEC — PB 상세페이지 출력 스펙 (변경 금지 계약)

이 문서는 앱이 생성하는 HTML 결과물의 **불변 계약**을 정의한다.
모델·프롬프트·후처리가 바뀌어도 **이 스펙에 맞는 출력**이 나와야 한다.

미래에 Gemini → Claude → 다른 모델로 바꿔도 이 문서를 기준으로 검증.

---

## 1. 출력 형식

- 단일 HTML5 문서 (`<!DOCTYPE html>` 시작)
- 모든 CSS는 `<head>` 안 `<style>` 태그에 임베드
- JavaScript 없음
- 외부 리소스(폰트·이미지) 모두 base64 data URL로 인라인
- 파일 1개로 완전 자립 (오프라인 동작)

## 2. 페이지 구조

```
<body>
  <section class="...">          ← 풀폭 (배경색 양옆까지)
    [content with own max-width inside if needed]
  </section>
  <section class="pb-overlay-section">  ← 이미지 + 텍스트 오버레이 (선택)
    <img>
    <div class="pb-overlay-content">...</div>
  </section>
  ...
  <footer>
    <img src="{LOGO}" alt="PARIS BAGUETTE">
  </footer>
</body>
```

## 3. 타이포그래피

- 폰트: `'PBGothic', sans-serif` (호스트 자동 임베드)
- weight 매핑: 100~500 = Regular, 600~900 = Bold
- letter-spacing: `-0.07em` 기본 (한글 톤 타이트하게)
- line-height: 1.65 기본
- word-break: keep-all (한글 단어 단위 줄바꿈)

크기 (호스트 강제):
- h1: clamp(26px, 3.4vw, 40px)
- h2: clamp(20px, 2.4vw, 30px)
- h3: clamp(17px, 1.9vw, 22px)
- p, li: clamp(13px, 1.2vw, 15px), line-height 1.75

## 4. 컬러 팔레트 (배경 허용 톤)

| HEX | 용도 |
|---|---|
| `#FFFFFF` | 기본 화이트 |
| `#FAF8F3` `#F5F0E6` `#F8F5EE` | 웜 크림 |
| `#F5F5F5` `#F7F7F7` | 쿨 오프화이트 |
| `#1A2D5A` `#0F1B36` | 딥 네이비 |
| `#1A1A1A` `#2B2B2B` | 차콜·블랙 |

테마 컬러(사용자 입력)는 **포인트만** — 제목 강조 일부에. 넓은 면적 금지.

**금지**: 채도 높은 원색·파스텔, 그라디언트 배경, rgba 반투명, 이미지에서 추출한 색.

## 5. 이미지 규칙

- 모든 이미지 원본 비율 유지 (크롭 금지)
- `object-fit: contain` (`cover` 금지, `pb-allow-crop` 클래스만 예외)
- 일반 섹션 이미지: `max-width: 540px` 중앙 정렬 (호스트 강제)
- 오버레이 섹션 이미지: `width: 100%` 풀커버 (배경 역할)
- `pb-product-center` 클래스: 22% 중앙 (제품 단독 사진)

## 6. 섹션 너비

- 모든 섹션·main·article·header·footer: `width: 100%` (뷰포트 풀폭)
- body 직계·2차·3차·4차 자손 모두 `max-width: none !important` (호스트 강제)
- 콘텐츠 가운데 모으기: 섹션 내부에 `<div style="max-width: 720px; margin: auto">` 식으로

## 7. 유틸리티 클래스 (호스트 제공, AI가 사용)

### `<section class="pb-overlay-section">`
이미지에 텍스트 오버레이. 평범한 사진(매장·인물·풍경)에 분위기 텍스트 얹을 때.
```html
<section class="pb-overlay-section">
  <img src="{IMAGE_X}">
  <div class="pb-overlay-content">
    <h2>제목</h2>
    <p>부제</p>
  </div>
</section>
```
- 검은 그라디언트 + 흰 텍스트 자동
- 오버레이 강도: CSS variable `--pb-overlay-strength` (기본 0.45, 0~1)

### `<img class="pb-product-center">`
제품 단독 사진(흰 배경에 피사체만)에 사용. 가로 22% 중앙 자동 정렬.

### `<div class="pb-info-card">`
혜택·이벤트·주의사항 박스. 크림색 배경 + 둥근 모서리 + max 760px 중앙.
변형: `<div class="pb-info-card dark">` = 네이비 배경 + 흰 텍스트.

## 8. 안전망 후처리

`stripOverlayStyles`가 다음을 인라인 style에서 제거 (생성 품질 보호):
- `background: rgba(...)` (반투명)
- `background: linear-gradient(...)` `background: radial-gradient(...)`
- `opacity: 0.X`
- `filter: ...` (grayscale·blur 등)
- `mix-blend-mode: ...`
- `position: absolute + inset: 0` 패턴 (인라인 오버레이만 — 클래스 패턴은 제외)

## 9. 입력 스키마

```typescript
type GeminiHtmlParams = {
  apiKey: string;
  title?: string;       // 메인 헤드라인
  subhead?: string;     // 부제
  period?: string;      // 기간 (예: "2026-04-09 ~ 2026-04-29")
  themeColor: string;   // HEX (예: "#2B75B9")
  description: string;  // 설명글 (단락 사이는 빈 줄)
  images: MultiImageItem[];  // 이미지 배열 + 메타
};
```

## 10. 출력 검수 기준

새 모델·프롬프트로 갈아끼울 때 다음 시나리오로 검증:

| # | 입력 | 기대 출력 |
|---|---|---|
| 1 | 신제품 라인업 (이미지 8장 + 헤드라인 + 설명) | 풀블리드 시퀀스 + 자연스러운 배경 전환 |
| 2 | 제품 1개 사진 + 짧은 설명 | `pb-product-center` 또는 작은 중앙 정렬 |
| 3 | 사전예약 + 혜택 안내 + CTA | `pb-info-card` 박스 + 기간 띠 |
| 4 | 매장 외관 사진 + 분위기 카피 | `pb-overlay-section` 오버레이 |
| 5 | 컬래버 (이미지 8장 + 두 브랜드 컬러) | 양사 컬러 충돌 + 풀블리드 |

각 케이스에서:
- 양옆 흰 띠 없음 (섹션 풀폭)
- 이미지 540px 안쪽 (제품·일반)
- 텍스트는 한글 톤 (자간 -0.07em, 한·영 병기 클리셰 회피)
- 푸터에 PARIS BAGUETTE 로고 자동
