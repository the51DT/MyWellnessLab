# myWellness LAB Frontend

Amway myWellness LAB Vue 3 + Vite 프론트엔드 프로젝트입니다.

## 요구 사항

- Node.js 18 이상 (권장: 20 LTS)
- npm 9 이상

## 시작하기

```bash
# 1. 저장소 클론
git clone <repository-url>
cd akl-mywellnesslab-front-preDev

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

- **서비스 인트로:** https://localhost:444/intro (443 포트 사용 중이면 444로 자동 변경)
- **퍼블리싱 목록 (로그인 불필요):** https://localhost:444/publishing

> `npm run dev`는 HTTPS로 실행됩니다. 최초 실행 시 `vite-plugin-mkcert`가 로컬 인증서를 생성할 수 있습니다.

## npm scripts

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (`.env.development`) |
| `npm run local` | 로컬 모드 (`.env.dev.local` 필요 시) |
| `npm run build` | 프로덕션 빌드 |
| `npm run build:dev` | 스테이징 빌드 |
| `npm run build:prod` | 운영 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 환경 변수

| 파일 | 용도 |
|------|------|
| `.env` | 공통 설정 |
| `.env.development` | `npm run dev` |
| `.env.staging` | `npm run build:dev` |
| `.env.production` | `npm run build:prod` |
| `.env.publishing` | 퍼블리싱 빌드 |

개인/로컬 전용 값은 `.env.local`, `.env.*.local` 파일에 넣으세요. (Git 제외)

## 퍼블리싱 화면 보기

로그인 없이 UI 목업을 확인할 수 있습니다.

1. https://localhost:444/publishing 접속
2. **리스트** 탭에서 원하는 화면 링크 클릭

주요 경로:

- `/publishing/home` — 홈
- `/publishing/home/intro` — 인트로
- `/publishing/analyze` — 분석
- `/publishing/checkup-input/checkup-basics` — 설문
- `/publishing/my-page/pub-my-page` — 마이페이지

## 프로젝트 구조

```
src/
├── views/publishing/   # 퍼블리싱(목업) 화면
├── views/              # 실제 서비스 화면
├── router/             # Vue Router
├── store/              # Vuex
├── apis/               # API 호출
└── assets/             # CSS, 이미지 등
```

## GitHub에 올릴 때

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <repository-url>
git push -u origin main
```

## 참고

- 개발 API: `https://mywellnesslab.dev.amway.co.kr`
- Amway UAT 로그인: `https://uat.amway.co.kr/login`
- 443 포트가 이미 사용 중이면 Vite가 다른 포트(예: 444)를 사용합니다.
