import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

export default function GoalBoxplot({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const goals = data.map(d => Number(d.goal)).filter(r => isFinite(r));
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">목표 금액 박스플롯</div>
      <Plot
        data={[{
          y: goals,
          type: 'box',
          marker: { color: '#818cf8' },
          boxpoints: 'outliers',
        }]}
        layout={{
          margin: { t: 30, l: 40, r: 10, b: 40 },
          yaxis: { title: '목표 금액' },
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