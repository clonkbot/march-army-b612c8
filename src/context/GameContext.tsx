import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'

export type GameState = 'menu' | 'playing' | 'levelComplete' | 'gameOver'

export interface Level {
  id: number
  name: string
  trackLength: number
  obstacles: Obstacle[]
  gates: Gate[]
  enemy: Enemy
}

export interface Obstacle {
  position: number
  type: 'barrier' | 'spike' | 'crusher'
  damage: number
  width: number
}

export interface Gate {
  position: number
  leftValue: number
  leftOperation: 'add' | 'multiply'
  rightValue: number
  rightOperation: 'add' | 'multiply'
}

export interface Enemy {
  health: number
  name: string
}

interface GameContextType {
  gameState: GameState
  setGameState: (state: GameState) => void
  currentLevel: number
  setCurrentLevel: (level: number) => void
  soldiers: number
  setSoldiers: (count: number) => void
  score: number
  setScore: (score: number) => void
  levels: Level[]
  startGame: () => void
  nextLevel: () => void
  restartLevel: () => void
  applyGate: (operation: 'add' | 'multiply', value: number) => void
  takeDamage: (damage: number) => void
  lanePosition: number
  setLanePosition: (lane: number) => void
  gameProgress: number
  setGameProgress: (progress: number) => void
  enemyHealth: number
  setEnemyHealth: (health: number) => void
  damageEnemy: (damage: number) => void
  showDamageNumber: { value: number; id: number } | null
  setShowDamageNumber: (val: { value: number; id: number } | null) => void
}

const levels: Level[] = [
  {
    id: 1,
    name: 'Training Grounds',
    trackLength: 100,
    obstacles: [
      { position: 40, type: 'barrier', damage: 5, width: 3 },
    ],
    gates: [
      { position: 20, leftValue: 5, leftOperation: 'add', rightValue: 2, rightOperation: 'multiply' },
      { position: 60, leftValue: 10, leftOperation: 'add', rightValue: 3, rightOperation: 'multiply' },
    ],
    enemy: { health: 100, name: 'Training Dummy' }
  },
  {
    id: 2,
    name: 'The Gauntlet',
    trackLength: 120,
    obstacles: [
      { position: 35, type: 'barrier', damage: 8, width: 3 },
      { position: 70, type: 'spike', damage: 12, width: 2 },
    ],
    gates: [
      { position: 20, leftValue: 8, leftOperation: 'add', rightValue: 2, rightOperation: 'multiply' },
      { position: 50, leftValue: 15, leftOperation: 'add', rightValue: 3, rightOperation: 'multiply' },
      { position: 85, leftValue: 20, leftOperation: 'add', rightValue: 2, rightOperation: 'multiply' },
    ],
    enemy: { health: 200, name: 'Heavy Guard' }
  },
  {
    id: 3,
    name: 'Final Assault',
    trackLength: 150,
    obstacles: [
      { position: 25, type: 'barrier', damage: 10, width: 3 },
      { position: 55, type: 'spike', damage: 15, width: 2 },
      { position: 85, type: 'crusher', damage: 20, width: 4 },
    ],
    gates: [
      { position: 15, leftValue: 10, leftOperation: 'add', rightValue: 3, rightOperation: 'multiply' },
      { position: 40, leftValue: 20, leftOperation: 'add', rightValue: 2, rightOperation: 'multiply' },
      { position: 70, leftValue: 30, leftOperation: 'add', rightValue: 4, rightOperation: 'multiply' },
      { position: 95, leftValue: 50, leftOperation: 'add', rightValue: 2, rightOperation: 'multiply' },
    ],
    enemy: { health: 500, name: 'War Commander' }
  }
]

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [soldiers, setSoldiers] = useState(10)
  const [score, setScore] = useState(0)
  const [lanePosition, setLanePosition] = useState(0)
  const [gameProgress, setGameProgress] = useState(0)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [showDamageNumber, setShowDamageNumber] = useState<{ value: number; id: number } | null>(null)
  const damageIdRef = useRef(0)

  const startGame = useCallback(() => {
    setCurrentLevel(0)
    setSoldiers(10)
    setScore(0)
    setGameProgress(0)
    setEnemyHealth(levels[0].enemy.health)
    setGameState('playing')
    setLanePosition(0)
  }, [])

  const nextLevel = useCallback(() => {
    const next = currentLevel + 1
    if (next < levels.length) {
      setCurrentLevel(next)
      setSoldiers(10)
      setGameProgress(0)
      setEnemyHealth(levels[next].enemy.health)
      setGameState('playing')
      setLanePosition(0)
    } else {
      setGameState('menu')
    }
  }, [currentLevel])

  const restartLevel = useCallback(() => {
    setSoldiers(10)
    setGameProgress(0)
    setEnemyHealth(levels[currentLevel].enemy.health)
    setGameState('playing')
    setLanePosition(0)
  }, [currentLevel])

  const applyGate = useCallback((operation: 'add' | 'multiply', value: number) => {
    setSoldiers(prev => {
      const newCount = operation === 'add' ? prev + value : prev * value
      return Math.max(1, Math.floor(newCount))
    })
  }, [])

  const takeDamage = useCallback((damage: number) => {
    setSoldiers(prev => {
      const newCount = prev - damage
      if (newCount <= 0) {
        setGameState('gameOver')
        return 0
      }
      return newCount
    })
    damageIdRef.current += 1
    setShowDamageNumber({ value: -damage, id: damageIdRef.current })
    setTimeout(() => setShowDamageNumber(null), 800)
  }, [])

  const damageEnemy = useCallback((damage: number) => {
    setEnemyHealth(prev => {
      const newHealth = prev - damage
      if (newHealth <= 0) {
        setScore(s => s + levels[currentLevel].enemy.health * 10)
        setGameState('levelComplete')
        return 0
      }
      return newHealth
    })
  }, [currentLevel])

  return (
    <GameContext.Provider value={{
      gameState,
      setGameState,
      currentLevel,
      setCurrentLevel,
      soldiers,
      setSoldiers,
      score,
      setScore,
      levels,
      startGame,
      nextLevel,
      restartLevel,
      applyGate,
      takeDamage,
      lanePosition,
      setLanePosition,
      gameProgress,
      setGameProgress,
      enemyHealth,
      setEnemyHealth,
      damageEnemy,
      showDamageNumber,
      setShowDamageNumber,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}
