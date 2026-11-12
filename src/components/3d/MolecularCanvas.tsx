import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
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
  fitCameraToStage?: boolean;
  dpr?: number | [number, number];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showAutoRotateButton?: boolean;
  showFullscreenButton?: boolean;
}

const ResponsiveCameraRig: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
  resetKey: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  fitCameraToStage?: boolean;
}> = ({ position, target, resetKey, autoRotate = false, autoRotateSpeed = 1.0, fitCameraToStage = false }) => {
  const { camera, size, invalidate } = useThree();
  const lastFitCamera = useRef<THREE.Camera | null>(null);
  const lastFitScale = useRef(1);
  const lastBasePosition = useRef<[number, number, number] | null>(null);

  useEffect(() => {
    const isNarrow = size.width < 540;
    const isTall = size.height > size.width;
    const targetFov = isNarrow || isTall ? 52 : 46;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      invalidate();
    }

    const fitScale = fitCameraToStage ? THREE.MathUtils.clamp(Math.sqrt(size.height / 560), 1, 1.35) : 1;
    const basePositionChanged = !lastBasePosition.current || position.some((value, index) => value !== lastBasePosition.current?.[index]);
    if (lastFitCamera.current !== camera || basePositionChanged) {
      lastFitCamera.current = camera;
      lastBasePosition.current = [...position];
      lastFitScale.current = 1;
    }
    const scaleChange = fitScale / lastFitScale.current;
    if (Math.abs(scaleChange - 1) > 0.001) {
      const targetPosition = new THREE.Vector3(...target);
      camera.position.sub(targetPosition).multiplyScalar(scaleChange).add(targetPosition);
      lastFitScale.current = fitScale;
    }
  }, [camera, fitCameraToStage, invalidate, position[0], position[1], position[2], size.height, size.width, target[0], target[1], target[2]]);

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
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
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
  frameloop = 'always',
  dpr = [1, 1.5],
  autoRotate: autoRotateProp = false,
  autoRotateSpeed = 1.0,
  showAutoRotateButton = true,
  showFullscreenButton = true,
  fitCameraToStage = false,
}) => {
  const [isRotating, setIsRotating] = useState<boolean>(autoRotateProp);

  useEffect(() => {
    setIsRotating(autoRotateProp);
  }, [autoRotateProp]);

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
        isAutoRotating={isRotating}
        onToggleAutoRotate={showAutoRotateButton ? () => setIsRotating((prev: boolean) => !prev) : undefined}
        showFullscreenButton={showFullscreenButton}
      >
        <color attach="background" args={['#06131d']} />
        <ResponsiveCameraRig
          position={cameraPosition}
          target={cameraTarget}
          resetKey={resetKey}
          autoRotate={isRotating}
          autoRotateSpeed={autoRotateSpeed}
          fitCameraToStage={fitCameraToStage}
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
