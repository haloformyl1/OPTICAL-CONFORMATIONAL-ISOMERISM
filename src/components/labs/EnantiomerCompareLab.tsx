import React, { useState } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { SuperpositionViewer3D } from '../3d/SuperpositionViewer3D';
import { FischerProjection2D } from '../2d/FischerProjection2D';
import { BilingualText } from '../BilingualText';
import { OPTICAL_EXAMPLES } from '../../content/examples/opticalExamples';
import { ArrowLeftRight, CheckCircle2, XCircle, RotateCw, Layers, ShieldCheck, ShieldAlert, Tag, Hash, Box, FileText, Columns, Info } from 'lucide-react';

export const EnantiomerCompareLab: React.FC = () => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(1); // Default to Tartaric Acid
  const [superimposeProgress, setSuperimposeProgress] = useState<number>(0); // 0 = separate, 1 = overlaid
  const [isAutoSuperimposing, setIsAutoSuperimposing] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d-fischer' | 'split'>('3d');
  const [showLabels, setShowLabels] = useState(true);
  const [showPriorityBadges, setShowPriorityBadges] = useState(true);

  // Smooth continuous auto-superposition animation by default
  React.useEffect(() => {
    if (!isAutoSuperimposing) return;
    let animId: number;
    let startTime: number | null = null;
    const duration = 4000;

    const loop = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = (time - startTime) % duration;
      const t = elapsed / duration;
      const p = Math.sin(t * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
      setSuperimposeProgress(p);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoSuperimposing]);

  const testPairs = [
    { label: "(R)- vs (S)-Lactic Acid [Enantiomers]", pair: OPTICAL_EXAMPLES[0], rel: "enantiomers" as const },
    { label: "(2R,3R)- vs (2S,3S)-Tartaric Acid [Enantiomers]", pair: OPTICAL_EXAMPLES[1], rel: "enantiomers" as const },
    { label: "meso-Tartaric Acid vs its Mirror Image [Superimposable / Identical]", pair: OPTICAL_EXAMPLES[2], rel: "identical" as const },
    { label: "D-Erythrose vs D-Threose [Diastereomers]", pair: OPTICAL_EXAMPLES[7], rel: "diastereomers" as const },
    { label: "(R)- vs (S)-2-Chlorobutane [Enantiomers]", pair: OPTICAL_EXAMPLES[4], rel: "enantiomers" as const },
  ];

  const currentItem = testPairs[selectedPairIndex] || testPairs[1];

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="pair-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Stereoisomer Pair:" bn="জোড় নির্বাচন:" />
          </label>
          <select
            id="pair-select"
            value={selectedPairIndex}
            onChange={(e) => {
              setSelectedPairIndex(Number(e.target.value));
              setSuperimposeProgress(0);
            }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer max-w-xs sm:max-w-none truncate"
          >
            {testPairs.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode & Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 3D vs 2D Fischer vs Split Switcher */}
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>3D Model</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d-fischer')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '2d-fischer'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>2D Fischer Formula</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split (2D + 3D)</span>
            </button>
          </div>

          {/* 3D Toggles (Atom Labels & CIP Priority) */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  showLabels
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}
                title="Toggle Atom Labels"
              >
                <Tag className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowPriorityBadges(!showPriorityBadges)}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  showPriorityBadges
                    ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                    : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}
                title="Toggle CIP Priority Badges (1-4)"
              >
                <Hash className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAutoSuperimposing) {
                    setIsAutoSuperimposing(false);
                  } else {
                    setSuperimposeProgress(superimposeProgress > 0.5 ? 0 : 1);
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 cursor-pointer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>
                  {isAutoSuperimposing
                    ? '⏸ Auto-Superposing (Pause)'
                    : superimposeProgress > 0.5
                    ? 'Separate'
                    : '▶ Auto-Superpose (Play)'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[540px] overflow-hidden">
        {/* Visualizer Area */}
        <div className="relative h-full w-full min-h-[360px] overflow-y-auto bg-gradient-to-b from-[#05111e] to-[#08182b]">
          {viewMode === '2d-fischer' && (
            <div className="p-4 sm:p-6 h-full flex flex-col justify-center">
              <FischerProjection2D pairIndex={selectedPairIndex} />
            </div>
          )}

          {viewMode === '3d' && (
            <div className="relative h-full w-full min-h-[420px]">
              <MolecularCanvas cameraPosition={[0, 1.2, 5.2]}>
                <SuperpositionViewer3D
                  structureA={currentItem.pair.isomerA.structure}
                  structureB={currentItem.pair.isomerB.structure}
                  mode={superimposeProgress > 0.5 ? 'superimposed' : 'side-by-side'}
                  relationship={currentItem.rel}
                  superimposeProgress={superimposeProgress}
                  showLabels={showLabels}
                  showPriorityBadges={showPriorityBadges}
                />
              </MolecularCanvas>

              {/* Superposition Scrubber Track at Bottom of Canvas */}
              <div className="absolute bottom-4 inset-x-4 max-w-sm mx-auto z-10 rounded-xl border border-slate-700/80 bg-slate-900/90 p-2.5 backdrop-blur-md shadow-xl">
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Separated View</span>
                  <span className="font-mono text-cyan-300">{Math.round(superimposeProgress * 100)}% Overlaid</span>
                  <span>Full Superposition</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={superimposeProgress}
                  onChange={(e) => setSuperimposeProgress(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 h-full gap-4 p-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2 overflow-y-auto min-h-[350px]">
                <FischerProjection2D pairIndex={selectedPairIndex} />
              </div>
              <div className="relative rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden min-h-[350px]">
                <MolecularCanvas cameraPosition={[0, 1.2, 5.2]}>
                  <SuperpositionViewer3D
                    structureA={currentItem.pair.isomerA.structure}
                    structureB={currentItem.pair.isomerB.structure}
                    mode={superimposeProgress > 0.5 ? 'superimposed' : 'side-by-side'}
                    relationship={currentItem.rel}
                    superimposeProgress={superimposeProgress}
                    showLabels={showLabels}
                    showPriorityBadges={showPriorityBadges}
                  />
                </MolecularCanvas>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Stereochemical Relationship Breakdown */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            <span>Stereochemical Relationship</span>
          </h3>

          <div
            className={`rounded-xl border p-3.5 space-y-2 text-xs ${
              currentItem.rel === 'enantiomers'
                ? 'border-purple-500/40 bg-purple-950/20'
                : currentItem.rel === 'identical'
                ? 'border-emerald-500/40 bg-emerald-950/20'
                : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {currentItem.rel === 'identical' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : currentItem.rel === 'enantiomers' ? (
                <ShieldAlert className="h-5 w-5 text-purple-400" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-400" />
              )}
              <h4 className="font-black text-sm text-white uppercase tracking-wider">
                {currentItem.rel === 'enantiomers'
                  ? 'Enantiomers (Non-Superimposable Mirror Images)'
                  : currentItem.rel === 'identical'
                  ? 'Identical Homomers (Superimposable)'
                  : 'Diastereomers (Non-Mirror Stereoisomers)'}
              </h4>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              {currentItem.rel === 'enantiomers' &&
                'Molecule B is the exact mirror image of Molecule A. When you slide B onto A, only two groups can align; the remaining two groups mismatch and clash! They rotate plane-polarized light in equal and opposite directions (+ and -).'}
              {currentItem.rel === 'identical' &&
                'Even though Molecule B was constructed by reflecting Molecule A, rotating B by 180° in the plane causes all atoms to align 100% with Molecule A! They are the SAME molecule (Achiral Meso).'}
              {currentItem.rel === 'diastereomers' &&
                'Molecules A and B are stereoisomers that are NOT mirror images of each other! One stereocenter has identical configuration while the second has inverted configuration. They have distinct physical properties.'}
            </p>
          </div>

          {/* Quick Relationship Rules Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-300 space-y-1.5">
            <span className="font-bold text-white block mb-1">Cheat-Sheet for Exams:</span>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Mirror Image + Non-Superimposable:</span>
              <span className="font-bold text-purple-400">Enantiomers</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Mirror Image + Superimposable:</span>
              <span className="font-bold text-emerald-400">Identical / Meso</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400">Not Mirror Images + Non-Superimposable:</span>
              <span className="font-bold text-amber-400">Diastereomers</span>
            </div>
          </div>

          {/* Fischer Projection Guidelines Tip */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Info className="h-3.5 w-3.5" />
              <span>Fischer Projection Tip</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Toggle to the <span className="text-purple-300 font-bold">&quot;2D Fischer Formula&quot;</span> tab above to view classic horizontal/vertical cross formulas and test 180° in-plane symmetry operations!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
