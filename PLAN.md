# 구현 계획 — PB 상세페이지 초안 디자인 생성 앱

`layout_design.md`의 레이아웃 계약을 구현하는 **서버 없는(100% 클라이언트) 웹앱**의
단계별 계획. 모든 렌더링은 사용자 브라우저에서 수행한다.

## 목표

사내 누구나 **링크로 접속**하거나 **ZIP을 받아** 쓸 수 있는, 24시간 호스팅 인프라가
필요 없는 정적 웹앱. 이미지·텍스트만 입력하면 파리바게뜨 상세페이지 스타일의
**통합 PDF(편집 가능) + JPG** 초안을 받을 수 있다.

## 제약

- 폰트: `assets/fonts/PBGothicBd.ttf`, `PBGothicRg.ttf` 만 사용
- 로고: `assets/PB logo.png`, 페이지 최하단 고정
- 편집 가능 PDF = 텍스트 벡터 + 폰트 임베드 (브라우저에서 생성)
- **서버 0대** — 모든 렌더링·파일 생성은 사용자 브라우저에서
- 로그인 없음
- 배포 경로 **두 가지 동시 지원**:
  - **B. GitHub Pages** (추측 불가 URL, 사내 공유)
  - **C. ZIP 파일** (오프라인 배포)

---

## 기술 스택 (서버리스)

| 역할 | 선택 | 이유 |
|---|---|---|
| 빌드 | **Vite + React + TypeScript** | 순수 정적 번들, 서버 필요 없음 |
| 스타일 | Tailwind CSS + CSS 변수 | `layout_design.md` 디자인 토큰 매핑 |
| 상태 | Zustand | 캠페인 단일 스토어에 충분 |
| DnD | `@dnd-kit/sortable` | 접근성·성능 |
| 업로드 | `<input type="file">` + `FileReader` | 서버 없이 브라우저 메모리에서 처리 (base64) |
| **PDF** | **`@react-pdf/renderer`** | 벡터 텍스트·폰트 임베드·100% 클라이언트 |
| **JPG** | **`pdfjs-dist`** | 생성된 PDF를 캔버스로 렌더 → JPEG blob (PDF와 100% 시각 일치) |
| 검증 | Zod | Campaign JSON 스키마 |

### 단일 렌더러 전략

`@react-pdf/renderer` 하나가 **진실 공급원**이다.

```
Campaign JSON
    ↓
@react-pdf/renderer   ──→  PDF blob  (편집 가능)
    ↓                          ↓
<PDFViewer>                pdfjs-dist
 (라이브 프리뷰)               ↓
                          Canvas → JPEG blob
```

프리뷰·PDF·JPG가 **동일한 렌더 결과** — 시각적 어긋남 없음.

---

## 디렉터리 구조

```
detail-page-builder/
├── README.md
├── layout_design.md            ← 레이아웃 계약
├── PLAN.md                     ← 이 문서
├── references/                 ← 레퍼런스 HTML 스냅샷 (원본 URL 유실 대비)
│   ├── new-paran-label.html
│   ├── cafe-de-dessert.html
│   └── pb-blue-label-matcha.html
├── package.json
├── vite.config.ts              ← base: './' (ZIP 배포용 상대 경로)
├── tsconfig.json
├── tailwind.config.ts
├── index.html
├── public/
│   ├── fonts/
│   │   ├── PBGothicRg.ttf
│   │   └── PBGothicBd.ttf
│   └── logo/
│       └── pb-logo.png
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Editor.tsx          ← 2열 레이아웃 (좌: 편집, 우: 프리뷰)
│   │   ├── MetaBar.tsx         ← 캠페인 메타 입력 (title, slug, period, theme)
│   │   ├── SectionList.tsx     ← dnd-kit 순서 조정, +/- 버튼
│   │   ├── SectionForm.tsx     ← 선택 섹션 필드 편집
│   │   ├── Preview.tsx         ← <PDFViewer> 라이브 프리뷰
│   │   └── DownloadBar.tsx     ← PDF·JPG 다운로드 + JSON 저장/불러오기
│   ├── pdf/
│   │   ├── Document.tsx        ← @react-pdf/renderer 루트 문서
│   │   ├── theme.ts            ← 타이포·컬러·간격 (layout_design.md와 1:1)
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── Fullbleed.tsx
│   │       ├── Split.tsx
│   │       ├── TextBlock.tsx
│   │       ├── Grid.tsx
│   │       └── FooterLogo.tsx  ← 자동 삽입, 편집 불가
│   └── lib/
│       ├── types.ts            ← Campaign, *Section 타입
│       ├── schema.ts           ← Zod 스키마
│       ├── store.ts            ← Zustand (캠페인 CRUD)
│       ├── pdf-to-jpg.ts       ← pdfjs-dist 래퍼
│       └── samples.ts          ← 하드코딩 샘플 (개발·테스트용)
└── .github/
    └── workflows/
        └── deploy.yml          ← GitHub Pages 자동 배포 (B 경로)
```

