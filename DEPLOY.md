# 배포 가이드

이 프로젝트를 웹에 배포하는 방법입니다.

## Vercel에 배포 (권장)

### 1. GitHub에 코드 푸시
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Vercel에 배포

1. [Vercel](https://vercel.com)에 가입/로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (비워둠)
   - **Output Directory**: (비워둠)
5. "Deploy" 클릭

### 3. 환경 변수 설정 (필요한 경우)

Vercel 대시보드에서 환경 변수를 설정할 수 있습니다.

### 4. 배포 완료

배포가 완료되면 `https://your-project.vercel.app` 형태의 URL이 제공됩니다.

## 주의사항

- **데이터베이스**: Vercel은 서버리스 환경이므로 데이터베이스는 `/tmp` 디렉토리에 저장됩니다. 이는 임시 저장소이므로 실제 운영 환경에서는 외부 데이터베이스 서비스(예: PostgreSQL, MongoDB)를 사용하는 것을 권장합니다.

- **카카오맵 API 키**: 카카오 개발자 콘솔에서 배포된 도메인을 등록해야 합니다.
  1. [카카오 개발자 콘솔](https://developers.kakao.com) 접속
  2. 애플리케이션 설정 → 플랫폼 → Web 플랫폼 등록
  3. 사이트 도메인에 배포된 URL 추가 (예: `https://your-project.vercel.app`)

## 다른 배포 옵션

### Railway
1. [Railway](https://railway.app)에 가입
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택 후 자동 배포

### Render
1. [Render](https://render.com)에 가입
2. "New Web Service" → GitHub 저장소 선택
3. 설정:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. 배포

### Heroku
1. [Heroku](https://heroku.com)에 가입
2. Heroku CLI 설치
3. 다음 명령어 실행:
```bash
heroku create your-app-name
git push heroku main
```

