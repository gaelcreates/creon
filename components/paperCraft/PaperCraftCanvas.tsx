"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { Desk } from "./Desk";
import { DeskItems } from "./DeskItems";
import { Decor } from "./Decor";
import { CinemaCamera } from "./CinemaCamera";
import { DustParticles } from "./Effects";
import { CameraRig } from "./CameraRig";

type Props = {
  /** Si true : pas de timeline GSAP, scene rendue dans son état "phase 7"
   * (caméra arrivée à destination), texte révélé immédiatement côté parent. */
  reducedMotion?: boolean;
};

/**
 * Canvas R3F orchestrateur — assemble bureau + objets + décor + caméra ciné
 * + particules. Pilote la timeline GSAP via <CameraRig />, sauf en mode
 * reduced-motion où on initialise directement à la position d'arrivée.
 *
 * Post-processing : ChromaticAberration léger en permanence, désactivé
 * en reduced-motion (économie GPU + plus sobre).
 */
export default function PaperCraftCanvas({ reducedMotion = false }: Props) {
  // Position initiale caméra :
  //  - mode normal : début de la timeline ([0, 1.5, 6])
  //  - reduced-motion : position finale ([2, 0.5, 0.3]) — vue plongée dans
  //    l'objectif, équivalent visuel de l'état "phase 7"
  const initialCamPos: [number, number, number] = reducedMotion
    ? [2, 0.5, 0.3]
    : [0, 1.5, 6];
  const initialFov = reducedMotion ? 90 : 60;

  return (
    <Canvas
      camera={{ position: initialCamPos, fov: initialFov }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Lights />
        <Desk />
        <DeskItems />
        <Decor />
        <CinemaCamera />
        <DustParticles />
        {!reducedMotion && <CameraRig />}
      </Suspense>

      {!reducedMotion && (
        <EffectComposer>
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0008, 0.0008)}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 4, 3]}
        intensity={0.85}
        color="#fff5e6"
        castShadow
      />
      {/* PointLight orange tamisée près de la lampe d'archi (étape 5) */}
      <pointLight
        position={[2.4, 0.9, -0.5]}
        intensity={0.9}
        color="#ff7a00"
        distance={4}
        decay={2}
      />
      {/* Petite fill light derrière pour décoller les objets du mur */}
      <pointLight
        position={[-2, 2, 1]}
        intensity={0.3}
        color="#fff5e6"
        distance={5}
        decay={2}
      />
    </>
  );
}
