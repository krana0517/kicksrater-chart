# Kickstarter Analytics Dashboard

Next.js, React, Tailwind CSS, Plotly.js를 활용한 Kickstarter 프로젝트 데이터 분석 대시보드입니다.

## 🚀 주요 기능

### 📊 대시보드 기능
- **KPI 카드**: 전체 프로젝트 통계 요약
- **모금률 히스토그램**: 목표 대비 모금률 분포 분석
- **후원자 수 히스토그램**: 후원자 수 분포 분석
- **목표 금액 박스플롯**: 목표 금액별 통계 분석
- **프로젝트 기간 박스플롯**: 프로젝트 기간별 통계 분석
- **목표 vs 모금 차트**: 목표 금액과 실제 모금액 비교
- **후원자 vs 모금 차트**: 후원자 수와 모금액 관계 분석
- **상태별 파이 차트**: 프로젝트 성공/실패 비율
- **카테고리별 막대 차트**: 카테고리별 프로젝트 분포
- **국가별 성공 지도**: 국가별 프로젝트 성공률
- **월별 트렌드**: 시간별 프로젝트 트렌드 분석

### 🎨 UI/UX 특징
- **Pinterest 스타일 카드 레이아웃**: Masonry 그리드 레이아웃
- **호버 인터랙션**: 카드 호버 시 상세 정보 표시
- **반응형 디자인**: 다양한 화면 크기에 최적화
- **글래스모피즘 효과**: 현대적인 UI 디자인
- **부드러운 애니메이션**: CSS 트랜지션 효과

### 🔍 검색 및 필터링
- **프로젝트명 검색**: 실시간 검색 기능
- **카테고리별 필터링**: 상위 카테고리별 프로젝트 분류
- **정렬 옵션**: 성공률, 날짜, 모금액, 후원자 수 기준 정렬
- **상태별 필터링**: 성공/실패/진행중/취소 프로젝트 분류

## 📦 설치 및 실행

### 1. 프로젝트 압축 해제
```bash
unzip kickstarter-dashboard.zip
cd kickstarter-dashboard
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

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.3.4, React 18
- **Styling**: Tailwind CSS
- **Charts**: Plotly.js
- **Language**: TypeScript
- **Data**: CSV 파일 기반 (kickstarter.csv)

## 📁 프로젝트 구조

```
kickstarter-dashboard/
├── components/          # 차트 컴포넌트들
│   ├── KpiCard.tsx
│   ├── PledgedHistogram.tsx
│   ├── GoalVsPledgedChart.tsx
│   └── ...
├── pages/              # Next.js 페이지
│   ├── dashboard.tsx   # 메인 대시보드
│   ├── api/           # API 엔드포인트
│   └── ...
├── data/              # 데이터 파일
│   └── kickstarter.csv
├── styles/            # CSS 스타일
└── public/            # 정적 파일
```

## 🎯 주요 페이지

- **`/dashboard`**: 메인 대시보드 (카드 레이아웃 + 차트)
- **`/project-detail`**: 개별 프로젝트 상세 페이지
- **`/kickstarter-dashboard`**: 차트 전용 대시보드

## 📊 데이터 소스

- **kickstarter.csv**: Kickstarter 프로젝트 데이터
- **컬럼**: id, name, blurb, category, goal, pledged, backers_count, state, country, launched_at, deadline 등

## 🎨 디자인 특징

- **색상 팔레트**: 파란색 그라데이션 (#667eea → #764ba2)
- **카드 디자인**: 흰색 배경, 둥근 모서리, 그림자 효과
- **호버 효과**: 배경 블러, 그라데이션 오버레이, 텍스트 애니메이션
- **레이아웃**: 사이드바 네비게이션 + 메인 컨텐츠 영역

## 🔧 커스터마이징

### 색상 변경
`pages/dashboard.tsx`에서 그라데이션 색상 수정:
```tsx
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
```

### 카드 스타일 변경
카드 컴포넌트의 스타일 속성 수정

### 차트 설정 변경
각 차트 컴포넌트에서 Plotly.js 설정 수정

## 📝 라이선스

이 프로젝트는 교육 및 포트폴리오 목적으로 제작되었습니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

**개발자**: [Your Name]  
**최종 업데이트**: 2024년 6월
