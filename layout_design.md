# PB 상세페이지 레이아웃 디자인 계약

파리바게뜨 공식 프로모션 상세페이지(`paris.co.kr/promotion/*`)의 레이아웃 규칙을
"이미지 + 텍스트 입력만으로 자동 조립" 가능한 형태로 고정한 스펙 문서.

이 문서는 **단일 진실 공급원(single source of truth)** 이다. 앱의 템플릿·스타일·
타입 정의는 이 문서와 어긋나면 안 된다.

---

## 0. 레퍼런스

로컬 스냅샷이 **권위 있는 버전**이다. 원본 URL은 운영상 제거될 수 있으므로 신뢰하지 않는다.

| 캠페인 | 로컬 스냅샷 | 원본 URL (변동 가능) |
|---|---|---|
| 파란라벨 | `references/new-paran-label.html` | `https://www.paris.co.kr/promotion/new-paran-label/` |
| 카페 드 디저트 | `references/cafe-de-dessert.html` | `https://www.paris.co.kr/promotion/cafe-de-dessert/` |
| 블루라벨 말차 | `references/pb-blue-label-matcha.html` | `https://www.paris.co.kr/promotion/pb-blue-label-matcha/` |

- 스냅샷 일시: 2026-04-23 (`curl`로 HTML 취득)
- Phase 1에서 Playwright 세팅 직후 각 페이지 **풀 스크린샷(`.jpg`)도 같은 폴더에 저장**하여 시각 레퍼런스까지 고정.
- 새 레퍼런스 추가 시 반드시 스냅샷부터 저장한 뒤 이 표에 등록.

---

## 1. 페이지 구조

```
┌─────────────────────────────────────┐
│  HERO                               │  1. 풀블리드 이미지 + 제목/부제/기간
├─────────────────────────────────────┤
│  BODY 섹션 (N개, 순서 조정 가능)     │  2. hero 제외한 섹션 타입 자유 조합
│  · fullbleed                        │
│  · split                            │
│  · text-block                       │
│  · grid                             │
│    ...                              │
├─────────────────────────────────────┤
│       [PARIS BAGUETTE 로고]          │  3. 자동 고정, 편집 불가
└─────────────────────────────────────┘
```

- HERO는 페이지당 정확히 1개. 맨 위 고정.
- 로고 footer는 자동 삽입. 사용자가 제거·이동 불가.
- BODY 섹션은 최대 20개까지(실무 과잉 방지). 드래그로 순서 변경.

---

## 2. 전역 규칙

| 항목 | 값 |
|---|---|
| Content max-width | **1200px** (중앙 정렬) |
| 배경색 | `#FFFFFF` |
| 기본 폰트 | `PBGothicRg` (본문), `PBGothicBd` (제목·강조) |
| 기본 텍스트 색 | `#1A1A1A` |
| 보조 텍스트 색 | `#6B6B6B` |
| 섹션 수직 간격 | 기본 `0`(이미지 섹션), 텍스트 섹션은 상하 패딩으로 호흡 확보 |
| 테마 컬러 | 캠페인별 사용자 지정 (기본 `#2B75B9`) |

### 2.1 폰트 임베드

```css
@font-face {
  font-family: "PBGothic";
  src: url("/fonts/PBGothicRg.ttf") format("truetype");
  font-weight: 400;
  font-display: block;
}
@font-face {
  font-family: "PBGothic";
  src: url("/fonts/PBGothicBd.ttf") format("truetype");
  font-weight: 700;
  font-display: block;
}
```

- PDF 출력 시 **폰트 서브셋 임베드 강제**. `font-display: block`로 폴백 방지
  (폴백으로 렌더된 뒤 PDF에 구워지는 사고를 막기 위해).

---

## 3. 타이포그래피 스케일

| 역할 | 폰트 | 크기(px) | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero headline | PBGothic Bold | 56 | 1.25 | -0.02em |
| Hero subhead | PBGothic Regular | 22 | 1.5 | 0 |
| Section headline | PBGothic Bold | 40 | 1.3 | -0.015em |
| Section sub | PBGothic Regular | 20 | 1.6 | 0 |
| Body | PBGothic Regular | 17 | 1.75 | 0 |
| Caption | PBGothic Regular | 14 | 1.5 | 0 |
| Date range | PBGothic Regular | 15 | 1.4 | 0.02em |

- 줄바꿈은 사용자 입력(`\n`)을 그대로 존중. 자동 word-break 금지.
- 한글 단독 줄바꿈 방지용 `word-break: keep-all; overflow-wrap: break-word;` 전역 적용.

---

## 4. 컬러 시스템

| 토큰 | 기본 값 | 용도 |
|---|---|---|
| `--color-bg` | `#FFFFFF` | 페이지 배경 |
| `--color-fg` | `#1A1A1A` | 기본 텍스트 |
| `--color-fg-muted` | `#6B6B6B` | 보조 텍스트·기간 |
| `--color-theme` | 사용자 선택 | 강조·CTA·테두리 |
| `--color-divider` | `#EDEDED` | 섹션 구분선(옵션) |

- 캠페인 생성 시 `theme_color`만 교체하면 hero 배경 틴트, 아이콘, 강조 라인이 함께 바뀐다.

---

## 5. 간격·리듬

- 텍스트 전용 섹션: 상하 패딩 `96px`, 좌우 패딩 `80px`
- Split 섹션: 상하 패딩 `80px`, 열 간격 `56px`
- Grid 섹션: 카드 간격 `24px`(2열) / `20px`(3열)
- Fullbleed: 이미지끼리 간격 `0`. 이미지 뒤 텍스트 섹션이 오면 텍스트 섹션 자체 패딩으로 호흡.
- 로고 footer: 상하 패딩 `72px`

---

