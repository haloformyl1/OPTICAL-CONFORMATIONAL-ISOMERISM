import React from 'react';
import { Sphere, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D } from '../../types/isomerism';
import { Molecule3DViewer } from './Molecule3DViewer';

interface SuperpositionViewer3DProps {
  structureA: MolecularStructure3D;
  structureB: MolecularStructure3D;
  mode: 'side-by-side' | 'superimposed';
  relationship: 'enantiomers' | 'diastereomers' | 'identical' | 'meso' | 'conformers';
  superimposeProgress?: number; // 0 (separated) to 1 (fully overlaid)
}

export const SuperpositionViewer3D: React.FC<SuperpositionViewer3DProps> = ({
  structureA,
  structureB,
  mode,
  relationship,
  superimposeProgress = mode === 'superimposed' ? 1 : 0,
}) => {
  // Interpolate position from side-by-side to origin
  const posX_B = THREE.MathUtils.lerp(2.2, 0, superimposeProgress);
  const posX_A = THREE.MathUtils.lerp(-2.2, 0, superimposeProgress);

  const isSuperimposed = superimposeProgress > 0.85;
  const isMatch = relationship === 'identical' || relationship === 'meso';

  return (
    <group>
      {/* Molecule A */}
      <group position={[posX_A, 0, 0]}>
        <Molecule3DViewer structure={structureA} showLabels={true} showPriorityBadges={true} />
        {!isSuperimposed && (
          <Text position={[0, 2.2, 0]} fontSize={0.25} color="#38bdf8" outlineWidth={0.03} outlineColor="#020617">
            Isomer A
          </Text>
        )}
      </group>

      {/* Central Mirror Plane in Side-by-Side Mode */}
      {!isSuperimposed && (
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Plane args={[4.2, 4.2]}>
            <meshStandardMaterial
              color="#a855f7"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </Plane>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(4.2, 4.2)]} />
            <lineBasicMaterial color="#c084fc" linewidth={2} />
          </lineSegments>
          <Text position={[0, 2.3, 0]} fontSize={0.22} color="#d8b4fe" outlineWidth={0.03} outlineColor="#020617">
            Mirror Plane (Reflector)
          </Text>
        </group>
      )}

      {/* Molecule B */}
      <group position={[posX_B, 0, 0]}>
        <Molecule3DViewer structure={structureB} showLabels={true} showPriorityBadges={true} />
        {!isSuperimposed && (
          <Text position={[0, 2.2, 0]} fontSize={0.25} color="#c084fc" outlineWidth={0.03} outlineColor="#020617">
            {relationship === 'enantiomers' ? 'Mirror Image (Isomer B)' : 'Isomer B'}
          </Text>
        )}
      </group>

      {/* Superimposition Verdict Notification Overlay */}
      {isSuperimposed && (
        <group position={[0, 2.4, 0]}>
          <Text
            fontSize={0.28}
            color={isMatch ? '#4ade80' : '#f87171'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#020617"
            fontWeight="bold"
          >
            {isMatch
              ? '✓ Superimposable! (Identical / Homomers)'
              : '✕ Non-Superimposable Mismatch! (Enantiomers / Chiral)'}
          </Text>
          {/* Clash Point Aura if non-superimposable */}
          {!isMatch && (
            <Sphere args={[1.5, 16, 16]} position={[0, -2.4, 0]}>
              <meshBasicMaterial color="#ef4444" transparent opacity={0.2} wireframe />
            </Sphere>
          )}
        </group>
      )}
    </group>
  );
};

