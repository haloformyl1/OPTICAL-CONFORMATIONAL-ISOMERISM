import React, { Suspense, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, Grid, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ErrorState } from '../ui/States';
import { AppCanvas as Canvas } from '../ui/AppCanvas';

interface MolecularCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  resetKey?: number;
  ariaLabel?: string;
  frameloop?: 'always' | 'demand' | 'never';
  dpr?: number | [number, number];
}

const ResponsiveCameraRig: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
  resetKey: number;
}> = ({ position, target, resetKey }) => {
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    const isNarrow = size.width < 540;
    const isTall = size.height > size.width;
    const targetFov = isNarrow || isTall ? 52 : 46;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, invalidate, size.height, size.width]);

  return (
    <>
      <PerspectiveCamera
        key={`camera-${resetKey}`}
        makeDefault
        position={position}
        fov={46}
        near={0.1}
        far={100}
      />
      <OrbitControls
        key={`controls-${resetKey}`}
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableRotate
        enableZoom
        target={target}
        maxDistance={14}
        minDistance={1.8}
        makeDefault
      />
    </>
  );
};

export const MolecularCanvas: React.FC<MolecularCanvasProps> = ({
  children,
  cameraPosition = [0, 0.4, 4.4],
  cameraTarget = [0, 0, 0],
  resetKey = 0,
  ariaLabel = 'Interactive 3D molecular stereochemistry model',
  frameloop = 'demand',
  dpr = [1, 1.5],
}) => {
  const webGLAvailable = useMemo(() => {
    if (typeof document === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }, []);

  if (!webGLAvailable) {
    return (
      <ErrorState
        title="WebGL is unavailable"
        message="Use a browser with hardware-accelerated WebGL to view this interactive 3D molecule."
      />
    );
  }

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden bg-[var(--canvas-background)]"
      role="img"
      aria-label={ariaLabel}
    >
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#06131d']} />
        <ResponsiveCameraRig
          position={cameraPosition}
          target={cameraTarget}
          resetKey={resetKey}
        />

        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 10, 6]} intensity={1.6} />
        <directionalLight position={[-8, -5, -6]} intensity={0.5} color="#7dd3fc" />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <group position={[0, 0, 0]}>
            <Grid
              infiniteGrid
              fadeDistance={18}
              fadeStrength={2.5}
              sectionColor="#2d718f"
              cellColor="#173d4f"
              sectionSize={2}
              position={[0, -1.8, 0]}
            />
            {children}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
