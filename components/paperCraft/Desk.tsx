/**
 * Étape 2 — Bureau (Plane bois).
 *
 * Une grande PlaneGeometry posée à plat, vue en perspective depuis la caméra
 * [0, 1.5, 6]. Couleur bois clair sans texture externe (option B du brief :
 * 100% procédural, zéro fichier à gérer pour l'instant).
 *
 * - args [8, 4] : 8 unités de large, 4 de profondeur — remplit l'écran
 *   confortablement avec une caméra à 6 unités de distance.
 * - rotation -π/2 sur X : couche le plan à plat.
 * - position y=0 : pile au niveau du sol de la scène.
 * - flatShading + roughness élevée : aspect mat, pas de reflets brillants
 *   (on veut un feel "carton/papier", pas "vernis").
 * - couleur #c9a87a : chêne clair / bois pâle, chaud sans être saturé
 *   (s'harmonise avec le beige #fbf3e2 du fond).
 */
export function Desk() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 4]} />
      <meshStandardMaterial
        color="#c9a87a"
        roughness={0.85}
        metalness={0}
        flatShading
      />
    </mesh>
  );
}
