import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import Game from './components/Game'
import UI from './components/UI'
import { GameProvider, useGame } from './context/GameContext'

function AppContent() {
  const { gameState, currentLevel, soldiers, score } = useGame()

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-200 relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 50 }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UI />

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-sky-800/40 font-medium tracking-wide">
          Requested by <span className="text-sky-800/60">@CryptoTekniker</span> · Built by <span className="text-sky-800/60">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
