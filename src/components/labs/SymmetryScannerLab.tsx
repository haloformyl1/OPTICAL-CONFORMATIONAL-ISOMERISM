import React, { useState } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { SymmetryScanner3D } from '../3d/SymmetryScanner3D';
import { BilingualText } from '../BilingualText';
import { OPTICAL_EXAMPLES } from '../../content/examples/opticalExamples';
import { CONFORMATIONAL_EXAMPLES } from '../../content/examples/conformationalExamples';
import { ShieldCheck, ShieldAlert, Layers, Eye, EyeOff, Info } from 'lucide-react';

export const SymmetryScannerLab: React.FC = () => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(2); // meso-tartaric acid by default
  const [showPOS, setShowPOS] = useState(true);
  const [posPlane, setPosPlane] = useState<'xy' | 'yz' | 'xz'>('xy');
  const [showCOS, setShowCOS] = useState(false);

  // Available curated test molecules
  const testMolecules = [
    { label: "meso-Tartaric Acid (Has POS, Achiral)", pair: OPTICAL_EXAMPLES[2], plane: 'xy' as const, hasPos: true, hasCos: false },
    { label: "(2R,3R)-Tartaric Acid (Chiral Enantiomer, No POS/COS)", pair: OPTICAL_EXAMPLES[1], plane: 'xy' as const, hasPos: false, hasCos: false },
    { label: "Lactic Acid (Asymmetric, Chiral)", pair: OPTICAL_EXAMPLES[0], plane: 'xy' as const, hasPos: false, hasCos: false },
    { label: "trans-1,4-Dimethylcyclohexane (Has Inversion Center i, Achiral)", pair: CONFORMATIONAL_EXAMPLES[25], plane: 'xy' as const, hasPos: false, hasCos: true },
    { label: "cis-1,3-Dimethylcyclohexane (Meso with POS, Achiral)", pair: CONFORMATIONAL_EXAMPLES[22], plane: 'yz' as const, hasPos: true, hasCos: false },
  ];

  const currentTest = testMolecules[selectedExampleIndex] || testMolecules[0];
  const activeStructure = currentTest.pair.isomerA.structure;

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <label htmlFor="sym-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Test Molecule:" bn="অণু নির্বাচন:" />
          </label>
          <select
            id="sym-select"
            value={selectedExampleIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedExampleIndex(idx);
              setPosPlane(testMolecules[idx].plane);
              setShowPOS(testMolecules[idx].hasPos);
              setShowCOS(testMolecules[idx].hasCos);
            }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            {testMolecules.map((m, i) => (
              <option key={i} value={i}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPOS(!showPOS)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              showPOS
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            {showPOS ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Plane of Symmetry (σ)</span>
          </button>

          {showPOS && (
            <div className="flex rounded-lg border border-cyan-500/30 bg-slate-900 p-0.5 text-[11px] font-bold">
              {(['xy', 'yz', 'xz'] as const).map((plane) => (
                <button
                  key={plane}
                  type="button"
                  onClick={() => setPosPlane(plane)}
                  className={`rounded px-2 py-0.5 uppercase cursor-pointer border-0 ${
                    posPlane === plane ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {plane}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowCOS(!showCOS)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              showCOS
                ? 'border-pink-400 bg-pink-500/20 text-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.3)]'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            {showCOS ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Inversion Center (i)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* 3D Visualizer Canvas */}
        <div className="relative h-full w-full min-h-[300px] bg-gradient-to-b from-[#05111e] to-[#08182b]">
          <MolecularCanvas cameraPosition={[0, 1.5, 4.8]}>
            <SymmetryScanner3D
              structure={activeStructure}
              showPOS={showPOS}
              posPlane={posPlane}
              showCOS={showCOS}
            />
          </MolecularCanvas>

          {/* Verdict HUD Card */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`rounded-xl border p-3 backdrop-blur-md shadow-lg max-w-xs ${
              currentTest.hasPos || currentTest.hasCos
                ? 'border-emerald-500/40 bg-emerald-950/40'
                : 'border-purple-500/40 bg-purple-950/40'
            }`}>
              <div className="flex items-center gap-1.5">
                {currentTest.hasPos || currentTest.hasCos ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-purple-400" />
                )}
                <span className={`text-xs font-black uppercase tracking-wider ${
                  currentTest.hasPos || currentTest.hasCos ? 'text-emerald-300' : 'text-purple-300'
                }`}>
                  {currentTest.hasPos || currentTest.hasCos ? 'Achiral / Optically Inactive' : 'Chiral / Optically Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {currentTest.hasPos
                  ? 'Contains internal Plane of Symmetry (σ). Upper and lower halves reflect symmetrically.'
                  : currentTest.hasCos
                  ? 'Contains Center of Inversion (i). Inverting through center yields an identical atom.'
                  : 'Lacks both plane of symmetry and inversion center. Non-superimposable on mirror image.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Theoretical Explanation & Symmetry Checklist */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            <span>Symmetry Criteria for Chirality</span>
          </h3>

          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Plane of Symmetry (σ):</span>
              <span className={`font-bold ${currentTest.hasPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentTest.hasPos ? 'PRESENT (Achiral)' : 'ABSENT'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Inversion Center (i):</span>
              <span className={`font-bold ${currentTest.hasCos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentTest.hasCos ? 'PRESENT (Achiral)' : 'ABSENT'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Optical Activity:</span>
              <span className={`font-bold font-mono ${
                currentTest.hasPos || currentTest.hasCos ? 'text-slate-400' : 'text-cyan-300'
              }`}>
                {currentTest.hasPos || currentTest.hasCos ? '0.0° (Inactive)' : 'Active (d or l)'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>General Rule:</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              A molecule is <strong className="text-white">chiral</strong> if and only if it lacks an alternating axis of symmetry ($S_n$). In 99.9% of organic chemistry, checking for the absence of both a <span className="text-cyan-300 font-semibold">Plane of Symmetry (σ = S_1)</span> and a <span className="text-pink-300 font-semibold">Center of Symmetry (i = S_2)</span> is completely sufficient to establish optical activity!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
