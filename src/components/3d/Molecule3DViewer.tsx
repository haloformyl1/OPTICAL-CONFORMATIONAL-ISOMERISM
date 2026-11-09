import React, { useMemo } from 'react';
import { Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D, Atom3D, Bond3D } from '../../types/isomerism';
import { getElementColor, getElementRadius } from '../../utils/chemistry';

interface Molecule3DViewerProps {
  structure: MolecularStructure3D;
  showLabels?: boolean;
  showPriorityBadges?: boolean;
  spaceFilling?: boolean;
  showDipole?: boolean;
  highlightConformation?: boolean;
}

const getBondTransform = (
  p1: [number, number, number],
  p2: [number, number, number],
  offset?: [number, number, number]
) => {
  const v1 = new THREE.Vector3(...p1);
  const v2 = new THREE.Vector3(...p2);
  if (offset) {
    v1.add(new THREE.Vector3(...offset));
    v2.add(new THREE.Vector3(...offset));
  }
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(v2, v1);
  const length = direction.length();

  const orientation = new THREE.Quaternion();
  if (length > 0.0001) {
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  }
  return { mid, length, orientation };
};

export const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({
  structure,
  showLabels = true,
  showPriorityBadges = false,
  spaceFilling = false,
  showDipole = false,
  highlightConformation = false,
}) => {
  const atomMap = useMemo(() => {
    const map = new Map<string, Atom3D>();
    structure.atoms.forEach((a) => map.set(a.id, a));
    return map;
  }, [structure]);

  return (
    <group>
      {/* 3D Atoms */}
      {structure.atoms.map((atom) => {
        let baseRadius = getElementRadius(atom.element);
        if (spaceFilling) baseRadius *= 1.85;

        // Color coding: standard CPK or axial/equatorial conformation highlight
        let color = atom.color || getElementColor(atom.element);
        if (highlightConformation && atom.conformationType) {
          color = atom.conformationType === 'axial' ? '#f59e0b' : '#06b6d4'; // Amber for axial, Cyan for equatorial
        }

        return (
          <group key={atom.id} position={atom.position}>
            {/* Stereocenter aura halo */}
            {atom.isStereocenter && (
              <Sphere args={[baseRadius * 1.45, 16, 16]}>
                <meshStandardMaterial
                  color="#a855f7"
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </Sphere>
            )}

            {/* Core Atom Sphere */}
            <Sphere args={[baseRadius, 32, 32]}>
              <meshStandardMaterial
                color={color}
                roughness={0.25}
                metalness={0.15}
              />
            </Sphere>

            {/* Element or Group Label */}
            {showLabels && !spaceFilling && (
              <Text
                position={[0, baseRadius + 0.22, 0]}
                fontSize={0.24}
                color="#f8fafc"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="#020617"
              >
                {atom.label || atom.element}
              </Text>
            )}

            {/* CIP Priority Badge (1, 2, 3, 4) */}
            {showPriorityBadges && atom.cipPriority && (
              <group position={[0.22, 0.22, 0.2]}>
                <Sphere args={[0.16, 16, 16]}>
                  <meshBasicMaterial
                    color={
                      atom.cipPriority === 1
                        ? '#ef4444'
                        : atom.cipPriority === 2
                        ? '#f59e0b'
                        : atom.cipPriority === 3
                        ? '#3b82f6'
                        : '#10b981'
                    }
                  />
                </Sphere>
                <Text
                  position={[0, 0, 0.17]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {atom.cipPriority}
                </Text>
              </group>
            )}

            {/* Axial / Equatorial Tag */}
            {highlightConformation && atom.conformationType && (
              <Text
                position={[0, -baseRadius - 0.22, 0]}
                fontSize={0.18}
                color={atom.conformationType === 'axial' ? '#fcd34d' : '#67e8f9'}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#020617"
              >
                {atom.conformationType === 'axial' ? 'ax' : 'eq'}
              </Text>
            )}
          </group>
        );
      })}

      {/* 3D Chemical Bonds */}
      {structure.bonds.map((bond, index) => {
        const a1 = atomMap.get(bond.from);
        const a2 = atomMap.get(bond.to);
        if (!a1 || !a2) return null;

        const bondColor = bond.color || '#64748b';
        const bondRadius = spaceFilling ? 0.08 : 0.09;

        if (bond.order === 1) {
          const { mid, length, orientation } = getBondTransform(a1.position, a2.position);
          return (
            <group key={`b-${index}`} position={mid} quaternion={orientation}>
              <Cylinder args={[bondRadius, bondRadius, length, 16]}>
                <meshStandardMaterial
                  color={bondColor}
                  roughness={0.4}
                  metalness={0.1}
                />
              </Cylinder>
            </group>
          );
        }

        if (bond.order === 2) {
          // Double bond rendering
          const t1 = getBondTransform(a1.position, a2.position, [0.06, 0.06, 0]);
          const t2 = getBondTransform(a1.position, a2.position, [-0.06, -0.06, 0]);
          return (
            <React.Fragment key={`b2-${index}`}>
              <group position={t1.mid} quaternion={t1.orientation}>
                <Cylinder args={[bondRadius * 0.75, bondRadius * 0.75, t1.length, 16]}>
                  <meshStandardMaterial color={bondColor} roughness={0.4} />
                </Cylinder>
              </group>
              <group position={t2.mid} quaternion={t2.orientation}>
                <Cylinder args={[bondRadius * 0.75, bondRadius * 0.75, t2.length, 16]}>
                  <meshStandardMaterial color={bondColor} roughness={0.4} />
                </Cylinder>
              </group>
            </React.Fragment>
          );
        }

        if (bond.order === 3) {
          // Triple bond rendering
          const t0 = getBondTransform(a1.position, a2.position);
          const t1 = getBondTransform(a1.position, a2.position, [0.07, 0, 0]);
          const t2 = getBondTransform(a1.position, a2.position, [-0.07, 0, 0]);
          return (
            <React.Fragment key={`b3-${index}`}>
              <group position={t0.mid} quaternion={t0.orientation}>
                <Cylinder args={[bondRadius * 0.65, bondRadius * 0.65, t0.length, 16]}>
                  <meshStandardMaterial color={bondColor} />
                </Cylinder>
              </group>
              <group position={t1.mid} quaternion={t1.orientation}>
                <Cylinder args={[bondRadius * 0.65, bondRadius * 0.65, t1.length, 16]}>
                  <meshStandardMaterial color={bondColor} />
                </Cylinder>
              </group>
              <group position={t2.mid} quaternion={t2.orientation}>
                <Cylinder args={[bondRadius * 0.65, bondRadius * 0.65, t2.length, 16]}>
                  <meshStandardMaterial color={bondColor} />
                </Cylinder>
              </group>
            </React.Fragment>
          );
        }

        return null;
      })}

      {/* Net Dipole Moment Vector Arrow */}
      {showDipole && structure.dipoleVectors && structure.dipoleVectors.map((v, i) => {
        const { mid, length, orientation } = getBondTransform(v.from, v.to);
        return (
          <group key={`dipole-${i}`} position={mid} quaternion={orientation}>
            <Cylinder args={[0.04, 0.04, length, 12]}>
              <meshBasicMaterial color="#f59e0b" />
            </Cylinder>
            <mesh position={[0, length / 2, 0]}>
              <coneGeometry args={[0.12, 0.28, 16]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

