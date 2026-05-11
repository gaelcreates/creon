"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particules vivantes — poussière + atomes lumineux qui flottent dans les
 * faisceaux des projecteurs. C'est la signature "monde vivant" du brief.
 *
 * 220 particules avec mouvement individuel (sin/cos + offset random),
 * pas juste une rotation rigide du groupe. Le mouvement est subtil
 * (amplitude 0.1) mais perceptible — on ressent que ça vit.
 */
export function Particles() {
  const COUNT = 220;

  const { positions, offsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const offsets = new Float32Array(COUNT * 3); // phase, freq, amp
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 6 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
      offsets[i * 3] = Math.random() * Math.PI * 2;
      offsets[i * 3 + 1] = 0.3 + Math.random() * 0.6;
      offsets[i * 3 + 2] = 0.05 + Math.random() * 0.12;
    }
    return { positions, offsets };
  }, []);

  const ref = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => positions.slice(), [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const phase = offsets[i * 3];
      const freq = offsets[i * 3 + 1];
      const amp = offsets[i * 3 + 2];
      arr[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t * freq + phase) * amp;
      arr[i * 3] = basePositions[i * 3] + Math.cos(t * freq * 0.7 + phase) * amp * 0.5;
    }
    attr.needsUpdate = true;
    // léger drift global pour empêcher la sensation de boucle
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fff0d0"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
