# PB 상세페이지 초안 빌더

파리바게뜨 공식 프로모션 상세페이지 톤의 **HTML / PDF / JPG 초안**을
이미지·텍스트 입력만으로 자동 생성하는 사내 웹앱.

프론트엔드 React + Vercel 서버리스 함수 1개 (`/api/gemini-html`)로 Gemini를 프록시. API 키는 서버 환경변수에만 보관되어 사용자에게 노출되지 않습니다.

## 사용법 (2단계)

1. **AI 자동 생성**
   - 사이트 접속만 하면 바로 사용 가능 (API 키 입력 단계 없음)
   - "🤖 AI 자동 생성" 탭에서 헤드라인·부제·기간·테마 컬러·설명글 입력
   - 이미지 여러 장 업로드 (각 이미지의 내용에 맞춰 AI가 텍스트와 매칭)
   - "AI로 상세페이지 HTML 생성" 클릭 → 1~2분 후 완성

2. **세부 조정 + 내보내기**
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
├── api/                    ← Vercel 서버리스 함수
│   ├── gemini-html.ts      ← Gemini 호출 프록시 (서버 키 사용, 모델 체인 + 재시도)
│   └── _lib/
│       └── rate-limit.ts   ← 선택적 Upstash Redis rate limit
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
├── .env.example            ← 필요한 환경변수 템플릿
├── vercel.json             ← Vercel 배포 설정 (functions.maxDuration 60)
└── package.json
```

## 개발

```bash
npm install

# 옵션 A — 프론트엔드만 (Gemini 호출 안 되는 화면 작업)
npm run dev    # http://localhost:5173

# 옵션 B — Vercel CLI로 함수도 같이 실행 (Gemini 호출 검증 가능)
npm i -g vercel   # 최초 1회
vercel link       # 프로젝트 연결 (1회)
vercel env pull .env.local   # 대시보드 env를 로컬에 복사
vercel dev        # http://localhost:3000 (/api/* 동작)
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
4. **Environment Variables** 추가 (`.env.example` 참고):
   - `GEMINI_API_KEY` (필수) — https://aistudio.google.com/app/apikey 에서 발급
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (선택, rate limit) — https://console.upstash.com/ 무료 가입
5. 자동 감지되는 설정 그대로 "Deploy"
6. 1~2분 후 URL 발급

### 정적 호스팅 (대안)

이제는 서버 함수가 필요하므로 정적 호스팅 단독으로는 작동하지 않음. 정적 호스팅에 프론트엔드를 올리되 `/api/gemini-html`은 별도 백엔드(Vercel·Cloudflare Workers 등)에서 호스팅한 뒤 프론트엔드의 fetch URL을 절대 경로로 교체.

## 보안 고려

- API 키는 Vercel 환경변수(`GEMINI_API_KEY`)에만 존재, 클라이언트에 노출되지 않음
- `/api/gemini-html` 엔드포인트에 IP당 분 5회·일 50회 rate limit (Upstash env 설정 시)
- 폰트·로고는 빌드 결과물에 base64 로 임베드되어 외부 노출 없음
- robots.txt 로 검색 엔진 인덱싱 차단
- URL 자체가 1차 보호 (Free Vercel 은 비밀번호 보호 미지원)

## 문서

- 모델·프롬프트 교체 시 → `docs/PROMPT_HISTORY.md` 에 변경 이력 기록
- 출력 톤 검증 → `docs/OUTPUT_SPEC.md` 시나리오 5개로 회귀 테스트
- 데이터 흐름 이해 → `docs/ARCHITECTURE.md`

## 라이선스

내부 도구 — 외부 공개·재배포 금지.
