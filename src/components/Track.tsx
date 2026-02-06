import { useMemo } from 'react'
import * as THREE from 'three'

interface TrackProps {
  length: number
}

export default function Track({ length }: TrackProps) {
  const stripes = useMemo(() => {
    const arr = []
    for (let i = 0; i < length; i += 10) {
      arr.push(
        <mesh key={`stripe-${i}`} position={[0, 0.02, -i]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )
    }
    return arr
  }, [length])

  return (
    <group>
      {/* Main track */}
      <mesh position={[0, 0, -length / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, length]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Lane dividers */}
      <mesh position={[-2.5, 0.01, -length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, length]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[2.5, 0.01, -length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, length]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Road stripes */}
      {stripes}

      {/* Side rails - left */}
      <mesh position={[-4.2, 0.5, -length / 2]}>
        <boxGeometry args={[0.4, 1, length]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Side rails - right */}
      <mesh position={[4.2, 0.5, -length / 2]}>
        <boxGeometry args={[0.4, 1, length]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Water/ground */}
      <mesh position={[0, -0.5, -length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, length + 50]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  )
}
