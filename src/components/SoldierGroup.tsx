import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

function Soldier({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Group>(null!)
  const bobOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (meshRef.current) {
      // Bob animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 8 + bobOffset) * 0.05
      // Slight rotation while marching
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8 + bobOffset) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Hat */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.1, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Ammo belt */}
      <mesh position={[0, 0.3, 0.15]} rotation={[0.3, 0, 0]} castShadow>
        <torusGeometry args={[0.25, 0.05, 8, 16]} />
        <meshStandardMaterial color="#78716c" metalness={0.5} />
      </mesh>

      {/* Gun */}
      <group position={[0.25, 0.4, 0.1]} rotation={[0, 0, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#57534e" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
          <meshStandardMaterial color="#44403c" metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

export default function SoldierGroup() {
  const { soldiers, gameProgress, lanePosition } = useGame()
  const groupRef = useRef<THREE.Group>(null!)
  const targetLaneX = useRef(0)

  useEffect(() => {
    targetLaneX.current = lanePosition * 2.5
  }, [lanePosition])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetLaneX.current,
        0.1
      )
    }
  })

  // Generate soldier positions in formation
  const soldierPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const cols = Math.min(5, Math.ceil(Math.sqrt(soldiers)))
    const spacing = 0.6

    for (let i = 0; i < soldiers; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = (col - (cols - 1) / 2) * spacing
      const z = row * spacing
      positions.push([x, 0, z])
    }
    return positions
  }, [soldiers])

  return (
    <group ref={groupRef} position={[0, 0, -gameProgress]}>
      {soldierPositions.map((pos, i) => (
        <Soldier key={`soldier-${i}-${soldiers}`} position={pos} index={i} />
      ))}
    </group>
  )
}
