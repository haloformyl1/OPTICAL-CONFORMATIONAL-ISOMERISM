import React, { useState, useMemo } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { SuperpositionViewer3D } from '../3d/SuperpositionViewer3D';
import { FischerProjection2D } from '../2d/FischerProjection2D';
import { BilingualText } from '../BilingualText';
import { OPTICAL_EXAMPLES } from '../../content/examples/opticalExamples';
import type { StereoisomerPair } from '../../types/isomerism';
import { getGroupColor } from '../../utils/chemistry';
import { ArrowLeftRight, CheckCircle2, XCircle, RotateCw, Layers, ShieldAlert, Tag, Hash, Box, FileText, Columns, Info } from 'lucide-react';

// Custom 3D structures for meso-2,3-Dichlorobutane (has horizontal plane of symmetry)
const mesoDichlorobutanePair: StereoisomerPair = {
  id: "opt-meso-23-dichlorobutane",
  category: "optical",
  iupacName: { en: "meso-2,3-Dichlorobutane", bn: "মেসো-২,৩-ডাইক্লোরোবিউটেন" },
  commonName: { en: "meso-2,3-Dichlorobutane", bn: "মেসো-২,৩-ডাইক্লোরোবিউটেন" },
  formula: "C4H8Cl2",
  systemType: "haloalkane",
  relationship: "identical",
  isomerA: {
    label: "meso-2,3-Dichlorobutane (2R, 3S)",
    descriptor: "(2R,3S)-meso-2,3-dichlorobutane",
    structure: {
      name: { en: "meso-2,3-Dichlorobutane", bn: "মেসো-২,৩-ডাইক্লোরোবিউটেন" },
      formula: "C4H8Cl2",
      atoms: [
        { id: "c2", element: "C", position: [0, 0.75, 0], label: "C2*", isStereocenter: true, configuration: "R" },
        { id: "c3", element: "C", position: [0, -0.75, 0], label: "C3*", isStereocenter: true, configuration: "S" },
        { id: "cl2", element: "Cl", position: [1.5, 0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "cl3", element: "Cl", position: [1.5, -0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "me2", element: "C", position: [-1.1, 1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "me3", element: "C", position: [-1.1, -1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h2", element: "H", position: [0.1, 0.7, -1.2], label: "H", cipPriority: 4 },
        { id: "h3", element: "H", position: [0.1, -0.7, -1.2], label: "H", cipPriority: 4 },
      ],
      bonds: [
        { from: "c2", to: "c3", order: 1 },
        { from: "c2", to: "cl2", order: 1 },
        { from: "c2", to: "me2", order: 1 },
        { from: "c2", to: "h2", order: 1 },
        { from: "c3", to: "cl3", order: 1 },
        { from: "c3", to: "me3", order: 1 },
        { from: "c3", to: "h3", order: 1 },
      ],
      optical: {
        stereocentersCount: 2,
        configurationRS: "(2R,3S)",
        opticalActivity: "inactive (meso)",
        isMeso: true,
      },
      symmetry: {
        hasPOS: true,
        hasCOS: false,
        isChiral: false,
        chiralReason: { en: "Internal horizontal plane of symmetry (sigma) bisects C2-C3 bond.", bn: "অভ্যন্তরীণ অনুভূমিক প্রতিসাম্য তল (sigma) C2-C3 বন্ধনকে দ্বিখণ্ডিত করে।" },
      },
    },
  },
  isomerB: {
    label: "Mirror Image of meso-2,3-Dichlorobutane",
    descriptor: "Superimposable Mirror Image",
    structure: {
      name: { en: "Mirror Image of meso-2,3-Dichlorobutane", bn: "মেসোর দর্পণ প্রতিবিম্ব" },
      formula: "C4H8Cl2",
      atoms: [
        { id: "c2", element: "C", position: [0, 0.75, 0], label: "C2*", isStereocenter: true, configuration: "S" },
        { id: "c3", element: "C", position: [0, -0.75, 0], label: "C3*", isStereocenter: true, configuration: "R" },
        { id: "cl2", element: "Cl", position: [-1.5, 0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "cl3", element: "Cl", position: [-1.5, -0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "me2", element: "C", position: [1.1, 1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "me3", element: "C", position: [1.1, -1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h2", element: "H", position: [-0.1, 0.7, -1.2], label: "H", cipPriority: 4 },
        { id: "h3", element: "H", position: [-0.1, -0.7, -1.2], label: "H", cipPriority: 4 },
      ],
      bonds: [
        { from: "c2", to: "c3", order: 1 },
        { from: "c2", to: "cl2", order: 1 },
        { from: "c2", to: "me2", order: 1 },
        { from: "c2", to: "h2", order: 1 },
        { from: "c3", to: "cl3", order: 1 },
        { from: "c3", to: "me3", order: 1 },
        { from: "c3", to: "h3", order: 1 },
      ],
      optical: {
        stereocentersCount: 2,
        configurationRS: "(2S,3R)",
        opticalActivity: "inactive (meso)",
        isMeso: true,
      },
      symmetry: {
        hasPOS: true,
        hasCOS: false,
        isChiral: false,
        chiralReason: { en: "180° in-plane rotation superimposes 100% with original.", bn: "১৮০° তলে ঘূর্ণনে মূল অণুর সাথে সম্পূর্ণ মিলে যায়।" },
      },
    },
  },
  pedagogicalNote: {
    en: "meso-2,3-Dichlorobutane has an internal plane of symmetry (sigma) in eclipsed Fischer orientation, cancelling optical activity.",
    bn: "মেসো-২,৩-ডাইক্লোরোবিউটেনে অভ্যন্তরীণ প্রতিসাম্য তল (sigma) থাকায় এটি অপটিক্যাল নিষ্ক্রিয়।",
  },
};

// Custom 3D structures for (2R,3S)- vs (2R,3R)-3-Chloro-2-butanol (Diastereomers)
const chloroButanolDiastereomersPair: StereoisomerPair = {
  id: "opt-3-chloro-2-butanol-diast",
  category: "optical",
  iupacName: { en: "3-Chlorobutan-2-ol", bn: "৩-ক্লোরোবিউটান-২-অল" },
  commonName: { en: "(2R,3S)- vs (2R,3R)-3-Chlorobutan-2-ol", bn: "৩-ক্লোরোবিউটান-২-অল (ডায়াস্টেরিওমার)" },
  formula: "C4H9ClO",
  systemType: "haloalkane",
  relationship: "diastereomers",
  isomerA: {
    label: "(2R,3S)-3-Chlorobutan-2-ol",
    descriptor: "(2R,3S)-3-chlorobutan-2-ol",
    structure: {
      name: { en: "(2R,3S)-3-Chlorobutan-2-ol", bn: "(২R,৩S)-৩-ক্লোরোবিউটান-২-অল" },
      formula: "C4H9ClO",
      atoms: [
        { id: "c2", element: "C", position: [0, 0.75, 0], label: "C2*", isStereocenter: true, configuration: "R" },
        { id: "c3", element: "C", position: [0, -0.75, 0], label: "C3*", isStereocenter: true, configuration: "S" },
        { id: "oh", element: "O", position: [1.3, 0.9, 0.4], label: "OH", cipPriority: 1 },
        { id: "me2", element: "C", position: [-1.1, 1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h2", element: "H", position: [0.1, 0.7, -1.2], label: "H", cipPriority: 4 },
        { id: "cl", element: "Cl", position: [1.5, -0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "me3", element: "C", position: [-1.1, -1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h3", element: "H", position: [0.1, -0.7, -1.2], label: "H", cipPriority: 4 },
      ],
      bonds: [
        { from: "c2", to: "c3", order: 1 },
        { from: "c2", to: "oh", order: 1 },
        { from: "c2", to: "me2", order: 1 },
        { from: "c2", to: "h2", order: 1 },
        { from: "c3", to: "cl", order: 1 },
        { from: "c3", to: "me3", order: 1 },
        { from: "c3", to: "h3", order: 1 },
      ],
      optical: {
        stereocentersCount: 2,
        configurationRS: "(2R,3S)",
        opticalActivity: "dextro (+)",
        isMeso: false,
      },
      symmetry: {
        hasPOS: false,
        hasCOS: false,
        isChiral: true,
        chiralReason: { en: "C2 has OH, C3 has Cl. Diastereomer pair.", bn: "C2 তে OH, C3 তে Cl যুক্ত ডায়াস্টেরিওমার।" },
      },
    },
  },
  isomerB: {
    label: "(2R,3R)-3-Chlorobutan-2-ol",
    descriptor: "(2R,3R)-3-chlorobutan-2-ol",
    structure: {
      name: { en: "(2R,3R)-3-Chlorobutan-2-ol", bn: "(২R,৩R)-৩-ক্লোরোবিউটান-২-অল" },
      formula: "C4H9ClO",
      atoms: [
        { id: "c2", element: "C", position: [0, 0.75, 0], label: "C2*", isStereocenter: true, configuration: "R" },
        { id: "c3", element: "C", position: [0, -0.75, 0], label: "C3*", isStereocenter: true, configuration: "R" },
        { id: "oh", element: "O", position: [1.3, 0.9, 0.4], label: "OH", cipPriority: 1 },
        { id: "me2", element: "C", position: [-1.1, 1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h2", element: "H", position: [0.1, 0.7, -1.2], label: "H", cipPriority: 4 },
        { id: "cl", element: "Cl", position: [-1.5, -0.9, 0.4], label: "Cl", cipPriority: 1 },
        { id: "me3", element: "C", position: [1.1, -1.4, -0.4], label: "CH3", cipPriority: 3 },
        { id: "h3", element: "H", position: [-0.1, -0.7, -1.2], label: "H", cipPriority: 4 },
      ],
      bonds: [
        { from: "c2", to: "c3", order: 1 },
        { from: "c2", to: "oh", order: 1 },
        { from: "c2", to: "me2", order: 1 },
        { from: "c2", to: "h2", order: 1 },
        { from: "c3", to: "cl", order: 1 },
        { from: "c3", to: "me3", order: 1 },
        { from: "c3", to: "h3", order: 1 },
      ],
      optical: {
        stereocentersCount: 2,
        configurationRS: "(2R,3R)",
        opticalActivity: "levo (-)",
        isMeso: false,
      },
      symmetry: {
        hasPOS: false,
        hasCOS: false,
        isChiral: true,
        chiralReason: { en: "C2(R) matches isomer A, but C3(R) is inverted relative to isomer A(3S). Diastereomers!", bn: "C2(R) অপরিবর্তিত কিন্তু C3(R) বিপরীত হওয়ায় এরা ডায়াস্টেরিওমার!" },
      },
    },
  },
  pedagogicalNote: {
    en: "At C2, both isomers share the (2R) configuration, but at C3, configurations are inverted (3S vs 3R). They are Diastereomers.",
    bn: "উভয় সমাণুর C2-এ (2R) কনফিগারেশন এক, কিন্তু C3-এ কনফিগারেশন বিপরীত (3S বনাম 3R)। এরা ডায়াস্টেরিওমার।",
  },
};

export const EnantiomerCompareLab: React.FC = () => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(1); // Default to Tartaric Acid
  const [superimposeProgress, setSuperimposeProgress] = useState<number>(0); // 0 = separate, 1 = overlaid
  const [isAutoSuperimposing, setIsAutoSuperimposing] = useState<boolean>(false);
  const [isRotated180, setIsRotated180] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d-fischer' | 'split'>('3d');
  // By default, do not clutter 3D spheres with floating text labels; use the Top Group Legend!
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [showPriorityBadges, setShowPriorityBadges] = useState<boolean>(false);

  // Smooth continuous auto-superposition animation when triggered
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

  // 15 Curated Stereoisomer Examples covering Enantiomers, Diastereomers, and Meso/Identical pairs
  const testPairs = [
    { label: "1. (R)- vs (S)-Lactic Acid [Enantiomers]", pair: OPTICAL_EXAMPLES[0], rel: "enantiomers" as const },
    { label: "2. (2R,3R)- vs (2S,3S)-Tartaric Acid [Enantiomers]", pair: OPTICAL_EXAMPLES[1], rel: "enantiomers" as const },
    { label: "3. meso-Tartaric Acid vs its Mirror Image [Superimposable / Identical]", pair: OPTICAL_EXAMPLES[2], rel: "identical" as const },
    { label: "4. D-Erythrose vs D-Threose [Diastereomers]", pair: OPTICAL_EXAMPLES[7], rel: "diastereomers" as const },
    { label: "5. (R)- vs (S)-2-Chlorobutane [Enantiomers]", pair: OPTICAL_EXAMPLES[4], rel: "enantiomers" as const },
    { label: "6. (R)- vs (S)-2-Bromobutane [Enantiomers]", pair: OPTICAL_EXAMPLES[10], rel: "enantiomers" as const },
    { label: "7. (S)- vs (R)-Alanine (2-Aminopropanoic acid) [Enantiomers]", pair: OPTICAL_EXAMPLES[6], rel: "enantiomers" as const },
    { label: "8. D- vs L-Glyceraldehyde [Enantiomers]", pair: OPTICAL_EXAMPLES[3], rel: "enantiomers" as const },
    { label: "9. (2R,3R)- vs (2S,3S)-2,3-Dichlorobutane [Enantiomers]", pair: OPTICAL_EXAMPLES[8], rel: "enantiomers" as const },
    { label: "10. meso-2,3-Dichlorobutane vs its Mirror Image [Superimposable / Identical]", pair: mesoDichlorobutanePair, rel: "identical" as const },
    { label: "11. (2R,3S)- vs (2R,3R)-3-Chloro-2-butanol [Diastereomers]", pair: chloroButanolDiastereomersPair, rel: "diastereomers" as const },
    { label: "12. (R)- vs (S)-1-Phenylethanol [Enantiomers]", pair: OPTICAL_EXAMPLES[15], rel: "enantiomers" as const },
    { label: "13. (R)- vs (S)-sec-Butanol (Butan-2-ol) [Enantiomers]", pair: OPTICAL_EXAMPLES[11], rel: "enantiomers" as const },
    { label: "14. (R)- vs (S)-Bromochlorofluoromethane [Enantiomers]", pair: OPTICAL_EXAMPLES[5], rel: "enantiomers" as const },
    { label: "15. (2S,3R)- vs (2R,3S)-2-Bromo-3-chlorobutane [Enantiomers]", pair: OPTICAL_EXAMPLES[48], rel: "enantiomers" as const },
  ];

  const currentItem = testPairs[selectedPairIndex] || testPairs[1];

  // Extract unique ligand groups linked with chiral carbons for the Top Group Color Legend
  const uniqueGroups = useMemo(() => {
    const structure = currentItem.pair.isomerA.structure;
    const seen = new Set<string>();
    const groups: Array<{ label: string; color: string; cipPriority?: number }> = [];

    structure.atoms.forEach((atom) => {
      // Exclude stereocenter carbon from ligand legend
      if (atom.isStereocenter && (atom.label === 'C*' || (atom.label?.startsWith('C') && atom.element === 'C'))) {
        return;
      }
      const label = atom.label || atom.element;
      if (!seen.has(label)) {
        seen.add(label);
        groups.push({
          label,
          color: atom.color || getGroupColor(label, atom.element),
          cipPriority: atom.cipPriority,
        });
      }
    });

    // Sort by CIP priority if available
    groups.sort((a, b) => (a.cipPriority || 99) - (b.cipPriority || 99));
    return groups;
  }, [currentItem]);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="pair-select" className="text-xs font-bold text-slate-300">
            <BilingualText en="Stereoisomer Pair (15 Examples):" bn="স্টেরিওসমাণু জোড় (১৫টি উদাহরণ):" />
          </label>
          <select
            id="pair-select"
            value={selectedPairIndex}
            onChange={(e) => {
              setSelectedPairIndex(Number(e.target.value));
              setSuperimposeProgress(0);
              setIsRotated180(false);
            }}
            className="w-full min-w-0 max-w-full rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer sm:w-auto sm:max-w-md truncate"
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
                title="Toggle In-Model Text Labels"
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
            </div>
          )}

          {/* 180° In-Plane Rotation Toggle Button */}
          <button
            type="button"
            onClick={() => setIsRotated180(!isRotated180)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isRotated180
                ? 'border-purple-400 bg-purple-500/25 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
            title="Rotate Molecule B by 180° in plane to test symmetry & superimposability"
          >
            <RotateCw className={`h-3.5 w-3.5 transition-transform duration-500 ${isRotated180 ? 'rotate-180 text-purple-400' : 'text-slate-400'}`} />
            <span>{isRotated180 ? 'B: 180° Rotated' : 'Rotate B 180°'}</span>
          </button>

          {/* 3D Superposition Quick Buttons */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
              <button
                type="button"
                onClick={() =>
                  setSuperimposeProgress(superimposeProgress > 0.5 ? 0 : 1)
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>
                  {superimposeProgress > 0.5
                    ? 'Separate View'
                    : 'Superimpose (100%)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsAutoSuperimposing(!isAutoSuperimposing)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isAutoSuperimposing
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>
                  {isAutoSuperimposing
                    ? '⏸ Stop Auto-Play'
                    : '▶ Auto-Superpose'}
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
          {/* Top Group Color Legend Bar: (colourfull ball = the group it assigned) */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className="absolute top-3 inset-x-4 z-20 flex justify-center pointer-events-none">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-1 px-3.5 rounded-full border border-slate-700/80 bg-slate-900/95 backdrop-blur-md shadow-2xl pointer-events-auto">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Group Legend:
                </span>
                {uniqueGroups.map((grp) => (
                  <div
                    key={grp.label}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700/70 text-xs font-semibold text-slate-200 shadow-sm"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-md border border-white/20"
                      style={{
                        backgroundColor: grp.color,
                        boxShadow: `0 0 8px ${grp.color}99`,
                      }}
                    />
                    <span className="text-white font-mono">{grp.label}</span>
                    {grp.cipPriority && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-700 text-cyan-300 font-mono">
                        #{grp.cipPriority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === '2d-fischer' && (
            <div className="p-4 sm:p-6 h-full flex flex-col justify-center">
              <FischerProjection2D
                pairIndex={selectedPairIndex}
                externalProgress={superimposeProgress}
                onProgressChange={setSuperimposeProgress}
                externalIsRotated={isRotated180}
                onRotateChange={setIsRotated180}
              />
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
                  isRotated180={isRotated180}
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
                <FischerProjection2D
                  pairIndex={selectedPairIndex}
                  externalProgress={superimposeProgress}
                  onProgressChange={setSuperimposeProgress}
                  externalIsRotated={isRotated180}
                  onRotateChange={setIsRotated180}
                />
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
                    isRotated180={isRotated180}
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
