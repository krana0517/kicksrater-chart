import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

function getCategoryName(category: string) {
  try {
    const obj = JSON.parse(category);
    return obj.name || '기타';
  } catch {
    return '기타';
  }
}

export default function CategoryBarChart({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const catStats: Record<string, { total: number; success: number }> = {};
  data.forEach(d => {
    const name = getCategoryName(d.category);
    if (!catStats[name]) catStats[name] = { total: 0, success: 0 };
    catStats[name].total++;
    if (d.state === 'successful') catStats[name].success++;
  });
  const cats = Object.keys(catStats);
  const totals = cats.map(c => catStats[c].total);
  const rates = cats.map(c => catStats[c].total ? catStats[c].success / catStats[c].total * 100 : 0);
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">카테고리별 프로젝트 수/성공률</div>
      <Plot
        data={[
          {
            x: cats,
            y: totals,
            type: 'bar',
            name: '프로젝트 수',
            marker: { color: '#60a5fa' },
          },
          {
            x: cats,
            y: rates,
            type: 'bar',
            name: '성공률(%)',
            marker: { color: '#34d399' },
            yaxis: 'y2',
          },
        ]}
        layout={{
          barmode: 'group',
          margin: { t: 30, l: 40, r: 10, b: 80 },
          xaxis: { title: '카테고리', tickangle: -45 },
          yaxis: { title: '프로젝트 수' },
          yaxis2: {
            title: '성공률(%)',
            overlaying: 'y',
            side: 'right',
            showgrid: false,
          },
          legend: { orientation: 'h', y: -0.3 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { family: 'inherit' },
        }}
        style={{ width: '100%', height: '320px' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
} 