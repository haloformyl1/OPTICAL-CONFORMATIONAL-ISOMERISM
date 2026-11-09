import React from 'react';
import { Sphere, Cylinder, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D } from '../../types/isomerism';
import { Molecule3DViewer } from './Molecule3DViewer';

interface SymmetryScanner3DProps {
  structure: MolecularStructure3D;
  showPOS: boolean;
  posPlane: 'xy' | 'yz' | 'xz';
  showCOS: boolean;
}

export const SymmetryScanner3D: React.FC<SymmetryScanner3DProps> = ({
  structure,
  showPOS,
  posPlane,
  showCOS,
}) => {
  // Plane orientations
  const planeRotation: [number, number, number] =
    posPlane === 'xy'
      ? [0, 0, 0]
      : posPlane === 'yz'
      ? [0, Math.PI / 2, 0]
      : [Math.PI / 2, 0, 0];

  return (
    <group>
      {/* Underlying 3D Molecule */}
      <Molecule3DViewer structure={structure} showLabels={true} />

      {/* Plane of Symmetry (POS / sigma) Visualizer */}
      {showPOS && (
        <group rotation={planeRotation}>
          <Plane args={[4.5, 4.5]}>
            <meshStandardMaterial
              color="#06b6d4"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              roughness={0.1}
            />
          </Plane>
          {/* Wireframe border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(4.5, 4.5)]} />
            <lineBasicMaterial color="#38bdf8" linewidth={2} />
          </lineSegments>
          <Text position={[0, 2.4, 0]} fontSize={0.22} color="#67e8f9" outlineWidth={0.03} outlineColor="#020617">
            Plane of Symmetry (σ)
          </Text>
        </group>
      )}

      {/* Center of Symmetry (COS / i) Visualizer */}
      {showCOS && (
        <group>
          {/* Inversion Center Point */}
          <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={0.6} />
          </Sphere>
          <Text position={[0, 0.35, 0]} fontSize={0.2} color="#f472b6" outlineWidth={0.03} outlineColor="#020617">
            Inversion Center (i)
          </Text>

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
