import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MolecularCanvas } from './MolecularCanvas';
import { DihedralRotator3D } from './DihedralRotator3D';
import { BilingualText } from '../BilingualText';
import { RotateCcw, Compass, Zap } from 'lucide-react';

export const HeroStereoAnimation: React.FC = () => {
  const [angle, setAngle] = useState(180); // Anti by default
  const [viewMode, setViewMode] = useState<'perspective' | 'newman'>('perspective');

  return (
    <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full rounded-3xl border border-[rgba(70,227,255,0.22)] bg-gradient-to-b from-[#08182b] to-[#040d1a] shadow-2xl backdrop-blur-2xl overflow-hidden">
      {/* 3D Canvas */}
      <MolecularCanvas cameraPosition={viewMode === 'newman' ? [0, 0, 4.8] : [0, 1.4, 4.6]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <DihedralRotator3D angleDeg={angle} moleculeType="butane" viewMode={viewMode} />
        </Float>
      </MolecularCanvas>

      {/* Floating Interactive Controls */}
      <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900/90 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setAngle(180)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 180 ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anti (180°)
          </button>
          <button
            type="button"
            onClick={() => setAngle(60)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 60 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gauche (60°)
          </button>
          <button
            type="button"
            onClick={() => setAngle(0)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
              angle === 0 ? 'bg-rose-500 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Eclipsed (0°)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'perspective' ? 'newman' : 'perspective')}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 backdrop-blur-md cursor-pointer"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>{viewMode === 'perspective' ? 'Newman Projection' : '3D View'}</span>
        </button>
      </div>
    </div>
  );
};
