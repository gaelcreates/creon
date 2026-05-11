"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

/**
 * Timeline GSAP qui pilote la caméra Three.js à travers les 10 plans du
 * storyboard hero v07 (durée totale ≈ 11.7s).
 *
 *  #  PHASE       DURÉE  CAM ACTION                  DESCRIPTION
 *  01 ENTER       1.5s   crane low → drift           Entrée au ras du sol
 *  02 DRIFT       1.5s   rise 30cm → 90cm            Contour apple boxes
 *  03 WIDE        1.5s   shoulder height · pan       Wide plateau entier
 *  04 PUSH-IN     1.5s   glide → desk                Plongée sur le DIT desk
 *  05 PIVOT       1.5s   arc R → camera              Pivot vers caméra principale
 *  06 LENS        1.5s   push-in lent                L'objectif Cooke plein cadre
 *  07 TUNNEL      0.8s   through lens                Tunnel optique
 *  08 DEVELOP     0.5s   cross-dissolve              Le papier se développe (flash blanc)
 *  09 REVEAL      0.7s   pull-out                    CREON s'écrit (overlay HTML)
 *  10 SETTLED     1.0s   static · final              State final
 *
 * La caméra suit un proxy Vector3 (target) animé en parallèle ; useFrame
 * applique camera.lookAt(target) à chaque frame, donnant un mouvement fluide.
 * Le FOV s'ouvre de 45 → 95 pendant la phase 07 (effet fish-eye / tunnel).
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3(0, 1.5, 0));

  useEffect(() => {
    // Reset état de la caméra au mount
    camera.position.set(-4, 0.3, 6);
    target.current.set(0, 1.5, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
    }

    const tl = gsap.timeline();

    // ── PHASE 02 — DRIFT (1.5s) : monte 30→90cm, drift latéral ──
    tl.to(
      camera.position,
      { x: -2.5, y: 0.9, z: 5.5, duration: 1.5, ease: "power2.inOut" },
      1.5,
    );
    tl.to(
      target.current,
      { x: 0.5, y: 1.5, z: 0, duration: 1.5, ease: "power2.inOut" },
      1.5,
    );

    // ── PHASE 03 — WIDE (1.5s) : épaule, pan plateau entier ──
    tl.to(camera.position, {
      x: 0,
      y: 1.7,
      z: 7,
      duration: 1.5,
      ease: "power2.inOut",
    });
    tl.to(
      target.current,
      { x: 1, y: 1.5, z: -1, duration: 1.5, ease: "power2.inOut" },
      "<",
    );

    // ── PHASE 04 — PUSH-IN (1.5s) : glide vers DIT desk ──
    tl.to(camera.position, {
      x: -1.8,
      y: 1.4,
      z: 3,
      duration: 1.5,
      ease: "power2.inOut",
    });
    tl.to(
      target.current,
      { x: -3.2, y: 1.1, z: 0.3, duration: 1.5, ease: "power2.inOut" },
      "<",
    );

    // ── PHASE 05 — PIVOT (1.5s) : arc droite vers caméra principale ──
    tl.to(camera.position, {
      x: 1.5,
      y: 1.6,
      z: 2.5,
      duration: 1.5,
      ease: "power2.inOut",
    });
    tl.to(
      target.current,
      { x: 1.5, y: 1.65, z: -0.2, duration: 1.5, ease: "power2.inOut" },
      "<",
    );

    // ── PHASE 06 — LENS (1.5s) : push-in lent vers l'objectif Cooke ──
    tl.to(camera.position, {
      x: 1.5,
      y: 1.65,
      z: 1.5,
      duration: 1.5,
      ease: "power3.in",
    });
    tl.to(
      target.current,
      { x: 1.5, y: 1.65, z: 0.1, duration: 1.5, ease: "power3.in" },
      "<",
    );

    // ── PHASE 07 — TUNNEL (0.8s) : traversée objectif + FOV s'ouvre ──
    tl.to(camera.position, {
      x: 1.5,
      y: 1.65,
      z: 0.55,
      duration: 0.8,
      ease: "power3.in",
    });
    if (camera instanceof THREE.PerspectiveCamera) {
      tl.to(
        camera,
        {
          fov: 95,
          duration: 0.8,
          ease: "power3.in",
          onUpdate: () =>
            (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        },
        "<",
      );
    }

    // Phase 08 DEVELOP (0.5s) + 09 REVEAL (0.7s) + 10 SETTLED (1.0s)
    // sont gérées côté wrapper (overlay HTML / flash / handwriting).
    // La caméra reste figée pendant ces phases.

    return () => {
      tl.kill();
    };
  }, [camera]);

  useFrame(() => {
    camera.lookAt(target.current);
  });

  return null;
}
