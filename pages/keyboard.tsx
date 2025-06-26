import { useState, useEffect, useRef } from 'react';
import { Geist } from "next/font/google";
import Link from 'next/link';

const geist = Geist({
  subsets: ["latin"],
});

interface KeyPress {
  key: string;
  timestamp: number;
  isPressed: boolean;
}

export default function KeyboardVisualizer() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [keyHistory, setKeyHistory] = useState<KeyPress[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [compositionText, setCompositionText] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [keysPerSecond, setKeysPerSecond] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeyTimeRef = useRef<number>(0);
  const keyCountRef = useRef<number>(0);

  // 모스부호 변환표
  const morseCode: { [key: string]: string } = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': ' ', '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
    '-': '-....-', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
  };

  // 텍스트를 2진법으로 변환
  const textToBinary = (text: string): string => {
    return text.split('').map(char => {
      const charCode = char.charCodeAt(0);
      return charCode.toString(2).padStart(8, '0');
    }).join(' ');
  };

  // 텍스트를 모스부호로 변환
  const textToMorse = (text: string): string => {
    return text.toLowerCase().split('').map(char => {
      return morseCode[char] || char;
    }).join(' ');
  };

  // 실제 한글 키보드 레이아웃 (한글/영문 표기)
  const keyboardLayout = [
    // 숫자 키 행
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    // 첫 번째 행 (한글 자음/모음)
    ['Tab', 'qㅂ', 'wㅈ', 'eㄷ', 'rㄹ', 'tㅌ', 'yㅛ', 'uㅕ', 'iㅑ', 'oㅐ', 'pㅔ', '[', ']', '\\'],
    // 두 번째 행 (한글 자음/모음)
    ['Caps', 'aㅁ', 'sㄴ', 'dㅇ', 'fㄹ', 'gㅎ', 'hㅗ', 'jㅓ', 'kㅏ', 'lㅣ', ';', "'", 'Enter'],
    // 세 번째 행 (한글 자음/모음)
    ['Shift', 'zㅋ', 'xㅌ', 'cㅊ', 'vㅍ', 'bㅠ', 'nㅜ', 'mㅡ', ',', '.', '/', 'Shift'],
    // 네 번째 행
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
  ];

  // 타이머 시작
  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const newTime = prev + 1;
        // 초당 타수 계산 (1초마다)
        if (keyCountRef.current > 0) {
          setKeysPerSecond(Math.round((keyCountRef.current / newTime) * 10) / 10);
        }
        return newTime;
      });
    }, 1000);
  };

  // 타이머 정지
  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // 이미 눌린 키는 무시 (중복 방지)
    if (pressedKeys.has(event.key.toLowerCase())) {
      return;
    }

    const key = event.key.toLowerCase();
    setPressedKeys(prev => new Set([...prev, key]));
    
    // 스페이스 스크롤 방지
    if (event.key === ' ') {
      event.preventDefault();
    }
    
    // 키 카운트 증가
    keyCountRef.current += 1;
    
    setKeyHistory(prev => [
      ...prev,
      {
        key: event.key,
        timestamp: Date.now(),
        isPressed: true
      }
    ]);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  // 한글 조합 이벤트 처리
  const handleCompositionStart = (event: CompositionEvent) => {
    setCompositionText(event.data);
  };

  const handleCompositionUpdate = (event: CompositionEvent) => {
    setCompositionText(event.data);
  };

  const handleCompositionEnd = (event: CompositionEvent) => {
    setCompositionText('');
  };

  const toggleListening = () => {
    if (isListening) {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('compositionstart', handleCompositionStart);
      document.removeEventListener('compositionupdate', handleCompositionUpdate);
      document.removeEventListener('compositionend', handleCompositionEnd);
      setIsListening(false);
      stopTimer();
    } else {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      document.addEventListener('compositionstart', handleCompositionStart);
      document.addEventListener('compositionupdate', handleCompositionUpdate);
      document.addEventListener('compositionend', handleCompositionEnd);
      setIsListening(true);
      startTimer();
      // input에 포커스
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const clearHistory = () => {
    setKeyHistory([]);
    setPressedKeys(new Set());
    setTypedText('');
    setCompositionText('');
    setTimer(0);
    setKeysPerSecond(0);
    keyCountRef.current = 0;
    stopTimer();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedText(event.target.value);
  };

  const getKeyClass = (key: string) => {
    // 한글 키 처리
    const keyToCheck = key.includes('ㅂ') ? 'q' : 
                      key.includes('ㅈ') ? 'w' : 
                      key.includes('ㄷ') ? 'e' : 
                      key.includes('ㄹ') ? 'r' : 
                      key.includes('ㅌ') ? 't' : 
                      key.includes('ㅛ') ? 'y' : 
                      key.includes('ㅕ') ? 'u' : 
                      key.includes('ㅑ') ? 'i' : 
                      key.includes('ㅐ') ? 'o' : 
                      key.includes('ㅔ') ? 'p' : 
                      key.includes('ㅁ') ? 'a' : 
                      key.includes('ㄴ') ? 's' : 
                      key.includes('ㅇ') ? 'd' : 
                      key.includes('ㅎ') ? 'g' : 
                      key.includes('ㅗ') ? 'h' : 
                      key.includes('ㅓ') ? 'j' : 
                      key.includes('ㅏ') ? 'k' : 
                      key.includes('ㅣ') ? 'l' : 
                      key.includes('ㅋ') ? 'z' : 
                      key.includes('ㅊ') ? 'c' : 
                      key.includes('ㅍ') ? 'v' : 
                      key.includes('ㅠ') ? 'b' : 
                      key.includes('ㅜ') ? 'n' : 
                      key.includes('ㅡ') ? 'm' : 
                      key.toLowerCase();

    const isPressed = pressedKeys.has(keyToCheck);
    const baseClass = "px-2 py-1 rounded font-mono text-xs font-medium transition-all duration-150 select-none";
    
    if (isPressed) {
      return `${baseClass} bg-blue-500 text-white shadow-lg transform scale-95`;
    }
    
    return `${baseClass} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600`;
  };

  const getSpecialKeyClass = (key: string) => {
    const isPressed = pressedKeys.has(key.toLowerCase());
    const baseClass = "px-3 py-1 rounded font-mono text-xs font-medium transition-all duration-150 select-none";
    
    if (isPressed) {
      return `${baseClass} bg-blue-500 text-white shadow-lg transform scale-95`;
    }
    
    return `${baseClass} bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500`;
  };

  const getSpaceKeyClass = () => {
    const isPressed = pressedKeys.has(' ');
    const baseClass = "px-16 py-1 rounded font-mono text-xs font-medium transition-all duration-150 select-none";
    
    if (isPressed) {
      return `${baseClass} bg-blue-500 text-white shadow-lg transform scale-95`;
    }
    
    return `${baseClass} bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500`;
  };

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('compositionstart', handleCompositionStart);
      document.removeEventListener('compositionupdate', handleCompositionUpdate);
      document.removeEventListener('compositionend', handleCompositionEnd);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 입력 기록을 3줄로 제한 (최대 12개 항목)
  const limitedKeyHistory = keyHistory.slice(-12);

  return (
    <div className={`${geist.className} min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* 네비게이션 바 */}
        <nav className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            ⌨️ 키보드 시각화
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            🌤️ 날씨 대시보드
          </Link>
        </nav>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ⌨️ 키보드 시각화
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            키보드 입력을 실시간으로 시각화합니다
          </p>
        </header>

        {/* 컨트롤 패널 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* 타이머와 입력 타수 */}
            <div className="flex gap-4 items-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ⏱️ {formatTime(timer)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  경과 시간
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  ⚡ {keysPerSecond}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  키/초
                </div>
              </div>
            </div>

            <button
              onClick={toggleListening}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isListening ? '🔴 입력 중지' : '🟢 입력 시작'}
            </button>
            
            <button
              onClick={clearHistory}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              🗑️ 기록 지우기
            </button>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {isListening ? '입력 감지 중...' : '대기 중'}
              </span>
            </div>
          </div>
        </div>

        {/* 타이핑된 텍스트 표시 - 실제 input 박스 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📝 타이핑 영역
          </h2>
          <div className="relative">
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              placeholder="키를 눌러서 텍스트를 입력해보세요..."
              className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono"
              disabled={!isListening}
            />
            {compositionText && (
              <div className="absolute bottom-4 left-4 text-blue-600 dark:text-blue-400 underline">
                {compositionText}
              </div>
            )}
          </div>
        </div>

        {/* 텍스트 변환 결과 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            🔄 텍스트 변환
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2진법 변환 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                🔢 2진법 변환
              </h3>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 min-h-20">
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                  {typedText ? textToBinary(typedText) : '텍스트를 입력하면 2진법으로 변환됩니다...'}
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                각 문자를 8비트 2진수로 변환
              </div>
            </div>

            {/* 모스부호 변환 */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                📡 모스부호 변환
              </h3>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 min-h-20">
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                  {typedText ? textToMorse(typedText) : '텍스트를 입력하면 모스부호로 변환됩니다...'}
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                영문, 숫자, 특수문자를 모스부호로 변환
              </div>
            </div>
          </div>
        </div>

        {/* 입력 통계 - 키보드 레이아웃 상단 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📊 입력 통계
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {keyHistory.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                총 입력 수
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {new Set(keyHistory.map(k => k.key)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                고유 키 수
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timer > 0 ? Math.round(keyHistory.length / timer) : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                평균 키/초
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {pressedKeys.size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                현재 눌린 키
              </div>
            </div>
          </div>
        </div>

        {/* 키보드 시각화 - 실제 한글 키보드 레이아웃 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            키보드 레이아웃 (실제 한글 키보드)
          </h2>
          
          <div className="space-y-1 max-w-4xl mx-auto">
            {keyboardLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {row.map((key) => (
                  <div
                    key={key}
                    className={
                      key === 'Space' ? getSpaceKeyClass() :
                      key === 'Backspace' || key === 'Tab' || key === 'Caps' || key === 'Enter' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu' ? getSpecialKeyClass(key) :
                      getKeyClass(key)
                    }
                    style={{ 
                      minWidth: key === 'Backspace' ? '60px' : 
                                key === 'Tab' ? '50px' : 
                                key === 'Caps' ? '60px' : 
                                key === 'Enter' ? '70px' : 
                                key === 'Shift' ? '70px' : 
                                key === 'Space' ? 'auto' : 
                                key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu' ? '50px' : '35px'
                    }}
                  >
                    {key === 'Backspace' ? '⌫' : 
                     key === 'Tab' ? 'Tab' : 
                     key === 'Caps' ? 'Caps' : 
                     key === 'Enter' ? '↵' : 
                     key === 'Shift' ? '⇧' : 
                     key === 'Space' ? 'Space' : 
                     key === 'Ctrl' ? 'Ctrl' : 
                     key === 'Win' ? 'Win' : 
                     key === 'Alt' ? 'Alt' : 
                     key === 'Menu' ? 'Menu' : key}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 키 입력 기록 - 3줄 제한 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            입력 기록 ({keyHistory.length}) - 최근 12개
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {limitedKeyHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">
                키를 눌러보세요!
              </p>
            ) : (
              limitedKeyHistory.map((press, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {press.key.length > 1 ? press.key.slice(0, 2) : press.key}
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-sm text-gray-800 dark:text-gray-200">
                        {press.key === ' ' ? 'Space' : press.key}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(press.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 