import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';

interface AppCanvasProps extends CanvasProps {
  showCameraControls?: boolean;
  showFullscreenButton?: boolean;
  isAutoRotating?: boolean;
  onToggleAutoRotate?: () => void;
}

export const AppCanvas = forwardRef<HTMLCanvasElement, AppCanvasProps>(
  ({ children, onCreated, showCameraControls = true, showFullscreenButton = true, isAutoRotating = false, onToggleAutoRotate, frameloop = 'always', ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [camera, setCamera] = useState<THREE.Camera | null>(null);
    const [initialPos, setInitialPos] = useState<THREE.Vector3 | null>(null);
    const [initialZoom, setInitialZoom] = useState<number>(1);
    const [controls, setControls] = useState<any>(null);
    const [isNearViewport, setIsNearViewport] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(true);
    const [canvasFullscreen, setCanvasFullscreen] = useState(false);
    const [hasFrameFullscreenHost, setHasFrameFullscreenHost] = useState(false);

    useEffect(() => {
      setHasFrameFullscreenHost(Boolean(containerRef.current?.closest('.lab-frame')));
    }, []);

    useEffect(() => {
      const handleFsChange = () => {
        const isFs = Boolean(
          document.fullscreenElement &&
            (document.fullscreenElement === containerRef.current ||
              containerRef.current?.contains(document.fullscreenElement) ||
              document.fullscreenElement.contains(containerRef.current!))
        );
        setCanvasFullscreen(isFs);
      };
      document.addEventListener('fullscreenchange', handleFsChange);
      return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const toggleCanvasFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          const host =
            (containerRef.current?.closest('.lab-frame') as HTMLElement) ||
            (containerRef.current?.closest('[data-fullscreen-host]') as HTMLElement) ||
            containerRef.current;
          if (host?.requestFullscreen) {
            await host.requestFullscreen();
          }
        }
      } catch (err) {
        console.warn('Canvas fullscreen failed', err);
      }
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      if (typeof IntersectionObserver === 'undefined') {
        setIsNearViewport(true);
        setHasBeenVisible(true);
        return;
      }

      const observer = new IntersectionObserver(([entry]) => {
        setIsNearViewport(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      }, { rootMargin: '120px 0px' });

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const handleVisibilityChange = () => {
        setIsDocumentVisible(document.visibilityState === 'visible');
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handleCreated = (state: any) => {
      setCamera(state.camera);
      setInitialPos(state.camera.position.clone());
      setInitialZoom(state.camera.zoom);
      if (state.controls) {
        setControls(state.controls);
      }
      if (onCreated) {
        onCreated(state);
      }
    };

    const handleZoom = (factor: number) => {
      if (camera) {
        if (camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) {
          camera.zoom = Math.max(0.1, Math.min(20, camera.zoom * factor));
          camera.updateProjectionMatrix();
        }
      }
    };

    const handleReset = () => {
      if (camera && initialPos) {
        camera.position.copy(initialPos);
        if (camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) {
          camera.zoom = initialZoom;
          camera.updateProjectionMatrix();
        }
        if (controls && controls.target) {
          controls.target.set(0, 0, 0);
          controls.update();
        }
      }
    };

    return (
      <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden">
        {hasBeenVisible && (
          <Canvas
            ref={ref}
            onCreated={handleCreated}
            frameloop={isNearViewport && isDocumentVisible ? frameloop : 'never'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'block',
            }}
            {...props}
          >
            {children}
          </Canvas>
        )}

        {showCameraControls && (
          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2 sm:bottom-4 sm:right-4">
            <button
              type="button"
              onClick={() => handleZoom(1.2)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-black/50 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              aria-label="Zoom In"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(1 / 1.2)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-black/50 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              aria-label="Zoom Out"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-black/50 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              aria-label="Reset View"
              title="Reset View"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </button>
            {onToggleAutoRotate && (
              <button
                type="button"
                onClick={onToggleAutoRotate}
                className={`grid h-10 w-10 place-items-center rounded-lg border shadow-lg backdrop-blur-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isAutoRotating
                    ? 'border-cyan-400 bg-cyan-500/30 text-cyan-300 ring-2 ring-cyan-400/50 shadow-cyan-500/20'
                    : 'border-white/20 bg-black/50 text-white hover:bg-black/70 hover:text-cyan-200'
                }`}
                aria-label={isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
                title={isAutoRotating ? 'Stop Auto-Rotate (3D)' : 'Start Auto-Rotate (3D)'}
              >
                <RotateCw
                  className={`h-5 w-5 ${isAutoRotating ? 'animate-spin' : ''}`}
                  style={isAutoRotating ? { animationDuration: '4s' } : undefined}
                />
              </button>
            )}
            {showFullscreenButton && !hasFrameFullscreenHost && (
              <button
                type="button"
                onClick={toggleCanvasFullscreen}
                className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/40 bg-slate-900/80 text-cyan-300 shadow-lg backdrop-blur-md transition-colors hover:bg-cyan-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                aria-label={canvasFullscreen ? 'Exit Fullscreen' : 'Fullscreen Animation'}
                title={canvasFullscreen ? 'Exit Fullscreen' : 'Fullscreen Animation'}
              >
                {canvasFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

AppCanvas.displayName = 'AppCanvas';
