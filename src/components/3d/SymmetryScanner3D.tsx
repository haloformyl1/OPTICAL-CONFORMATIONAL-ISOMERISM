import React, { useMemo } from 'react';
import { Sphere, Cylinder, Text, Plane, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D } from '../../types/isomerism';
import { Molecule3DViewer } from './Molecule3DViewer';

interface SymmetryScanner3DProps {
  structure: MolecularStructure3D;
  showPOS: boolean;
  posPlane: 'xy' | 'yz' | 'xz';
  showCOS: boolean;
  expectedPlane?: 'xy' | 'yz' | 'xz' | null;
  hasPOS?: boolean;
  showPlaneAnnotations?: boolean;
}

export const SymmetryScanner3D: React.FC<SymmetryScanner3DProps> = ({
  structure,
  showPOS,
  posPlane,
  showCOS,
  expectedPlane,
  hasPOS = false,
  showPlaneAnnotations = true,
}) => {
  // Plane orientations
  const planeRotation: [number, number, number] =
    posPlane === 'xy'
      ? [0, 0, 0]
      : posPlane === 'yz'
      ? [0, Math.PI / 2, 0]
      : [Math.PI / 2, 0, 0];

  // Find reflection pairs across the plane of symmetry
  const reflectionPairs = useMemo(() => {
    if (!showPOS) return [];
    const pairs: Array<{ p1: [number, number, number]; p2: [number, number, number]; element: string; label?: string }> = [];
    const used = new Set<string>();

    structure.atoms.forEach((a1) => {
      if (used.has(a1.id)) return;
      structure.atoms.forEach((a2) => {
        if (a1.id === a2.id || used.has(a2.id) || a1.element !== a2.element) return;
        const [x1, y1, z1] = a1.position;
        const [x2, y2, z2] = a2.position;

        let isReflected = false;
        if (posPlane === 'xz') {
          // Reflects across horizontal y = 0: (x, y, z) <-> (x, -y, z)
          isReflected = Math.abs(x1 - x2) < 0.25 && Math.abs(y1 + y2) < 0.25 && Math.abs(z1 - z2) < 0.25;
        } else if (posPlane === 'xy') {
          // Reflects across z = 0: (x, y, z) <-> (x, y, -z)
          isReflected = Math.abs(x1 - x2) < 0.25 && Math.abs(y1 - y2) < 0.25 && Math.abs(z1 + z2) < 0.25;
        } else if (posPlane === 'yz') {
          // Reflects across x = 0: (x, y, z) <-> (-x, y, z)
          isReflected = Math.abs(x1 + x2) < 0.25 && Math.abs(y1 - y2) < 0.25 && Math.abs(z1 - z2) < 0.25;
        }

        if (isReflected) {
          pairs.push({ p1: a1.position, p2: a2.position, element: a1.element, label: a1.label });
          used.add(a1.id);
          used.add(a2.id);
        }
      });
    });
    return pairs;
  }, [structure, showPOS, posPlane]);

  // Determine if this plane is a genuine plane of symmetry
  const isGenuinePOS = (hasPOS && posPlane === expectedPlane) || reflectionPairs.length >= 2;

  return (
    <group>
      {/* Underlying 3D Molecule */}
      <Molecule3DViewer structure={structure} showLabels={true} />

      {/* Plane of Symmetry (POS / sigma) Visualizer */}
      {showPOS && (
        <group>
          {/* Slicing Cutting Plane */}
          <group rotation={planeRotation}>
            <Plane args={[4.6, 4.6]}>
              <meshStandardMaterial
                color={isGenuinePOS ? '#10b981' : '#f43f5e'}
                transparent
                opacity={isGenuinePOS ? 0.32 : 0.22}
                side={THREE.DoubleSide}
                roughness={0.1}
              />
            </Plane>
            {/* Wireframe border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(4.6, 4.6)]} />
              <lineBasicMaterial color={isGenuinePOS ? '#34d399' : '#ef4444'} linewidth={2} />
            </lineSegments>
          </group>

          {/* Educational Billboard Label in 3D (Toggleable) */}
          {showPlaneAnnotations && (
            <Billboard position={[0, 2.7, 0]} follow={true}>
              {isGenuinePOS ? (
                <group>
                  <Text
                    fontSize={0.25}
                    color="#34d399"
                    outlineWidth={0.04}
                    outlineColor="#020617"
                    fontWeight="bold"
                    anchorY="bottom"
                  >
                    {posPlane === 'xz'
                      ? '✓ Genuine Horizontal Plane of Symmetry (σ): y = 0'
                      : '✓ Genuine Plane of Symmetry (σ)'}
                  </Text>
                  <Text
                    fontSize={0.15}
                    color="#a7f3d0"
                    outlineWidth={0.025}
                    outlineColor="#020617"
                    position={[0, -0.22, 0]}
                    anchorY="top"
                  >
                    {posPlane === 'xz'
                      ? 'Bisects C2-C3: Top (-COOH, -OH, -H) mirrors Bottom (-COOH, -OH, -H)'
                      : 'All atoms reflect into identical counterparts'}
                  </Text>
                </group>
              ) : (
                <group>
                  <Text
                    fontSize={0.24}
                    color="#f87171"
                    outlineWidth={0.04}
                    outlineColor="#020617"
                    fontWeight="bold"
                    anchorY="bottom"
                  >
                    ✕ NOT a Plane of Symmetry!
                  </Text>
                  <Text
                    fontSize={0.14}
                    color="#fca5a5"
                    outlineWidth={0.025}
                    outlineColor="#020617"
                    position={[0, -0.22, 0]}
                    anchorY="top"
                  >
                    {posPlane === 'xy'
                      ? 'Left (-H) ≠ Right (-OH). Slices between H and OH! Click [XZ] for true plane.'
                      : 'Mismatched groups across this plane. Click [XZ] for true horizontal plane.'}
                  </Text>
                </group>
              )}
            </Billboard>
          )}

          {/* Reflection Rays Connecting Symmetric Atom Pairs across the Plane */}
          {isGenuinePOS &&
            reflectionPairs.map((pair, idx) => {
              const v1 = new THREE.Vector3(...pair.p1);
              const v2 = new THREE.Vector3(...pair.p2);
              const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
              const dir = new THREE.Vector3().subVectors(v2, v1);
              const length = dir.length();
              const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());

              return (
                <group key={`ref-pair-${idx}`}>
                  <group position={mid} quaternion={quat}>
                    <Cylinder args={[0.018, 0.018, length, 8]}>
                      <meshBasicMaterial color="#34d399" transparent opacity={0.75} />
                    </Cylinder>
                  </group>
                  {/* Intersection reflection point on the plane */}
                  <Sphere args={[0.065, 12, 12]} position={mid}>
                    <meshBasicMaterial color="#6ee7b7" />
                  </Sphere>
                </group>
              );
            })}
        </group>
      )}

      {/* Center of Symmetry (COS / i) Visualizer */}
      {showCOS && (
        <group>
          {/* Inversion Center Point */}
          <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={0.6} />
          </Sphere>
          <Billboard position={[0, 0.38, 0]} follow={true}>
            <Text fontSize={0.2} color="#f472b6" outlineWidth={0.03} outlineColor="#020617" fontWeight="bold">
              Inversion Center (i)
            </Text>
          </Billboard>

          {/* Inversion Rays connecting inverted atom pairs */}
          {structure.atoms.map((atom) => {
            const p = atom.position;
            const dist = Math.hypot(p[0], p[1], p[2]);
            if (dist < 0.2) return null; // Center atom itself

            const mid: [number, number, number] = [0, 0, 0];
            const dir = new THREE.Vector3(...p).normalize();
            const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

            return (
              <group key={`ray-${atom.id}`} position={mid} quaternion={quat}>
                <Cylinder args={[0.015, 0.015, dist * 2, 8]}>
                  <meshBasicMaterial color="#ec4899" transparent opacity={0.6} wireframe />
                </Cylinder>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
