"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Plateau de tournage AGRANDI (20x20 unités au sol, mur à z=-12).
 *
 * Composition :
 * - Sol : grande plane bois clair (papier-3 #fbf3e2 + flatShading), receive shadow
 * - Cyclo (mur courbe) : plane verticale beige #ede0c4 derrière, donne la
 *   profondeur d'un vrai studio (pas un mur sec)
 * - Plafond : très haut, dark (suggère l'espace cinema)
 * - Apple boxes éparpillées sur le plateau (4 caisses bois)
 * - Câbles au sol (lines courbes noires)
 * - Bandes de gaffer tape (rectangles fluo subtils au sol)
 * - Bureau DIT (2 monitors + clavier + papiers)
 */
export function Stage() {
  return (
    <group>
      {/* ─── SOL (grand plan horizontal) ─── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial
          color="#d9c9a4"
          roughness={0.95}
          metalness={0}
          flatShading
        />
      </mesh>

      {/* ─── CYCLO (mur de fond) ─── */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial
          color="#ede0c4"
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* ─── PLAFOND léger (pour fermer la scène à hauteur cinéma) ─── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 9, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#2a1f17" roughness={0.95} side={2} />
      </mesh>

      {/* ─── BANDES DE GAFFER TAPE au sol (deux lignes parallèles fluo) ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.005, 1.2]}>
        <planeGeometry args={[0.08, 6]} />
        <meshStandardMaterial color="#ff7a00" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.2, 0.005, 1.2]}>
        <planeGeometry args={[0.08, 6]} />
        <meshStandardMaterial color="#ff7a00" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.005, -1.5]}>
        <planeGeometry args={[5, 0.08]} />
        <meshStandardMaterial color="#c63838" roughness={0.5} />
      </mesh>

      {/* ─── APPLE BOXES (caisses bois éparpillées) ─── */}
      <AppleBox position={[-3.8, 0, 2.2]} rotation={0.3} />
      <AppleBox position={[4.2, 0, 2.8]} rotation={-0.4} stacked />
      <AppleBox position={[-5.5, 0, -0.5]} rotation={0.1} />
      <AppleBox position={[5.6, 0, -2.0]} rotation={0.7} />

      {/* ─── CÂBLES (lignes courbes au sol) ─── */}
      <Cable
        points={[
          [-4, 0.02, 1.5],
          [-2, 0.02, 0.5],
          [0, 0.02, 1.2],
          [2, 0.02, 0.3],
          [4, 0.02, 0.8],
        ]}
      />
      <Cable
        points={[
          [-5, 0.02, -1],
          [-3, 0.02, -2],
          [-1, 0.02, -1.5],
          [1, 0.02, -2.2],
        ]}
        color="#1a1612"
      />

      {/* ─── BUREAU DIT (à gauche, 2 monitors + clavier) ─── */}
      <DITDesk position={[-3.2, 0, 0.3]} />

      {/* ─── CAMÉRA PRINCIPALE (au centre, c'est le sujet de la scène) ─── */}
      <MainCamera position={[1.5, 0, -0.5]} />

      {/* ─── PROJECTEURS suspendus (3 spots cinéma haut placés) ─── */}
      <Projector position={[-5, 6.5, 2]} aimAt={[0, 1, 0]} />
      <Projector position={[5.5, 7, 1]} aimAt={[1, 1, -0.5]} />
      <Projector position={[0, 7.2, -3]} aimAt={[0, 1, 0]} />

      {/* ─── PORTANT (C-stand) pour vraisemblance ─── */}
      <CStand position={[-6, 0, 3.5]} />
      <CStand position={[6.2, 0, 3.2]} />
    </group>
  );
}

// ============================================================
// AppleBox : caisse en bois cinéma (gros parallélépipède bois)
// ============================================================
function AppleBox({
  position,
  rotation = 0,
  stacked = false,
}: {
  position: [number, number, number];
  rotation?: number;
  stacked?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.5, 0.45]} />
        <meshStandardMaterial color="#a98559" roughness={0.85} flatShading />
      </mesh>
      {/* poignée en haut (rectangle noir) */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[0.25, 0.04, 0.06]} />
        <meshStandardMaterial color="#100609" roughness={0.7} flatShading />
      </mesh>
      {stacked && (
        <>
          <mesh position={[0, 0.85, 0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.5, 0.45]} />
            <meshStandardMaterial
              color="#b89165"
              roughness={0.85}
              flatShading
            />
          </mesh>
          <mesh position={[0, 1.11, 0.1]}>
            <boxGeometry args={[0.25, 0.04, 0.06]} />
            <meshStandardMaterial color="#100609" roughness={0.7} flatShading />
          </mesh>
        </>
      )}
    </group>
  );
}

// ============================================================
// Cable : ligne courbe au sol (TubeGeometry sur courbe Bezier)
// ============================================================
function Cable({
  points,
  color = "#0d0a08",
}: {
  points: [number, number, number][];
  color?: string;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    return new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
  }, [points]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} roughness={0.7} flatShading />
    </mesh>
  );
}

