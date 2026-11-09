import React, { useState, useEffect, useRef } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { DihedralRotator3D } from '../3d/DihedralRotator3D';
import { BilingualText } from '../BilingualText';
import { Play, Pause, RotateCcw, Zap, Compass, Info, ShieldAlert } from 'lucide-react';

export const DihedralEnergyLab: React.FC = () => {
  const [molecule, setMolecule] = useState<'ethane' | 'propane' | 'butane' | 'glycol'>('butane');
  const [angle, setAngle] = useState<number>(180); // Default to anti 180
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'perspective' | 'newman'>('perspective');

  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime: number | null = null;
    const speed = 40; // deg per sec

    const loop = (time: number) => {
      if (lastTime !== null) {
        const delta = (time - lastTime) / 1000;
        setAngle((prev) => (prev + delta * speed) % 360);
      }
      lastTime = time;
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Potential Energy calculation based on molecule and angle
  // Butane curve:
  // Anti (180 deg) = 0 kJ/mol
  // Gauche (60 deg, 300 deg) = 3.8 kJ/mol
  // Eclipsed (120 deg, 240 deg) = 16.0 kJ/mol
  // Fully Eclipsed (0 deg, 360 deg) = 19.0 kJ/mol
  const calculateEnergy = (deg: number, mol: string): number => {
    const r = (deg * Math.PI) / 180;
    if (mol === 'ethane') {
      // 3-fold torsional barrier: V = (V0/2) * (1 - cos(3theta)), V0 = 12 kJ/mol
      return Math.round((6 * (1 - Math.cos(3 * r))) * 10) / 10;
    }
    if (mol === 'propane') {
      // V0 = 14 kJ/mol
      return Math.round((7 * (1 - Math.cos(3 * r))) * 10) / 10;
    }
    if (mol === 'glycol') {
      // Exceptional Gauche: Gauche (60 deg) is MINIMUM (-9 kJ/mol relative to anti)
      // Anti (180 deg) = 9 kJ/mol
      // Gauche (60 deg, 300 deg) = 0 kJ/mol (H-bonding stabilization)
      // Fully Eclipsed = 24 kJ/mol
      const cosTheta = Math.cos(r);
      const cos2Theta = Math.cos(2 * r);
      const cos3Theta = Math.cos(3 * r);
      const energy = 10 - 8 * cosTheta + 5 * cos2Theta + 6 * (1 - cos3Theta);
      return Math.max(0, Math.round(energy * 10) / 10);
    }
    // Butane:
    // Fourier expansion approximation: V(theta) = c1(1-cos theta) + c2(1-cos 2theta) + c3(1-cos 3theta)
    const e = 9.5 * (1 - Math.cos(r)) - 2.5 * (1 - Math.cos(2 * r)) + 3.8 * (1 - Math.cos(3 * r));
    // Normalize so anti (180) is 0
    return Math.max(0, Math.round((e - 0.5) * 10) / 10);
  };

  const currentEnergy = calculateEnergy(angle, molecule);

  // Conformational State Descriptor
  const getConformationDescriptor = (deg: number, mol: string) => {
    const d = Math.round(deg);
    if (d >= 350 || d <= 10) {
      return {
        label: 'Fully Eclipsed (Syn-periplanar)',
        bn: 'সম্পূর্ণ গ্রহণযুক্ত (Syn-periplanar)',
        color: 'text-rose-400',
        bg: 'border-rose-500/40 bg-rose-500/10',
        type: 'Global Maximum Energy (Steric + Torsional Strain)',
      };
    }
    if ((d >= 50 && d <= 70) || (d >= 290 && d <= 310)) {
      return {
        label: mol === 'glycol' ? 'Gauche (Intramolecular H-Bonded Minimum)' : 'Gauche (Synclinal)',
        bn: mol === 'glycol' ? 'গশ (অন্তঃআণবিক হাইড্রোজেন বন্ধন যুক্ত স্থিতিশীল)' : 'গশ (Synclinal)',
        color: 'text-emerald-400',
        bg: 'border-emerald-500/40 bg-emerald-500/10',
        type: mol === 'glycol' ? 'Global Minimum in Gas/Non-polar!' : 'Local Minimum (Steric Strain 3.8 kJ/mol)',
      };
    }
    if ((d >= 110 && d <= 130) || (d >= 230 && d <= 250)) {
      return {
        label: 'Partially Eclipsed (Anticlinal)',
        bn: 'আংশিক গ্রহণযুক্ত (Anticlinal)',
        color: 'text-amber-400',
        bg: 'border-amber-500/40 bg-amber-500/10',
        type: 'Intermediate Energy Barrier (H / CH3 eclipsing)',
      };
    }
    if (d >= 170 && d <= 190) {
      return {
        label: 'Anti-periplanar (Staggered)',
        bn: 'অ্যান্টি-পেরিপ্ল্যানার (সমান্তরাল বিপরীত)',
        color: 'text-cyan-400',
        bg: 'border-cyan-500/40 bg-cyan-500/10',
        type: mol === 'glycol' ? 'Less stable than Gauche in CCl4' : 'Global Minimum (Steric & Torsional Minimum)',
      };
    }
    return {
      label: 'Skew / Intermediate Rotamer',
      bn: 'তির্যক / মধ্যবর্তী ঘূর্ণক',
      color: 'text-slate-300',
      bg: 'border-slate-700 bg-slate-800/40',
      type: 'Torsional rotation in progress',
    };
  };

  const descriptor = getConformationDescriptor(angle, molecule);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        {/* Molecule Switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="mol-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Molecule:" bn="অণু নির্বাচন:" />
          </label>
          <select
            id="mol-select"
            value={molecule}
            onChange={(e) => {
              setMolecule(e.target.value as any);
              setAngle(180);
            }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            <option value="butane">n-Butane (CH3-CH2-CH2-CH3) [Classic]</option>
            <option value="ethane">Ethane (CH3-CH3) [12 kJ/mol Barrier]</option>
            <option value="propane">Propane (CH3-CH2-CH3) [14 kJ/mol Barrier]</option>
            <option value="glycol">Ethylene Glycol (HO-CH2-CH2-OH) [Gauche Exception!]</option>
          </select>
        </div>

        {/* View Mode & Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'perspective' ? 'newman' : 'perspective')}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{viewMode === 'perspective' ? 'Switch to Newman View' : 'Switch to 3D View'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-0 ${
              isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Rotate'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: 3D Canvas + Energy Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* 3D Visualizer Canvas */}
        <div className="relative h-full w-full min-h-[300px] bg-gradient-to-b from-[#05111e] to-[#08182b]">
          <MolecularCanvas cameraPosition={viewMode === 'newman' ? [0, 0, 4.8] : [0, 1.2, 4.5]}>
            <DihedralRotator3D angleDeg={angle} moleculeType={molecule} viewMode={viewMode} />
          </MolecularCanvas>

          {/* Current Conformation HUD Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
            <div className={`rounded-xl border p-2.5 backdrop-blur-md shadow-lg ${descriptor.bg}`}>
              <div className="flex items-center gap-1.5">
                <Zap className={`h-4 w-4 ${descriptor.color}`} />
                <span className={`text-xs font-black uppercase tracking-wider ${descriptor.color}`}>
                  {descriptor.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">{descriptor.type}</p>
            </div>
            <div className="rounded-lg bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 backdrop-blur-sm">
              Dihedral Angle (θ): <span className="font-mono font-bold text-cyan-300">{Math.round(angle)}°</span> | Energy: <span className="font-mono font-bold text-amber-300">{currentEnergy} kJ/mol</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Potential Energy Plot & Snapping Controls */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>Potential Energy Profile (kJ/mol)</span>
          </h3>

          {/* Real-time SVG Potential Energy Curve */}
          <div className="relative w-full h-44 rounded-xl border border-cyan-500/20 bg-slate-950 p-2 mb-3">
            <svg viewBox="0 0 360 100" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="360" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="360" y2="50" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="360" y2="80" stroke="#334155" strokeDasharray="3 3" />

              {/* Energy Curve Path */}
              {(() => {
                const points: string[] = [];
                for (let deg = 0; deg <= 360; deg += 3) {
                  const e = calculateEnergy(deg, molecule);
                  const y = 85 - (e / (molecule === 'glycol' ? 26 : 22)) * 70;
                  points.push(`${deg},${y}`);
                }
                return (
                  <polyline
                    fill="none"
                    stroke="#00f2fe"
                    strokeWidth="2.5"
                    points={points.join(' ')}
                  />
                );
              })()}

              {/* Current Angle Tracking Indicator Circle */}
              {(() => {
                const curY = 85 - (currentEnergy / (molecule === 'glycol' ? 26 : 22)) * 70;
                return (
                  <g>
                    <line x1={angle} y1="0" x2={angle} y2="95" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx={angle} cy={curY} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>

            {/* X-axis key angles */}
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0° (Syn)</span>
              <span>60° (G)</span>
              <span>120°</span>
              <span>180° (Anti)</span>
              <span>240°</span>
              <span>300° (G)</span>
              <span>360°</span>
            </div>
          </div>

          {/* Interactive Dihedral Angle Slider */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Scrub Dihedral Angle (θ):</span>
              <span className="font-mono text-cyan-300 font-bold">{Math.round(angle)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => {
                setIsPlaying(false);
                setAngle(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Quick Snap Conformation Buttons */}
          <div className="space-y-1.5 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Snap to Key Conformations:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => { setAngle(180); setIsPlaying(false); }}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  Math.round(angle) === 180 ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                Anti (180°)
              </button>
              <button
                type="button"
                onClick={() => { setAngle(60); setIsPlaying(false); }}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  Math.round(angle) === 60 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                Gauche (60°)
              </button>
              <button
                type="button"
                onClick={() => { setAngle(120); setIsPlaying(false); }}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  Math.round(angle) === 120 ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                Partially Eclipsed (120°)
              </button>
              <button
                type="button"
                onClick={() => { setAngle(0); setIsPlaying(false); }}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  Math.round(angle) === 0 ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                Fully Eclipsed (0°)
              </button>
            </div>
          </div>

          {/* Exceptional Case Note for Glycol */}
          {molecule === 'glycol' && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>The Gauche Effect Anomaly!</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-200/90">
                Unlike butane where Anti is the global minimum, ethylene glycol forms a stable 5-membered cyclic intramolecular hydrogen bond (O-H···O) in the Gauche conformer (60°), releasing ~8-12 kJ/mol and making Gauche significantly more stable than Anti!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

