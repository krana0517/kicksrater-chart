import { useState } from 'react';
import Link from 'next/link';
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

const menuItems = [
  { key: 'overview', label: '프로젝트 현황' },
  { key: 'category', label: '카테고리별 분석' },
  { key: 'success', label: '성공/실패 요인' },
  { key: 'trend', label: '트렌드 분석' },
];

export default function KickstarterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // 통합 필터/검색 적용 (딱 한 번만 선언)
  const filteredData = data.filter(d => {
    // ...필터 조건...
    return ...;
  });

  return (
    <div className={`${geist.className} min-h-screen flex bg-gradient-to-br from-gray-50 to-green-100 dark:from-gray-900 dark:to-gray-800`}>
      {/* 좌측 메뉴 */}
      <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 shadow-lg flex flex-col p-6">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-green-600 dark:text-green-300">
            🦄 킥스타터 대시보드
          </Link>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.key}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === item.key
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900'
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          © 2024 Kickstarter Dashboard
        </div>
      </aside>

      {/* 우측 컨텐츠 */}
      <main className="flex-1 p-10">
        {activeTab === 'overview' && (
          <section>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">프로젝트 현황</h1>
            <p className="text-gray-600 dark:text-gray-300">킥스타터 전체 프로젝트의 개요와 주요 통계를 시각화합니다.</p>
            {/* 차트, 통계 등 실제 데이터 시각화 영역 */}
            <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center text-gray-400 dark:text-gray-500">
              (여기에 전체 프로젝트 통계 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'category' && (
          <section>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">카테고리별 분석</h1>
            <p className="text-gray-600 dark:text-gray-300">카테고리별 성공률, 펀딩액, 프로젝트 수 등을 분석합니다.</p>
            <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center text-gray-400 dark:text-gray-500">
              (여기에 카테고리별 분석 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'success' && (
          <section>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">성공/실패 요인</h1>
            <p className="text-gray-600 dark:text-gray-300">프로젝트의 성공과 실패에 영향을 미치는 주요 요인을 분석합니다.</p>
            <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center text-gray-400 dark:text-gray-500">
              (여기에 성공/실패 요인 분석 결과가 들어갑니다)
            </div>
          </section>
        )}
        {activeTab === 'trend' && (
          <section>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">트렌드 분석</h1>
            <p className="text-gray-600 dark:text-gray-300">시간에 따른 프로젝트 트렌드와 변화 양상을 시각화합니다.</p>
            <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center text-gray-400 dark:text-gray-500">
              (여기에 트렌드 분석 차트/그래프가 들어갑니다)
            </div>
          </section>
        )}
      </main>
    </div>
  );
} 