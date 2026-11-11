import React, { useState, useEffect } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { CyclohexaneFlip3D, type CyclohexaneForm } from '../3d/CyclohexaneFlip3D';
import { CyclohexaneChair2D } from '../2d/CyclohexaneChair2D';
import { BilingualText } from '../BilingualText';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Flame, Info, Eye, Layers } from 'lucide-react';

const conformationSteps: Array<{
  id: CyclohexaneForm;
  nameEn: string;
  nameBn: string;
  energyKJ: number;
  descriptionEn: string;
  descriptionBn: string;
}> = [
  {
    id: 'chair1',
    nameEn: 'Chair 1 (Ground State)',
    nameBn: 'চেয়ার ১ (মূল নিম্নশক্তি অবস্থা)',
    energyKJ: 0,
    descriptionEn: 'All C-C-C angles are 109.5° (no angle strain) and all adjacent C-H bonds are perfectly staggered (no torsional strain).',
    descriptionBn: 'সকল C-C-C কোণ ১০৯.৫° (কোণ বিকৃতি নেই) এবং সকল সংলগ্ন বন্ধন সম্পূর্ণভাবে স্ট্যাগার্ড (টর্শনাল বিকৃতি নেই)।',
  },
  {
    id: 'half-chair',
    nameEn: 'Half-Chair (Transition State)',
    nameBn: 'হাফ-চেয়ার (সংক্রমণ অবস্থা)',
    energyKJ: 45,
    descriptionEn: 'Extreme steric & torsional barrier (~45 kJ/mol). Four carbons lie in one plane with substantial eclipsing strain.',
    descriptionBn: 'চরম বাধা (~৪৫ কিজু/মোল)। চারটি কার্বন একই সমতলে অবস্থান করায় তীব্র গ্রহণযুক্ত বিকৃতি ঘটে।',
  },
  {
    id: 'twist-boat',
    nameEn: 'Twist-Boat (Local Minimum)',
    nameBn: 'টুইস্ট-বোট (স্থানীয় নিম্নশক্তি অবস্থা)',
    energyKJ: 23,
    descriptionEn: 'Slightly twisted to relieve both flagpole repulsion and eclipsing strain. ~23 kJ/mol above the chair.',
    descriptionBn: 'ফ্ল্যাগপোল এবং এক্লিপসিং বিকৃতি কমাতে সামান্য মোচড়ানো অবস্থা। চেয়ারের চেয়ে ~২৩ কিজু/মোল উচ্চশক্তিযুক্ত।',
  },
  {
    id: 'boat',
    nameEn: 'Boat (Symmetric Intermediate)',
    nameBn: 'বোট (প্রতিসম মধ্যবর্তী অবস্থা)',
    energyKJ: 30,
    descriptionEn: 'Severe flagpole hydrogen repulsion between C1 and C4, plus 4 pairs of fully eclipsed C-H bonds (~30 kJ/mol).',
    descriptionBn: 'C1 ও C4-এর ফ্ল্যাগপোল হাইড্রোজেনের মধ্যে তীব্র বিকর্ষণ এবং ৪ জোড়া গ্রহণযুক্ত বন্ধনের টান (~৩০ কিজু/মোল)।',
  },
  {
    id: 'chair2',
    nameEn: 'Chair 2 (Inverted Ring Flip)',
    nameBn: 'চেয়ার ২ (বিপরীত রিং-ফ্লিপ)',
    energyKJ: 0,
    descriptionEn: 'The ring flip is complete. All original axial bonds have become equatorial, and all equatorial have become axial!',
    descriptionBn: 'রিং ফ্লিপ সম্পন্ন হয়েছে। পূর্বের সমস্ত অক্ষীয় বন্ধন নিরক্ষীয় এবং নিরক্ষীয় বন্ধনগুলি অক্ষীয় হয়ে গেছে!',
  },
];

