import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame, Gate as GateType } from '../context/GameContext'

interface GateProps {
  gate: GateType
  index: number
}

export default function Gate({ gate, index }: GateProps) {
  const { gameProgress, lanePosition, applyGate, gameState } = useGame()
  const [triggered, setTriggered] = useState(false)
  const leftGlowRef = useRef<THREE.Mesh>(null!)
  const rightGlowRef = useRef<THREE.Mesh>(null!)

  // Reset triggered state when game restarts
  useEffect(() => {
    if (gameState === 'playing') {
      setTriggered(false)
    }
  }, [gameState])

  useFrame((state) => {
    // Check if player passed through
    if (!triggered && gameProgress >= gate.position && gameProgress < gate.position + 2) {
      setTriggered(true)
      // Determine which side based on lane position
      if (lanePosition <= 0) {
        applyGate(gate.leftOperation, gate.leftValue)
      } else {
        applyGate(gate.rightOperation, gate.rightValue)
      }
    }

    // Pulse animation for gates
    if (leftGlowRef.current && rightGlowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
      leftGlowRef.current.scale.setScalar(pulse)
      rightGlowRef.current.scale.setScalar(pulse)
    }
  })

  const leftLabel = `${gate.leftOperation === 'add' ? '+' : 'x'}${gate.leftValue}`
  const rightLabel = `${gate.rightOperation === 'add' ? '+' : 'x'}${gate.rightValue}`
  const leftColor = gate.leftOperation === 'multiply' ? '#22c55e' : '#3b82f6'
  const rightColor = gate.rightOperation === 'multiply' ? '#22c55e' : '#3b82f6'

  return (
    <group position={[0, 0, -gate.position]}>
      {/* Gate frame */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[9, 0.3, 0.3]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </mesh>

      {/* Left gate */}
      <group position={[-2.25, 1.5, 0]}>
        <mesh ref={leftGlowRef}>
          <boxGeometry args={[3.5, 3, 0.2]} />
          <meshStandardMaterial
            color={leftColor}
            transparent
            opacity={triggered ? 0.3 : 0.8}
            emissive={leftColor}
            emissiveIntensity={triggered ? 0.1 : 0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH5lQ3g.woff"
        >
          {leftLabel}
        </Text>
      </group>

      {/* Right gate */}
      <group position={[2.25, 1.5, 0]}>
        <mesh ref={rightGlowRef}>
          <boxGeometry args={[3.5, 3, 0.2]} />
          <meshStandardMaterial
            color={rightColor}
            transparent
            opacity={triggered ? 0.3 : 0.8}
            emissive={rightColor}
            emissiveIntensity={triggered ? 0.1 : 0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ACH5lQ3g.woff"
        >
          {rightLabel}
        </Text>
      </group>

      {/* Divider */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Posts */}
      <mesh position={[-4.3, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} />
      </mesh>
      <mesh position={[4.3, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} />
      </mesh>
    </group>
  )
}
