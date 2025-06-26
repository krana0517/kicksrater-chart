import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import Link from 'next/link';

// react-chessboard는 SSR에서 에러가 날 수 있으므로 dynamic import 사용
const Chessboard = dynamic(() => import('react-chessboard').then(mod => mod.Chessboard), { ssr: false });

declare module 'react-chessboard';

export default function ChessPage() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState('AI와 대국을 시작하세요!');
  const [isUserTurn, setIsUserTurn] = useState(true); // 항상 사용자가 백(선)

  // AI(랜덤 legal move)
  const makeAIMove = () => {
    const moves = game.moves();
    if (moves.length === 0) return;
    const move = moves[Math.floor(Math.random() * moves.length)];
    game.move(move);
    setFen(game.fen());
    setHistory(game.history());
    setIsUserTurn(true);
    updateStatus();
  };

  // 상태 메시지 업데이트
  const updateStatus = () => {
    if (game.isCheckmate()) {
      setStatus(game.turn() === 'w' ? 'AI 승리! 체크메이트' : '사용자 승리! 체크메이트');
    } else if (game.isDraw()) {
      setStatus('무승부!');
    } else if (game.isCheck()) {
      setStatus('체크!');
    } else {
      setStatus(game.turn() === 'w' ? '사용자 차례입니다.' : 'AI 차례입니다.');
    }
  };

  // 사용자가 말을 움직였을 때
  const onDrop = (source: string, target: string) => {
    if (!isUserTurn) return false;
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return false;
    setFen(game.fen());
    setHistory(game.history());
    setIsUserTurn(false);
    updateStatus();
    return true;
  };

  // AI 턴이면 자동으로 두기
  useEffect(() => {
    if (!isUserTurn && !game.isGameOver()) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, fen]);

  // 새 게임
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setHistory([]);
    setIsUserTurn(true);
    setStatus('AI와 대국을 시작하세요!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#efefef] p-8">
      <div className="w-full max-w-2xl mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-[#05ce78] tracking-widest">CHESS vs AI</div>
          <Link href="/" className="px-4 py-2 bg-[#05ce78] text-white rounded-lg font-medium">홈으로</Link>
        </nav>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardWidth={400}
              arePiecesDraggable={isUserTurn && !game.isGameOver()}
              customBoardStyle={{ borderRadius: 12, boxShadow: '0 4px 24px #0001' }}
            />
            <div className="mt-4 flex gap-2">
              <button onClick={resetGame} className="px-4 py-2 bg-[#05ce78] text-white rounded font-bold">새 게임</button>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 text-lg font-semibold text-[#282828]">{status}</div>
            <div className="bg-white rounded-lg shadow p-4 text-xs text-[#282828] h-64 overflow-y-auto">
              <div className="font-bold mb-2">기보</div>
              <ol className="list-decimal ml-4">
                {history.map((move, idx) => (
                  <li key={idx}>{move}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 