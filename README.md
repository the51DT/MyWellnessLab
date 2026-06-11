# myWellness LAB Frontend

Amway myWellness LAB Vue 3 + Vite 프론트엔드 프로젝트입니다.

## 요구 사항

- Node.js 18 이상 (권장: 20 LTS)
- npm 9 이상

## 시작하기

```bash
# 1. 저장소 클론 (기본 브랜치: master)
git clone -b master https://github.com/the51DT/MyWellnessLab.git
cd MyWellnessLab

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

`npm run dev` 실행 후 **터미널에 출력되는 Local URL**로 접속합니다. (기본 설정 포트: **443**)

```
➜  Local:   https://localhost:443/
```

443 포트가 이미 사용 중이면 Vite가 **444 등 다른 포트**를 자동으로 사용합니다. 이때는 터미널에 표시된 주소를 그대로 쓰면 됩니다.

- **서비스 인트로:** `{Local URL}/intro`
- **퍼블리싱 목록 (로그인 불필요):** `{Local URL}/publishing`

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

1. `npm run dev` 실행 후 터미널에 나온 Local URL + `/publishing` 접속
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
git init -b master
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/the51DT/MyWellnessLab.git
git push -u origin master
```

## 참고

- 개발 API: `https://mywellnesslab.dev.amway.co.kr`
- Amway UAT 로그인: `https://uat.amway.co.kr/login`
- 로컬 개발 서버 포트는 `vite.config.js`에서 **443**으로 설정되어 있습니다. 포트 충돌 시 Vite가 다른 포트를 쓰므로, 항상 터미널 출력 URL을 확인하세요.