// ============================================================
// DITDesk : bureau du Digital Imaging Technician
// 2 monitors + clavier + tasse + papier sur une table noire
// ============================================================
function DITDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* plateau de table */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.04, 0.9]} />
        <meshStandardMaterial color="#1a1612" roughness={0.6} flatShading />
      </mesh>
      {/* 4 pieds */}
      {[
        [-0.85, 0.38, -0.4],
        [0.85, 0.38, -0.4],
        [-0.85, 0.38, 0.4],
        [0.85, 0.38, 0.4],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.76, 8]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.5} flatShading />
        </mesh>
      ))}
      {/* monitor 1 (face vers la caméra principale) */}
      <group position={[-0.45, 1.05, 0]} rotation={[0, 0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.42, 0.04]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.4} flatShading />
        </mesh>
        {/* écran émissif */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.62, 0.36]} />
          <meshStandardMaterial
            color="#3a5a82"
            emissive="#3a5a82"
            emissiveIntensity={0.45}
            roughness={0.3}
          />
        </mesh>
        {/* pied du monitor */}
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.05]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.5} />
        </mesh>
      </group>
      {/* monitor 2 */}
      <group position={[0.45, 1.05, 0]} rotation={[0, -0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.42, 0.04]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.4} flatShading />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.62, 0.36]} />
          <meshStandardMaterial
            color="#5a4a3a"
            emissive="#ff7a00"
            emissiveIntensity={0.55}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.05]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.5} />
        </mesh>
      </group>
      {/* clavier */}
      <mesh position={[0, 0.79, 0.32]} castShadow>
        <boxGeometry args={[0.5, 0.025, 0.18]} />
        <meshStandardMaterial color="#2a2520" roughness={0.6} flatShading />
      </mesh>
      {/* tasse de café */}
      <mesh position={[0.7, 0.86, 0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#ede4d3" roughness={0.7} flatShading />
      </mesh>
      {/* papier de notes */}
      <mesh
        position={[-0.75, 0.78, 0.2]}
        rotation={[-Math.PI / 2, 0, 0.15]}
      >
        <planeGeometry args={[0.22, 0.3]} />
        <meshStandardMaterial color="#fbf3e2" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

// ============================================================
// MainCamera : LA caméra cinéma au centre (objectif Cooke stylisé)
// C'est le sujet vers lequel la camera virtuelle plonge en phase 6
// ============================================================
function MainCamera({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* TRÉPIED haut (3 pieds robustes) */}
      <Tripod />

      {/* TÊTE FLUIDE (entre trépied et caméra) */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.18, 16]} />
        <meshStandardMaterial color="#1a1612" roughness={0.5} flatShading />
      </mesh>

      {/* CORPS CAMÉRA — gros parallélépipède noir */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[0.85, 0.5, 0.65]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.55} flatShading />
      </mesh>

      {/* Détails sur le corps : poignée, viseur, lectures écran */}
      {/* Mini écran à l'arrière */}
      <mesh position={[0, 1.7, -0.34]}>
        <planeGeometry args={[0.3, 0.18]} />
        <meshStandardMaterial
          color="#ff7a00"
          emissive="#ff7a00"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Poignée latérale haut */}
      <mesh position={[0.35, 1.95, 0]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.16]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.5} />
      </mesh>
      {/* Magazine (rouleau du dessus) */}
      <mesh
        position={[0, 1.98, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.18, 0.18, 0.4, 24]} />
        <meshStandardMaterial color="#1a1612" roughness={0.6} flatShading />
      </mesh>
      {/* Voyant REC rouge émissif */}
      <mesh position={[0.42, 1.7, 0.3]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#ff2a2a"
          emissive="#ff2a2a"
          emissiveIntensity={1.5}
          roughness={0.3}
        />
      </mesh>

      {/* OBJECTIF COOKE — gros cylindre devant (CE QU'ON VA TRAVERSER) */}
      <CookeLens position={[0, 1.65, 0.6]} />
    </group>
  );
}

