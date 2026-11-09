import React, { useState } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { Molecule3DViewer } from '../3d/Molecule3DViewer';
import { BilingualText } from '../BilingualText';
import { OPTICAL_EXAMPLES } from '../../content/examples/opticalExamples';
import { Sparkles, Eye, RotateCw, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const CIPPriorityLab: React.FC = () => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0); // Lactic acid
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  const currentExample = OPTICAL_EXAMPLES[selectedExampleIndex] || OPTICAL_EXAMPLES[0];
  const structure = currentExample.isomerA.structure;

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <label htmlFor="cip-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Select Molecule:" bn="অণু নির্বাচন:" />
          </label>
          <select
            id="cip-select"
            value={selectedExampleIndex}
            onChange={(e) => {
              setSelectedExampleIndex(Number(e.target.value));
              setActiveStep(1);
            }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            {OPTICAL_EXAMPLES.slice(0, 10).map((ex, idx) => (
              <option key={ex.id} value={idx}>
                {idx + 1}. {ex.iupacName.en} ({ex.formula})
              </option>
            ))}
          </select>
        </div>

        {/* Step Stepper */}
        <div className="flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-slate-900 p-1">
          {([1, 2, 3, 4] as const).map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(step)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
                activeStep === step
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* 3D Visualizer Canvas */}
        <div className="relative h-full w-full min-h-[300px] bg-gradient-to-b from-[#05111e] to-[#08182b]">
          <MolecularCanvas
            cameraPosition={activeStep === 3 ? [0, 0, 4.2] : [0, 1.2, 4.5]}
          >
            <Molecule3DViewer
              structure={structure}
              showLabels={true}
              showPriorityBadges={activeStep >= 2}
            />
          </MolecularCanvas>

          {/* Configuration Badge Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            <div className="rounded-xl border border-purple-500/40 bg-purple-950/40 p-3 backdrop-blur-md shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                CIP Configuration Result
              </span>
              <h4 className="text-xl font-black text-white">
                {structure.optical?.configurationRS || '(R)'}
              </h4>
              <p className="text-xs text-cyan-300 mt-0.5">
                {structure.optical?.configurationRS?.includes('R')
                  ? 'Rectus (Clockwise 1 → 2 → 3)'
                  : 'Sinister (Counter-Clockwise 1 → 2 → 3)'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Priority Derivation */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Cahn-Ingold-Prelog (CIP) Sequence</span>
          </h3>

          {/* Stepper Content */}
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3.5 space-y-3 text-xs">
            {activeStep === 1 && (
              <div>
                <h4 className="font-bold text-cyan-300 text-sm mb-1">Step 1: Identify Stereocenter</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Locate the $sp^3$ tetrahedral carbon bonded to 4 distinct groups. This is the chiral stereocenter marked with a glowing purple aura in 3D.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <h4 className="font-bold text-amber-300 text-sm mb-1">Step 2: Assign Priorities (1 to 4)</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                  Assign priority based on decreasing Atomic Number ($Z$) of the directly attached atoms:
                </p>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between rounded bg-red-950/40 border border-red-500/30 px-2 py-1 text-red-300">
                    <span>Priority 1 (Highest):</span>
                    <span className="font-bold">Z is largest</span>
                  </div>
                  <div className="flex justify-between rounded bg-amber-950/40 border border-amber-500/30 px-2 py-1 text-amber-300">
                    <span>Priority 2:</span>
                    <span className="font-bold">Next largest</span>
                  </div>
                  <div className="flex justify-between rounded bg-blue-950/40 border border-blue-500/30 px-2 py-1 text-blue-300">
                    <span>Priority 3:</span>
                    <span className="font-bold">Third largest</span>
                  </div>
                  <div className="flex justify-between rounded bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 text-emerald-300">
                    <span>Priority 4 (Lowest):</span>
                    <span className="font-bold">-H (Z=1)</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div>
                <h4 className="font-bold text-purple-300 text-sm mb-1">Step 3: Orient Priority 4 to Back</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  View the molecule along the Carbon-to-Group 4 axis such that Priority 4 (-H) points directly away from the observer behind the plane.
                </p>
              </div>
            )}

            {activeStep === 4 && (
              <div>
                <h4 className="font-bold text-emerald-300 text-sm mb-1">Step 4: Trace Arc 1 → 2 → 3</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Trace the curved arrow from Priority 1 to Priority 2 to Priority 3:
                </p>
                <div className="mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <div className="text-cyan-300 font-bold">
                    ↻ Clockwise = (R) [Rectus, Latin for Right]
                  </div>
                  <div className="text-pink-300 font-bold">
                    ↺ Counter-Clockwise = (S) [Sinister, Latin for Left]
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">Fischer Projection Shortcut:</span>
            If Priority 4 is on a <strong>Vertical bond</strong>: Clockwise = R, Counter-clockwise = S.<br />
            If Priority 4 is on a <strong>Horizontal bond</strong>: Reverse the result! (Clockwise = S, Counter-clockwise = R).
          </div>
        </div>
      </div>
    </div>
  );
};
