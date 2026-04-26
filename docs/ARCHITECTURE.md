# ARCHITECTURE — 데이터 흐름·후처리 파이프라인

## 1. 전체 흐름

```
사용자 입력
  ├─ 헤드라인·부제·기간·테마 컬러 (텍스트)
  ├─ 설명글 (textarea, 단락 분리)
  └─ 이미지 N장 (base64 data URL + 메타)
        ↓
[AutoMode.tsx]
        ↓ geminiGenerateHtml(params)
[lib/geminiHtml.ts]
        ↓
  ├─ buildPrompt(params) → 프롬프트 텍스트
  ├─ 이미지 → inline_data 변환
  └─ Gemini API 호출 (model chain fallback + 3-attempt retry)
        ↓ response.text
  ├─ stripCodeFences (마크다운 코드펜스 제거)
  ├─ substituteAssets ({IMAGE_N}, {LOGO} → 실제 base64)
  ├─ stripOverlayStyles (인라인 오버레이 차단)
  └─ injectFontCss (@font-face + 호스트 강제 CSS)
        ↓ 완성 HTML
[store.setHtmlOutput(html)]
        ↓
[Preview → HtmlPreview iframe srcDoc]
        ↓ 사용자 편집
[HtmlDetailMode]
  ├─ contenteditable 항상 ON (DOM 직접 편집)
  ├─ 텍스트 색·정렬·크기·행간
  ├─ 섹션 배경·배치·열·반전·오버레이 강도
  ├─ 행 묶음 (그룹화 / 분리 / 내부 재정렬)
  ├─ 이미지 슬라이더 (max-width %)
  └─ 드래그 정렬
        ↓
[내보내기]
  ├─ openPrintView → @page 동적 사이즈 → 단일 페이지 PDF
  ├─ captureIframeAsJpeg → html2canvas → JPEG
  └─ downloadHtmlFile → HTML 파일 그대로
```

## 2. 핵심 파일

| 파일 | 역할 |
|---|---|
| `src/lib/geminiHtml.ts` | **출력 톤의 80% 결정** — 프롬프트, 모델 체인, 후처리 |
| `src/lib/fontBase64.ts` | PBGothic Regular·Bold base64 임베드 |
| `src/lib/assets.ts` | 로고 base64 |
| `src/lib/htmlExport.ts` | PDF·JPG·HTML 내보내기 |
| `src/lib/imageUpload.ts` | 사용자 이미지 → base64 + 메타 측정 |
| `src/components/AutoMode.tsx` | AI 생성 폼 |
| `src/components/HtmlDetailMode.tsx` | iframe DOM 편집 컨트롤 패널 |
| `src/components/HtmlPreview.tsx` | iframe srcDoc 렌더 |
| `src/components/Preview.tsx` | mode 분기 (auto vs detail) |

## 3. 모델 체인 + 폴백

`src/lib/geminiHtml.ts`:
```ts
const MODEL_CHAIN = [
  "gemini-2.5-flash",         // 1순위
  "gemini-2.5-flash-lite",    // 2순위 (429/5xx 폴백)
  "gemini-1.5-flash",         // 3순위
];
```

각 모델당 3회 재시도 (지연 0 / 2s / 5s).
HTTP 401·403 → 키 오류 (즉시 실패).
HTTP 400·404 → 모델 부재 (다음 모델 시도).
HTTP 429·5xx → 재시도.

## 4. Generation Config

```ts
{
  responseMimeType: "text/plain",
  temperature: 0.4,
  maxOutputTokens: 16000,
}
```

## 5. 후처리 파이프라인 상세

### 5-1. stripCodeFences
응답 첫·끝의 `\`\`\`html` `\`\`\`` 마크다운 펜스 제거.

### 5-2. substituteAssets
`{IMAGE_0}`, `{IMAGE_1}`, ..., `{LOGO}` placeholder를 실제 data URL로 치환.

### 5-3. stripOverlayStyles
인라인 `style="..."` 안의 위험 패턴 정규식 제거:
- `background-color: rgba(...)`
- `background-image: linear-gradient(...) | radial-gradient(...)`
- `opacity: 숫자`
- `filter: ...`
- `mix-blend-mode: ...`
- `position: absolute + inset: 0` 결합 패턴 (인라인 오버레이만)

→ AI가 무리한 시각효과를 박는 것 방지. **클래스 기반 오버레이(`pb-overlay-section`)는 영향 없음**.

### 5-4. injectFontCss
`<head>` 마지막에 `<style>` 블록 추가:
- `@font-face` 2개 (Regular + Bold, weight 범위 매핑)
- 호스트 강제 CSS (배경·이미지 캡·자간·타이포)
- 유틸리티 클래스 정의 (`pb-overlay-section`, `pb-info-card`, `pb-product-center`)

## 6. 편집 패널 → DOM 매니퓰레이션

`HtmlDetailMode`는 React state를 거의 안 쓰고 **iframe 안 DOM을 직접 변경**:

| 동작 | 구현 |
|---|---|
| 텍스트 색·정렬·크기·행간 | `el.style.setProperty(prop, val, 'important')` |
| 섹션 배경 | `el.style.backgroundColor = X` |
| 섹션 열 (1/2/3) | `display: grid; grid-template-columns: repeat(N, ...)` |
| 섹션 반전 | flex: `flex-direction: row-reverse` / grid: 자식 `order` |
| 오버레이 강도 | CSS var `--pb-overlay-strength` |
| 행 묶음 | `<div class="pb-row-group">` wrapper 추가, 자식 `flex: 1 1 0` |
| 드래그 정렬 | HTML5 native drag, body.children 재정렬 |

**저장 시점**:
- 자동 저장 없음 (디바운스 제거 → iframe 깜박임 방지)
- 컴포넌트 unmount 시 한 번 직렬화하여 store에 반영
- 내보내기는 항상 iframe 라이브 DOM 직접 읽기 (`readLiveHtml`)

## 7. 자산 임베딩 전략

100% 클라이언트 + 서버리스 배포 위해:
- 폰트 `.ttf` → base64 (~600KB total)
- 로고 `.png` → base64 (~10KB)
- 사용자 이미지 → 업로드 시점에 base64
- 모든 자산이 결과 HTML 안에 박혀서 **결과 파일 1개로 자립**

## 8. 환경·키 관리

- Gemini API 키는 사용자 브라우저 `localStorage` 만 (`pb_gemini_api_key` key)
- 코드·리포에 키 절대 없음
- 사내 사용자는 본인 키로 본인 비용 (Free tier로 충분)

## 9. 미래 모델 교체 가이드

Gemini → 다른 모델 (Claude, GPT 등) 갈아끼울 때:

1. `OUTPUT_SPEC.md`의 "10. 출력 검수 기준" 5개 시나리오 통과 검증
2. `prompts/gemini-v1.txt`의 프롬프트 그대로 시도 (대부분 호환)
3. 모델 응답 형식 차이 처리:
   - 멀티모달 입력 형식 (Anthropic SDK는 `images` 별도 파라미터)
   - 출력 형식 (HTML 그대로 vs JSON 래핑)
4. 후처리 4단계는 그대로 사용 (모델 무관)
5. `MODEL_CHAIN` 폴백 구조 유지 — 새 모델 ID로 교체

**프롬프트는 별도 텍스트 파일** (`prompts/gemini-v1.txt`)에 박제되어 있어서 모델 갈아끼워도 프롬프트는 재사용 가능.