function Tripod() {
  // 3 pieds inclinés depuis y=1.35 (base de la tête) vers y=0
  const legs = [
    { angle: 0 },
    { angle: (Math.PI * 2) / 3 },
    { angle: (Math.PI * 4) / 3 },
  ];
  return (
    <group>
      {legs.map((leg, i) => {
        const x = Math.cos(leg.angle) * 0.55;
        const z = Math.sin(leg.angle) * 0.55;
        return (
          <mesh
            key={i}
            position={[x * 0.5, 0.7, z * 0.5]}
            rotation={[
              Math.sin(leg.angle) * 0.35,
              0,
              -Math.cos(leg.angle) * 0.35,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.02, 1.5, 8]} />
            <meshStandardMaterial color="#1a1612" roughness={0.5} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

function CookeLens({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tube principal (long cylindre) — pointe vers +Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.65, 32]} />
        <meshStandardMaterial color="#0a0805" roughness={0.45} flatShading />
      </mesh>
      {/* Anneau argenté frontal (focus ring) */}
      <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
        <meshStandardMaterial color="#7a7570" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Verre frontal — lentille émissive orange (rappel CREON) */}
      <mesh position={[0, 0, 0.33]}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial
          color="#ff7a00"
          emissive="#ff7a00"
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>
      {/* Reflet "fish-eye" central */}
      <mesh position={[0, 0, 0.34]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial
          color="#fff5e6"
          emissive="#fff5e6"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Anneaux concentriques visibles à l'intérieur (tunnel phase 7) */}
      {[0.08, 0.18, 0.3, 0.45].map((depth, i) => (
        <mesh key={i} position={[0, 0, -depth]}>
          <ringGeometry args={[0.04 + i * 0.018, 0.16 - i * 0.02, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ff7a00" : "#1a1612"}
            emissive={i % 2 === 0 ? "#ff7a00" : "#000000"}
            emissiveIntensity={i % 2 === 0 ? 0.4 : 0}
            side={2}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// Projector : projecteur cinéma suspendu avec faisceau lumineux
// (cône additif transparent qui simule la lumière dans la fumée)
// ============================================================
function Projector({
  position,
  aimAt,
}: {
  position: [number, number, number];
  aimAt: [number, number, number];
}) {
  // Direction du faisceau
  const direction = useMemo(() => {
    const dx = aimAt[0] - position[0];
    const dy = aimAt[1] - position[1];
    const dz = aimAt[2] - position[2];
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return [dx / len, dy / len, dz / len] as [number, number, number];
  }, [aimAt, position]);

  // Rotation pour orienter le cône faisceau le long de la direction
  const beamRotation = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3(...direction).negate(); // cone par défaut pointe vers +Y
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    return new THREE.Euler().setFromQuaternion(quat);
  }, [direction]);

  // Longueur du faisceau jusqu'à atteindre y=0
  const length = Math.abs(position[1] / direction[1]);

  return (
    <group position={position}>
      {/* Housing — gros cylindre noir cinéma */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.45, 24]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.5} flatShading />
      </mesh>
      {/* Avant — lentille jaune chaude émissive */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.08, 24]} />
        <meshStandardMaterial
          color="#ffd96b"
          emissive="#ffb030"
          emissiveIntensity={1.2}
          roughness={0.4}
        />
      </mesh>
      {/* Barn doors (volets latéraux noirs) */}
      <mesh
        position={[0.2, -0.3, 0]}
        rotation={[0, 0, -0.4]}
        castShadow
      >
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.6} />
      </mesh>
      <mesh
        position={[-0.2, -0.3, 0]}
        rotation={[0, 0, 0.4]}
        castShadow
      >
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.6} />
      </mesh>
      {/* Câble qui monte vers le plafond */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.0, 6]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.5} />
      </mesh>

      {/* FAISCEAU (god ray simulé — cône additif transparent) */}
      <mesh
        position={[
          direction[0] * length * 0.5,
          direction[1] * length * 0.5,
          direction[2] * length * 0.5,
        ]}
        rotation={beamRotation}
      >
        <coneGeometry args={[length * 0.45, length, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffc070"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// CStand : portant cinéma classique (poteau vertical + base 3 pieds)
// ============================================================
function CStand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base (3 bras horizontaux) */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 0.25,
            0.04,
            Math.sin(angle) * 0.25,
          ]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[0.5, 0.04, 0.08]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.5} />
        </mesh>
      ))}
      {/* Poteau vertical */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.025, 2.6, 8]} />
        <meshStandardMaterial color="#1a1612" roughness={0.5} flatShading />
      </mesh>
      {/* Knuckle (raccord) en haut */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.1]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.4} />
      </mesh>
    </group>
  );
}
