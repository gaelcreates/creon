/**
 * Étape 3-4 — Objets posés sur le bureau.
 *
 * Tout est procédural (pas de textures externes) : couleurs unies +
 * flatShading + roughness élevée pour un feel "carton/papier".
 *
 * Disposition (vue de dessus, X→droite, Z→profondeur) :
 *   - papiers à gauche-centre (zone éclairée par la lampe)
 *   - tasse loin à gauche
 *   - stylos éparpillés au centre
 *   - ordinateur (laptop ouvert) au fond
 *   - lampe d'archi à droite
 */
export function DeskItems() {
  return (
    <group>
      {/* ─── Papier 1 : feuille blanche posée à plat ─── */}
      <mesh position={[-0.5, 0.005, 0.3]} rotation={[-Math.PI / 2, 0, 0.18]}>
        <planeGeometry args={[1.4, 1.9]} />
        <meshStandardMaterial color="#f9f4ea" roughness={0.95} flatShading />
      </mesh>

      {/* ─── Papier 2 : feuille ivoire légèrement décalée ─── */}
      <mesh position={[0.4, 0.012, -0.1]} rotation={[-Math.PI / 2, 0, -0.12]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial color="#ede0c4" roughness={0.95} flatShading />
      </mesh>

      {/* ─── Tasse : cylindre creme ─── */}
      <mesh position={[-1.9, 0.18, -0.4]} castShadow>
        <cylinderGeometry args={[0.18, 0.16, 0.36, 24]} />
        <meshStandardMaterial color="#ede4d3" roughness={0.7} flatShading />
      </mesh>
      {/* anse de la tasse — petit tore */}
      <mesh position={[-1.7, 0.2, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.018, 8, 16]} />
        <meshStandardMaterial color="#ede4d3" roughness={0.7} flatShading />
      </mesh>

      {/* ─── Stylos (3 cylindres horizontaux inclinés) ─── */}
      <Pen position={[0.85, 0.04, 0.65]} rotation={[0, 0.2, Math.PI / 2]} color="#100609" />
      <Pen position={[1.05, 0.04, 0.55]} rotation={[0, -0.1, Math.PI / 2]} color="#ff7a00" />
      <Pen position={[-1.3, 0.04, 0.55]} rotation={[0, -0.5, Math.PI / 2]} color="#b13d3d" />

      {/* ─── Ordinateur (laptop ouvert) ─── */}
      {/* Base / clavier */}
      <mesh position={[0.2, 0.04, -0.7]} castShadow>
        <boxGeometry args={[1.7, 0.06, 1.0]} />
        <meshStandardMaterial color="#c7c4be" roughness={0.6} flatShading />
      </mesh>
      {/* Écran (incliné en arrière) */}
      <mesh position={[0.2, 0.55, -1.15]} rotation={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 1.0, 0.05]} />
        <meshStandardMaterial color="#1e1a16" roughness={0.5} flatShading />
      </mesh>
      {/* Logo orange sur le dos de l'écran (face visible quand on regarde de devant) */}
      <mesh position={[0.2, 0.55, -1.18]} rotation={[-0.18, 0, 0]}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial color="#ff7a00" roughness={0.5} emissive="#ff7a00" emissiveIntensity={0.2} />
      </mesh>

      {/* ─── Lampe d'architecte (base + tige + abat-jour) ─── */}
      <Lamp position={[2.6, 0, -0.8]} />
    </group>
  );
}

function Pen({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 0.45, 12]} />
      <meshStandardMaterial color={color} roughness={0.5} flatShading />
    </mesh>
  );
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.06, 24]} />
        <meshStandardMaterial color="#2a2520" roughness={0.6} flatShading />
      </mesh>
      {/* Tige verticale */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 12]} />
        <meshStandardMaterial color="#2a2520" roughness={0.5} flatShading />
      </mesh>
      {/* Tige inclinée */}
      <mesh position={[-0.18, 0.95, 0]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 12]} />
        <meshStandardMaterial color="#2a2520" roughness={0.5} flatShading />
      </mesh>
      {/* Abat-jour (cône inversé) */}
      <mesh position={[-0.42, 1.05, 0]} rotation={[0, 0, -0.45]}>
        <coneGeometry args={[0.18, 0.28, 16, 1, true]} />
        <meshStandardMaterial color="#ff7a00" roughness={0.6} flatShading side={2} />
      </mesh>
    </group>
  );
}
