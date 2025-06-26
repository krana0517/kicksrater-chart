import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

export default function StatePieChart({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const stateCounts: Record<string, number> = {};
  data.forEach(d => {
    stateCounts[d.state] = (stateCounts[d.state] || 0) + 1;
  });
  const states = Object.keys(stateCounts);
  const counts = states.map(s => stateCounts[s]);
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">프로젝트 상태 비율</div>
      <Plot
        data={[{
          values: counts,
          labels: states,
          type: 'pie',
          marker: { colors: ['#34d399', '#f87171', '#fbbf24', '#a3e635', '#60a5fa'] },
        }]}
        layout={{
          margin: { t: 30, l: 10, r: 10, b: 10 },
          showlegend: true,
          paper_bgcolor: 'rgba(0,0,0,0)',
          font: { family: 'inherit' },
        }}
        style={{ width: '100%', height: '260px' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
} 