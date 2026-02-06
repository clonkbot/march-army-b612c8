import { useGame } from '../context/GameContext'

export default function UI() {
  const {
    gameState,
    soldiers,
    score,
    currentLevel,
    levels,
    startGame,
    nextLevel,
    restartLevel,
    showDamageNumber,
    gameProgress,
  } = useGame()

  const level = levels[currentLevel]
  const progress = level ? (gameProgress / level.trackLength) * 100 : 0

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 right-0 p-3 md:p-4">
          {/* Soldier count */}
          <div className="flex justify-center mb-2 md:mb-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg border-2 border-blue-400">
              <span className="text-white font-bold text-2xl md:text-4xl tracking-tight" style={{ fontFamily: 'Bangers, cursive' }}>
                {soldiers}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto bg-gray-800/50 rounded-full h-2 md:h-3 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-100 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          {/* Level indicator */}
          <div className="text-center mt-1 md:mt-2">
            <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-widest">
              Level {currentLevel + 1} - {level?.name}
            </span>
          </div>

          {/* Score */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4">
            <div className="bg-black/30 backdrop-blur-sm px-2 md:px-3 py-1 rounded-lg">
              <span className="text-yellow-400 text-sm md:text-lg font-bold" style={{ fontFamily: 'Bangers, cursive' }}>
                SCORE: {score}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Damage number popup */}
      {showDamageNumber && gameState === 'playing' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-bounce">
          <span
            className="text-red-500 font-bold text-4xl md:text-6xl drop-shadow-lg"
            style={{ fontFamily: 'Bangers, cursive', textShadow: '2px 2px 0 #000' }}
          >
            {showDamageNumber.value}
          </span>
        </div>
      )}

      {/* Controls hint */}
      {gameState === 'playing' && (
        <div className="absolute bottom-16 md:bottom-20 left-0 right-0 text-center">
          <p className="text-white/50 text-xs md:text-sm font-medium">
            Swipe left/right or drag to change lanes
          </p>
        </div>
      )}

      {/* Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-900/80 to-sky-700/80 backdrop-blur-sm pointer-events-auto">
          <div className="text-center p-6 md:p-8">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 drop-shadow-lg"
              style={{ fontFamily: 'Bangers, cursive', textShadow: '4px 4px 0 #1e40af' }}
            >
              MARCH
            </h1>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-6 md:mb-8 drop-shadow-lg"
              style={{ fontFamily: 'Bangers, cursive', textShadow: '3px 3px 0 #b45309' }}
            >
              ARMY
            </h2>

            <div className="space-y-3 md:space-y-4">
              <button
                onClick={startGame}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-xl md:text-2xl py-3 md:py-4 px-8 md:px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-b-4 border-green-700"
                style={{ fontFamily: 'Bangers, cursive' }}
              >
                PLAY
              </button>

              <div className="text-white/70 text-sm md:text-base mt-4 md:mt-6">
                <p className="mb-2">Choose gates wisely to multiply your army!</p>
                <p>Avoid obstacles and defeat the boss!</p>
              </div>
            </div>

            {/* Level select */}
            <div className="mt-6 md:mt-8">
              <p className="text-white/50 text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">Levels</p>
              <div className="flex justify-center gap-2 md:gap-3">
                {levels.map((lvl, i) => (
                  <div
                    key={lvl.id}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-600/50 border-2 border-blue-400 flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-lg md:text-xl" style={{ fontFamily: 'Bangers, cursive' }}>
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Complete */}
      {gameState === 'levelComplete' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-green-900/80 to-emerald-700/80 backdrop-blur-sm pointer-events-auto">
          <div className="text-center p-6 md:p-8">
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-400 mb-2 drop-shadow-lg animate-pulse"
              style={{ fontFamily: 'Bangers, cursive', textShadow: '3px 3px 0 #b45309' }}
            >
              VICTORY!
            </h2>
            <p className="text-white text-lg md:text-xl mb-4 md:mb-6">
              Level {currentLevel + 1} Complete
            </p>

            <div className="bg-black/30 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <p className="text-white/70 text-sm uppercase tracking-widest mb-1 md:mb-2">Final Score</p>
              <p className="text-yellow-400 text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Bangers, cursive' }}>
                {score}
              </p>
              <p className="text-white/70 text-sm mt-2 md:mt-3">
                Soldiers remaining: <span className="text-blue-400 font-bold">{soldiers}</span>
              </p>
            </div>

            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-xl md:text-2xl py-3 md:py-4 px-8 md:px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-b-4 border-green-700"
              style={{ fontFamily: 'Bangers, cursive' }}
            >
              {currentLevel < levels.length - 1 ? 'NEXT LEVEL' : 'PLAY AGAIN'}
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-red-900/80 to-red-700/80 backdrop-blur-sm pointer-events-auto">
          <div className="text-center p-6 md:p-8">
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-red-400 mb-4 md:mb-6 drop-shadow-lg"
              style={{ fontFamily: 'Bangers, cursive', textShadow: '3px 3px 0 #7f1d1d' }}
            >
              GAME OVER
            </h2>

            <div className="bg-black/30 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <p className="text-white/70 text-sm uppercase tracking-widest mb-1 md:mb-2">Score</p>
              <p className="text-yellow-400 text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Bangers, cursive' }}>
                {score}
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <button
                onClick={restartLevel}
                className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xl md:text-2xl py-3 md:py-4 px-8 md:px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-b-4 border-blue-700"
                style={{ fontFamily: 'Bangers, cursive' }}
              >
                TRY AGAIN
              </button>
              <button
                onClick={startGame}
                className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-lg md:text-xl py-2 md:py-3 px-6 md:px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-b-4 border-gray-800"
                style={{ fontFamily: 'Bangers, cursive' }}
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
