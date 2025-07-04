import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import KpiCard from '../components/KpiCard';
import PledgedHistogram from '../components/PledgedHistogram';
import GoalVsPledgedChart from '../components/GoalVsPledgedChart';
import DurationBoxplot from '../components/DurationBoxplot';
import CountrySuccessMap from '../components/CountrySuccessMap';
import BackersHistogram from '../components/BackersHistogram';
import GoalBoxplot from '../components/GoalBoxplot';
import StatePieChart from '../components/StatePieChart';
import CategoryBarChart from '../components/CategoryBarChart';
import MonthlyTrend from '../components/MonthlyTrend';
import BackersVsPledgedChart from '../components/BackersVsPledgedChart';
import DashboardLayout from '../components/DashboardLayout';

// 스켈레톤 애니메이션 CSS
const skeletonStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const STATES = ['successful', 'failed', 'canceled', 'live'];
const COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'DK', 'IE', 'NZ', 'MX', 'SG', 'HK', 'JP', 'AT', 'BE', 'CH', 'NO'];

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

// 국가 코드 → 이모지 변환 함수 추가
function countryCodeToEmoji(countryCode: string) {
  if (!countryCode) return '';
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryTab, setCategoryTab] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'success' | 'pledged' | 'backers'>('success');
  const [columnCount] = useState(5); // 고정 5단
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // 서버 페이징 관련 상태
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const limit = 20;

  // 데이터 fetch 함수
  const fetchProjects = async (reset = false) => {
    setLoading(true);
    let url = `/api/kickstarter?limit=${limit}&offset=${reset ? 0 : offset}`;
    if (state) url += `&state=${state}`;
    if (country) url += `&country=${country}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryTab !== 'ALL') url += `&category=${encodeURIComponent(categoryTab)}`;
    url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    
    const res = await fetch(url);
    const json = await res.json();
    setPagination(json.pagination);
    
    if (reset) {
      setData(json.data || []);
      setOffset(limit);
      setHasMore(json.pagination?.hasNextPage ?? false);
    } else {
      setData(prev => [...prev, ...(json.data || [])]);
      setOffset(prev => prev + limit);
      setHasMore(json.pagination?.hasNextPage ?? false);
    }
    setLoading(false);
  };

  // 최초 및 필터 변경 시 초기화 fetch
  useEffect(() => {
    setOffset(0);
    fetchProjects(true);
  }, [state, country, search, categoryTab, sortBy, sortOrder]);

  // 상위 카테고리 추출 함수
  function getParentCategoryName(category: any) {
    try {
      const obj = JSON.parse(category);
      return obj.parent_name || obj.name || '기타';
    } catch {
      return '기타';
    }
  }

  // 전체 카테고리 목록을 가져오는 함수
  const fetchAllCategories = async () => {
    const res = await fetch('/api/kickstarter?info=dateRange');
    const json = await res.json();
    // 전체 데이터에서 카테고리 추출 (임시로 1000개만 가져와서 카테고리 추출)
    const tempRes = await fetch('/api/kickstarter?limit=1000');
    const tempJson = await tempRes.json();
    const categories = Array.from(new Set(
      tempJson.data.map((d: any) => getParentCategoryName(d.category))
    )).sort() as string[];
    setAllCategories(categories);
  };

  // 최초 로딩 시 카테고리 목록 가져오기
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // 탭용 카테고리 목록 (ALL 포함)
  const tabCategories = ['ALL', ...allCategories];

  // 무한 스크롤 로드 더 함수
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProjects();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 스켈레톤 애니메이션 CSS 주입 */}
      <style dangerouslySetInnerHTML={{ __html: skeletonStyles }} />
      
      {/* Sidebar */}
      <aside style={{ width: 100, minWidth: 100, height: '100vh', position: 'sticky', top: 0, left: 0, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.7)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.3)', padding: '32px 16px', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <span style={{ fontSize: 32 }}>🌊</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: -0.5, textAlign: 'center', lineHeight: 1.2 }}>Kickstarter<br />Dashboard</span>
        </div>
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'kpi', label: '📊', title: 'KPI' },
              { id: 'pledged', label: '💰', title: '모금률' },
              { id: 'backers', label: '👥', title: '후원자 수' },
              { id: 'goal', label: '🎯', title: '목표 금액' },
              { id: 'duration', label: '⏱️', title: '기간' },
              { id: 'goalvsp', label: '📈', title: '목표 vs 모금' },
              { id: 'backersvsp', label: '📊', title: '후원자 vs 모금' },
              { id: 'state', label: '🍰', title: '상태 비율' },
              { id: 'category', label: '🏷️', title: '카테고리' },
              { id: 'country', label: '🌍', title: '국가별' },
              { id: 'monthly', label: '📅', title: '월별 트렌드' },
            ].map(sec => (
              <li key={sec.id} style={{ marginBottom: 8 }}>
                <a href={`#${sec.id}`} title={sec.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px', borderRadius: 8, color: '#374151', fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s', fontSize: 18 }} onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', fontSize: 10, color: '#9ca3af', paddingTop: 32, textAlign: 'center' }}>Inspired by<br />Toss UI</div>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, overflowX: 'auto', padding: 32, background: '#efefef' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Kickstarter Analytics Dashboard</h1>
        {/* 검색/필터 UI - 간소화 */}
        <div style={{ position: 'relative', width: 320, margin: '0 auto 32px' }}>
          <input
            type="text"
            placeholder="프로젝트명 검색 (예: game, music...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 48px 14px 20px', borderRadius: 24, border: '1px solid #e5e7eb', fontSize: 18, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          />
          <span style={{ position: 'absolute', right: 18, top: 13, color: '#9ca3af', fontSize: 20 }}>🔍</span>
        </div>
        {/* 추천 프로젝트 카드 - 사선 배치 */}
        <div style={{ margin: '0 auto 40px', maxWidth: 1600 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* 카테고리 탭 */}
              {tabCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryTab(cat)}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 999,
                    border: 'none',
                    background: categoryTab === cat ? '#2563eb' : '#e5e7eb',
                    color: categoryTab === cat ? '#fff' : '#374151',
                    fontWeight: categoryTab === cat ? 600 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.18s',
                  }}
                >
                  {cat === 'ALL' ? '전체' : cat}
                </button>
              ))}
            </div>
            {/* 정렬 드롭다운 */}
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'success' | 'pledged' | 'backers')} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 15, border: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600 }}>
                <option value="success">성공 우선</option>
                <option value="date">날짜순</option>
                <option value="pledged">모금액순</option>
                <option value="backers">후원자순</option>
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 15, border: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600 }}>
                <option value="desc">내림차순</option>
                <option value="asc">오름차순</option>
              </select>
            </div>
          </div>

          {/* 로딩 상태 표시 */}
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '60px 20px',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  border: '3px solid #e5e7eb', 
                  borderTop: '3px solid #2563eb', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}></div>
                <p style={{ color: '#6b7280', fontSize: 16, margin: 0 }}>데이터를 불러오는 중...</p>
                <p style={{ color: '#9ca3af', fontSize: 14, margin: '8px 0 0 0' }}>최대 500개 프로젝트 로딩 중</p>
              </div>
            </div>
          )}

          {/* Pinterest 스타일 Masonry 레이아웃 */}
          <div style={{ 
            columnCount: columnCount,
            columnGap: 10,
            columnFill: 'balance',
            margin: '0 auto',
            width: '100%'
          }}>
            {data.map((d, i) => {
              // 프로젝트 기간 계산 - 1970년대 날짜 처리
              let period = '';
              try {
                const start = new Date(Number(d.launched_at) * 1000);
                const end = new Date(Number(d.deadline) * 1000);
                
                // 1970년대 날짜인 경우 (아직 시작되지 않은 프로젝트)
                if (start.getFullYear() < 1980 || end.getFullYear() < 1980) {
                  if (d.state === 'submitted' || d.is_launched === 'false') {
                    period = '오픈 예정';
                  } else {
                    period = '날짜 미정';
                  }
                } else {
                  period = `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()} ~ ${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`;
                }
              } catch { 
                period = '날짜 정보 없음'; 
              }
              
              // 1인당 후원금 계산
              const perBacker = d.backers_count && Number(d.backers_count) > 0 ? Math.round(Number(d.pledged) / Number(d.backers_count)) : 0;
              
              // 설명 텍스트 길이에 따른 높이 조정
              const descriptionLength = d.blurb ? d.blurb.length : 0;
              // 프로젝트 ID 기반 일관된 랜덤 높이 생성 (320px ~ 480px 범위)
              const seed = d.id ? parseInt(d.id.toString().slice(-3)) : 0;
              const randomHeight = 320 + (seed % 161); // 320 ~ 480 범위
              
              // 설명 텍스트 길이에 따른 추가 높이 계산
              const textLengthFactor = Math.min(descriptionLength / 100, 2); // 최대 2배까지
              const additionalHeight = textLengthFactor * 60; // 텍스트 길이당 최대 60px 추가
              
              const cardHeight = Math.min(randomHeight + additionalHeight, 600); // 최대 600px로 제한
              
              // 카드 높이에 따른 태그 위치 조정
              const isTallCard = cardHeight > 400;
              const tagTopPosition = isTallCard ? 60 : 20; // 높은 카드는 더 아래에 배치
              
              // 카드 높이에 따른 동적 위치 계산
              const dynamicTagTop = Math.min(80, Math.max(20, cardHeight * 0.15)); // 카드 높이의 15%, 최소 20px, 최대 80px
              const dynamicTagBottom = Math.min(80, Math.max(20, cardHeight * 0.15)); // 카드 높이의 15%, 최소 20px, 최대 80px
              
              return (
                <div
                  key={d.id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    height: cardHeight,
                    width: '100%',
                    breakInside: 'avoid',
                    marginBottom: 16,
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)',
                    border: 'none',
                    boxShadow: hoveredCard === d.id 
                      ? '0 2px 12px rgba(0,0,0,0.06)' 
                      : '0 2px 12px rgba(0,0,0,0.06)',
                    animation: 'fadeInUp 0.6s ease-out'
                  }}
                  onMouseEnter={() => setHoveredCard(d.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={`/project-detail?id=${d.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* 배경 이미지 */}
                    {d.photo && d.photo !== '{}' && (() => { 
                      try { 
                        const p = JSON.parse(d.photo); 
                        return p.full ? (
                          <div style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%', 
                            height: '100%',
                            backgroundImage: `url(${p.full})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: hoveredCard === d.id ? 'brightness(0.6) blur(3px)' : 'brightness(0.9)',
                            transition: 'filter 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 1,
                            willChange: 'filter'
                          }} />
                        ) : null; 
                      } catch { 
                        return null; 
                      } 
                    })()}
                    
                    {/* 그라데이션 오버레이 */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: hoveredCard === d.id 
                        ? 'linear-gradient(180deg, rgba(75,85,99,0.05) 0%, rgba(75,85,99,0.15) 40%, rgba(75,85,99,0.85) 100%)'
                        : 'linear-gradient(180deg, rgba(75,85,99,0.05) 0%, rgba(75,85,99,0.1) 60%, rgba(75,85,99,0.7) 100%)',
                      transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 2,
                      willChange: 'background'
                    }} />
                    
                    {/* 기본 배경 (이미지가 없는 경우) */}
                    {(!d.photo || d.photo === '{}') && (
                      <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        zIndex: 1
                      }} />
                    )}
                    
                    {/* 카드 내용 */}
                    <div style={{ 
                      padding: 20, 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative',
                      zIndex: 3,
                      color: '#fff',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}>
                      {/* 상단 영역 - 태그+제목+설명 (column-reverse) */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        paddingTop: 0,
                        paddingBottom: 0,
                        transition: 'none',
                        gap: 12
                      }}>
                        {/* 제목+설명 - 호버 시에만 표시 */}
                        <div style={{
                          opacity: hoveredCard === d.id ? 1 : 0,
                          transform: hoveredCard === d.id ? 'translateY(0)' : 'translateY(15px)',
                          transition: 'opacity 0.25s, transform 0.25s',
                          willChange: 'opacity, transform',
                          width: '100%'
                        }}>
                          <h3 style={{
                            fontWeight: 700,
                            fontSize: 22,
                            marginBottom: 10,
                            lineHeight: 1.3,
                            color: '#fff'
                          }}>{d.name}</h3>
                          <p style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: 15,
                            lineHeight: 1.7,
                            marginBottom: 0,
                            maxHeight: `${Math.min(cardHeight * 0.4, 120)}px`, // 카드 높이의 40%, 최대 120px
                            overflow: 'hidden'
                          }}>{d.blurb}</p>
                        </div>
                        {/* 태그 - 호버 시에만 표시 */}
                        <div style={{
                          display: 'flex',
                          gap: 8,
                          flexWrap: 'wrap',
                          opacity: hoveredCard === d.id ? 1 : 0,
                          transform: hoveredCard === d.id ? 'translateY(0)' : 'translateY(15px)',
                          transition: 'opacity 0.25s, transform 0.25s',
                          willChange: 'opacity, transform',
                          width: '100%'
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 20, background: '#2563eb', color: '#fff', border: '1px solid #2563eb', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}>{getParentCategoryName(d.category)}</span>
                          {d.state !== 'submitted' && (
                            <span style={{ fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 20, background: d.state === 'successful' ? '#22c55e' : d.state === 'live' ? '#3b82f6' : d.state === 'canceled' ? '#6b7280' : '#ef4444', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{d.state === 'successful' ? '성공' : d.state === 'live' ? '진행중' : d.state === 'canceled' ? '취소' : '실패'}</span>
                          )}
                          {d.staff_pick === 'true' && (
                            <span style={{ fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 20, background: '#fbbf24', color: '#000', border: '1px solid #fbbf24', boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)' }}>Project We Love</span>
                          )}
                        </div>
                      </div>
                      
                      {/* 정보 영역 */}
                      <div style={{
                        opacity: hoveredCard === d.id ? 1 : 0,
                        transform: hoveredCard === d.id ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'opacity 0.25s, transform 0.25s',
                        marginTop: 'auto',
                        willChange: 'opacity, transform',
                        background: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        color: '#fff'
                      }}>
                        {/* 금액 정보 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <span style={{ fontSize: 20 }}>
                            {countryCodeToEmoji(d.country)}
                          </span>
                          <span style={{ fontSize: 12, color: '#888', background: '#fff', borderRadius: 8, padding: '2px 8px', border: '1px solid #eee' }}>
                            {d.country_displayable_name || d.country}
                          </span>
                        </div>
                        <div style={{ fontSize: 16, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>목표: <b style={{ color: '#fff' }}>${Number(d.goal).toLocaleString()}</b></span>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>|</span>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>모금: <b style={{ color: '#fff' }}>${Number(d.pledged).toLocaleString()}</b></span>
                        </div>
                        {/* 후원자 정보 */}
                        <div style={{ fontSize: 16, color: '#60a5fa', fontWeight: 600, marginBottom: 8 }}>
                          후원자 {Number(d.backers_count).toLocaleString()}명
                        </div>
                        {/* 기간 */}
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                          {period}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
            
            {/* 무한 스크롤 트리거 */}
            <InfiniteScroll
              dataLength={data.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div style={{ 
                  columnCount: columnCount,
                  columnGap: 10,
                  columnFill: 'balance',
                  margin: '0 auto',
                  width: '100%'
                }}>
                  {/* 스켈레톤 로딩 카드들 - 기존 카드들과 자연스럽게 연결 */}
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      style={{
                        background: '#f8f9fa',
                        borderRadius: 16,
                        height: 320 + (index % 3) * 80, // 다양한 높이
                        width: '100%',
                        breakInside: 'avoid',
                        marginBottom: 16,
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.4s ease-out'
                      }}
                    >
                      {/* 스켈레톤 애니메이션 */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: 16
                      }} />
                      
                      {/* 스켈레톤 내용 구조 */}
                      <div style={{ padding: 20, position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                          height: 20, 
                          background: 'rgba(255,255,255,0.8)', 
                          borderRadius: 4, 
                          marginBottom: 12,
                          width: '80%'
                        }} />
                        <div style={{ 
                          height: 16, 
                          background: 'rgba(255,255,255,0.6)', 
                          borderRadius: 4, 
                          marginBottom: 8,
                          width: '60%'
                        }} />
                        <div style={{ 
                          height: 16, 
                          background: 'rgba(255,255,255,0.6)', 
                          borderRadius: 4, 
                          marginBottom: 8,
                          width: '40%'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              }
              endMessage={
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#6b7280',
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  margin: '20px 0'
                }}>
                  <p style={{ margin: 0, fontSize: 16 }}>
                    {categoryTab === 'ALL' ? '🎉 모든 랜덤 프로젝트를 확인했습니다!' : '🎉 모든 프로젝트를 확인했습니다!'}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#9ca3af' }}>
                    총 {data.length}개의 프로젝트
                  </p>
                </div>
              }
              style={{ overflow: 'visible' }}
            >
              <div style={{ height: 1 }} />
            </InfiniteScroll>
          </div>
        </div>
        {/* 차트 섹션들 임시 주석처리
        <div style={{ margin: '0 auto', maxWidth: 1600 }}>
          <section id="kpi" style={{ marginBottom: 48 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <KpiCard data={data} loading={loading} />
            </div>
          </section>
          <section id="pledged" style={{ marginBottom: 48 }}>
            <PledgedHistogram data={data} loading={loading} />
          </section>
          <section id="backers" style={{ marginBottom: 48 }}>
            <BackersHistogram data={data} loading={loading} />
          </section>
          <section id="goal" style={{ marginBottom: 48 }}>
            <GoalBoxplot data={data} loading={loading} />
          </section>
          <section id="duration" style={{ marginBottom: 48 }}>
            <DurationBoxplot data={data} loading={loading} />
          </section>
          <section id="goalvsp" style={{ marginBottom: 48 }}>
            <GoalVsPledgedChart data={data} loading={loading} />
          </section>
          <section id="backersvsp" style={{ marginBottom: 48 }}>
            <BackersVsPledgedChart data={data} loading={loading} />
          </section>
          <section id="state" style={{ marginBottom: 48 }}>
            <StatePieChart data={data} loading={loading} />
          </section>
          <section id="category" style={{ marginBottom: 48 }}>
            <CategoryBarChart data={data} loading={loading} />
          </section>
          <section id="country" style={{ marginBottom: 48 }}>
            <CountrySuccessMap data={data} loading={loading} />
          </section>
          <section id="monthly" style={{ marginBottom: 48 }}>
            <MonthlyTrend data={data} loading={loading} />
          </section>
        </div>
        */}
      </main>
    </div>
  );
} 