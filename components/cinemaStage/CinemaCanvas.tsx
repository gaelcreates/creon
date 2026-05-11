"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Lighting } from "./Lighting";
import { Stage } from "./Stage";
import { Particles } from "./Particles";
import { CameraRig } from "./CameraRig";
import { PostFX } from "./PostFX";

type Props = {
  reducedMotion?: boolean;
};

/**
 * Orchestrateur du Canvas R3F pour le hero CREON.
 * Lazy-load only côté client (WebGL) via dynamic() dans le wrapper.
 *
 * En reduced-motion : on initialise la caméra à la position finale (juste
 * après le push-in dans l'objectif, état stable) et on skip la timeline.
 */
export default function CinemaCanvas({ reducedMotion = false }: Props) {
  const initialPos: [number, number, number] = reducedMotion
    ? [1.5, 1.65, 1.5]
    : [-4, 0.3, 6];
  const initialFov = reducedMotion ? 60 : 45;

  return (
    <Canvas
      camera={{ position: initialPos, fov: initialFov, near: 0.05, far: 50 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: 3, // ACESFilmicToneMapping
        toneMappingExposure: 1.1,
      }}
      shadows
    >
      <Suspense fallback={null}>
        <Lighting />
        <Stage />
        <Particles />
        {!reducedMotion && <CameraRig />}
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
