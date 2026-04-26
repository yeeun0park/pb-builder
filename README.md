# PB 상세페이지 초안 빌더

파리바게뜨 공식 프로모션 상세페이지 톤의 **HTML / PDF / JPG 초안**을
이미지·텍스트 입력만으로 자동 생성하는 사내 웹앱.

100% 클라이언트 사이드 — 서버 0대, 모든 처리는 사용자 브라우저에서.

## 사용법 (3단계)

1. **Gemini API 키 등록** (1회)
   - https://aistudio.google.com/app/apikey 에서 무료 발급
   - 좌측 패널의 "🔑 Gemini API 키 설정" 에 붙여넣기 → "저장"
   - 이 브라우저 localStorage 에만 저장됨, 서버·리포에 절대 전송 안 됨

2. **AI 자동 생성**
   - "🤖 AI 자동 생성" 탭에서 헤드라인·부제·기간·테마 컬러·설명글 입력
   - 이미지 여러 장 업로드 (각 이미지의 내용에 맞춰 AI가 텍스트와 매칭)
   - "AI로 상세페이지 HTML 생성" 클릭 → 1~2분 후 완성

3. **세부 조정 + 내보내기**
   - "🛠️ 세부 조정" 탭에서 텍스트·이미지·섹션 수정
   - 우측 프리뷰에서 텍스트 클릭해 직접 타이핑 가능
   - 하단 "PDF 저장 / JPG 저장 / HTML 저장" 으로 다운로드

## 특징

- **PB 브랜드 톤 자동 적용**: PBGothic 폰트, 자간 -0.07em, 중립 컬러 팔레트
- **이미지·텍스트 의미 매칭**: AI가 이미지 내용을 보고 적절한 텍스트 배치
- **3가지 레이아웃 패턴**: 풀블리드 + 박스 카드 + 오버레이 텍스트
- **세부 편집**: 행 묶음(같은 행에 여러 섹션), 오버레이 강도 조절, 행간·자간·색상
- **단일 페이지 PDF**: 인쇄 다이얼로그에서 페이지 끊김 없이 한 페이지로 저장

## 폴더 구조

```
detail-page-builder/
├── docs/
│   ├── OUTPUT_SPEC.md      ← 출력 톤 계약 (모델 바뀌어도 유지해야 할 스펙)
│   ├── ARCHITECTURE.md     ← 데이터 흐름·후처리 파이프라인
│   └── PROMPT_HISTORY.md   ← 프롬프트 변경 이력
├── prompts/
│   └── gemini-v1.txt       ← 프롬프트 원문 박제 (모델 교체용)
├── public/
│   ├── fonts/              ← PBGothic Regular·Bold (base64 임베드용)
│   ├── logo/               ← PB 로고
│   └── robots.txt          ← 검색 엔진 차단
├── references/             ← paris.co.kr 페이지 스냅샷·분석
├── src/
│   ├── components/         ← React UI (AutoMode, HtmlDetailMode, Preview)
│   ├── lib/                ← geminiHtml, fontBase64, htmlExport
│   └── ...
├── vercel.json             ← Vercel 배포 설정
└── package.json
```

## 개발

```bash
npm install
npm run dev    # http://localhost:5173
```

## 빌드

```bash
npm run build  # → dist/
npm run preview
```

## 배포

### Vercel (권장 — git push 시 자동 재배포)

1. https://vercel.com 에서 GitHub 로그인
2. "Add New Project" → 이 리포 선택
3. **Root Directory**: 모노리포일 경우 `detail-page-builder` 지정 (단독 리포면 비워둠)
4. 자동 감지되는 설정 그대로 "Deploy"
5. 1~2분 후 URL 발급

### 정적 호스팅 (대안)

`npm run build` → `dist/` 폴더를 어떤 정적 호스팅에 올려도 작동.

## 보안 고려

- 키는 사용자 본인의 localStorage 에만 저장
- 폰트·로고는 빌드 결과물에 base64 로 임베드되어 외부 노출 없음
- robots.txt 로 검색 엔진 인덱싱 차단
- URL 자체가 1차 보호 (Free Vercel 은 비밀번호 보호 미지원)

## 문서

- 모델·프롬프트 교체 시 → `docs/PROMPT_HISTORY.md` 에 변경 이력 기록
- 출력 톤 검증 → `docs/OUTPUT_SPEC.md` 시나리오 5개로 회귀 테스트
- 데이터 흐름 이해 → `docs/ARCHITECTURE.md`

## 라이선스

내부 도구 — 외부 공개·재배포 금지.
