import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface EnemyProps {
  position: [number, number, number]
}

export default function Enemy({ position }: EnemyProps) {
  const { gameProgress, soldiers, damageEnemy, enemyHealth, levels, currentLevel, gameState } = useGame()
  const [isFighting, setIsFighting] = useState(false)
  const [damageShown, setDamageShown] = useState<number | null>(null)
  const meshRef = useRef<THREE.Group>(null!)
  const lastDamageTime = useRef(0)

  const level = levels[currentLevel]
  const maxHealth = level?.enemy.health || 100

  // Reset when game restarts
  useEffect(() => {
    if (gameState === 'playing') {
      setIsFighting(false)
      setDamageShown(null)
      lastDamageTime.current = 0
    }
  }, [gameState])

  useFrame((state) => {
    if (!meshRef.current) return

    // Idle animation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    // Check if soldiers reached enemy
    const distance = Math.abs(gameProgress - (level?.trackLength || 100) + 5)
    if (distance < 3 && gameState === 'playing' && !isFighting) {
      setIsFighting(true)
    }

    // Deal damage over time when fighting
    if (isFighting && gameState === 'playing') {
      const now = state.clock.elapsedTime
      if (now - lastDamageTime.current > 0.3) {
        lastDamageTime.current = now
        const damage = Math.ceil(soldiers * 0.5)
        damageEnemy(damage)
        setDamageShown(damage)
        setTimeout(() => setDamageShown(null), 300)
      }

      // Shake when being attacked
      meshRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.1
    }
  })

  const healthPercent = (enemyHealth / maxHealth) * 100

  return (
    <group position={position}>
      {/* Enemy character */}
      <group ref={meshRef}>
        {/* Body */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <capsuleGeometry args={[0.8, 1.5, 8, 16]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 3, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>

        {/* Spiky hair */}
        {[0, 0.5, 1, 1.5, 2].map((i) => (
          <mesh key={i} position={[Math.sin(i * 1.2) * 0.3, 3.4, Math.cos(i * 1.2) * 0.3]} rotation={[0.3, i, 0]} castShadow>
            <coneGeometry args={[0.15, 0.5, 6]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        ))}

        {/* Arms */}
        <mesh position={[-1, 1.5, 0]} rotation={[0, 0, 0.5]} castShadow>
          <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[1, 1.5, 0]} rotation={[0, 0, -0.5]} castShadow>
          <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.4, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.4, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Platform */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 0.3, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.5} />
        </mesh>
      </group>

      {/* Health bar */}
      <group position={[0, 4.5, 0]}>
        {/* Background */}
        <mesh>
          <planeGeometry args={[3, 0.4]} />
          <meshBasicMaterial color="#1f2937" />
        </mesh>
        {/* Health fill */}
        <mesh position={[(healthPercent - 100) / 100 * 1.5, 0, 0.01]}>
          <planeGeometry args={[3 * (healthPercent / 100), 0.3]} />
          <meshBasicMaterial color={healthPercent > 50 ? '#22c55e' : healthPercent > 25 ? '#f59e0b' : '#ef4444'} />
        </mesh>
        {/* Health text */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH5lQ3g.woff"
        >
          {enemyHealth}
        </Text>
      </group>

      {/* Damage popup */}
      {damageShown && (
        <Text
          position={[Math.random() - 0.5, 4 + Math.random(), 1]}
          fontSize={0.8}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH5lQ3g.woff"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          -{damageShown}
        </Text>
      )}
    </group>
  )
}
