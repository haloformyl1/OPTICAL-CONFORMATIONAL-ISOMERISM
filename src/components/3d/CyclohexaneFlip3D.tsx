import React, { useMemo } from 'react';
import { Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

export type CyclohexaneForm = 'chair1' | 'half-chair' | 'twist-boat' | 'boat' | 'chair2';

interface CyclohexaneFlip3DProps {
  form: CyclohexaneForm;
  substituent: 'H' | 'CH3' | 't-Bu';
  show13Diaxial: boolean;
}

const getBondTransform = (p1: [number, number, number], p2: [number, number, number]) => {
  const v1 = new THREE.Vector3(...p1);
  const v2 = new THREE.Vector3(...p2);
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(v2, v1);
  const len = dir.length();
  const orientation = new THREE.Quaternion();
  if (len > 0.001) {
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  }
  return { mid, length: len, orientation };
};

export const CyclohexaneFlip3D: React.FC<CyclohexaneFlip3DProps> = ({
  form,
  substituent,
  show13Diaxial,
}) => {
  // Define carbon ring coordinates for each conformation state
  const ringNodes = useMemo(() => {
    // Standard Chair 1 (C1 down, C4 up)
    if (form === 'chair1') {
      return [
        { id: 'c1', pos: [-1.25, -0.45, 0] as [number, number, number] },
        { id: 'c2', pos: [-0.65, 0.35, 1.05] as [number, number, number] },
        { id: 'c3', pos: [0.65, -0.35, 1.05] as [number, number, number] },
        { id: 'c4', pos: [1.25, 0.45, 0] as [number, number, number] },
        { id: 'c5', pos: [0.65, -0.35, -1.05] as [number, number, number] },
        { id: 'c6', pos: [-0.65, 0.35, -1.05] as [number, number, number] },
      ];
    }
    // Boat (Both C1 and C4 up - flagpole interaction)
    if (form === 'boat') {
      return [
        { id: 'c1', pos: [-1.25, 0.55, 0] as [number, number, number] },
        { id: 'c2', pos: [-0.65, -0.25, 1.05] as [number, number, number] },
        { id: 'c3', pos: [0.65, -0.25, 1.05] as [number, number, number] },
        { id: 'c4', pos: [1.25, 0.55, 0] as [number, number, number] },
        { id: 'c5', pos: [0.65, -0.25, -1.05] as [number, number, number] },
        { id: 'c6', pos: [-0.65, -0.25, -1.05] as [number, number, number] },
      ];
    }
    // Twist-boat (Slight dihedral rotation relieving flagpole)
    if (form === 'twist-boat') {
      return [
        { id: 'c1', pos: [-1.2, 0.35, 0.2] as [number, number, number] },
        { id: 'c2', pos: [-0.6, -0.3, 1.0] as [number, number, number] },
        { id: 'c3', pos: [0.65, -0.15, 0.95] as [number, number, number] },
        { id: 'c4', pos: [1.2, 0.45, -0.2] as [number, number, number] },
        { id: 'c5', pos: [0.6, -0.3, -1.0] as [number, number, number] },
        { id: 'c6', pos: [-0.65, -0.15, -0.95] as [number, number, number] },
      ];
    }
    // Half-chair (One end planar, one end bent - transition state)
    if (form === 'half-chair') {
      return [
        { id: 'c1', pos: [-1.3, 0.65, 0] as [number, number, number] },
        { id: 'c2', pos: [-0.7, 0.1, 1.0] as [number, number, number] },
        { id: 'c3', pos: [0.65, 0.05, 1.0] as [number, number, number] },
        { id: 'c4', pos: [1.25, 0.05, 0] as [number, number, number] },
        { id: 'c5', pos: [0.65, 0.05, -1.0] as [number, number, number] },
        { id: 'c6', pos: [-0.7, 0.1, -1.0] as [number, number, number] },
      ];
    }
    // Chair 2 (Inverted: C1 up, C4 down)
    return [
      { id: 'c1', pos: [-1.25, 0.45, 0] as [number, number, number] },
      { id: 'c2', pos: [-0.65, -0.35, 1.05] as [number, number, number] },
      { id: 'c3', pos: [0.65, 0.35, 1.05] as [number, number, number] },
      { id: 'c4', pos: [1.25, -0.45, 0] as [number, number, number] },
      { id: 'c5', pos: [0.65, 0.35, -1.05] as [number, number, number] },
      { id: 'c6', pos: [-0.65, -0.35, -1.05] as [number, number, number] },
    ];
  }, [form]);

  // Ring C-C bonds
  const ringBonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]
  ];

  // Substituents on C1 (Key comparison site: in Chair 1 it is AXIAL-down, in Chair 2 it is EQUATORIAL-down)
  const isC1Axial = form === 'chair1';
  const c1Pos = ringNodes[0].pos;
  const subPos: [number, number, number] = isC1Axial
    ? [c1Pos[0], c1Pos[1] - (substituent === 't-Bu' ? 1.4 : 1.1), c1Pos[2]] // Axial down
    : [c1Pos[0] - 1.2, c1Pos[1] - 0.2, c1Pos[2]]; // Equatorial outwards

  // 1,3-diaxial partners on C3 and C5
  const c3Pos = ringNodes[2].pos;
  const c5Pos = ringNodes[4].pos;
  const h3Pos: [number, number, number] = [c3Pos[0], c3Pos[1] - 0.9, c3Pos[2]];
  const h5Pos: [number, number, number] = [c5Pos[0], c5Pos[1] - 0.9, c5Pos[2]];

  return (
    <group>
      {/* Carbon Ring Atoms */}
      {ringNodes.map((node, idx) => (
        <group key={node.id} position={node.pos}>
          <Sphere args={[0.34, 24, 24]}>
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.1} />
          </Sphere>
          <Text position={[0, 0.42, 0]} fontSize={0.2} color="#94a3b8">
            C{idx + 1}
          </Text>
        </group>
      ))}

      {/* Ring C-C Bonds */}
      {ringBonds.map(([i1, i2], idx) => {
        const p1 = ringNodes[i1].pos;
        const p2 = ringNodes[i2].pos;
        const { mid, length, orientation } = getBondTransform(p1, p2);
        return (
          <group key={`rb-${idx}`} position={mid} quaternion={orientation}>
            <Cylinder args={[0.09, 0.09, length, 16]}>
              <meshStandardMaterial color="#64748b" roughness={0.4} />
            </Cylinder>
          </group>
        );
      })}

      {/* C1 Main Substituent (H, CH3, or tert-Butyl) */}
      <group>
        {/* Bond to substituent */}
        {(() => {
          const { mid, length, orientation } = getBondTransform(c1Pos, subPos);
          return (
            <group position={mid} quaternion={orientation}>
              <Cylinder args={[0.08, 0.08, length, 16]}>
                <meshStandardMaterial color={isC1Axial ? '#f59e0b' : '#06b6d4'} />
              </Cylinder>
            </group>
          );
        })()}

        {/* Substituent Head */}
        <group position={subPos}>
          <Sphere args={[substituent === 't-Bu' ? 0.65 : substituent === 'CH3' ? 0.42 : 0.28, 32, 32]}>
            <meshStandardMaterial
              color={substituent === 'H' ? '#ffffff' : '#3b82f6'}
              roughness={0.2}
            />
          </Sphere>
          <Text position={[0, -0.45, 0]} fontSize={0.24} color="#f8fafc" outlineWidth={0.03} outlineColor="#020617">
            {substituent} ({isC1Axial ? 'Axial' : 'Equatorial'})
          </Text>
        </group>
      </group>

      {/* 1,3-Diaxial Interaction Warning Mesh & Lines (Only in Chair 1 when Axial) */}
      {show13Diaxial && isC1Axial && substituent !== 'H' && (
        <group>
          {/* C3 axial hydrogen */}
          <group position={h3Pos}>
            <Sphere args={[0.24, 16, 16]}>
              <meshStandardMaterial color="#f59e0b" />
            </Sphere>
            <Text position={[0, -0.32, 0]} fontSize={0.18} color="#fcd34d">
              H (3-ax)
            </Text>
          </group>
          {/* C5 axial hydrogen */}
          <group position={h5Pos}>
            <Sphere args={[0.24, 16, 16]}>
              <meshStandardMaterial color="#f59e0b" />
            </Sphere>
            <Text position={[0, -0.32, 0]} fontSize={0.18} color="#fcd34d">
              H (5-ax)
            </Text>
          </group>

          {/* Repulsive interaction lines */}
          {(() => {
            const t3 = getBondTransform(subPos, h3Pos);
            const t5 = getBondTransform(subPos, h5Pos);
            return (
              <>
                <group position={t3.mid} quaternion={t3.orientation}>
                  <Cylinder args={[0.03, 0.03, t3.length, 12]}>
                    <meshBasicMaterial color="#ef4444" wireframe />
                  </Cylinder>
                </group>
                <group position={t5.mid} quaternion={t5.orientation}>
                  <Cylinder args={[0.03, 0.03, t5.length, 12]}>
                    <meshBasicMaterial color="#ef4444" wireframe />
                  </Cylinder>
                </group>
              </>
            );
          })()}

          {/* Steric strain glow aura */}
          <group position={subPos}>
            <Sphere args={[substituent === 't-Bu' ? 0.95 : 0.65, 16, 16]}>
              <meshBasicMaterial color="#ef4444" transparent opacity={0.35} wireframe />
            </Sphere>
          </group>
        </group>
      )}

      {/* Flagpole Interaction Warning in Boat Conformation */}
      {form === 'boat' && (
        <group>
          <Text position={[0, 1.2, 0]} fontSize={0.24} color="#f87171" outlineWidth={0.03} outlineColor="#020617">
            Flagpole Steric Strain (~30 kJ/mol)
          </Text>
        </group>
      )}
    </group>
  );
};

