import React, { useState } from 'react';

// 카드 타입 정의
interface Card {
  id: number;
  name: string;
  image: string; // 이미지 경로 또는 URL
  description: string;
}

// 플레이어 상태 타입
interface Player {
  hand: Card[];
  field: Card[];
  deck: Card[];
  name: string;
}

// 더미 카드 데이터(4종류, 40장용)
const CARD_LIBRARY: Card[] = [
  { id: 1, name: '불꽃 기사', image: '/file.svg', description: '강력한 불꽃의 힘을 지닌 기사.' },
  { id: 2, name: '얼음 마법사', image: '/globe.svg', description: '얼음을 다루는 마법사.' },
  { id: 3, name: '숲의 요정', image: '/window.svg', description: '자연과 교감하는 요정.' },
  { id: 4, name: '번개 용', image: '/vercel.svg', description: '하늘을 가르는 번개의 용.' },
];

// 40장 덱 생성 함수(카드 종류를 반복)
function createDeck(): Card[] {
  const deck: Card[] = [];
  for (let i = 0; i < 40; i++) {
    const base = CARD_LIBRARY[i % CARD_LIBRARY.length];
    deck.push({ ...base, id: i + 1 });
  }
  // 셔플
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// 초기 플레이어 상태 생성 함수
function createInitialPlayer(name: string): Player {
  const deck = createDeck();
  const hand = deck.slice(0, 5);
  return { hand, field: [], deck: deck.slice(5), name };
}

export default function CardGamePage() {
  // 상태: 플레이어 2명
  const [players, setPlayers] = useState<Player[]>([
    createInitialPlayer('플레이어 1'),
    createInitialPlayer('플레이어 2'),
  ]);

  // 턴 상태 (0: 플레이어1, 1: 플레이어2)
  const [turn, setTurn] = useState(0);

  // 드로우 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 드로우 함수
  const handleDraw = () => {
    setPlayers(prev => prev.map((player, idx) => {
      if (idx !== turn) return player;
      if (player.deck.length === 0) {
        setError('덱에 카드가 없습니다!');
        return player;
      }
      setError(null);
      const [drawn, ...rest] = player.deck;
      return {
        ...player,
        hand: [...player.hand, drawn],
        deck: rest,
      };
    }));
  };

  // 턴 넘기기
  const handleNextTurn = () => {
    setTurn(t => (t + 1) % players.length);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-6">카드 게임 (기본 UI)</h1>
      <div className="flex flex-col gap-12 w-full max-w-3xl">
        {players.map((player, idx) => (
          <div key={player.name} className={`rounded-xl shadow-lg p-6 bg-white/80 ${turn === idx ? 'ring-4 ring-indigo-400' : ''}`}>
            <h2 className="text-xl font-semibold mb-2">{player.name} {turn === idx && <span className="text-indigo-600">(턴)</span>}</h2>
            <div className="mb-2 flex items-center gap-4">
              <span className="font-bold">덱:</span>
              <span className="text-blue-700 font-mono">{player.deck.length}장</span>
              {turn === idx && (
                <button
                  className="ml-4 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  onClick={handleDraw}
                  disabled={player.deck.length === 0}
                >
                  드로우
                </button>
              )}
            </div>
            <div className="mb-4">
              <span className="font-bold">필드:</span>
              <div className="flex gap-2 mt-2 min-h-[80px]">
                {player.field.length === 0 ? (
                  <span className="text-gray-400">카드 없음</span>
                ) : (
                  player.field.map(card => (
                    <CardView key={card.id} card={card} />
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="font-bold">패:</span>
              <div className="flex gap-2 mt-2 min-h-[80px]">
                {player.hand.length === 0 ? (
                  <span className="text-gray-400">카드 없음</span>
                ) : (
                  player.hand.map(card => (
                    <CardView key={card.id} card={card} />
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8 items-center">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
          onClick={handleNextTurn}
        >
          턴 넘기기
        </button>
        {error && <span className="text-red-500 font-bold">{error}</span>}
      </div>
      <div className="mt-8 text-gray-600">※ 드로우, 턴 넘기기, 덱/패/필드 상태를 확인할 수 있습니다. 카드 이동/효과 등은 추후 구현 예정</div>
    </div>
  );
}

// 카드 UI 컴포넌트
function CardView({ card }: { card: Card }) {
  return (
    <div className="w-24 h-32 bg-white rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-300 hover:scale-105 transition-transform cursor-pointer">
      <img src={card.image} alt={card.name} className="w-10 h-10 mb-2" />
      <div className="font-bold text-sm mb-1">{card.name}</div>
      <div className="text-xs text-gray-500 text-center px-1">{card.description}</div>
    </div>
  );
} 