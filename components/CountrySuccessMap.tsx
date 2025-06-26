import React from 'react';

type Props = {
  data: any[];
  loading: boolean;
};

// 국가 코드에 맞는 이모지 플래그 반환
function countryFlag(code: string) {
  if (!code) return '🏳️';
  // ISO 3166-1 alpha-2 국가코드를 이모지 플래그로 변환
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export default function CountrySuccessMap({ data, loading }: Props) {
  if (loading) return <div className="glass p-6">로딩 중...</div>;
  if (!data || data.length === 0) return <div className="glass p-6">데이터 없음</div>;
  const countryStats: Record<string, { total: number; success: number }> = {};
  data.forEach(d => {
    if (!countryStats[d.country]) countryStats[d.country] = { total: 0, success: 0 };
    countryStats[d.country].total++;
    if (d.state === 'successful') countryStats[d.country].success++;
  });
  const countries = Object.keys(countryStats);
  const rates = countries.map(c => ({
    code: c,
    rate: countryStats[c].total ? countryStats[c].success / countryStats[c].total * 100 : 0,
    total: countryStats[c].total,
  }));
  // 성공률 상위 5개 국가 추출
  const top5 = rates
    .filter(r => r.total > 10) // 표본이 너무 적은 국가는 제외
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);
  return (
    <div className="glass p-6">
      <div className="font-semibold mb-2">성공률 TOP 5 국가</div>
      <ul className="space-y-2">
        {top5.map((c, i) => (
          <li key={c.code} className="flex items-center gap-3 text-lg">
            <span className="text-2xl">{countryFlag(c.code)}</span>
            <span className="font-bold">{c.code}</span>
            <span className="text-gray-500">({c.total.toLocaleString()}건)</span>
            <span className="ml-auto text-xl font-bold">{c.rate.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 