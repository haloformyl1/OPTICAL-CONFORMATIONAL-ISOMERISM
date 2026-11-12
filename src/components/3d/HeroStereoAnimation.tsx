import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MolecularCanvas } from './MolecularCanvas';
import { DihedralRotator3D } from './DihedralRotator3D';
import { Compass } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AutoRotatingRotamerProps {
  targetAngle: number;
  moleculeType: 'ethane' | 'propane' | 'butane' | 'glycol';
  viewMode: 'perspective' | 'newman';
  animated: boolean;
}

const AutoRotatingRotamer: React.FC<AutoRotatingRotamerProps> = ({
  targetAngle,
  moleculeType,
  viewMode,
  animated,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentAngleDeg = useRef<number>(targetAngle);
  const frameAccumulator = useRef(0);
  const [animatedAngle, setAnimatedAngle] = useState(targetAngle);

  useFrame((state, delta) => {
    if (groupRef.current && animated && viewMode === 'perspective') {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    } else if (groupRef.current && (viewMode === 'newman' || !animated)) {
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.position.y = 0;
    }

    const diff = targetAngle - currentAngleDeg.current;
    if (Math.abs(diff) > 0.05) {
      currentAngleDeg.current = THREE.MathUtils.damp(currentAngleDeg.current, targetAngle, 8, delta);
      frameAccumulator.current += delta;
      if (frameAccumulator.current >= 1 / 30 || Math.abs(diff) < 0.2) {
        setAnimatedAngle(currentAngleDeg.current);
        frameAccumulator.current = 0;
      }
    } else if (Math.abs(diff) > 0) {
      currentAngleDeg.current = targetAngle;
      setAnimatedAngle(targetAngle);
      frameAccumulator.current = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <DihedralRotator3D
        angleDeg={animatedAngle}
        moleculeType={moleculeType}
        viewMode={viewMode}
        showCarbonLabels={false}
      />
    </group>
  );
};

export const HeroStereoAnimation: React.FC = () => {
  const [angle, setAngle] = useState(180); // Anti by default
  const [viewMode, setViewMode] = useState<'perspective' | 'newman'>('perspective');
  const reducedMotion = useStore((state) => state.reducedMotion);
  const animated = !reducedMotion;

  return (
    <div className="relative h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] w-full overflow-hidden">
      {/* 3D Canvas */}
      <MolecularCanvas
        frameloop={animated ? 'always' : 'demand'}
        showAutoRotateButton={false}
        showFullscreenButton={false}
        fitCameraToStage
        cameraPosition={viewMode === 'newman' ? [0, 0, 4.8] : [3.5, 2.2, 4.2]}
      >
        <AutoRotatingRotamer
          targetAngle={angle}
          moleculeType="butane"
          viewMode={viewMode}
          animated={animated}
        />
      </MolecularCanvas>

      <div className="pointer-events-none absolute bottom-2 left-2 right-14 z-10 flex flex-col items-stretch gap-2 sm:bottom-4 sm:left-4 sm:right-18 sm:flex-row sm:items-end sm:justify-between">
        {/* Preset Buttons */}
        <div className="pointer-events-auto flex w-full rounded-xl border border-cyan-500/30 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md sm:w-auto">
          <button
            type="button"
            onClick={() => setAngle(180)}
            aria-pressed={angle === 180}
            className={`flex-1 rounded-lg px-1.5 py-1 text-[10px] font-bold transition-all cursor-pointer border-0 sm:flex-none sm:px-2.5 sm:text-xs ${
              angle === 180
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="sm:hidden">Anti</span>
            <span className="hidden sm:inline">Anti (180°)</span>
          </button>
          <button
            type="button"
            onClick={() => setAngle(60)}
            aria-pressed={angle === 60}
            className={`flex-1 rounded-lg px-1.5 py-1 text-[10px] font-bold transition-all cursor-pointer border-0 sm:flex-none sm:px-2.5 sm:text-xs ${
              angle === 60
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="sm:hidden">Gauche</span>
            <span className="hidden sm:inline">Gauche (60°)</span>
          </button>
          <button
            type="button"
            onClick={() => setAngle(0)}
            aria-pressed={angle === 0}
            className={`flex-1 rounded-lg px-1.5 py-1 text-[10px] font-bold transition-all cursor-pointer border-0 sm:flex-none sm:px-2.5 sm:text-xs ${
              angle === 0
                ? 'bg-rose-500 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="sm:hidden">Eclipsed</span>
            <span className="hidden sm:inline">Eclipsed (0°)</span>
          </button>
        </div>

        {/* Perspective vs Newman Projection Toggle */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'perspective' ? 'newman' : 'perspective')}
          aria-pressed={viewMode === 'newman'}
          className="pointer-events-auto flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-cyan-300 shadow-md backdrop-blur-md hover:bg-cyan-500/20 cursor-pointer sm:justify-start"
        >
          <Compass className="h-3.5 w-3.5" />
          <span className="sm:hidden">{viewMode === 'perspective' ? 'Newman' : '3D View'}</span>
          <span className="hidden sm:inline">{viewMode === 'perspective' ? 'Newman Projection' : '3D View'}</span>
        </button>
      </div>
    </div>
  );
};

