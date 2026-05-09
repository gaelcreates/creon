"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  onComplete: () => void;
};

const TOTAL_DURATION = 5.5; // seconds
const SHAPE_COUNT = 36;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInQuint(t: number): number {
  return t * t * t * t * t;
}

function CameraRig({ onComplete }: { onComplete: () => void }) {
  const startTime = useRef<number | null>(null);
  const completed = useRef(false);

  useFrame((state) => {
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - startTime.current;
    const camera = state.camera;

    if (elapsed < 3.5) {
      // Phase 1 — slow drift through the constellation
      const t = elapsed / 3.5;
      const eased = easeInOutCubic(t);
      camera.position.set(
        Math.sin(elapsed * 0.4) * 4,
        Math.cos(elapsed * 0.3) * 2.5,
        18 - eased * 14, // 18 → 4
      );
      camera.lookAt(0, 0, 0);
    } else if (elapsed < 5) {
      // Phase 2 — accelerate dive into wordmark
      const t = (elapsed - 3.5) / 1.5;
      const eased = easeInQuint(t);
      camera.position.set(0, 0, 4 - eased * 8); // 4 → -4 (passes through)
      camera.lookAt(0, 0, -10);
    } else if (elapsed < TOTAL_DURATION) {
      // Phase 3 — fade out (camera stays past the wordmark)
      camera.position.set(0, 0, -4);
      camera.lookAt(0, 0, -10);
    } else if (!completed.current) {
      completed.current = true;
      onComplete();
    }
  });

  return null;
}

function FloatingShapes() {
  // Pre-compute random shape positions / variations
  const shapes = useMemo(() => {
    return Array.from({ length: SHAPE_COUNT }).map((_, i) => {
      const angle = (i / SHAPE_COUNT) * Math.PI * 2;
      const radius = 4 + Math.random() * 8;
      return {
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 12,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.6,
        kind: i % 4,
        color: i % 3 === 0 ? "#ff7a00" : i % 3 === 1 ? "#ede0c4" : "#100609",
        speed: 0.5 + Math.random() * 1,
        floatI: 0.4 + Math.random() * 0.6,
        rotI: 0.3 + Math.random() * 0.4,
      };
    });
  }, []);

  return (
    <>
      {shapes.map((s, i) => (
        <Float
          key={i}
          speed={s.speed}
          rotationIntensity={s.rotI}
          floatIntensity={s.floatI}
        >
          <mesh
            position={s.position}
            rotation={s.rotation}
            scale={s.scale}
            castShadow
            receiveShadow
          >
            {s.kind === 0 && <icosahedronGeometry args={[1, 0]} />}
            {s.kind === 1 && <octahedronGeometry args={[1, 0]} />}
            {s.kind === 2 && <torusGeometry args={[0.8, 0.25, 16, 32]} />}
            {s.kind === 3 && <dodecahedronGeometry args={[0.85, 0]} />}
            <meshStandardMaterial
              color={s.color}
              roughness={s.color === "#100609" ? 0.6 : 0.3}
              metalness={s.color === "#ff7a00" ? 0.4 : 0.2}
              flatShading
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function CenterPortal() {
  // Glowing ring at center the camera passes through
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2;
      const pulse = 1 + Math.sin(t * 1.5) * 0.04;
      ringRef.current.scale.setScalar(pulse);
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer ring */}
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#ff7a00"
          emissive="#ff7a00"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      {/* Inner glow disc */}
      <mesh ref={innerRef}>
        <circleGeometry args={[1.85, 64]} />
        <meshStandardMaterial
          color="#f5ead5"
          emissive="#ff7a00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  // Simple floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      scale: 0.02 + Math.random() * 0.05,
    }));
  }, []);

  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#100609" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene3D({ onComplete }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 55, position: [0, 0, 18] }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Soft warm ambient + key light */}
      <ambientLight intensity={0.4} color="#f5ead5" />
      <directionalLight
        position={[6, 8, 6]}
        intensity={1.2}
        color="#fff5e0"
        castShadow
      />
      <pointLight
        position={[-6, -4, 4]}
        intensity={1}
        color="#ff7a00"
        distance={20}
      />
      <pointLight
        position={[0, 0, 8]}
        intensity={0.6}
        color="#ff7a00"
        distance={15}
      />

      <FloatingShapes />
      <CenterPortal />
      <ParticleField />

      <CameraRig onComplete={onComplete} />

      <Environment preset="apartment" />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#f5ead5", 12, 30]} />
    </Canvas>
  );
}
