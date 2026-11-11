import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MolecularCanvas } from './MolecularCanvas';
import { DihedralRotator3D } from './DihedralRotator3D';
import { Compass } from 'lucide-react';

interface AutoRotatingRotamerProps {
  targetAngle: number;
  moleculeType: 'ethane' | 'propane' | 'butane' | 'glycol';
  viewMode: 'perspective' | 'newman';
}

const AutoRotatingRotamer: React.FC<AutoRotatingRotamerProps> = ({
  targetAngle,
  moleculeType,
  viewMode,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentAngleDeg = useRef<number>(targetAngle);
  const [animatedAngle, setAnimatedAngle] = useState(targetAngle);

  useFrame((state, delta) => {
    // Continuous automatic 3D rotation all the time on the front screen
    if (groupRef.current && viewMode === 'perspective') {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    } else if (groupRef.current && viewMode === 'newman') {
      // In Newman mode, align straight down the C-C axis
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.position.y = 0;
    }

    // Smooth physics damp to selected conformer preset
    const diff = targetAngle - currentAngleDeg.current;
    if (Math.abs(diff) > 0.05) {
      currentAngleDeg.current = THREE.MathUtils.damp(currentAngleDeg.current, targetAngle, 8, delta);
      setAnimatedAngle(currentAngleDeg.current);
    }
  });

  return (
    <group ref={groupRef}>
      <DihedralRotator3D
        angleDeg={animatedAngle}
        moleculeType={moleculeType}
        viewMode={viewMode}
      />
    </group>
  );
};

export const HeroStereoAnimation: React.FC = () => {
  const [angle, setAngle] = useState(180); // Anti by default
  const [viewMode, setViewMode] = useState<'perspective' | 'newman'>('perspective');

  return (
    <div className="relative h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] w-full overflow-hidden">
      {/* 3D Canvas */}
      <MolecularCanvas cameraPosition={viewMode === 'newman' ? [0, 0, 4.8] : [0, 1.4, 4.6]}>
        <AutoRotatingRotamer
          targetAngle={angle}
          moleculeType="butane"
          viewMode={viewMode}
        />
      </MolecularCanvas>

      {/* Floating Interactive Controls (Original Clean Layout) */}
      <div className="absolute bottom-4 left-4 right-18 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        {/* Preset Buttons */}
        <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900/90 p-1 backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => setAngle(180)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 180
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anti (180°)
          </button>
          <button
            type="button"
            onClick={() => setAngle(60)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 60
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gauche (60°)
          </button>
          <button
            type="button"
            onClick={() => setAngle(0)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 0
                ? 'bg-rose-500 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Eclipsed (0°)
          </button>
        </div>

        {/* Perspective vs Newman Projection Toggle */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'perspective' ? 'newman' : 'perspective')}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 backdrop-blur-md cursor-pointer shadow-md pointer-events-auto"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>{viewMode === 'perspective' ? 'Newman Projection' : '3D View'}</span>
        </button>
      </div>
    </div>
  );
};

