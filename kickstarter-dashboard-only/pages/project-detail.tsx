import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProjectDetail {
  id: string;
  name: string;
  blurb: string;
  photo: string;
  goal: number;
  pledged: number;
  backers_count: number;
  state: string;
  category: string;
  created_at: string;
  launched_at: string;
  deadline: string;
  urls: string;
  staff_pick: string;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProjectDetail();
    }
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      const response = await fetch('/api/kickstarter');
      const data = await response.json();
      const projectData = data.find((p: any) => p.id === id);
      setProject(projectData);
    } catch (error) {
      console.error('프로젝트 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: 18, color: '#6b7280' }}>로딩 중...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: 18, color: '#6b7280' }}>프로젝트를 찾을 수 없습니다.</div>
        <Link href="/dashboard" style={{ 
          padding: '12px 24px', 
          background: '#2563eb', 
          color: '#fff', 
          borderRadius: 8, 
          textDecoration: 'none',
          fontWeight: 600
        }}>
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  // 프로젝트 기간 계산
  let period = '';
  try {
    const start = new Date(Number(project.launched_at) * 1000);
    const end = new Date(Number(project.deadline) * 1000);
    period = `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()} ~ ${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`;
  } catch { period = ''; }

  // 카테고리 파싱
  let categoryName = '기타';
  try {
    const categoryObj = JSON.parse(project.category);
    categoryName = categoryObj.parent_name || categoryObj.name || '기타';
  } catch { }

  // 이미지 URL 파싱
  let imageUrl = '';
  try {
    const photoObj = JSON.parse(project.photo);
    imageUrl = photoObj.full || '';
  } catch { }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
      padding: '24px'
    }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 24,
        maxWidth: 1000,
        margin: '0 auto 24px'
      }}>
        <Link href="/dashboard" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 16
        }}>
          ← 대시보드로 돌아가기
        </Link>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ 
        maxWidth: 1000, 
        margin: '0 auto',
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* 썸네일 */}
        {imageUrl && (
          <div style={{ 
            width: '100%', 
            height: 0,
            paddingBottom: '56.25%', // 16:9 비율
            background: '#f3f4f6',
            position: 'relative'
          }}>
            <img 
              src={imageUrl} 
              alt={project.name}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* 프로젝트 정보 */}
        <div style={{ padding: '32px 40px' }}>
          {/* 타이틀 */}
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            marginBottom: 16,
            color: '#1f2937',
            lineHeight: 1.3
          }}>
            {project.name}
          </h1>

          {/* 태그들 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              padding: '6px 14px', 
              borderRadius: 20, 
              background: '#2563eb', 
              color: '#fff'
            }}>
              {categoryName}
            </span>
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              padding: '6px 14px', 
              borderRadius: 20, 
              background: project.state === 'successful' ? '#22c55e' : '#ef4444', 
              color: '#fff'
            }}>
              {project.state === 'successful' ? '성공' : '실패'}
            </span>
            {project.staff_pick === 'true' && (
              <span style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                padding: '6px 14px', 
                borderRadius: 20, 
                background: '#fbbf24', 
                color: '#fff'
              }}>
                Project We Love
              </span>
            )}
          </div>

          {/* 세부 설명 */}
          <div style={{ 
            fontSize: 16, 
            lineHeight: 1.7, 
            color: '#6b7280',
            marginBottom: 32,
            maxWidth: '100%'
          }}>
            {project.blurb}
          </div>

          {/* 목표금/모집금 정보 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            marginBottom: 32
          }}>
            <div style={{ 
              background: '#f8fafc', 
              padding: 20, 
              borderRadius: 12,
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>목표 금액</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                ${Number(project.goal).toLocaleString()}
              </div>
            </div>
            <div style={{ 
              background: '#f0f9ff', 
              padding: 20, 
              borderRadius: 12,
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>모집 금액</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                ${Number(project.pledged).toLocaleString()}
              </div>
            </div>
            <div style={{ 
              background: '#f0fdf4', 
              padding: 20, 
              borderRadius: 12,
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>후원자 수</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                {Number(project.backers_count).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            fontSize: 14,
            color: '#64748b',
            marginBottom: 32
          }}>
            <div>
              <strong>프로젝트 기간:</strong> {period}
            </div>
            <div>
              <strong>1인당 후원금:</strong> ${project.backers_count && Number(project.backers_count) > 0 ? Math.round(Number(project.pledged) / Number(project.backers_count)).toLocaleString() : 0}
            </div>
          </div>

          {/* Kickstarter 링크 */}
          {project.urls && project.urls !== '{}' && (() => { 
            try { 
              const urls = JSON.parse(project.urls); 
              return urls.web && urls.web.project ? (
                <div style={{ textAlign: 'center' }}>
                  <a 
                    href={urls.web.project} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-block',
                      padding: '14px 28px',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: 10,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 15,
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                  >
                    Kickstarter에서 보기
                  </a>
                </div>
              ) : null; 
            } catch { 
              return null; 
            } 
          })()}
        </div>
      </div>
    </div>
  );
} 