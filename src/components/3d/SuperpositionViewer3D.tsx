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
}

export const SuperpositionViewer3D: React.FC<SuperpositionViewer3DProps> = ({
  structureA,
  structureB,
  mode,
  relationship,
  superimposeProgress = mode === 'superimposed' ? 1 : 0,
  showLabels = true,
  showPriorityBadges = false,
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
      <group position={[posX_B, 0, 0]}>
        <Molecule3DViewer
          structure={structureB}
          showLabels={showLabels}
          showPriorityBadges={showPriorityBadges}
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
              {relationship === 'enantiomers' ? 'Mirror Image (Isomer B)' : 'Isomer B'}
            </Text>
          </Billboard>
        )}
      </group>

      {/* Superimposition Verdict Notification Overlay */}
      {isSuperimposed && (
        <Billboard position={[0, 3.1, 0]} follow={true}>
          <Text
            fontSize={0.3}
            color={isMatch ? '#4ade80' : '#f87171'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.045}
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
              <meshBasicMaterial color="#ef4444" transparent opacity={0.15} wireframe />
            </Sphere>
          )}
        </Billboard>
      )}
    </group>
  );
};

