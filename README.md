# Kickstarter 프로젝트 대시보드

Kickstarter 프로젝트 데이터를 활용한 인터랙티브 대시보드입니다. Pinterest 스타일의 Masonry 레이아웃과 무한 스크롤을 통해 프로젝트들을 탐색할 수 있습니다.

## 🚀 주요 기능

- **Pinterest 스타일 UI**: Masonry 레이아웃으로 카드 배치
- **무한 스크롤**: 자연스러운 스크롤 경험
- **카테고리 필터링**: 프로젝트 카테고리별 탐색
- **상세 페이지**: 각 프로젝트의 상세 정보 확인
- **국가별 태그**: 이모지 국기로 프로젝트 출신국 표시
- **반응형 디자인**: 다양한 화면 크기에 최적화

## 🛠️ 기술 스택

- **Frontend**: Next.js, React, TypeScript
- **Styling**: 인라인 스타일 (Tailwind CSS 대신)
- **Data Visualization**: Plotly.js (차트 컴포넌트)
- **Data**: CSV 파일 기반 (Kickstarter 데이터)

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone [your-repository-url]
cd weather-dashboard
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
weather-dashboard/
├── components/          # 재사용 가능한 컴포넌트들
├── data/               # CSV 데이터 파일
├── pages/              # Next.js 페이지들
│   ├── api/           # API 라우트
│   ├── dashboard.tsx  # 메인 대시보드
│   └── project-detail.tsx # 프로젝트 상세 페이지
├── public/             # 정적 파일들
└── styles/             # 스타일 파일들
```

## 🎯 주요 페이지

### 대시보드 (`/dashboard`)
- 프로젝트 카드 그리드 뷰
- 카테고리별 필터링
- 무한 스크롤
- 국가별 태그 표시

### 프로젝트 상세 (`/project-detail?id=프로젝트ID`)
- 프로젝트 상세 정보
- 목표/모집 금액
- 후원자 수
- 프로젝트 기간
- Kickstarter 링크

## 🔧 API 엔드포인트

- `GET /api/kickstarter` - 프로젝트 목록 조회
- `GET /api/kickstarter?id=프로젝트ID` - 특정 프로젝트 조회

## 📊 데이터 소스

Kickstarter 프로젝트 데이터를 CSV 파일로 관리하며, 다음과 같은 정보를 포함합니다:
- 프로젝트 기본 정보 (제목, 설명, 이미지)
- 금융 정보 (목표금액, 모집금액, 후원자 수)
- 카테고리 및 상태 정보
- 국가 및 날짜 정보

## 🚀 배포

### Vercel 배포 (추천)
1. GitHub 저장소와 Vercel 계정 연결
2. 자동 배포 설정
3. 코드 푸시 시 자동 업데이트

### 로컬 빌드
```bash
npm run build
npm start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
