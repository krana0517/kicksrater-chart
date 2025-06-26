import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  data: any[];
  loading: boolean;
};

export default function BackersVsPledgedChart({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const backers = data.map(d => Number(d.backers_count));
  const pledged = data.map(d => Number(d.pledged));
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">후원자 수 vs 모금액</div>
      <Plot
        data={[{
          x: backers,
          y: pledged,
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#f472b6', opacity: 0.5 },
        }]}
        layout={{
          margin: { t: 30, l: 40, r: 10, b: 40 },
          xaxis: { title: '후원자 수' },
          yaxis: { title: '모금액' },
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