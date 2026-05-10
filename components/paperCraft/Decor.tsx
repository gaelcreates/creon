/**
 * Étape 4-5 — Décor environnant : mur arrière + étagère/livres + plante + polaroids.
 *
 * Placés en arrière-plan derrière le bureau pour donner de la profondeur
 * pendant les panoramiques caméra (étape 7).
 */
export function Decor() {
  return (
    <group>
      {/* ─── Mur arrière (large plane vertical) ─── */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#d4c5a8" roughness={0.95} flatShading />
      </mesh>

      {/* ─── Étagère + livres (à gauche au mur) ─── */}
      <Bookshelf position={[-3.4, 1.5, -2.4]} />

      {/* ─── Polaroids (au mur, à gauche au-dessus de l'étagère) ─── */}
      <Polaroid position={[-2.2, 2.5, -2.4]} rotation={[0, 0, 0.08]} tone="#f4ead4" />
      <Polaroid position={[-1.5, 2.7, -2.4]} rotation={[0, 0, -0.05]} tone="#ede0c4" />
      <Polaroid position={[-2.6, 3.1, -2.4]} rotation={[0, 0, 0.12]} tone="#f9f4ea" />
      <Polaroid position={[-1.7, 3.3, -2.4]} rotation={[0, 0, -0.1]} tone="#e8d9b8" />

      {/* ─── Plante en pot (à droite, devant le mur) ─── */}
      <Plant position={[3.4, 0, -1.6]} />

      {/* ─── Affiche de cinéma (large plane au mur, à droite) ─── */}
      <mesh position={[2.4, 2.4, -2.45]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial color="#b13d3d" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[2.4, 2.4, -2.43]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshStandardMaterial color="#100609" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Bookshelf({ position }: { position: [number, number, number] }) {
  // 6 livres alignés, hauteurs et couleurs variées
  const books = [
    { color: "#b13d3d", h: 0.58, w: 0.13 },
    { color: "#2a4f3a", h: 0.62, w: 0.11 },
    { color: "#ede0c4", h: 0.55, w: 0.14 },
    { color: "#ff7a00", h: 0.6, w: 0.12 },
    { color: "#1e1a16", h: 0.65, w: 0.13 },
    { color: "#7a8b6a", h: 0.5, w: 0.15 },
  ];

  return (
    <group position={position}>
      {/* Planche horizontale */}
      <mesh>
        <boxGeometry args={[1.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#a98559" roughness={0.85} flatShading />
      </mesh>
      {/* Livres alignés */}
      {books.map((b, i) => {
        const offset =
          books.slice(0, i).reduce((sum, bb) => sum + bb.w + 0.005, 0) -
          0.85;
        return (
          <mesh
            key={i}
            position={[offset + b.w / 2, b.h / 2 + 0.03, 0]}
            castShadow
          >
            <boxGeometry args={[b.w, b.h, 0.22]} />
            <meshStandardMaterial color={b.color} roughness={0.7} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

function Polaroid({
  position,
  rotation,
  tone,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  tone: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cadre blanc */}
      <mesh>
        <planeGeometry args={[0.42, 0.5]} />
        <meshStandardMaterial color="#fbf3e2" roughness={0.9} flatShading />
      </mesh>
      {/* "Photo" intérieure (zone colorée) */}
      <mesh position={[0, 0.04, 0.001]}>
        <planeGeometry args={[0.34, 0.34]} />
        <meshStandardMaterial color={tone} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.4, 16]} />
        <meshStandardMaterial color="#a06040" roughness={0.85} flatShading />
      </mesh>
      {/* Feuilles : 6 plans verts inclinés à différents angles */}
      {[
        { rot: [-0.3, 0, 0.4], pos: [0.15, 0.7, 0] },
        { rot: [-0.2, 1.5, -0.3], pos: [-0.15, 0.65, 0.05] },
        { rot: [-0.4, 0.8, 0.2], pos: [0.05, 0.85, -0.1] },
        { rot: [-0.1, -1, -0.5], pos: [-0.1, 0.75, -0.05] },
        { rot: [-0.5, 2.2, 0.1], pos: [0.1, 0.95, 0.1] },
        { rot: [-0.3, -2, 0.3], pos: [-0.05, 0.8, 0.12] },
      ].map((leaf, i) => (
        <mesh
          key={i}
          position={leaf.pos as [number, number, number]}
          rotation={leaf.rot as [number, number, number]}
        >
          <planeGeometry args={[0.32, 0.55]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#3d6b4a" : "#5a8a5e"}
            roughness={0.85}
            flatShading
            side={2}
          />
        </mesh>
      ))}
    </group>
  );
}
