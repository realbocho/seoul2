# 서울 추천 장소 지도

서울 지역의 추천 장소를 관리하고 지도에 표시하는 풀스택 웹 애플리케이션입니다.

## 기능

- **서울 지역 지도**: 카카오맵 API를 사용하여 서울 지역 지도를 표시합니다.
- **장소 추천**: 사용자가 장소명과 추천 사유를 입력하여 장소를 추천할 수 있습니다.
- **추천 현황 표시**:
  - **5개 이상 추천**: 일반 마커로 표시되며, 클릭 시 추천 사유 목록이 표시됩니다.
  - **5개 미만 추천**: 투명하게 표시됩니다.
- **데이터 저장**: 추천 데이터는 SQLite 데이터베이스에 저장되어 모든 사용자와 공유됩니다.
- **실시간 업데이트**: 다른 사용자가 입력한 추천도 30초마다 자동으로 업데이트됩니다.

## 설치 및 실행

### 사전 요구사항

- Node.js (v14 이상)
- npm

### 설치

```bash
npm install
```

### 서버 실행

```bash
npm start
```

서버가 실행되면 브라우저에서 `http://localhost:3000`에 접속하세요.

## 사용 방법

1. 서버를 실행한 후 브라우저에서 `http://localhost:3000`에 접속합니다.
2. 좌측 사이드바에서 장소명과 추천 사유를 입력하고 "추천하기" 버튼을 클릭합니다.
3. 추천이 5개 이상인 장소는 지도에 마커로 표시됩니다.
4. 마커를 클릭하면 해당 장소의 추천 사유 목록을 확인할 수 있습니다.
5. 다른 사용자가 입력한 추천도 30초마다 자동으로 업데이트됩니다.

## 파일 구조

```
.
├── server.js          # Express 서버 (백엔드)
├── package.json       # Node.js 의존성
├── recommendations.db # SQLite 데이터베이스 (자동 생성)
├── public/           # 프론트엔드 파일
│   ├── index.html    # 메인 HTML 파일
│   ├── style.css     # 스타일시트
│   └── script.js     # JavaScript 로직 및 카카오맵 API 연동
└── README.md         # 프로젝트 설명
```

## API 엔드포인트

- `GET /api/recommendations`: 모든 추천 장소 조회
- `POST /api/recommendations`: 새로운 추천 추가

## 기술 스택

### 백엔드
- Node.js
- Express.js
- SQLite3

### 프론트엔드
- HTML5
- CSS3
- JavaScript (Vanilla)
- 카카오맵 API (JavaScript Key: cbbb536047b180ef5a78cc84146a49f5)

## 배포

### Vercel에 배포 (권장)

1. [Vercel](https://vercel.com)에 가입/로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 자동으로 배포됨

자세한 배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

### 중요: 카카오맵 API 키 설정

배포 후 카카오 개발자 콘솔에서 배포된 도메인을 등록해야 합니다:

1. [카카오 개발자 콘솔](https://developers.kakao.com) 접속
2. 애플리케이션 설정 → 플랫폼 → Web 플랫폼 등록
3. 사이트 도메인에 배포된 URL 추가 (예: `https://your-project.vercel.app`)

## 라이선스

ISC

