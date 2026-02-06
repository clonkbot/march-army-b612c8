import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame, Obstacle as ObstacleType } from '../context/GameContext'

interface ObstacleProps {
  obstacle: ObstacleType
  index: number
}

export default function Obstacle({ obstacle, index }: ObstacleProps) {
  const { gameProgress, takeDamage, gameState, showDamageNumber, setShowDamageNumber } = useGame()
  const [triggered, setTriggered] = useState(false)
  const [showNumber, setShowNumber] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null!)
  const numberRef = useRef<THREE.Group>(null!)
  const animationProgress = useRef(0)

  // Reset triggered state when game restarts
  useEffect(() => {
    if (gameState === 'playing') {
      setTriggered(false)
      setShowNumber(false)
      animationProgress.current = 0
    }
  }, [gameState])

  useFrame((state, delta) => {
    // Check collision
    if (!triggered && gameProgress >= obstacle.position - 1 && gameProgress < obstacle.position + 1) {
      setTriggered(true)
      setShowNumber(true)
      takeDamage(obstacle.damage)
    }

    // Animate obstacle
    if (meshRef.current) {
      if (obstacle.type === 'crusher') {
        meshRef.current.position.y = 1 + Math.abs(Math.sin(state.clock.elapsedTime * 2)) * 2
      }
    }

    // Animate damage number
    if (showNumber && numberRef.current) {
      animationProgress.current += delta * 2
      numberRef.current.position.y = 2 + animationProgress.current
      const opacity = Math.max(0, 1 - animationProgress.current / 2)
      if (opacity <= 0) {
        setShowNumber(false)
      }
    }
  })

  const renderObstacle = () => {
    switch (obstacle.type) {
      case 'barrier':
        return (
          <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
            <boxGeometry args={[obstacle.width, 2, 0.5]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
          </mesh>
        )
      case 'spike':
        return (
          <group ref={meshRef as any}>
            {[-1, 0, 1].map((x) => (
              <mesh key={x} position={[x * 0.8, 0.5, 0]} castShadow>
                <coneGeometry args={[0.3, 1, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.6} />
              </mesh>
            ))}
          </group>
        )
      case 'crusher':
        return (
          <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
            <boxGeometry args={[obstacle.width, 1.5, 1.5]} />
            <meshStandardMaterial color="#7c3aed" metalness={0.4} roughness={0.6} />
          </mesh>
        )
      default:
        return null
    }
  }

  return (
    <group position={[0, 0, -obstacle.position]}>
      {renderObstacle()}

      {/* Warning stripes */}
      <mesh position={[0, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[obstacle.width + 2, 0.5]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Damage number popup */}
      {showNumber && (
        <group ref={numberRef} position={[0, 2, 0]}>
          <Text
            fontSize={1.5}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH5lQ3g.woff"
            outlineWidth={0.1}
            outlineColor="#000000"
          >
            -{obstacle.damage}
          </Text>
        </group>
      )}
    </group>
  )
}
