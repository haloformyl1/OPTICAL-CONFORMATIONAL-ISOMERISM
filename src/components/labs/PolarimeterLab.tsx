import React, { useState } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { PolarimeterBeam3D } from '../3d/PolarimeterBeam3D';
import { PolarimeterRay2D } from '../2d/PolarimeterRay2D';
import { BilingualText } from '../BilingualText';
import { calculateSpecificRotation, calculateEnantiomericExcess } from '../../utils/chemistry';
import { Compass, RotateCw, Sun, FlaskConical, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export const PolarimeterLab: React.FC = () => {
  const [specificRotConst, setSpecificRotConst] = useState<number>(13.5); // Lactic acid
  const [pathLengthDm, setPathLengthDm] = useState<number>(1.0); // 1 dm = 10 cm
  const [concentrationGml, setConcentrationGml] = useState<number>(0.1); // 0.1 g/mL = 10 g/100 mL
  const [dextroPercent, setDextroPercent] = useState<number>(100); // 100% dextro
  const [analyzerAngle, setAnalyzerAngle] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split');

  // Optical rotation calculation
  // alpha_pure = [alpha] * l * c
  const pureRotation = specificRotConst * pathLengthDm * concentrationGml;
  // Scaled by enantiomeric excess (ee)
  const levoPercent = 100 - dextroPercent;
  const eeResult = calculateEnantiomericExcess(dextroPercent, levoPercent);
  const observedRotation = Math.round((pureRotation * (eeResult.ee / 100) * (dextroPercent >= levoPercent ? 1 : -1)) * 10) / 10;

  // Extinction alignment indicator
  const isAligned = Math.abs(analyzerAngle - observedRotation) < 2.5;

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <label htmlFor="sample-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Chiral Sample:" bn="নমুনা নির্বাচন:" />
          </label>
          <select
            id="sample-select"
            value={specificRotConst}
            onChange={(e) => {
              setSpecificRotConst(Number(e.target.value));
              setAnalyzerAngle(0);
            }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            <option value="13.5">(+)-Lactic Acid ([α] = +13.5°)</option>
            <option value="66.5">(+)-Sucrose / Cane Sugar ([α] = +66.5°)</option>
            <option value="12.7">(+)-Tartaric Acid ([α] = +12.7°)</option>
            <option value="-23.1">(-)-2-Chlorobutane ([α] = -23.1°)</option>
            <option value="-92.4">(-)-Fructose ([α] = -92.4° - Strong Levorotation)</option>
          </select>
        </div>

        {/* View Mode Switcher: 3D, 2D, Split */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Bench
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '2d'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Ray &amp; Dial
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Split (2D + 3D)
            </button>
          </div>

          {/* Live Observed Rotation Display */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 px-3 py-1 text-xs">
            <span className="text-slate-400">α_obs:</span>
            <span className="font-mono font-bold text-cyan-300">
              {observedRotation > 0 ? `+${observedRotation}°` : `${observedRotation}°`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* Visualizer Area */}
        <div className="relative h-full w-full min-h-[340px] bg-gradient-to-b from-[#05111e] to-[#08182b] flex overflow-hidden">
          {/* 3D Polarimeter Visualizer Canvas */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className={`relative h-full ${viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-slate-800' : 'w-full'}`}>
              <MolecularCanvas cameraPosition={[0, 2.2, 7.5]}>
                <PolarimeterBeam3D
                  rotationAngleDeg={observedRotation}
                  analyzerAngleDeg={analyzerAngle}
                />
              </MolecularCanvas>

              {/* Alignment Alert */}
              {isAligned && (
                <div className="absolute top-4 left-4 z-10 rounded-xl border border-emerald-500/50 bg-emerald-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg animate-pulse">
                  <span className="text-xs font-bold text-emerald-300">
                    ✓ Extinction Angle Matched! (α = {analyzerAngle}°)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2D Polarimeter Ray Diagram */}
          {(viewMode === '2d' || viewMode === 'split') && (
            <div className={`h-full ${viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'} overflow-y-auto`}>
              <PolarimeterRay2D
                analyzerAngleDeg={analyzerAngle}
                sampleLengthDm={pathLengthDm}
                concentrationGmL={concentrationGml}
                specificRotation={specificRotConst}
                onAnalyzerChange={setAnalyzerAngle}
              />
            </div>
          )}
        </div>

        {/* Right Column: Biot's Law Sliders & Enantiomeric Excess (ee) */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Compass className="h-4 w-4" />
            <span>Virtual Polarimeter Bench</span>
          </h3>

          {/* Analyzer Angle Scrubber */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Rotate Analyzer Prism (θ):</span>
              <span className="font-mono text-pink-400 font-bold">{analyzerAngle}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={analyzerAngle}
              onChange={(e) => setAnalyzerAngle(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-90° (Levorotatory l / -)</span>
              <span>0°</span>
              <span>+90° (Dextrorotatory d / +)</span>
            </div>
          </div>

          {/* Path Length Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Polarimeter Tube Length (l):</span>
              <span className="font-mono text-cyan-300 font-bold">{pathLengthDm} dm ({pathLengthDm * 10} cm)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.5"
              value={pathLengthDm}
              onChange={(e) => setPathLengthDm(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Concentration Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Concentration (c):</span>
              <span className="font-mono text-cyan-300 font-bold">{concentrationGml} g/mL</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={concentrationGml}
              onChange={(e) => setConcentrationGml(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Enantiomeric Composition (ee) Slider */}
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Enantiomer Ratio:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {dextroPercent}% (+) : {levoPercent}% (-)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dextroPercent}
              onChange={(e) => setDextroPercent(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Optical Purity (ee):</span>
              <span className="font-mono font-bold text-white">
                {eeResult.ee.toFixed(1)}% ({eeResult.major} excess)
              </span>
            </div>
            {eeResult.ee === 0 && (
              <p className="text-[10px] text-amber-300 font-bold">
                ⚡ Racemic Mixture (±): Net rotation is 0° due to external compensation!
              </p>
            )}
          </div>

          {/* Biot's Formula Info Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1.5 text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-1">
              <FlaskConical className="h-4 w-4 text-cyan-400" />
              <span>Biot&apos;s Law Formula:</span>
            </h4>
            <div className="font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded text-center font-bold">
              [α]_D^T = α_obs / (l × c)
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Where <strong className="text-white">l</strong> is in decimeters (dm, 1 dm = 10 cm), <strong className="text-white">c</strong> is in g/mL, and <strong className="text-white">α_obs</strong> is the observed rotation angle measured by the analyzer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
