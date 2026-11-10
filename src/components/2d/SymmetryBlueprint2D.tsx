import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface SymmetryBlueprint2DProps {
  caseId?: 'meso-tartaric' | 'chiral-tartaric' | 'trans-cyclobutane' | 'cis-dichloro';
  showPOS?: boolean;
  showCOS?: boolean;
  onSelectCase?: (id: 'meso-tartaric' | 'chiral-tartaric' | 'trans-cyclobutane' | 'cis-dichloro') => void;
}

export const SymmetryBlueprint2D: React.FC<SymmetryBlueprint2DProps> = ({
  caseId,
  showPOS: controlledShowPOS,
  showCOS: controlledShowCOS,
  onSelectCase,
}) => {
  const [internalCase, setInternalCase] = useState<'meso-tartaric' | 'chiral-tartaric' | 'trans-cyclobutane' | 'cis-dichloro'>('meso-tartaric');
  const [internalShowPOS, setInternalShowPOS] = useState(true);
  const [internalShowCOS, setInternalShowCOS] = useState(false);

  const selectedCase = caseId || internalCase;
  const showPOS = controlledShowPOS !== undefined ? controlledShowPOS : internalShowPOS;
  const showCOS = controlledShowCOS !== undefined ? controlledShowCOS : internalShowCOS;

  const handleSelect = (id: 'meso-tartaric' | 'chiral-tartaric' | 'trans-cyclobutane' | 'cis-dichloro') => {
    setInternalCase(id);
    onSelectCase?.(id);
  };

  const cases = [
    {
      id: 'meso-tartaric' as const,
      name: 'meso-Tartaric Acid',
      formula: 'C4H6O6',
      pos: true,
      cos: false,
      isChiral: false,
      reasonEn: 'Internal Plane of Symmetry (σ) divides top and bottom halves into mirror reflections. Optically Inactive (Achiral).',
      reasonBn: 'অন্তঃস্থ প্রতিসাম্য তল (σ) অণুটিকে দুটি দর্পণ প্রতিবিম্ব ভাগে বিভক্ত করে। ফলে আলোক নিষ্ক্রিয় (অ্যাকাইরাল)।',
    },
    {
      id: 'chiral-tartaric' as const,
      name: '(2R,3R)-Tartaric Acid',
      formula: 'C4H6O6',
      pos: false,
      cos: false,
      isChiral: true,
      reasonEn: 'Lacks both POS (σ) and COS (i). Has only C2 simple rotational axis. Optically Active (Chiral / Dextro (+)).',
      reasonBn: 'প্রতিসাম্য তল (σ) এবং কেন্দ্র (i) উভয়ই অনুপস্থিত। কেবলমাত্র C2 অক্ষ বিদ্যমান। ফলে আলোক সক্রিয় (কাইরাল)।',
    },
    {
      id: 'trans-cyclobutane' as const,
      name: 'trans-1,3-Dimethylcyclobutane',
      formula: 'C6H12',
      pos: true,
      cos: true,
      isChiral: false,
      reasonEn: 'Possesses both a Center of Inversion (i) at the ring center and a Plane of Symmetry (σ). Achiral.',
      reasonBn: 'বলয়ের কেন্দ্রে প্রতিসাম্য কেন্দ্র (i) এবং প্রতিসাম্য তল (σ) উভয়ই উপস্থিত। ফলে অ্যাকাইরাল।',
    },
    {
      id: 'cis-dichloro' as const,
      name: 'cis-1,2-Dichloroethene',
      formula: 'C2H2Cl2',
      pos: true,
      cos: false,
      isChiral: false,
      reasonEn: 'Has 2 Planes of Symmetry (in-plane and perpendicular bisector). Achiral.',
      reasonBn: 'দুটি প্রতিসাম্য তল বিদ্যমান (আণবিক তল ও লম্ব সমদ্বিখণ্ডক তল)। ফলে অ্যাকাইরাল।',
    },
  ];

  const current = cases.find((c) => c.id === selectedCase) || cases[0];

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
              2D Symmetry Blueprint
            </span>
            <span className="text-sm font-black text-white">Plane (σ) &amp; Inversion Center (i) Scanner</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class 11/12 Exam Criterion: Molecule with σ or i = ACHIRAL (Inactive). Absence of both = CHIRAL (Active)!
          </p>
        </div>

        {/* Molecule Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-300">Select System:</label>
          <select
            value={selectedCase}
            onChange={(e) => handleSelect(e.target.value as any)}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-cyan-200 outline-none cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.formula})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInternalShowPOS(!showPOS)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              showPOS
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-md'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Plane of Symmetry (σ / POS)</span>
          </button>

          <button
            type="button"
            onClick={() => setInternalShowCOS(!showCOS)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              showCOS
                ? 'border-purple-400 bg-purple-500/20 text-purple-300 shadow-md'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Center of Symmetry (i / COS)</span>
          </button>
        </div>

        {/* Optical Activity Verdict Pill */}
        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
          current.isChiral
            ? 'border-purple-500 bg-purple-950/80 text-purple-300'
            : 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
        }`}>
          {current.isChiral ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          <span>{current.isChiral ? 'OPTICALLY ACTIVE (CHIRAL)' : 'OPTICALLY INACTIVE (ACHIRAL)'}</span>
        </div>
      </div>

      {/* Blueprint Drawing */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 min-h-[300px]">
        <div className="flex flex-col items-center">
          <svg width="340" height="260" viewBox="0 0 340 260" className="overflow-visible">
            {/* Draw 2D formula depending on case */}
            {selectedCase === 'meso-tartaric' && (
              <g>
                {/* Vertical Backbone */}
                <line x1="170" y1="40" x2="170" y2="220" stroke="#64748b" strokeWidth="4" />
                {/* Top COOH */}
                <rect x="140" y="15" width="60" height="26" rx="6" fill="#082f49" stroke="#38bdf8" />
                <text x="170" y="32" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">COOH</text>

                {/* C2 Horizontal Rung */}
                <line x1="80" y1="90" x2="260" y2="90" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="170" cy="90" r="5" fill="#c084fc" />
                <text x="70" y="94" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="end">H</text>
                <text x="270" y="94" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="start">OH</text>

                {/* C3 Horizontal Rung */}
                <line x1="80" y1="170" x2="260" y2="170" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="170" cy="170" r="5" fill="#c084fc" />
                <text x="70" y="174" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="end">H</text>
                <text x="270" y="174" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="start">OH</text>

                {/* Bottom COOH */}
                <rect x="140" y="220" width="60" height="26" rx="6" fill="#082f49" stroke="#38bdf8" />
                <text x="170" y="237" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">COOH</text>

                {/* Plane of Symmetry Line cutting at y = 130 */}
                {showPOS && (
                  <g>
                    <line x1="30" y1="130" x2="310" y2="130" stroke="#10b981" strokeWidth="3" strokeDasharray="6,3" className="animate-pulse" />
                    <rect x="230" y="118" width="95" height="24" rx="4" fill="#064e3b" stroke="#34d399" />
                    <text x="277" y="134" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">Plane of Symmetry (σ)</text>
                  </g>
                )}
              </g>
            )}

            {selectedCase === 'chiral-tartaric' && (
              <g>
                {/* Vertical Backbone */}
                <line x1="170" y1="40" x2="170" y2="220" stroke="#64748b" strokeWidth="4" />
                <rect x="140" y="15" width="60" height="26" rx="6" fill="#082f49" stroke="#38bdf8" />
                <text x="170" y="32" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">COOH</text>

                {/* C2 Rung: H left, OH right */}
                <line x1="80" y1="90" x2="260" y2="90" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="170" cy="90" r="5" fill="#c084fc" />
                <text x="70" y="94" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="end">H</text>
                <text x="270" y="94" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="start">OH</text>

                {/* C3 Rung: OH left, H right (Opposite!) */}
                <line x1="80" y1="170" x2="260" y2="170" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="170" cy="170" r="5" fill="#c084fc" />
                <text x="70" y="174" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="end">OH</text>
                <text x="270" y="174" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="start">H</text>

                <rect x="140" y="220" width="60" height="26" rx="6" fill="#082f49" stroke="#38bdf8" />
                <text x="170" y="237" fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="middle">COOH</text>

                {/* No POS banner */}
                {showPOS && (
                  <g>
                    <line x1="30" y1="130" x2="310" y2="130" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                    <text x="170" y="134" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">✕ NO Horizontal Plane (H ≠ OH)</text>
                  </g>
                )}
              </g>
            )}

            {selectedCase === 'trans-cyclobutane' && (
              <g>
                {/* Cyclobutane Square Ring */}
                <rect x="120" y="80" width="100" height="100" rx="4" fill="#0f2b46" stroke="#38bdf8" strokeWidth="3.5" />
                {/* Center of Inversion Dot at (170, 130) */}
                <circle cx="170" cy="130" r="6" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
                <text x="170" y="145" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">i (0,0)</text>

                {/* C1 Top-Left: CH3 UP */}
                <circle cx="120" cy="80" r="4" fill="#ffffff" />
                <line x1="120" y1="80" x2="80" y2="45" stroke="#38bdf8" strokeWidth="3" />
                <text x="75" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">CH3 (Up)</text>

                {/* C3 Bottom-Right: CH3 DOWN (Inverted!) */}
                <circle cx="220" cy="180" r="4" fill="#ffffff" />
                <line x1="220" y1="180" x2="260" y2="215" stroke="#38bdf8" strokeWidth="3" />
                <text x="265" y="230" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">CH3 (Down)</text>

                {/* Inversion Rays through i */}
                {showCOS && (
                  <g>
                    <line x1="80" y1="45" x2="260" y2="215" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4,3" className="animate-pulse" />
                    <text x="195" y="115" fill="#c084fc" fontSize="10" fontWeight="bold">r = -r</text>
                  </g>
                )}
              </g>
            )}

            {selectedCase === 'cis-dichloro' && (
              <g>
                {/* Central C=C Double Bond */}
                <line x1="130" y1="130" x2="210" y2="130" stroke="#ffffff" strokeWidth="6" />
                <line x1="130" y1="124" x2="210" y2="124" stroke="#082f49" strokeWidth="2" />

                {/* Left C */}
                <line x1="130" y1="130" x2="80" y2="70" stroke="#10b981" strokeWidth="3.5" />
                <text x="70" y="65" fill="#34d399" fontSize="12" fontWeight="bold">Cl (Top)</text>

                <line x1="130" y1="130" x2="80" y2="190" stroke="#94a3b8" strokeWidth="3" />
                <text x="70" y="200" fill="#ffffff" fontSize="12" fontWeight="bold">H (Bottom)</text>

                {/* Right C */}
                <line x1="210" y1="130" x2="260" y2="70" stroke="#10b981" strokeWidth="3.5" />
                <text x="270" y="65" fill="#34d399" fontSize="12" fontWeight="bold">Cl (Top)</text>

                <line x1="210" y1="130" x2="260" y2="190" stroke="#94a3b8" strokeWidth="3" />
                <text x="270" y="200" fill="#ffffff" fontSize="12" fontWeight="bold">H (Bottom)</text>

                {/* Vertical POS Bisector at x = 170 */}
                {showPOS && (
                  <g>
                    <line x1="170" y1="30" x2="170" y2="230" stroke="#10b981" strokeWidth="3" strokeDasharray="5,3" className="animate-pulse" />
                    <text x="175" y="40" fill="#6ee7b7" fontSize="10" fontWeight="bold">σ (Vertical Bisector)</text>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Right Explanation Card */}
        <div className="w-full md:w-72 p-4 rounded-xl border border-slate-800 bg-slate-900/90 text-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-b border-slate-800 pb-2">
            <Eye className="h-4 w-4" />
            <span>Symmetry Analysis</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Plane of Symmetry (σ):</span>
            <span className={`font-bold font-mono ${current.pos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {current.pos ? 'PRESENT (✓)' : 'ABSENT (✕)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Center of Inversion (i):</span>
            <span className={`font-bold font-mono ${current.cos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {current.cos ? 'PRESENT (✓)' : 'ABSENT (✕)'}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
            {current.reasonEn}
          </p>

          <p className="text-[11px] font-bengali text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
            {current.reasonBn}
          </p>
        </div>
      </div>
    </div>
  );
};
