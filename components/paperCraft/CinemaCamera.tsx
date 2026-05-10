/**
 * Étape 6 + 8 — Caméra ciné stylisée + tunnel objectif.
 *
 * Position [2, 0.4, -0.3] : à droite sur le bureau, lentille pointée vers +Z
 * (vers l'utilisateur). C'est l'objet final que la caméra va viser puis
 * traverser à la phase 5 de la timeline GSAP.
 *
 * - Corps : assemblage de boxes noir mat
 * - Magazine (rouleau du dessus) : cylindre couché
 * - Objectif : cylindre face devant
 * - Voyant REC : petit cube rouge avec emissive (s'allume en phase 4)
 * - Trépied : 3 cylindres minces qui partent du dessous de la caméra
 * - Tunnel intérieur : 4 anneaux concentriques visible au passage
 */
export function CinemaCamera() {
  return (
    <group position={[2, 0.4, -0.3]}>
      {/* Corps principal */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.5, 0.55]} />
        <meshStandardMaterial color="#1a1612" roughness={0.7} flatShading />
      </mesh>

      {/* Magazine (rouleau du dessus, cylindre couché sur Z) */}
      <mesh position={[0, 0.42, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.45, 24]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} flatShading />
      </mesh>

      {/* Viseur (petit cube derrière) */}
      <mesh position={[0.25, 0.22, -0.3]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.18]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.6} flatShading />
      </mesh>

      {/* Objectif (cylindre devant pointé vers +Z) */}
      <group position={[0, -0.05, 0.5]}>
        {/* tube extérieur */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.4, 24, 1, true]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.5} flatShading side={2} />
        </mesh>
        {/* anneau frontal */}
        <mesh position={[0, 0, 0.2]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.15, 0.22, 32]} />
          <meshStandardMaterial color="#3a3530" roughness={0.4} flatShading side={2} />
        </mesh>
        {/* lentille (cercle légèrement orange — émet la lueur en phase 4) */}
        <mesh position={[0, 0, 0.21]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial
            color="#ff7a00"
            emissive="#ff7a00"
            emissiveIntensity={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* ─── Tunnel intérieur (anneaux concentriques en profondeur) ─── */}
        {/* Ces anneaux deviennent visibles quand la caméra plonge dans l'objectif. */}
        {[0, 0.15, 0.3, 0.45].map((depth, i) => (
          <mesh key={i} position={[0, 0, -depth - 0.05]}>
            <ringGeometry args={[0.06 + i * 0.02, 0.14 - i * 0.02, 24]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#ff7a00" : "#2a1f15"}
              emissive={i % 2 === 0 ? "#ff7a00" : "#000000"}
              emissiveIntensity={0.3}
              side={2}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Voyant REC (petit cube rouge à droite, emissive) */}
      <mesh position={[0.3, 0.18, 0.15]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial
          color="#ff2a2a"
          emissive="#ff2a2a"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>

      {/* ─── Trépied (3 cylindres inclinés vers le sol) ─── */}
      <Tripod />
    </group>
  );
}

function Tripod() {
  // Pied : ~0.65 unités de descente depuis y=-0.25 (base de la caméra) jusqu'au sol y=0
  // En coordonnées locales, la caméra est à y=0 et le sol à y=-0.4.
  const legs = [
    { rot: [0.35, 0, 0.18] }, // avant-droit
    { rot: [0.35, Math.PI * 0.66, 0.18] }, // arrière-gauche
    { rot: [0.35, -Math.PI * 0.66, 0.18] }, // arrière-droit
  ];
  return (
    <group position={[0, -0.25, 0]}>
      {legs.map((leg, i) => (
        <mesh
          key={i}
          rotation={leg.rot as [number, number, number]}
          position={[0, -0.2, 0]}
        >
          <cylinderGeometry args={[0.018, 0.012, 0.5, 8]} />
          <meshStandardMaterial color="#1a1612" roughness={0.5} flatShading />
        </mesh>
      ))}
    </group>
  );
}
