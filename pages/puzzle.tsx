import { useState, useRef, useEffect } from 'react';
import { Geist } from "next/font/google";
import Link from 'next/link';

const geist = Geist({
  subsets: ["latin"],
});

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  imageUrl: string;
}

export default function PuzzleGame() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [activeTab, setActiveTab] = useState<'puzzle' | 'ascii'>('puzzle');
  const [asciiArt, setAsciiArt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setSelectedImage(imageUrl);
          createPuzzlePieces(imageUrl);
          if (activeTab === 'ascii') {
            generateAsciiArt(imageUrl, img.width, img.height);
          }
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const createPuzzlePieces = (imageUrl: string) => {
    const pieces: PuzzlePiece[] = [];
    for (let i = 0; i < 12; i++) {
      pieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        imageUrl: imageUrl
      });
    }
    setPuzzlePieces(pieces);
  };

  const shufflePuzzle = () => {
    const shuffled = [...puzzlePieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
      [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }
    setPuzzlePieces(shuffled);
    setIsGameStarted(true);
    setIsGameCompleted(false);
    setMoves(0);
    setTimer(0);
    startTimer();
  };

  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handlePieceMouseDown = (pieceId: number) => {
    if (!isGameStarted) return;
    setDraggedPiece(pieceId);
  };

  const handlePieceMouseUp = () => {
    setDraggedPiece(null);
  };

  const handlePieceMouseEnter = (targetPosition: number) => {
    if (!isGameStarted || draggedPiece === null) return;
    
    const updatedPieces = [...puzzlePieces];
    const draggedPieceObj = updatedPieces.find(p => p.id === draggedPiece);
    const targetPieceObj = updatedPieces.find(p => p.currentPosition === targetPosition);
    
    if (draggedPieceObj && targetPieceObj && draggedPieceObj.currentPosition !== targetPosition) {
      [draggedPieceObj.currentPosition, targetPieceObj.currentPosition] = 
      [targetPieceObj.currentPosition, draggedPieceObj.currentPosition];
      
      setPuzzlePieces(updatedPieces);
      setMoves(prev => prev + 1);
      checkGameCompletion(updatedPieces);
    }
  };

  const checkGameCompletion = (pieces: PuzzlePiece[]) => {
    const isCompleted = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    if (isCompleted) {
      setIsGameCompleted(true);
      setIsGameStarted(false);
      stopTimer();
    }
  };

  const resetGame = () => {
    setSelectedImage(null);
    setPuzzlePieces([]);
    setIsGameStarted(false);
    setIsGameCompleted(false);
    setTimer(0);
    setMoves(0);
    setDraggedPiece(null);
    setImageDimensions({ width: 0, height: 0 });
    stopTimer();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPuzzleSize = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0) {
      return { width: 400, height: 300 };
    }
    
    const maxWidth = 500;
    const maxHeight = 400;
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  };

  const puzzleSize = getPuzzleSize();
  const pieceWidth = puzzleSize.width / 4;
  const pieceHeight = puzzleSize.height / 3;

  useEffect(() => {
    if (activeTab === 'ascii' && selectedImage && imageDimensions.width && imageDimensions.height) {
      generateAsciiArt(selectedImage, imageDimensions.width, imageDimensions.height);
    }
  }, [activeTab]);

  const generateAsciiArt = (imageUrl: string, width: number, height: number) => {
    const asciiChars = '@%#*+=-:. ';
    const scale = 0.12;
    const asciiWidth = Math.floor(width * scale);
    const asciiHeight = Math.floor(height * scale * 0.5);
    const canvas = document.createElement('canvas');
    canvas.width = asciiWidth;
    canvas.height = asciiHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, asciiWidth, asciiHeight);
      const imgData = ctx.getImageData(0, 0, asciiWidth, asciiHeight);
      let ascii = '';
      for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
          const offset = (y * asciiWidth + x) * 4;
          const r = imgData.data[offset];
          const g = imgData.data[offset + 1];
          const b = imgData.data[offset + 2];
          const brightness = (r + g + b) / 3;
          const charIdx = Math.floor((brightness / 255) * (asciiChars.length - 1));
          ascii += asciiChars[charIdx];
        }
        ascii += '\n';
      }
      setAsciiArt(ascii);
    };
    img.src = imageUrl;
  };

  return (
    <div className={`${geist.className} min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4`}>
      <div className="max-w-6xl mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            🧩 이미지 퍼즐 & 아스키 아트
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            🌤️ 날씨 대시보드
          </Link>
        </nav>

        <div className="flex gap-2 mb-6">
          <button
            className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'puzzle' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setActiveTab('puzzle')}
          >
            🧩 퍼즐 게임
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${activeTab === 'ascii' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setActiveTab('ascii')}
          >
            🎨 아스키 아트 변환
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center w-24">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ⏱️ {formatTime(timer)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  경과 시간
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center w-24">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  🎯 {moves}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  이동 횟수
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium cursor-pointer"
              >
                📁 이미지 업로드
              </label>
            </div>

            {selectedImage && !isGameStarted && (
              <button
                onClick={shufflePuzzle}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                🎮 게임 시작
              </button>
            )}

            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              🔄 새 게임
            </button>
          </div>
        </div>

        {isGameCompleted && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              🎉 퍼즐 완성!
            </h2>
            <p className="text-green-600 dark:text-green-400">
              축하합니다! {formatTime(timer)} 만에 {moves}번의 이동으로 퍼즐을 완성했습니다!
            </p>
          </div>
        )}

        {activeTab === 'puzzle' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {isGameStarted ? '퍼즐 게임' : '이미지를 업로드하고 게임을 시작하세요'}
            </h2>
            
            {selectedImage ? (
              <div className="flex justify-center">
                <div 
                  className="grid grid-cols-4 gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-2"
                  style={{ 
                    width: puzzleSize.width, 
                    height: puzzleSize.height 
                  }}
                >
                  {Array.from({ length: 12 }, (_, index) => {
                    const piece = puzzlePieces.find(p => p.currentPosition === index);
                    if (!piece) return null;
                    
                    const row = Math.floor(piece.id / 4);
                    const col = piece.id % 4;
                    
                    return (
                      <div
                        key={piece.id}
                        onMouseDown={() => handlePieceMouseDown(piece.id)}
                        onMouseUp={handlePieceMouseUp}
                        onMouseEnter={() => handlePieceMouseEnter(index)}
                        className={`bg-cover bg-center cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded transition-all duration-200 ${
                          isGameStarted ? 'hover:border-blue-400' : ''
                        } ${
                          draggedPiece === piece.id ? 'opacity-50 scale-95' : ''
                        }`}
                        style={{
                          width: pieceWidth - 2,
                          height: pieceHeight - 2,
                          backgroundImage: `url(${piece.imageUrl})`,
                          backgroundPosition: `${col * -100}% ${row * -100}%`,
                          backgroundSize: `${puzzleSize.width}px ${puzzleSize.height}px`
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-72 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📁</div>
                  <p>이미지를 업로드해주세요</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🎨 아스키 아트 변환 결과
            </h2>
            {selectedImage ? (
              <pre className="overflow-x-auto text-xs leading-3 font-mono bg-gray-100 dark:bg-gray-900 p-4 rounded-lg whitespace-pre">
                {asciiArt || '이미지 변환 중...'}
              </pre>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                이미지를 업로드하면 아스키 아트로 변환됩니다.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            💡 게임 방법
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-medium mb-2">1. 이미지 업로드</h4>
              <p>원하는 이미지 파일을 선택하여 업로드하세요.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. 게임 시작</h4>
              <p>"게임 시작" 버튼을 클릭하면 이미지가 12조각으로 분할됩니다.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. 퍼즐 맞추기</h4>
              <p>조각을 클릭한 채로 다른 조각 위에 드래그하여 위치를 바꾸세요.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. 완성 확인</h4>
              <p>모든 조각이 올바른 위치에 놓이면 게임이 완료됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 