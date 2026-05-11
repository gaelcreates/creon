"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cinematic 3-point lighting "chaude" (warm) — par le brief storyboard v07.
 *
 * - Key light : gros directional warm-orange devant-droit (lumière dominante,
 *   simule le projecteur principal d'un plateau)
 * - Fill light : ambient + soft directional cool-ish à gauche pour décoller
 *   les ombres dures (rim leger)
 * - Back light : directional warm derrière les sujets pour les détourer
 *   (rim chaud)
 * - Practicals : 3 pointlights orange chaude (rappel CREON) placées sur la
 *   scène, animées en flicker subtil pour le "monde vivant"
 *
 * Tous les directional lights ont castShadow=true ; les meshes du Stage
 * activeront receiveShadow et castShadow individuellement.
 */
export function Lighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const practical1 = useRef<THREE.PointLight>(null);
  const practical2 = useRef<THREE.PointLight>(null);
  const practical3 = useRef<THREE.PointLight>(null);

  // Light flicker subtil : amplitude 0.05 sur l'intensité, fréquences décalées
  // pour éviter une synchro perceptible. C'est ce qui rend la scène "vivante"
  // (vs. statique CGI sec).
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (keyRef.current) {
      keyRef.current.intensity = 2.2 + Math.sin(t * 0.7) * 0.05;
    }
    if (practical1.current) {
      practical1.current.intensity = 1.4 + Math.sin(t * 3.1) * 0.12;
    }
    if (practical2.current) {
      practical2.current.intensity = 1.2 + Math.sin(t * 2.3 + 1.4) * 0.15;
    }
    if (practical3.current) {
      practical3.current.intensity = 1.0 + Math.sin(t * 4.7 + 0.6) * 0.18;
    }
  });

  return (
    <>
      {/* Ambient — fill diffuse, faible pour garder du contraste */}
      <ambientLight intensity={0.35} color="#fff0d8" />

      {/* Hemisphere — gradient ciel→sol, donne du naturel */}
      <hemisphereLight args={["#fde4b8", "#3d2a1f", 0.45]} />

      {/* KEY LIGHT — projecteur principal, warm orange */}
      <directionalLight
        ref={keyRef}
        position={[6, 8, 4]}
        intensity={2.2}
        color="#ffb066"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0002}
      />

      {/* FILL LIGHT — soft, plus froid, gauche */}
      <directionalLight
        position={[-5, 5, 3]}
        intensity={0.55}
        color="#d8e4f0"
      />

      {/* BACK / RIM LIGHT — chaud, derrière, détoure les sujets */}
      <directionalLight
        position={[2, 4, -8]}
        intensity={1.0}
        color="#ff9540"
      />

      {/* PRACTICALS — 3 lampes orange chaudes (vivent dans la scène) */}
      <pointLight
        ref={practical1}
        position={[3.5, 1.2, 1.0]}
        intensity={1.4}
        color="#ff7a00"
        distance={6}
        decay={2}
      />
      <pointLight
        ref={practical2}
        position={[-3.0, 1.5, -1.0]}
        intensity={1.2}
        color="#ffa040"
        distance={5}
        decay={2}
      />
      <pointLight
        ref={practical3}
        position={[0, 0.6, 2.5]}
        intensity={1.0}
        color="#ffc080"
        distance={4}
        decay={2}
      />
    </>
  );
}
