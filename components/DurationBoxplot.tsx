import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

function getDurationDays(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
}

export default function DurationBoxplot({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const durations = data.map(d => getDurationDays(d.launched, d.deadline)).filter(d => isFinite(d));
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">프로젝트 기간 (일)</div>
      <Plot
        data={[{
          y: durations,
          type: 'box',
          marker: { color: '#f472b6' },
          boxpoints: 'outliers',
        }]}
        layout={{
          margin: { t: 30, l: 40, r: 10, b: 40 },
          yaxis: { title: '일' },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { family: 'inherit' },
        }}
        style={{ width: '100%', height: '260px' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
} 