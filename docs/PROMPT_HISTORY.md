# PROMPT_HISTORY — 프롬프트·모델 변경 이력

이 문서는 프롬프트와 생성 모델의 변경 이력을 추적한다.
출력 톤이 바뀌면 여기에 변경 사유와 영향을 기록.

---

## v1 — 2026-04-26 (현재)

**파일**: `prompts/gemini-v1.txt`
**모델 체인**: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-1.5-flash`
**파라미터**: `temperature: 0.4`, `maxOutputTokens: 16000`

**기준이 된 레퍼런스 페이지 (paris.co.kr)**:
- new-paran-label
- cafe-de-dessert
- pb-blue-label-matcha
- pb-with-lafc
- pb-blue-rose-cake
- pb-family-month-cake
- pb-lafc-product

**주요 결정 사항**:
- 100% 클라이언트 사이드 (서버 0대) — 사용자 본인 키로 호출
- 호스트 강제 CSS로 톤 일관성 보장 (사이즈·자간·팔레트)
- 유틸리티 클래스 3종 (`pb-overlay-section`, `pb-info-card`, `pb-product-center`)
- 인라인 오버레이 차단 + 클래스 패턴만 허용
- 후처리 4단계 (stripCodeFences → substituteAssets → stripOverlayStyles → injectFontCss)

**검증된 시나리오**: `OUTPUT_SPEC.md` 섹션 10 참조.

---

## 변경 시 작성 양식

```markdown
## v{N} — YYYY-MM-DD

**파일**: `prompts/{provider}-v{N}.txt`
**모델 체인**: ...
**파라미터**: ...

**변경 사유**:
- 무엇을·왜 바꿨는가

**영향**:
- 출력 톤 차이 (이전 대비)
- 검수 시나리오 통과 여부

**롤백 절차**:
- 이전 버전으로 되돌리는 방법
```
