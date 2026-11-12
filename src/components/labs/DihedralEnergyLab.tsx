import React, { useState, useEffect, useRef } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { DihedralRotator3D } from '../3d/DihedralRotator3D';
import { NewmanSawhorse2D } from '../2d/NewmanSawhorse2D';
import { BilingualText } from '../BilingualText';
import { Play, Pause, RotateCcw, Zap, Compass, Info, ShieldAlert, Box, FileText, Columns } from 'lucide-react';

export const DihedralEnergyLab: React.FC = () => {
  const [molecule, setMolecule] = useState<'ethane' | 'propane' | 'butane' | 'glycol'>('butane');
  const [angle, setAngle] = useState<number>(180); // Default to anti 180
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d-newman' | 'split'>('3d');
  const [cameraPerspective, setCameraPerspective] = useState<'perspective' | 'newman'>('perspective');

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
  const calculateEnergy = (deg: number, mol: string): number => {
    const r = (deg * Math.PI) / 180;
    if (mol === 'ethane') {
      return Math.round((6 * (1 - Math.cos(3 * r))) * 10) / 10;
    }
    if (mol === 'propane') {
      return Math.round((7 * (1 - Math.cos(3 * r))) * 10) / 10;
    }
    if (mol === 'glycol') {
      const cosTheta = Math.cos(r);
      const cos2Theta = Math.cos(2 * r);
      const cos3Theta = Math.cos(3 * r);
      const energy = 10 - 8 * cosTheta + 5 * cos2Theta + 6 * (1 - cos3Theta);
      return Math.max(0, Math.round(energy * 10) / 10);
    }
    const e = 9.5 * (1 - Math.cos(r)) - 2.5 * (1 - Math.cos(2 * r)) + 3.8 * (1 - Math.cos(3 * r));
    return Math.max(0, Math.round((e - 0.5) * 10) / 10);
  };

  const currentEnergy = calculateEnergy(angle, molecule);

  const getConformationDescriptor = (deg: number, mol: string) => {
    const d = Math.round(deg);
    if (d >= 350 || d <= 10) {
      return {
        label: 'Fully Eclipsed (Syn-periplanar)',
        desc: 'Maximum steric clash between bulky groups & torsional strain.',
        type: 'Maximum Potential Energy',
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/30',
      };
    }
    if ((d >= 50 && d <= 70) || (d >= 290 && d <= 310)) {
      if (mol === 'glycol') {
        return {
          label: 'Gauche Conformation (STABLE EXCEPTION!)',
          desc: 'Intramolecular O-H···O hydrogen bonding stabilizes the 60° rotamer over anti!',
          type: 'Global Minimum (Exception to General Rule)',
          color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
        };
      }
      return {
        label: 'Gauche Conformation (Synclinal)',
        desc: 'Staggered but has 60° steric crowding between terminal groups.',
        type: 'Local Minimum (+3.8 kJ/mol)',
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30',
      };
    }
    if ((d >= 110 && d <= 130) || (d >= 230 && d <= 250)) {
      return {
        label: 'Partially Eclipsed (Anticlinal)',
        desc: 'Bonds eclipse each other with H/CH3 eclipsing strain.',
        type: 'Barrier Maximum (+16.0 kJ/mol)',
        color: 'text-orange-400 border-orange-500/40 bg-orange-950/30',
      };
    }
    if (d >= 170 && d <= 190) {
      return {
        label: 'Anti Conformation (Anti-periplanar)',
        desc: 'Bulky groups are at 180° opposite sides. Zero steric and zero torsional strain.',
        type: 'Global Minimum Energy (Most Stable)',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
      };
    }
    return {
      label: 'Skew / Intermediate Conformation',
      desc: 'Transitional dihedral angle between energy minima and maxima.',
      type: 'Intermediate State',
      color: 'text-slate-300 border-slate-700 bg-slate-900/40',
    };
  };

  const descriptor = getConformationDescriptor(angle, molecule);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        {/* Molecule Switcher */}
        <div className="flex w-full min-w-0 flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
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
            className="w-full min-w-0 max-w-full rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer sm:w-auto"
          >
            <option value="butane">n-Butane (CH3-CH2-CH2-CH3) [Classic]</option>
            <option value="ethane">Ethane (CH3-CH3) [12 kJ/mol Barrier]</option>
            <option value="propane">Propane (CH3-CH2-CH3) [14 kJ/mol Barrier]</option>
            <option value="glycol">Ethylene Glycol (HO-CH2-CH2-OH) [Gauche Exception!]</option>
          </select>
        </div>

        {/* View Mode Switcher (3D vs 2D Newman/Sawhorse vs Split) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>3D Model</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d-newman')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
                viewMode === '2d-newman'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>2D Newman / Sawhorse</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split (2D + 3D)</span>
            </button>
          </div>

          {/* 3D Camera Newman Toggle */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <button
              type="button"
              onClick={() => setCameraPerspective(cameraPerspective === 'perspective' ? 'newman' : 'perspective')}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{cameraPerspective === 'perspective' ? '3D Newman Angle' : 'Perspective Angle'}</span>
            </button>
          )}

          {/* Auto Rotate Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-0 ${
              isPlaying ? 'bg-amber-500 text-slate-950 font-black' : 'bg-cyan-500 text-slate-950 font-black'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Rotate'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] flex-1 min-h-[460px] lg:min-h-[540px] overflow-hidden">
        {/* Visualizer Area */}
        <div className="relative h-full w-full min-h-[360px] overflow-y-auto bg-gradient-to-b from-[#05111e] to-[#08182b]">
          {viewMode === '2d-newman' && (
            <div className="p-4 sm:p-6 h-full flex flex-col justify-center">
              <NewmanSawhorse2D
                angleDeg={angle}
                moleculeType={molecule}
                onAngleChange={(a) => setAngle(a)}
              />
            </div>
          )}

          {viewMode === '3d' && (
            <div className="relative h-full w-full min-h-[420px]">
              <MolecularCanvas
                autoRotate={cameraPerspective !== 'newman'}
                cameraPosition={cameraPerspective === 'newman' ? [0, 0, 4.8] : [0, 1.4, 4.6]}
                cameraTarget={[0, 0, 0]}
              >
                <DihedralRotator3D
                  angleDeg={angle}
                  moleculeType={molecule}
                  viewMode={cameraPerspective}
                />
              </MolecularCanvas>

              {/* Floating HUD status banner at bottom of 3D Canvas */}
              <div className="absolute bottom-4 inset-x-4 max-w-xl mx-auto z-10 rounded-2xl border p-3.5 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-slate-700/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {Math.round(angle)}°
                    </span>
                    <h4 className="text-sm font-black text-white">{descriptor.label}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{descriptor.desc}</p>
                </div>
                <div className="rounded-lg bg-slate-950/80 border border-cyan-500/30 px-3 py-1.5 text-xs text-slate-300">
                  Energy: <span className="font-mono font-bold text-amber-300">{currentEnergy} kJ/mol</span>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 h-full gap-4 p-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2 overflow-y-auto min-h-[350px]">
                <NewmanSawhorse2D
                  angleDeg={angle}
                  moleculeType={molecule}
                  onAngleChange={(a) => setAngle(a)}
                />
              </div>
              <div className="relative rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden min-h-[350px]">
                <MolecularCanvas
                  autoRotate={cameraPerspective !== 'newman'}
                  cameraPosition={cameraPerspective === 'newman' ? [0, 0, 4.8] : [0, 1.4, 4.6]}
                  cameraTarget={[0, 0, 0]}
                >
                  <DihedralRotator3D
                    angleDeg={angle}
                    moleculeType={molecule}
                    viewMode={cameraPerspective}
                  />
                </MolecularCanvas>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Potential Energy Plot & Scrubber */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>Potential Energy Curve (kJ/mol)</span>
          </h3>

          {/* Real-time SVG Potential Energy Curve */}
          <div className="relative w-full h-44 rounded-xl border border-cyan-500/20 bg-slate-950 p-2">
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

          {/* Interactive Dihedral Angle Scrubber Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Scrub Dihedral Angle (θ):</span>
              <span className="font-mono font-bold text-cyan-400">{Math.round(angle)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Quick Snap Buttons for Class 11/12 High-Yield Rotamers */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Jump to Standard Conformations:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAngle(180)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  Math.round(angle) === 180
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Anti (180°)</div>
                <div className="text-[10px] text-slate-400">0.0 kJ/mol (Global Min)</div>
              </button>

              <button
                type="button"
                onClick={() => setAngle(60)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  Math.round(angle) === 60
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Gauche (60°)</div>
                <div className="text-[10px] text-slate-400">3.8 kJ/mol (Local Min)</div>
              </button>

              <button
                type="button"
                onClick={() => setAngle(120)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  Math.round(angle) === 120
                    ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Part. Eclipsed (120°)</div>
                <div className="text-[10px] text-slate-400">16.0 kJ/mol (Barrier)</div>
              </button>

              <button
                type="button"
                onClick={() => setAngle(0)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  Math.round(angle) === 0
                    ? 'border-rose-400 bg-rose-500/20 text-rose-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Fully Eclipsed (0°)</div>
                <div className="text-[10px] text-slate-400">19.0 kJ/mol (Max Clash)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
