import React, { useMemo } from 'react';
import { Sphere, Cylinder, Text, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { rotatePointAroundAxis } from '../../utils/chemistry';

interface DihedralRotator3DProps {
  angleDeg: number; // 0 to 360 degrees
  moleculeType: 'ethane' | 'propane' | 'butane' | 'glycol';
  viewMode: 'perspective' | 'newman';
}

export const DihedralRotator3D: React.FC<DihedralRotator3DProps> = ({
  angleDeg,
  moleculeType,
  viewMode,
}) => {
  const rad = (angleDeg * Math.PI) / 180;

  // Front Carbon C1 at [0, 0, 0.75], Back Carbon C2 at [0, 0, -0.75]
  // Central C-C bond along Z axis: [0, 0, 1]
  const c1Pos: [number, number, number] = [0, 0, 0.75];
  const c2Pos: [number, number, number] = [0, 0, -0.75];

  // Front Carbon Substituents (Fixed)
  // At 120 degree angles in XY plane projected onto front carbon
  const frontSubs = useMemo(() => {
    // Sub 1 (Top, 90 deg):
    let sub1Type = 'H';
    let sub1Color = '#ffffff';
    let sub1Label = 'H';
    if (moleculeType === 'butane') {
      sub1Type = 'C';
      sub1Color = '#3b82f6';
      sub1Label = 'CH3';
    } else if (moleculeType === 'glycol') {
      sub1Type = 'O';
      sub1Color = '#ef4444';
      sub1Label = 'OH';
    }

    return [
      { id: 'f1', label: sub1Label, color: sub1Color, pos: [0, 1.25, 1.1] as [number, number, number] },
      { id: 'f2', label: 'H', color: '#ffffff', pos: [-1.08, -0.62, 1.1] as [number, number, number] },
      { id: 'f3', label: 'H', color: '#ffffff', pos: [1.08, -0.62, 1.1] as [number, number, number] },
    ];
  }, [moleculeType]);

  // Back Carbon Substituents (Rotated around Z-axis by angleDeg)
  // Baseline (at 0 deg, fully eclipsed with front):
  const backSubs = useMemo(() => {
    let sub1Type = 'H';
    let sub1Color = '#ffffff';
    let sub1Label = 'H';
    if (moleculeType === 'propane' || moleculeType === 'butane') {
      sub1Type = 'C';
      sub1Color = '#3b82f6';
      sub1Label = 'CH3';
    } else if (moleculeType === 'glycol') {
      sub1Type = 'O';
      sub1Color = '#ef4444';
      sub1Label = 'OH';
    }

    const basePositions: Array<{ id: string; label: string; color: string; basePos: [number, number, number] }> = [
      { id: 'b1', label: sub1Label, color: sub1Color, basePos: [0, 1.25, -1.1] },
      { id: 'b2', label: 'H', color: '#ffffff', basePos: [-1.08, -0.62, -1.1] },
      { id: 'b3', label: 'H', color: '#ffffff', basePos: [1.08, -0.62, -1.1] },
    ];

    return basePositions.map((sub) => {
      // Rotate around Z axis (0, 0, 1) passing through (0, 0, -0.75)
      const rotated = rotatePointAroundAxis(sub.basePos, [0, 0, -0.75], [0, 0, 1], rad);
      return {
        ...sub,
        pos: rotated,
      };
    });
  }, [moleculeType, rad]);

  // Eclipsing clash detection for visual warning
  const isEclipsed = (angleDeg >= 350 || angleDeg <= 10) || (angleDeg >= 110 && angleDeg <= 130) || (angleDeg >= 230 && angleDeg <= 250);
  const isFullyEclipsed = angleDeg >= 350 || angleDeg <= 10;
  const isAnti = angleDeg >= 170 && angleDeg <= 190;
  const isGauche = (angleDeg >= 50 && angleDeg <= 70) || (angleDeg >= 290 && angleDeg <= 310);

  // Group rotation for Newman view vs Perspective view
  const groupRotation: [number, number, number] = viewMode === 'newman' ? [0, 0, 0] : [0.35, -0.45, 0];

  return (
    <group rotation={groupRotation}>
      {/* Newman Projection Circle Overlay if in Newman Mode */}
      {viewMode === 'newman' && (
        <group position={[0, 0, 0]}>
          <Ring args={[0.7, 0.76, 64]}>
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
          </Ring>
        </group>
      )}

      {/* Central C-C Bond */}
      <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Cylinder args={[0.13, 0.13, 1.5, 24]}>
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.2} />
        </Cylinder>
      </group>

      {/* Front Carbon C1 */}
      <group position={c1Pos}>
        <Sphere args={[0.38, 32, 32]}>
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </Sphere>
        {viewMode !== 'newman' && (
          <Text position={[0, 0.5, 0]} fontSize={0.2} color="#94a3b8">
            C1 (Front)
          </Text>
        )}
      </group>

      {/* Back Carbon C2 */}
      <group position={c2Pos}>
        <Sphere args={[0.42, 32, 32]}>
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </Sphere>
        {viewMode !== 'newman' && (
          <Text position={[0, -0.55, 0]} fontSize={0.2} color="#64748b">
            C2 (Back)
          </Text>
        )}
      </group>

      {/* Front Substituents & Bonds */}
      {frontSubs.map((sub) => {
        const vMid = new THREE.Vector3().addVectors(new THREE.Vector3(...c1Pos), new THREE.Vector3(...sub.pos)).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(new THREE.Vector3(...sub.pos), new THREE.Vector3(...c1Pos));
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        return (
          <group key={sub.id}>
            <group position={vMid} quaternion={quat}>
              <Cylinder args={[0.08, 0.08, len, 16]}>
                <meshStandardMaterial color="#94a3b8" />
              </Cylinder>
            </group>
            <group position={sub.pos}>
              <Sphere args={[sub.label === 'CH3' || sub.label === 'OH' ? 0.36 : 0.26, 24, 24]}>
                <meshStandardMaterial color={sub.color} roughness={0.2} />
              </Sphere>
              <Text position={[0, 0.38, 0]} fontSize={0.22} color="#f8fafc" outlineWidth={0.03} outlineColor="#020617">
                {sub.label}
              </Text>
            </group>
          </group>
        );
      })}

      {/* Back Substituents & Bonds */}
      {backSubs.map((sub) => {
        const vMid = new THREE.Vector3().addVectors(new THREE.Vector3(...c2Pos), new THREE.Vector3(...sub.pos)).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(new THREE.Vector3(...sub.pos), new THREE.Vector3(...c2Pos));
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

        return (
          <group key={sub.id}>
            <group position={vMid} quaternion={quat}>
              <Cylinder args={[0.07, 0.07, len, 16]}>
                <meshStandardMaterial color="#64748b" />
              </Cylinder>
            </group>
            <group position={sub.pos}>
              <Sphere args={[sub.label === 'CH3' || sub.label === 'OH' ? 0.36 : 0.24, 24, 24]}>
                <meshStandardMaterial color={sub.color} roughness={0.3} />
              </Sphere>
              <Text position={[0, -0.38, 0]} fontSize={0.22} color="#cbd5e1" outlineWidth={0.03} outlineColor="#020617">
                {sub.label}
              </Text>
            </group>
          </group>
        );
      })}

      {/* Van der Waals Repulsion Clash Halo during Eclipsed Conformations */}
      {isEclipsed && (
        <group position={[0, 1.25, 0]}>
          <Sphere args={[isFullyEclipsed ? 0.75 : 0.55, 16, 16]}>
            <meshBasicMaterial
              color={isFullyEclipsed ? '#ef4444' : '#f59e0b'}
              transparent
              opacity={0.35}
              wireframe
            />
          </Sphere>
        </group>
      )}

      {/* Intramolecular Hydrogen Bonding visualizer for Glycol Gauche */}
      {moleculeType === 'glycol' && isGauche && (
        <group>
          {/* Dashed line connecting front OH and back OH */}
          <Cylinder args={[0.03, 0.03, 1.2, 12]} position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <meshBasicMaterial color="#22c55e" wireframe />
          </Cylinder>
          <Text position={[0, 1.6, 0]} fontSize={0.2} color="#86efac">
            Intramolecular H-Bond
          </Text>
        </group>
      )}
    </group>
  );
};

