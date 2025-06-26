import React, { ReactNode } from 'react';

const SECTIONS = [
  { id: 'kpi', label: 'KPI' },
  { id: 'pledged', label: '모금률' },
  { id: 'backers', label: '후원자 수' },
  { id: 'goal', label: '목표 금액' },
  { id: 'duration', label: '기간' },
  { id: 'goalvsp', label: '목표 vs 모금' },
  { id: 'backersvsp', label: '후원자 vs 모금' },
  { id: 'state', label: '상태 비율' },
  { id: 'category', label: '카테고리' },
  { id: 'country', label: '국가별' },
  { id: 'monthly', label: '월별 트렌드' },
];

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-gray-300">
      <aside className="w-64 min-w-64 h-screen sticky top-0 left-0 flex flex-col glass shadow-xl z-10 px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🌊</span>
          <span className="text-2xl font-bold tracking-tight">Kickstarter<br/>Dashboard</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {SECTIONS.map(sec => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="block px-3 py-2 rounded-lg hover:bg-blue-100/60 font-medium text-gray-700 transition-colors">
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-xs text-gray-400 pt-8">Inspired by Toss Dashboard UI</div>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">
        {children}
      </main>
    </div>
  );
} 