## 6. 섹션 타입 레퍼런스

각 섹션은 고유 ID와 `type`, 타입별 필드를 갖는다. 저장 포맷은 JSON.

### 6.1 `hero`

| 필드 | 필수 | 설명 |
|---|---|---|
| `image` | ✓ | 풀블리드 배경 이미지 (권장 3000×1500 이상) |
| `headline` | ✓ | 대제목. 여러 줄 허용 |
| `subhead` |  | 부제 |
| `period` |  | 예: `2026-04-09 ~ 2026-12-31` |
| `overlay` |  | `dark` / `light` / `none` (기본 `dark`, 반투명 어둠) |
| `align` |  | `center` / `left` (기본 `center`) |

**레이아웃**: 이미지 풀블리드, 뷰포트 높이 700–780px 고정. 텍스트는 이미지 위 중앙
(또는 좌측). overlay가 `dark`면 `rgba(0,0,0,0.35)` 그라디언트.

### 6.2 `fullbleed`

| 필드 | 필수 | 설명 |
|---|---|---|
| `image` | ✓ | 풀블리드 이미지 |
| `caption` |  | 이미지 아래 작은 설명 |
| `link` |  | 이미지에 링크 부여(옵션) |

**레이아웃**: 이미지 `width: 100vw` 느낌(실제론 1200px 컨테이너 기준 `100%`),
aspect-ratio는 이미지 원본 유지.

### 6.3 `split`

| 필드 | 필수 | 설명 |
|---|---|---|
| `image` | ✓ | 좌/우 한쪽 이미지 |
| `image_side` |  | `left` / `right` (기본 `left`) |
| `headline` | ✓ | 제목 |
| `body` | ✓ | 본문 |
| `bullets` |  | 리스트 (선택) |

**레이아웃**: 2열 그리드, 각 6fr / 6fr. 이미지 비율은 4:5 권장. 모바일 폭
(600px 이하)에서는 이미지 위·텍스트 아래로 스택.

### 6.4 `text-block`

| 필드 | 필수 | 설명 |
|---|---|---|
| `headline` |  | 제목 |
| `body` | ✓ | 본문 |
| `align` |  | `center` / `left` (기본 `center`) |
| `bg` |  | `white` / `muted` / `theme-tint` |

**레이아웃**: 배경에 따라 좌우 인셋 적용. `theme-tint`는 `--color-theme`에 8% 알파.

### 6.5 `grid`

| 필드 | 필수 | 설명 |
|---|---|---|
| `columns` | ✓ | 2 또는 3 |
| `items[]` | ✓ | 각 아이템: `image`, (옵션) `title`, (옵션) `caption` |
| `headline` |  | 그리드 위 섹션 제목 |

**레이아웃**: 1:1 정사각 썸네일. 카드 아래에 제목·캡션이 있을 때만 카드 배경 `#FFF`.

### 6.6 `footer-logo` (자동)

- 사용자가 편집 불가. 빌드 시 항상 마지막에 삽입.
- 로고 이미지: `/logo/PB logo.png` (원본 339×25, 렌더는 width `200px` 고정).
- 위아래 패딩 `72px`, 가로 중앙.
- 배경 `#FFFFFF`.

---

## 7. 출력 규격

모든 렌더링은 **사용자 브라우저 내에서** 수행(서버 없음).
단일 렌더러(`@react-pdf/renderer`)가 생성한 PDF가 진실 공급원이고, JPG는 그 PDF를
캔버스로 렌더해서 파생한다.

### 7.1 PDF (편집 가능)

- 렌더러: `@react-pdf/renderer` (브라우저 실행)
- 페이지 사이즈: **단일 페이지**, `width: 1200`, `height: <전체 섹션 높이 합>`
  (A4 분할 금지 — 이미지 중간 잘림 방지)
- 폰트: PBGothic Rg/Bd를 `Font.register(...)` 로 임베드
- 텍스트는 벡터 — 선택·복사·편집 가능
- 파일명: `<campaign-slug>_<YYYYMMDD>.pdf`

### 7.2 JPG

- 렌더러: `pdfjs-dist` — 위 PDF blob을 첫(유일) 페이지 `render(canvas)` → `canvas.toBlob('image/jpeg', 0.9)`
- 폭 `1200px`, 높이 PDF와 동일
- PDF와 **픽셀 단위로 시각 일치**
- 파일명: `<campaign-slug>_<YYYYMMDD>.jpg`

### 7.3 파일명

- `<campaign-slug>_<YYYYMMDD>.pdf`
- `<campaign-slug>_<YYYYMMDD>.jpg`
- slug는 영문 소문자·숫자·하이픈만. 한글 제목은 내부 필드로만 유지.

---

## 8. 검수 체크리스트

출력물 최종 승인 전 확인:

- [ ] 전체 폭 1200px, 중앙 정렬
- [ ] 페이지 최하단에 PARIS BAGUETTE 로고 존재
- [ ] PBGothic Bd/Rg 외 다른 폰트 없음 (PDF에서 폰트 속성 확인)
- [ ] PDF에서 제목·본문 텍스트 **선택/복사 가능**
- [ ] Hero 1개, 섹션 순서 사용자 의도대로
- [ ] 이미지 원본 비율 유지, 왜곡 없음
- [ ] 날짜 범위 포맷 `YYYY-MM-DD ~ YYYY-MM-DD` 통일

---

## 9. 변경 관리

이 파일을 수정할 땐:

1. 먼저 해당 변경이 기존 템플릿/타입과 호환되는지 검토
2. 관련 파일(`src/lib/types.ts`, `src/components/sections/*`, `src/lib/render-pdf.ts`) 동시 수정
3. 최소 1개 캠페인 샘플로 재렌더 후 `8. 검수 체크리스트` 통과 확인
