import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

export default function PledgedHistogram({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const rates = data.map(d => Number(d.pledged) / Number(d.goal)).filter(r => isFinite(r));
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">모금률 분포</div>
      <Plot
        data={[{
          x: rates,
          type: 'histogram',
          marker: { color: '#60a5fa' },
          nbinsx: 30,
        }]}
        layout={{
          margin: { t: 30, l: 40, r: 10, b: 40 },
          xaxis: { title: '모금률 (pledged/goal)' },
          yaxis: { title: '프로젝트 수' },
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