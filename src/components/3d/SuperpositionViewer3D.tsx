import React from 'react';
import { Sphere, Text, Plane, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D } from '../../types/isomerism';
import { Molecule3DViewer } from './Molecule3DViewer';

interface SuperpositionViewer3DProps {
  structureA: MolecularStructure3D;
  structureB: MolecularStructure3D;
  mode: 'side-by-side' | 'superimposed';
  relationship: 'enantiomers' | 'diastereomers' | 'identical' | 'meso' | 'conformers';
  superimposeProgress?: number; // 0 (separated) to 1 (fully overlaid)
  showLabels?: boolean;
  showPriorityBadges?: boolean;
  isRotated180?: boolean;
}

export const SuperpositionViewer3D: React.FC<SuperpositionViewer3DProps> = ({
  structureA,
  structureB,
  mode,
  relationship,
  superimposeProgress = mode === 'superimposed' ? 1 : 0,
  showLabels = true,
  showPriorityBadges = false,
  isRotated180 = false,
}) => {
  // Interpolate position from side-by-side to origin
  const posX_B = THREE.MathUtils.lerp(2.2, 0, superimposeProgress);
  const posX_A = THREE.MathUtils.lerp(-2.2, 0, superimposeProgress);

  const isSuperimposed = superimposeProgress > 0.85;
  const isMatch = relationship === 'identical' || relationship === 'meso';

  // For identical/meso compounds, Molecule B rotates 180° around the Z-axis (in-plane rotation)
  // to align with Molecule A. If manually toggled via isRotated180, it rotates immediately.
  // Otherwise, during superposition it smoothly rotates from 0 to 180° as it translates into A!
  // For enantiomers/diastereomers, it only rotates if manually toggled by user to test 180° rotation.
  const rotZ_B = isRotated180
    ? Math.PI
    : isMatch
    ? THREE.MathUtils.lerp(0, Math.PI, superimposeProgress)
    : 0;

  // When identical molecules superimpose 100%, Molecule B seamlessly dissolves into Molecule A (progress >= 0.95)
  // to avoid WebGL z-fighting, leaving 1 unified crystal-clear molecule!
  const opacityB = isMatch && superimposeProgress >= 0.95
    ? Math.max(0, 1 - (superimposeProgress - 0.95) / 0.05)
    : 1;

  return (
    <group>
      {/* Molecule A */}
      <group position={[posX_A, 0, 0]}>
        <Molecule3DViewer
          structure={structureA}
          showLabels={showLabels}
          showPriorityBadges={showPriorityBadges}
        />
        {!isSuperimposed && (
          <Billboard position={[0, 2.9, 0]} follow={true}>
            <Text
              fontSize={0.28}
              color="#38bdf8"
              outlineWidth={0.035}
              outlineColor="#020617"
              fontWeight="bold"
            >
              Isomer A
            </Text>
          </Billboard>
        )}
      </group>

      {/* Central Mirror Plane in Side-by-Side Mode */}
      {!isSuperimposed && (
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Plane args={[4.4, 4.4]}>
            <meshStandardMaterial
              color="#a855f7"
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
            />
          </Plane>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(4.4, 4.4)]} />
            <lineBasicMaterial color="#c084fc" linewidth={2} />
          </lineSegments>
          <Billboard position={[0, 2.4, 0]} follow={true}>
            <Text
              fontSize={0.22}
              color="#d8b4fe"
              outlineWidth={0.035}
              outlineColor="#020617"
              fontWeight="bold"
            >
              Mirror Plane (Reflector)
            </Text>
          </Billboard>
        </group>
      )}

      {/* Molecule B */}
      <group position={[posX_B, 0, 0]} rotation={[0, 0, rotZ_B]}>
        <Molecule3DViewer
          structure={structureB}
          showLabels={showLabels}
          showPriorityBadges={showPriorityBadges}
          opacity={opacityB}
        />
        {!isSuperimposed && (
          <Billboard position={[0, 2.9, 0]} follow={true}>
            <Text
              fontSize={0.28}
              color="#c084fc"
              outlineWidth={0.035}
              outlineColor="#020617"
              fontWeight="bold"
            >
              {isRotated180
                ? 'Mirror Image (180° Rotated)'
                : relationship === 'enantiomers'
                ? 'Mirror Image (Isomer B)'
                : 'Isomer B'}
            </Text>
          </Billboard>
        )}
      </group>

      {/* Superimposition Verdict Notification Overlay */}
      {isSuperimposed && (
        <Billboard position={[0, 3.2, 0]} follow={true}>
          <Text
            fontSize={0.28}
            color={isMatch ? '#4ade80' : '#f87171'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.045}
            outlineColor="#020617"
            fontWeight="bold"
          >
            {isMatch
              ? '✓ 100% Superimposable! Overlapped into 1 Single Molecule'
              : '✕ Non-Superimposable Mismatch! (Enantiomers / Chiral)'}
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.16}
            color={isMatch ? '#86efac' : '#fca5a5'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#020617"
            fontWeight="bold"
          >
            {isMatch
              ? '180° in-plane rotation aligns all atoms identically → Achiral Meso / Homomers'
              : 'Even after 3D rotation, bonds cannot align identically in space'}
          </Text>
          {/* Clash Point Aura if non-superimposable */}
          {!isMatch && (
            <Sphere args={[1.5, 16, 16]} position={[0, -2.4, 0]}>
              <meshBasicMaterial color="#ef4444" transparent opacity={0.15} wireframe />
            </Sphere>
          )}
        </Billboard>
      )}
    </group>
  );
};

