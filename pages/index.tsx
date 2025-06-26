import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [activeCard, setActiveCard] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>SALES JAPAN - 일본 진출 전문 컨설팅</title>
        <meta name="description" content="일본 진출 전문 컨설팅 회사" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 헤더 */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="https://cdn.imweb.me/thumbnail/20250624/9097960687246.png" alt="SALES JAPAN" />
          </div>
          <nav className={styles.nav}>
            <ul>
              <li><a href="#opportunity">시장 기회</a></li>
              <li><a href="#solution">솔루션</a></li>
              <li><a href="#process">프로세스</a></li>
              <li><a href="#expertise">전문 분야</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <div className={styles.cta}>
            <button className={styles.consultButton}>상담하기</button>
          </div>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.subtitle}>스타트업, 중소기업, 중견기업</span>
            <br />
            <span className={styles.mainTitle}>일본 진출 왜 어려울까?</span>
          </h1>
          <p className={styles.heroDescription}>
            빠르게 변화하고 대처하는 한국에 비해<br />
            일본은 매우 신중하며 과정과 절차를 중요시 합니다.
          </p>
        </div>
      </section>

      {/* 차이점 설명 섹션 */}
      <section className={styles.differences}>
        <div className={styles.differenceItem}>
          <h2>한국과는 완전히 다른 <span className={styles.highlight}>유통과 마케팅 방식</span></h2>
          <img src="https://cdn.imweb.me/thumbnail/20250623/3c5841535b688.png" alt="유통과 마케팅 방식" />
        </div>
        <div className={styles.differenceItem}>
          <h2>한국과는 완전히 다른 <span className={styles.highlight}>제조업 문화</span></h2>
          <img src="https://cdn.imweb.me/thumbnail/20250623/66dd93bf67aa6.png" alt="제조업 문화" />
        </div>
      </section>

      {/* 성공 사례 카드 섹션 - 원본 구조 */}
      <section className={styles.successCases}>
        <div className={styles.generalContainer}>
          <input 
            className={styles.radio} 
            type="radio" 
            name="card" 
            id="card-1" 
            checked={activeCard === 1}
            onChange={() => setActiveCard(1)}
          />
          <label className={styles.content} htmlFor="card-1">
            <span className={styles.icon}>
              <img
                className={styles.fitPicture}
                src="https://cdn.imweb.me/upload/S20250610673e0fe87a538/700ef75891d20.png"
                alt="CJ 비비고"
              />
            </span>
            <div className={styles.cardTitle}>
              <span className={styles.subtitle}>K-푸드</span>
              <h3>CJ 비비고</h3>
              <p>
                비비고는 일본 시장에서 한국식 만두를 대표하는 제품으로 성공적으로 안착했습니다. 초기에는 현지 소비자에게 익숙한 물만두로 인지도를 높이고, 이후 왕교자를 출시하여 한국식 만두의 특징을 강조했습니다. 이를 통해 일본 만두 시장에서 새로운 카테고리를 개척했다는 평가를 받고 있습니다.
              </p>
              <h5>
                <span className={styles.blue}>주요 타겟</span> : 전 연령층, 간편식 선호 가구<br />
                <span className={styles.blue}>활용 이점</span> : 브랜드 파워 (한류), 대규모 생산<br />
                <span className={styles.blue}>현지화 전략</span> : 본인 입맛 맞춤, 현지 공장 설립
              </h5>
              <h5>
                <span className={styles.blue}>주요 성과</span> : 냉동김밥 연 250만개 판매, 온라인 고추장 판매 1위
              </h5>
            </div>
          </label>

          <input 
            className={styles.radio} 
            type="radio" 
            name="card" 
            id="card-2" 
            checked={activeCard === 2}
            onChange={() => setActiveCard(2)}
          />
          <label className={styles.content} htmlFor="card-2">
            <span className={styles.icon}>
              <img
                className={styles.fitPicture}
                src="https://cdn.imweb.me/upload/S20250610673e0fe87a538/4043135a6c596.png"
                alt="마뗑킴"
              />
            </span>
            <div className={styles.cardTitle}>
              <span className={styles.subtitle}>K-패션</span>
              <h3>마뗑킴</h3>
              <p>
                젋은 세대에게 각광 받는 브랜드 '마뗑킴'은 성수동 쇼룸의 데이터에 기반해 일본을 첫 해외 진출 국가로 결정했습니다. 이 과정에서 무신사와의 협업을 통해 유통망 확대, 마케팅, 팝업스토어 등을 진행했고, 현재 시부야에 오프라인 1호 매장을 오픈하며 성공적인 결과를 만들어 내고 있습니다.
              </p>
              <h5>
                <span className={styles.blue}>주요 타겟</span> : Z세대, 트렌드 민감 소비자<br />
                <span className={styles.blue}>활용 이점</span> : 속도와 민첩성, 디지털 마케팅<br />
                <span className={styles.blue}>현지화 전략</span> : 현지 팝업스토어, 남성 라인 출시
              </h5>
              <h5>
                <span className={styles.blue}>주요 성과</span> : 3일 팝업 매출 2.4억 엔, Z세대 내 높은 인지도
              </h5>
            </div>
          </label>

          <input 
            className={styles.radio} 
            type="radio" 
            name="card" 
            id="card-3" 
            checked={activeCard === 3}
            onChange={() => setActiveCard(3)}
          />
          <label className={styles.content} htmlFor="card-3">
            <span className={styles.icon}>
              <img
                className={styles.fitPicture}
                src="https://cdn.imweb.me/upload/S20250610673e0fe87a538/82c2ff3689374.png"
                alt="카카오 픽코마"
              />
            </span>
            <div className={styles.cardTitle}>
              <span className={styles.subtitle}>K-콘텐츠</span>
              <h3>카카오 픽코마</h3>
              <p>
                카카오 픽코마는 카카오의 자회사로, 일본에서 운영되는 웹툰 및 웹소설 플랫폼입니다. 2016년 4월 서비스를 시작하여 현재 일본 시장에서 디지털 만화 플랫폼 중 매출 1위를 기록하고 있으며, 카카오의 웹툰과 웹소설 IP를 일본어로 번역하여 제공하는 것이 주요 사업입니다.
              </p>
              <h5>
                <span className={styles.blue}>주요 타겟</span> : 디지털 만화 소비자<br />
                <span className={styles.blue}>활용 이점</span> : 플랫폼 장악력, 디지털 DNA<br />
                <span className={styles.blue}>현지화 전략</span> : '기다리면 무료' BM 이식, 현지 제휴
              </h5>
              <h5>
                <span className={styles.blue}>주요 성과</span> : 일본 앱마켓 매출 1위, 연 거래액 1,000억엔 돌파
              </h5>
            </div>
          </label>

          <input 
            className={styles.radio} 
            type="radio" 
            name="card" 
            id="card-4" 
            checked={activeCard === 4}
            onChange={() => setActiveCard(4)}
          />
          <label className={styles.content} htmlFor="card-4">
            <span className={styles.icon}>
              <img
                className={styles.fitPicture}
                src="https://cdn.imweb.me/upload/S20250610673e0fe87a538/76711c0425333.png"
                alt="강남언니"
              />
            </span>
            <div className={styles.cardTitle}>
              <span className={styles.subtitle}>K-메드테크</span>
              <h3>강남언니</h3>
              <p>
                강남언니는 2022년 일본 시장 진출 이후, 일본인 환자를 위한 한국 병원 유치 및 일본 현지 병원 정보 서비스를 제공하며 빠르게 성장했습니다. 2023년에는 전년 대비 8배 성장한 약 80억 원의 매출을 기록했으며, 현지 병원들과의 협력을 통해 일본 내 미용 의료 정보 플랫폼으로서 입지를 강화했습니다.
              </p>
              <h5>
                <span className={styles.blue}>주요 타겟</span> : 미용의료 정보 민감 여성<br />
                <span className={styles.blue}>활용 이점</span> : 플랫폼 장악력, 디지털 숙련도<br />
                <span className={styles.blue}>현지화 전략</span> : 현지 기업 인수, 한국=미용강국 이미지 활용
              </h5>
              <h5>
                <span className={styles.blue}>주요 성과</span> : 4년 만에 사용자 120만명, 연 매출 8배 성장
              </h5>
            </div>
          </label>
        </div>
      </section>

      {/* 솔루션 섹션 */}
      <section className={styles.solutions}>
        <div className={styles.solutionContent}>
          <h2>솔루션</h2>
          <div className={styles.solutionGrid}>
            <div className={styles.solutionCard}>
              <h3>월간 동행형 밀착 컨설팅</h3>
              <p>일회성 보고서가 아닌, 매월 기업과 함께하며 전략 실행을 점검하고 개선하는 '동반자' 방식의 밀착 지원을 제공합니다.</p>
            </div>
            <div className={styles.solutionCard}>
              <h3>즈바리(ズバリ) 솔루션</h3>
              <p>업계 관행을 넘어, 시대의 흐름에 맞춰 단기간에 비약적인 성과를 내는 '핵심 성공 모델'을 진단하고 제안합니다.</p>
            </div>
            <div className={styles.solutionCard}>
              <h3>성장실행(Growth Execution)중심</h3>
              <p>기업의 지속 가능한 성장을 위해 제2, 제3의 사업 창출, 조직 디자인, 재무 기반 강화 등 미래 전략을 함께 그립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 세토웍스 소개 섹션 */}
      <section className={styles.setoworks}>
        <div className={styles.setoworksContent}>
          <img src="https://cdn.imweb.me/upload/S20250610673e0fe87a538/421732aa9625a.png" alt="세토웍스" />
          <h2>실행 및 업무지원 : 세토웍스</h2>
          <p className={styles.setoworksSubtitle}>
            압도적 일본 프로젝트 1위<br />
            글로벌 마케팅사
          </p>
          <p className={styles.setoworksDescription}>
            1,200건 이상의 글로벌 프로젝트와 누적 520억 원 이상의 성과로 검증된 국내 1위 글로벌 마케팅 실행사입니다. 
            산업통상자원부 지정 전문무역상사로, 전략을 즉각적인 매출과 브랜드 인지도로 전환하는 압도적인 실행력을 자랑합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
