import React from 'react';
import { Sphere, Cylinder, Text, Box } from '@react-three/drei';
import * as THREE from 'three';

interface PolarimeterBeam3DProps {
  rotationAngleDeg: number; // Optical rotation angle alpha (e.g. +30 deg or -45 deg)
  analyzerAngleDeg: number;
}

export const PolarimeterBeam3D: React.FC<PolarimeterBeam3DProps> = ({
  rotationAngleDeg,
  analyzerAngleDeg,
}) => {
  const rotRad = (rotationAngleDeg * Math.PI) / 180;
  const analyzerRad = (analyzerAngleDeg * Math.PI) / 180;

  // Extinction factor: intensity I = I0 * cos^2(analyzer - rot)
  const deltaAngle = analyzerRad - rotRad;
  const transmissionFactor = Math.pow(Math.cos(deltaAngle), 2);

  return (
    <group>
      {/* 1. Monochromatic Light Lamp (Sodium D-line 589 nm) */}
      <group position={[-4.5, 0, 0]}>
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.8} />
        </Sphere>
        <Text position={[0, -0.9, 0]} fontSize={0.2} color="#fde047">
          Na Lamp (589 nm)
        </Text>
      </group>

      {/* Beam Stage 1: Unpolarized light (multidirectional oscillating vectors) */}
      <group position={[-3.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.06, 0.06, 1.7, 16]}>
          <meshBasicMaterial color="#fef08a" />
        </Cylinder>
      </group>

      {/* 2. Fixed Polarizer (Nicol Prism) */}
      <group position={[-2.8, 0, 0]}>
        <Box args={[0.2, 1.6, 1.6]}>
          <meshStandardMaterial color="#0284c7" transparent opacity={0.65} roughness={0.1} />
        </Box>
        {/* Slit showing vertical transmission axis */}
        <Cylinder args={[0.02, 0.02, 1.4, 8]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffffff" />
        </Cylinder>
        <Text position={[0, 1.15, 0]} fontSize={0.2} color="#38bdf8">
          Polarizer (Vertical)
        </Text>
      </group>

      {/* Beam Stage 2: Plane-Polarized Light (Strictly Vertical) */}
      <group position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.05, 0.05, 2.6, 16]}>
          <meshBasicMaterial color="#38bdf8" />
        </Cylinder>
      </group>

      {/* 3. Chiral Sample Cell Tube */}
      <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Glass Outer Cylinder */}
        <Cylinder args={[0.55, 0.55, 2.4, 32]}>
          <meshStandardMaterial
            color="#a855f7"
            transparent
            opacity={0.3}
            roughness={0.05}
            side={THREE.DoubleSide}
          />
        </Cylinder>
        {/* Caps */}
        <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#64748b" />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[0, -1.25, 0]}>
          <meshStandardMaterial color="#64748b" />
        </Cylinder>
      </group>
      <Text position={[0, 1.1, 0]} fontSize={0.22} color="#c084fc">
        Chiral Sample Cell (Tube)
      </Text>

      {/* Beam Stage 3: Rotated Polarized Light (Angle = rotRad) */}
      <group position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.05, 0.05, 2.6, 16]}>
          <meshBasicMaterial color="#ec4899" />
        </Cylinder>
      </group>
      {/* Electric Field Vector indicator showing rotation */}
      <group position={[1.4, 0, 0]} rotation={[rotRad, 0, 0]}>
        <Cylinder args={[0.02, 0.02, 1.1, 8]}>
          <meshBasicMaterial color="#f472b6" />
        </Cylinder>
      </group>

      {/* 4. Rotatable Analyzer Prism */}
      <group position={[2.8, 0, 0]} rotation={[analyzerRad, 0, 0]}>
        <Box args={[0.2, 1.6, 1.6]}>
          <meshStandardMaterial
            color="#e11d48"
            transparent
            opacity={0.65}
            roughness={0.1}
          />
        </Box>
        {/* Transmission axis */}
        <Cylinder args={[0.02, 0.02, 1.4, 8]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffffff" />
        </Cylinder>
      </group>
      <Text position={[2.8, 1.15, 0]} fontSize={0.2} color="#fb7185">
        Analyzer ({analyzerAngleDeg}°)
      </Text>

      {/* Beam Stage 4: Transmitted Light to Detector */}
      <group position={[3.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.06 * transmissionFactor, 0.06 * transmissionFactor, 1.7, 16]}>
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={Math.max(0.15, transmissionFactor)}
          />
        </Cylinder>
      </group>

      {/* 5. Eyepiece / Detector Field */}
      <group position={[4.6, 0, 0]}>
        <Cylinder args={[0.65, 0.65, 0.2, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial
            color={transmissionFactor > 0.8 ? '#4ade80' : transmissionFactor < 0.1 ? '#1e293b' : '#facc15'}
            emissive={transmissionFactor > 0.8 ? '#22c55e' : '#000000'}
            emissiveIntensity={transmissionFactor * 0.8}
          />
        </Cylinder>
        <Text position={[0, -0.95, 0]} fontSize={0.18} color="#94a3b8">
          Field: {Math.round(transmissionFactor * 100)}% Light
        </Text>
      </group>
    </group>
  );
};