---

## 단계별 구현 순서

### Phase 1 — Vite 스캐폴드 + 자산 이관

1. `npm create vite@latest` — React + TS 템플릿
2. Tailwind 설치·설정
3. `vite.config.ts`에 `base: './'` — ZIP 배포 시 상대 경로로 동작하게
4. `assets/fonts/*.ttf` → `public/fonts/` 로 복사
5. `assets/PB logo.png` → `public/logo/pb-logo.png` 로 복사
6. `src/index.css` 에 `@font-face` 등록 + CSS 변수(디자인 토큰)
7. 샘플 "안녕하세요" 텍스트가 PBGothic으로 렌더되는지 확인

**완료 조건**: `npm run dev` → 루트 페이지가 PBGothic으로 보임.

### Phase 2 — 타입·스키마·스토어

1. `src/lib/types.ts` — `Campaign`, `HeroSection`, `FullbleedSection`, `SplitSection`, `TextBlockSection`, `GridSection`, 공용 `Section` 유니언 정의
2. `src/lib/schema.ts` — Zod 스키마 (JSON import/export 검증)
3. `src/lib/store.ts` — Zustand: `campaign`, `addSection`, `removeSection`, `reorderSections`, `updateSection`, `updateMeta`, `loadJson`, `exportJson`
4. `src/lib/samples.ts` — 1개 레퍼런스 캠페인 하드코딩 (Phase 3 테스트용)

**완료 조건**: 콘솔에서 스토어 조작 시 상태 변화가 타입 안전하게 일어남.

### Phase 3 — PDF 렌더러

1. `src/pdf/theme.ts` — `layout_design.md` §3·4·5 값 그대로 상수화
2. `src/pdf/Document.tsx` — `<Document><Page>...</Page></Document>` 루트, 페이지 폭 1200, 높이 동적 계산
3. `src/pdf/sections/*.tsx` — 섹션 타입별 `@react-pdf/renderer` 컴포넌트 (Flexbox 기반)
4. `src/pdf/sections/FooterLogo.tsx` — 모든 문서 끝에 자동 삽입
5. PBGothic 폰트를 `Font.register`로 임베드 등록
6. 샘플 캠페인으로 PDF blob 생성 → 다운로드 수동 확인

**완료 조건**: 샘플 JSON으로 만든 PDF를 열었을 때 PBGothic으로 선택 가능한 텍스트·원본 이미지·최하단 로고가 모두 정상.

### Phase 4 — 에디터 UI

1. `MetaBar` — 캠페인 메타 입력 (title, slug, period, theme color picker)
2. `SectionList` — `@dnd-kit/sortable` 순서 변경, 섹션 추가(타입 선택)·삭제
3. `SectionForm` — 선택된 섹션 필드 편집 (이미지 `<input type="file">` → base64 URL, 텍스트 `<textarea>`)
4. `Preview` — `@react-pdf/renderer`의 `<PDFViewer>`로 라이브 프리뷰 (우측 고정)
5. `Editor` — 좌측 Meta+SectionList+SectionForm, 우측 Preview 2열

**완료 조건**: 빈 상태에서 hero 추가 → 이미지 업로드 → 제목 입력 → 우측 프리뷰 즉시 반영.

### Phase 5 — 다운로드 + JSON 저장/불러오기

