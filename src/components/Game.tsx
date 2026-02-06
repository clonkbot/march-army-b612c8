import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Sky, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'
import Track from './Track'
import SoldierGroup from './SoldierGroup'
import Gate from './Gate'
import Obstacle from './Obstacle'
import Enemy from './Enemy'

export default function Game() {
  const { gameState, currentLevel, levels, gameProgress, setGameProgress, soldiers, lanePosition, setLanePosition } = useGame()
  const groupRef = useRef<THREE.Group>(null!)
  const { camera, gl } = useThree()

  const level = levels[currentLevel]
  const trackLength = level?.trackLength || 100

  // Touch/mouse controls for lane switching
  useEffect(() => {
    if (gameState !== 'playing') return

    let startX = 0
    const threshold = 30

    const handleStart = (x: number) => {
      startX = x
    }

    const handleEnd = (x: number) => {
      const diff = x - startX
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && lanePosition < 1) {
          setLanePosition(lanePosition + 1)
        } else if (diff < 0 && lanePosition > -1) {
          setLanePosition(lanePosition - 1)
        }
      }
    }

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX)
    const onTouchEnd = (e: TouchEvent) => handleEnd(e.changedTouches[0].clientX)
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX)
    const onMouseUp = (e: MouseEvent) => handleEnd(e.clientX)

    const canvas = gl.domElement
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [gl, gameState, lanePosition, setLanePosition])

  // Game loop - move soldiers forward
  useFrame((state, delta) => {
    if (gameState !== 'playing') return

    const speed = 8
    setGameProgress(Math.min(gameProgress + delta * speed, trackLength))

    // Camera follow
    const targetZ = -gameProgress + 10
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    camera.lookAt(0, 0, -gameProgress - 5)
  })

  // Memoize static elements
  const gates = useMemo(() => {
    if (!level) return null
    return level.gates.map((gate, i) => (
      <Gate key={`gate-${i}`} gate={gate} index={i} />
    ))
  }, [level])

  const obstacles = useMemo(() => {
    if (!level) return null
    return level.obstacles.map((obstacle, i) => (
      <Obstacle key={`obstacle-${i}`} obstacle={obstacle} index={i} />
    ))
  }, [level])

  if (!level) return null

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Environment */}
      <Sky sunPosition={[100, 50, 100]} />
      <fog attach="fog" args={['#87ceeb', 30, 100]} />

      {/* Track */}
      <Track length={trackLength} />

      {/* Gates */}
      {gates}

      {/* Obstacles */}
      {obstacles}

      {/* Enemy at end */}
      <Enemy position={[0, 0, -trackLength + 5]} />

      {/* Soldiers */}
      <SoldierGroup />

      {/* Ground shadows */}
      <ContactShadows
        position={[0, 0.01, -trackLength / 2]}
        width={20}
        height={trackLength + 20}
        opacity={0.4}
        blur={2}
      />
    </>
  )
}
