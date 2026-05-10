"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

/**
 * Étape 7-8 — Timeline GSAP qui pilote la caméra Three.js.
 *
 * 5 phases (synchronisées avec le brief) :
 *   Phase 1 (0 → 1.5s)   : statique [0, 1.5, 6] regarde [0, 0, 0]
 *   Phase 2 (1.5 → 3s)   : panoramique gauche → [-3, 1.5, 4], lookat [1, 0, 0]
 *   Phase 3 (3 → 4s)     : panoramique droit → [3, 1.2, 3], lookat [2, 0.5, 0]
 *   Phase 4 (4 → 5s)     : convergence → [2, 0.8, 1.5]
 *   Phase 5 (5 → 5.5s)   : plongée + FOV 60→90 → [2, 0.5, 0.3]
 *
 * Le lookAt se gère via un proxy Vector3 (target) animé en parallèle, et
 * useFrame appelle camera.lookAt(target) à chaque frame.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Reset position/orientation au mount (cas où la caméra arrive avec autre état)
    camera.position.set(0, 1.5, 6);
    target.current.set(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 60;
      camera.updateProjectionMatrix();
    }

    const tl = gsap.timeline();

    // Phase 2 : panoramique gauche (commence à t=1.5s)
    tl.to(
      camera.position,
      { x: -3, y: 1.5, z: 4, duration: 1.5, ease: "power2.inOut" },
      1.5,
    );
    tl.to(
      target.current,
      { x: 1, y: 0, z: 0, duration: 1.5, ease: "power2.inOut" },
      1.5,
    );

    // Phase 3 : panoramique droit (rapide)
    tl.to(camera.position, {
      x: 3,
      y: 1.2,
      z: 3,
      duration: 1,
      ease: "power2.inOut",
    });
    tl.to(
      target.current,
      { x: 2, y: 0.5, z: 0, duration: 1, ease: "power2.inOut" },
      "<",
    );

    // Phase 4 : convergence vers la caméra ciné
    tl.to(camera.position, {
      x: 2,
      y: 0.8,
      z: 1.5,
      duration: 1,
      ease: "power3.in",
    });

    // Phase 5 : plongée dans l'objectif + FOV s'ouvre (effet immersif)
    tl.to(camera.position, {
      x: 2,
      y: 0.5,
      z: 0.3,
      duration: 0.5,
      ease: "power3.in",
    });
    if (camera instanceof THREE.PerspectiveCamera) {
      tl.to(
        camera,
        {
          fov: 90,
          duration: 0.5,
          ease: "power3.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        },
        "<",
      );
    }

    return () => {
      tl.kill();
    };
  }, [camera]);

  // À chaque frame : la caméra regarde le proxy target (qui suit la timeline)
  useFrame(() => {
    camera.lookAt(target.current);
  });

  return null;
}