1. `DownloadBar` — "PDF 다운로드" / "JPG 다운로드" / "JSON 저장" / "JSON 불러오기" 4버튼
2. PDF: `pdf()` 함수로 blob 생성 → `<a download>` 트리거
3. JPG: PDF blob → `pdfjs-dist`로 렌더 → `canvas.toBlob('image/jpeg', 0.9)` → 다운로드
4. 파일명: `<slug>_<YYYYMMDD>.{pdf,jpg,json}`
5. JSON 불러오기 시 Zod 검증, 실패 시 토스트

**완료 조건**: 생성된 PDF 열어서 텍스트 선택 가능 + JPG 열어서 PDF와 시각 일치 + JSON export/import 왕복 성공.

### Phase 6 — 배포 B: GitHub Pages

1. 새 퍼블릭 리포 생성 (이름: `pb-detail-page-builder` 또는 덜 특정적인 이름)
2. `.github/workflows/deploy.yml` — `main` 푸시 시 `npm run build` 후 `dist/` 를 `gh-pages` 브랜치로 publish
3. Settings → Pages → Source: `gh-pages` 브랜치
4. 추측 불가 저장소명 고려 (예: `pb-dp-builder-draft-xyz`) — URL 자체가 1차 보호
5. `robots.txt`에 `Disallow: /` 넣어 검색 엔진 인덱싱 차단

**완료 조건**: `username.github.io/<repo>` 로 접속 시 앱 동작.

### Phase 7 — 배포 C: ZIP 번들

1. `npm run build` → `dist/` 폴더 생성
2. `npm run package` 스크립트 추가: `dist/` → `pb-detail-page-builder-<YYYYMMDD>.zip`
3. ZIP 풀고 `dist/index.html` 더블클릭 → 브라우저에서 정상 동작 확인
   - `vite.config.ts`의 `base: './'` 필수 (file:// 환경 대응)
   - PDF 워커(`pdfjs-dist`) 경로도 상대 경로로 번들
4. 사내 공유 드라이브/메신저로 배포
5. README에 "받는 법·쓰는 법" 3줄 안내

**완료 조건**: ZIP 풀어서 네트워크 없이 index.html 열었을 때도 PDF·JPG 생성 작동.

---

## 검수·완료 기준

`layout_design.md §8 검수 체크리스트` 전 항목 통과 + 다음 4개 시나리오:

1. 새 파란라벨 스타일 캠페인 재현 — 레퍼런스와 리듬 유사
2. 섹션 6개 이상 섞은 복합 페이지
3. GitHub Pages URL에서 다른 PC로 접속해 동일 출력 확인
4. ZIP 파일 배포본을 오프라인 PC에서 열었을 때도 동일 동작

---

## 산정 규모 (대략)

- Phase 1–2: 0.5일 (스캐폴드 + 타입·스토어)
- Phase 3: 1일 (@react-pdf/renderer 학습·튜닝)
- Phase 4: 1일 (에디터 UI)
- Phase 5: 0.5일 (다운로드·JSON)
- Phase 6: 0.25일 (GH Pages 워크플로)
- Phase 7: 0.25일 (ZIP 패키지)

합계 3.5일치.

---

## 알려진 위험·선결 사항

- **@react-pdf/renderer의 CSS 제약**: Flexbox 기반, CSS Grid 미지원. 현재 섹션 타입 6종은 모두 Flex로 커버 가능. Grid(6.5)도 Flex row wrap으로 구현.
- **단일 긴 페이지 PDF**: `<Page>` 높이를 사전 계산해야 함. 섹션별 예상 높이를 sum해서 `<Page size={[1200, totalH]}>` 지정 (이미지 비율 기반 heuristic). Phase 3에서 구현 세부 확정.
- **`file://` 환경 JPG 생성**: `pdfjs-dist`의 워커가 `file://`에서 제약이 있을 수 있음. 워커를 inline으로 번들(`pdfjsWorker?worker&inline`)하여 회피.
- **IP 이슈(B 경로)**: 퍼블릭 리포에 폰트·로고·레퍼런스 HTML이 들어감. 사내 자산 공개 리스크는 사용자가 감수하기로 결정.
