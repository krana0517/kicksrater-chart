import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

function getMonth(ts: string) {
  const d = new Date(Number(ts) * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function MonthlyTrend({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const monthStats: Record<string, { total: number; success: number }> = {};
  data.forEach(d => {
    const m = getMonth(d.launched_at);
    if (!monthStats[m]) monthStats[m] = { total: 0, success: 0 };
    monthStats[m].total++;
    if (d.state === 'successful') monthStats[m].success++;
  });
  const months = Object.keys(monthStats).sort();
  const totals = months.map(m => monthStats[m].total);
  const rates = months.map(m => monthStats[m].total ? monthStats[m].success / monthStats[m].total * 100 : 0);
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">월별 프로젝트 수/성공률</div>
      <Plot
        data={[
          {
            x: months,
            y: totals,
            type: 'bar',
            name: '프로젝트 수',
            marker: { color: '#818cf8' },
          },
          {
            x: months,
            y: rates,
            type: 'scatter',
            mode: 'lines+markers',
            name: '성공률(%)',
            marker: { color: '#34d399' },
            yaxis: 'y2',
          },
        ]}
        layout={{
          margin: { t: 30, l: 40, r: 10, b: 80 },
          xaxis: { title: '월', tickangle: -45 },
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