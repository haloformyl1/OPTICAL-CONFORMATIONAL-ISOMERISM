import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Cone, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { MolecularStructure3D } from '../../types/isomerism';

interface CIPArc3DProps {
  structure: MolecularStructure3D;
  visible?: boolean;
}

export const CIPArc3D: React.FC<CIPArc3DProps> = ({ structure, visible = true }) => {
  const beadsRef = useRef<THREE.Group>(null);
  const bead1Ref = useRef<THREE.Mesh>(null);
  const bead2Ref = useRef<THREE.Mesh>(null);
  const bead3Ref = useRef<THREE.Mesh>(null);

  // Find stereocenter and Priority 1, 2, 3, 4 atoms
  const { cStar, p1, p2, p3, isClockwise, curve, segmentTransforms, midTangent1, midTangent2 } = useMemo(() => {
    const cStarAtom =
      structure.atoms.find((a) => a.isStereocenter) ||
      structure.atoms.find((a) => a.element === 'C') ||
      structure.atoms[0];

    const atom1 = structure.atoms.find((a) => a.cipPriority === 1);
    const atom2 = structure.atoms.find((a) => a.cipPriority === 2);
    const atom3 = structure.atoms.find((a) => a.cipPriority === 3);

    if (!cStarAtom || !atom1 || !atom2 || !atom3) {
      return { cStar: null, p1: null, p2: null, p3: null, isClockwise: true, curve: null, segmentTransforms: [], midTangent1: null, midTangent2: null };
    }

    const cPos = new THREE.Vector3(...cStarAtom.position);
    const pos1 = new THREE.Vector3(...atom1.position);
    const pos2 = new THREE.Vector3(...atom2.position);
    const pos3 = new THREE.Vector3(...atom3.position);

    // Determine 2D projected chirality looking down the line of sight (front to back)
    // 2D cross product in XY view plane
    const cross = (pos2.x - pos1.x) * (pos3.y - pos2.y) - (pos2.y - pos1.y) * (pos3.x - pos2.x);
    // In mathematical coordinates (Y up):
    // cross < 0 corresponds to clockwise turn (12 o'clock -> 4 o'clock -> 8 o'clock)
    // cross > 0 corresponds to counter-clockwise turn
    const configStr = structure.optical?.configurationRS || '';
    const isClockwiseComputed = configStr ? configStr.includes('R') : cross < 0;

    // Normal to the plane formed by p1, p2, p3
    const v1 = pos1.clone().sub(cPos);
    const v2 = pos2.clone().sub(cPos);
    const v3 = pos3.clone().sub(cPos);

    let planeNormal = new THREE.Vector3().crossVectors(
      pos2.clone().sub(pos1),
      pos3.clone().sub(pos2)
    ).normalize();

    // Ensure normal points towards camera / positive Z
    if (planeNormal.z < 0) {
      planeNormal.negate();
    }
    const forwardOffset = planeNormal.clone().multiplyScalar(0.35);

    // Calculate outward curved midpoints so the arc smoothly encircles the carbon
    const avgLen12 = (v1.length() + v2.length()) * 0.55;
    const mid1Vec = new THREE.Vector3().addVectors(v1, v2).normalize().multiplyScalar(avgLen12);
    const midPoint1 = cPos.clone().add(mid1Vec).add(forwardOffset);

    const avgLen23 = (v2.length() + v3.length()) * 0.55;
    const mid2Vec = new THREE.Vector3().addVectors(v2, v3).normalize().multiplyScalar(avgLen23);
    const midPoint2 = cPos.clone().add(mid2Vec).add(forwardOffset);

    const pt1 = pos1.clone().add(forwardOffset);
    const pt2 = pos2.clone().add(forwardOffset);
    const pt3 = pos3.clone().add(forwardOffset);

    // Create a smooth 3D Catmull-Rom spline curve from 1 -> mid1 -> 2 -> mid2 -> 3
    const spline = new THREE.CatmullRomCurve3([pt1, midPoint1, pt2, midPoint2, pt3]);

    // Segment cylinders along the curve
    const curvePoints = spline.getPoints(36);
    const segs = [];
    for (let i = 0; i < curvePoints.length - 1; i++) {
      const a = curvePoints[i];
      const b = curvePoints[i + 1];
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      segs.push({ mid, len, quat });
    }

    // Tangents for arrowheads
    const tMid1 = spline.getTangent(0.48);
    const qMid1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tMid1.normalize());
    const tEnd = spline.getTangent(0.96);
    const qEnd = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tEnd.normalize());

    return {
      cStar: cPos,
      p1: pt1,
      p2: pt2,
      p3: pt3,
      isClockwise: isClockwiseComputed,
      curve: spline,
      segmentTransforms: segs,
      midTangent1: { pos: spline.getPoint(0.48), quat: qMid1 },
      midTangent2: { pos: spline.getPoint(0.96), quat: qEnd },
    };
  }, [structure]);

  // Animate energy beads flowing along the 1 -> 2 -> 3 path
  useFrame((state) => {
    if (!curve || !visible) return;
    const t = (state.clock.elapsedTime * 0.45) % 1;
    const t2 = (t + 0.33) % 1;
    const t3 = (t + 0.66) % 1;

    if (bead1Ref.current) {
      const p = curve.getPoint(t);
      bead1Ref.current.position.set(p.x, p.y, p.z);
    }
    if (bead2Ref.current) {
      const p = curve.getPoint(t2);
      bead2Ref.current.position.set(p.x, p.y, p.z);
    }
    if (bead3Ref.current) {
      const p = curve.getPoint(t3);
      bead3Ref.current.position.set(p.x, p.y, p.z);
    }
  });

  if (!visible || !curve || !cStar) return null;

  const arcColor = isClockwise ? '#10b981' : '#ec4899'; // Emerald green for (R) Clockwise, Pink/Magenta for (S) Counter-Clockwise
  const glowColor = isClockwise ? '#34d399' : '#f472b6';

  return (
    <group>
      {/* 3D Curved Arc Path Segments connecting 1 -> 2 -> 3 */}
      {segmentTransforms.map((seg, idx) => (
        <group key={`arc-seg-${idx}`} position={seg.mid} quaternion={seg.quat}>
          <Cylinder args={[0.024, 0.024, seg.len * 1.05, 8]}>
            <meshStandardMaterial
              color={arcColor}
              emissive={glowColor}
              emissiveIntensity={0.65}
              roughness={0.2}
            />
          </Cylinder>
        </group>
      ))}

      {/* Intermediate Direction Arrowhead (1 -> 2) */}
      {midTangent1 && (
        <group position={midTangent1.pos} quaternion={midTangent1.quat}>
          <Cone args={[0.075, 0.22, 16]}>
            <meshStandardMaterial color={arcColor} emissive={glowColor} emissiveIntensity={0.8} />
          </Cone>
        </group>
      )}

      {/* Final Direction Arrowhead (2 -> 3) */}
      {midTangent2 && (
        <group position={midTangent2.pos} quaternion={midTangent2.quat}>
          <Cone args={[0.09, 0.26, 16]}>
            <meshStandardMaterial color={arcColor} emissive={glowColor} emissiveIntensity={0.9} />
          </Cone>
        </group>
      )}

      {/* Animated Glowing Flow Beads */}
      <group ref={beadsRef}>
        <mesh ref={bead1Ref}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh ref={bead2Ref}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
        <mesh ref={bead3Ref}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={arcColor} />
        </mesh>
      </group>

      {/* 3D Billboard Direction Annotation right at the chiral stereocenter */}
      <Billboard position={[cStar.x, cStar.y - 1.15, cStar.z + 0.35]} follow={true}>
        <group>
          {/* Background Pill */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.5, 0.52]} />
            <meshBasicMaterial color="#020617" transparent opacity={0.88} />
          </mesh>
          <Text
            fontSize={0.16}
            color={glowColor}
            fontWeight="black"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.08, 0]}
          >
            {isClockwise
              ? '↻ CLOCKWISE COUNT (1 → 2 → 3)'
              : '↺ ANTI-CLOCKWISE COUNT (1 → 2 → 3)'}
          </Text>
          <Text
            fontSize={0.13}
            color="#f8fafc"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.11, 0]}
          >
            {isClockwise
              ? '⟹ (R) Configuration [Rectus / Right]'
              : '⟹ (S) Configuration [Sinister / Left]'}
          </Text>
        </group>
      </Billboard>
    </group>
  );
};
