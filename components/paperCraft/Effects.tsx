"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Étape 9 — Particules de poussière (dust motes).
 *
 * 80 points qui flottent dans la scène. Rotation très lente du groupe
 * pour un effet "ambiance" (pas de mouvement individuel — léger et perf-safe).
 */
export function DustParticles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 3 + 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={80}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fff5e6"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}
