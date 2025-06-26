import { useState } from 'react';
import Link from 'next/link';
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

// 메뉴 아이콘만 (이모지 예시)
const menuItems = [
  { key: 'overview', label: '프로젝트 현황', icon: '📊' },
  { key: 'category', label: '카테고리별 분석', icon: '🗂️' },
  { key: 'success', label: '성공/실패 요인', icon: '🎯' },
  { key: 'trend', label: '트렌드 분석', icon: '📈' },
];

// 색상 상수
const BG_COLOR = '#efefef';
const TEXT_COLOR = '#282828';
const POINT_COLOR = '#05ce78'; // 킥스타터 초록

export default function Kickstarter() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`${geist.className} min-h-screen flex`} style={{ background: BG_COLOR }}>
      {/* 좌측 메뉴 (아이콘만) */}
      <aside
        className="w-20 min-h-screen flex flex-col items-center py-8 shadow-lg"
        style={{ background: '#fff', color: TEXT_COLOR }}
      >
        <div className="mb-12">
          <Link href="/" className="text-lg font-extrabold tracking-widest" style={{ color: POINT_COLOR }}>
            KICKSTARTER<br />DATABASE
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-6 items-center justify-center w-full">
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-colors ${
                activeTab === item.key
                  ? ''
                  : 'hover:bg-[#f3f3f3]'
              }`}
              style={{
                background: activeTab === item.key ? POINT_COLOR : 'transparent',
                color: activeTab === item.key ? '#fff' : TEXT_COLOR,
                border: activeTab === item.key ? `2px solid ${POINT_COLOR}` : '2px solid transparent',
                fontWeight: activeTab === item.key ? 700 : 400
              }}
              onClick={() => setActiveTab(item.key)}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>
        <div className="mt-12 text-[10px] text-gray-400">
          © 2024 Kickstarter DB
        </div>
      </aside>

      {/* 우측 컨텐츠 */}
      <main className="flex-1 p-10" style={{ color: TEXT_COLOR }}>
        {activeTab === 'overview' && (
          <section>
            <h1 className="text-3xl font-bold mb-4" style={{ color: TEXT_COLOR }}>프로젝트 현황</h1>
            <p className="mb-8" style={{ color: '#555' }}>킥스타터 전체 프로젝트의 개요와 주요 통계를 시각화합니다.</p>
            <div className="p-8 bg-white rounded-lg shadow text-center text-gray-400" style={{ color: '#aaa' }}>
              (여기에 전체 프로젝트 통계 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'category' && (
          <section>
            <h1 className="text-3xl font-bold mb-4" style={{ color: TEXT_COLOR }}>카테고리별 분석</h1>
            <p className="mb-8" style={{ color: '#555' }}>카테고리별 성공률, 펀딩액, 프로젝트 수 등을 분석합니다.</p>
            <div className="p-8 bg-white rounded-lg shadow text-center text-gray-400" style={{ color: '#aaa' }}>
              (여기에 카테고리별 분석 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'success' && (
          <section>
            <h1 className="text-3xl font-bold mb-4" style={{ color: TEXT_COLOR }}>성공/실패 요인</h1>
            <p className="mb-8" style={{ color: '#555' }}>프로젝트의 성공과 실패에 영향을 미치는 주요 요인을 분석합니다.</p>
            <div className="p-8 bg-white rounded-lg shadow text-center text-gray-400" style={{ color: '#aaa' }}>
              (여기에 성공/실패 요인 분석 결과가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'trend' && (
          <section>
            <h1 className="text-3xl font-bold mb-4" style={{ color: TEXT_COLOR }}>트렌드 분석</h1>
            <p className="mb-8" style={{ color: '#555' }}>시간에 따른 프로젝트 트렌드와 변화 양상을 시각화합니다.</p>
            <div className="p-8 bg-white rounded-lg shadow text-center text-gray-400" style={{ color: '#aaa' }}>
              (여기에 트렌드 분석 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
      </main>
    </div>
  );
} 