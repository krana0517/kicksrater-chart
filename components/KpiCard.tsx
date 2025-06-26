import React from 'react';

type Props = {
  data: any[];
  loading: boolean;
};

export default function KpiCard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="glass p-6 text-center col-span-4">로딩 중...</div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="glass p-6 text-center col-span-4">데이터 없음</div>
    );
  }
  const total = data.length;
  const success = data.filter(d => d.state === 'successful').length;
  const avgGoal = data.reduce((sum, d) => sum + Number(d.goal), 0) / total;
  const avgPledged = data.reduce((sum, d) => sum + Number(d.pledged), 0) / total;
  const successRate = total ? (success / total * 100).toFixed(1) : 0;
  return (
    <>
      <div className="glass p-6 text-center">
        <div className="text-lg font-semibold">총 프로젝트</div>
        <div className="text-2xl font-bold">{total.toLocaleString()}</div>
      </div>
      <div className="glass p-6 text-center">
        <div className="text-lg font-semibold">성공률</div>
        <div className="text-2xl font-bold">{successRate}%</div>
      </div>
      <div className="glass p-6 text-center">
        <div className="text-lg font-semibold">평균 목표액</div>
        <div className="text-2xl font-bold">${avgGoal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
      </div>
      <div className="glass p-6 text-center">
        <div className="text-lg font-semibold">평균 모금액</div>
        <div className="text-2xl font-bold">${avgPledged.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
      </div>
    </>
  );
} 