export const CyclohexaneLab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [substituent, setSubstituent] = useState<'H' | 'CH3' | 't-Bu'>('CH3');
  const [show13Diaxial, setShow13Diaxial] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('3d');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeConf = conformationSteps[currentStep];

  // Auto-play stepper animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % conformationSteps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        {/* Substituent Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sub-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Substituent at C1:" bn="C1-এ প্রতিস্থাপক:" />
          </label>
          <select
            id="sub-select"
            value={substituent}
            onChange={(e) => setSubstituent(e.target.value as any)}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            <option value="H">Hydrogen (Unsubstituted C6H12)</option>
            <option value="CH3">Methyl Group (A-value = 7.3 kJ/mol)</option>
            <option value="t-Bu">tert-Butyl Group (A-value = 20.0 kJ/mol - Conformational Lock!)</option>
          </select>
        </div>

        {/* View Mode Switcher: 3D, 2D Chair, Split */}
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
              3D Model
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
              2D Chair &amp; Haworth
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

          {/* 1,3-Diaxial Interaction Toggle */}
          <button
            type="button"
            onClick={() => setShow13Diaxial(!show13Diaxial)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              show13Diaxial
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">1,3-Diaxial Strain</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] flex-1 min-h-[460px] lg:min-h-[520px]">
        {/* Visualizer Area */}
        <div className="relative h-full w-full min-h-[340px] bg-gradient-to-b from-[#05111e] to-[#08182b] flex overflow-hidden">
          {/* 3D Visualizer Canvas (shown in '3d' or 'split') */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className={`relative h-full ${viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-slate-800' : 'w-full'}`}>
              <MolecularCanvas cameraPosition={[0, 1.8, 5.0]}>
                <CyclohexaneFlip3D
                  form={activeConf.id}
                  substituent={substituent}
                  show13Diaxial={show13Diaxial}
                />
              </MolecularCanvas>

              {/* Step Pill */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-2.5 backdrop-blur-md shadow-lg max-w-[240px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Step {currentStep + 1} of 5
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{activeConf.nameEn}</h4>
                  <p className="text-[11px] text-amber-300 font-mono font-semibold">
                    +{activeConf.energyKJ} kJ/mol
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2D Chair Skeleton & Haworth (shown in '2d' or 'split') */}
          {(viewMode === '2d' || viewMode === 'split') && (
            <div className={`h-full ${viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'} overflow-y-auto`}>
              <CyclohexaneChair2D
                substituent={substituent}
                flipProgress={currentStep === 4 ? 1 : 0}
                onFlipToggle={() => setCurrentStep((c) => (c === 0 ? 4 : 0))}
              />
            </div>
          )}
        </div>

        {/* Right Column: Step Sequencer & Conformational Energy Barrier */}
        <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[rgba(70,227,255,0.14)] bg-[#071524]/90 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              <span>Ring Flip Trajectory</span>
            </h3>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
          </div>

          {/* Stepper Buttons */}
          <div className="flex flex-col gap-2 mb-4">
            {conformationSteps.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{step.nameEn}</span>
                  <span className="text-[10px] text-slate-400 font-bengali">{step.nameBn}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  step.energyKJ === 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                }`}>
                  +{step.energyKJ} kJ
                </span>
              </button>
            ))}
          </div>

          {/* A-Value & Conformational Equilibrium Insight */}
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-300 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Conformational Equilibrium (A-Value)</span>
            </h4>
            {substituent === 'CH3' && (
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Methylcyclohexane at room temperature exists as <span className="font-bold text-emerald-400">95% Equatorial</span> and only <span className="font-bold text-rose-400">5% Axial</span> (A-value = 7.3 kJ/mol), due to two repulsive gauche-butane type interactions with C3 and C5 axial hydrogens.
              </p>
            )}
            {substituent === 't-Bu' && (
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The bulky *tert*-butyl group has an A-value of <span className="font-bold text-rose-400">20.0 kJ/mol</span>, locking the molecule into <span className="font-bold text-emerald-400">&gt;99.9% Equatorial</span> chair. Axial *tert*-butyl is energetically prohibitive!
              </p>
            )}
            {substituent === 'H' && (
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Unsubstituted cyclohexane flips continuously between degenerate Chair 1 and Chair 2 at room temperature (~100,000 flips/second), spending almost 99.9% of its lifetime in chair conformations.
              </p>
            )}

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              <strong className="text-cyan-300">Exam Rule:</strong> In ring-flip: <span className="text-rose-400 font-bold">Axial ⇄ Equatorial</span>, but <span className="text-emerald-400 font-bold">UP stays UP</span> and <span className="text-emerald-400 font-bold">DOWN stays DOWN</span>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
