"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

/**
 * Post-processing cinématographique :
 *
 * - Bloom : les lumières émissives (lentille Cooke orange, écrans DIT,
 *   voyant REC, lampes projecteurs) débordent. C'est ce qui donne
 *   l'aspect "cinéma" plutôt que "CGI plat".
 * - Vignette : assombrissement progressif aux bords, focalise le regard
 *   sur le centre. Brief : ambiance plateau cinéma.
 * - Noise : film grain subtil. Donne la matière "pellicule" et casse
 *   le rendu lisse digital.
 * - ChromaticAberration : très léger (offset 0.0006) en permanence,
 *   monte plus fort pendant le tunnel (phase 7) via l'overlay HTML.
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette
        offset={0.25}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.OVERLAY}
        opacity={0.18}
      />
      <ChromaticAberration
        offset={new Vector2(0.0006, 0.0006)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}
