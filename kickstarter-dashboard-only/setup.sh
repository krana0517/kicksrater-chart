#!/bin/bash

echo "🚀 Kickstarter Dashboard 설정을 시작합니다..."

# Node.js 버전 확인
echo "📋 Node.js 버전 확인 중..."
node --version
npm --version

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 개발 서버 실행
echo "🌐 개발 서버를 시작합니다..."
echo "브라우저에서 http://localhost:3000 을 열어주세요."
echo "서버를 중지하려면 Ctrl+C를 누르세요."
echo ""

npm run dev 