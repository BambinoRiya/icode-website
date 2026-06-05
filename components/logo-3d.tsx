"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense } from "react"
import * as THREE from "three"

function RotatingLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cube element as logo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#e53888"
          metalness={0.7}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Glowing cube outline */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshStandardMaterial
          color="#e53888"
          transparent
          opacity={0.2}
          wireframe={true}
        />
      </mesh>

      {/* Glowing backdrop plane */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.5, 1.2]} />
        <meshStandardMaterial
          color="#e53888"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Decorative ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#e53888"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#e53888"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer tilted ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.1, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#e53888"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  )
}

function FloatingParticle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle = (index / 12) * Math.PI * 2
  const radius = 2 + (index % 3) * 0.3

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + index * 0.5
      meshRef.current.position.x = Math.cos(angle + t * 0.3) * radius
      meshRef.current.position.z = Math.sin(angle + t * 0.3) * radius
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#e53888"
        emissive="#e53888"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e53888" transparent opacity={0.3} />
    </mesh>
  )
}export function Logo3D() {
  return (
    <div className="w-full h-[400px] lg:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#e53888" />
          <pointLight position={[0, 0, 2]} intensity={1} color="#e53888" />
          
          <RotatingLogo />
        </Suspense>
      </Canvas>
    </div>
  )
}
