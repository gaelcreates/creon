"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Desk } from "./Desk";

/**
 * Étape 1 du brief — Canvas R3F vide avec caméra + lights.
 * Fond beige #fbf3e2 géré côté CSS sur la section parente.
 *
 * Caméra : position [0, 1.5, 6], fov 60 (vue bureau légèrement en plongée).
 * Lights :
 *   - AmbientLight 0.6 (lumière diffuse globale)
 *   - DirectionalLight 0.8 venant de la droite (simule fenêtre)
 *   - PointLight orange tamisée (rappel CREON, intensité posera la lampe d'archi en étape 5)
 *
 * Étapes suivantes ajouteront : bureau, papiers, ordinateur, etc.
 */
export default function PaperCraftCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // Pas de bg sur le canvas lui-même → laisse passer le beige de la section
    >
      <Suspense fallback={null}>
        <Lights />
        <Desk />
        {/* Étapes 3-6 : <DeskItems />, <Computer />, <Wall />, etc. */}
      </Suspense>
    </Canvas>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 4, 3]}
        intensity={0.8}
        color="#fff5e6"
      />
      <pointLight
        position={[-2, 2.5, 2]}
        intensity={0.6}
        color="#ff7a00"
        distance={6}
        decay={2}
      />
    </>
  );
}
