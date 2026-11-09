import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { ArrowLeftRight, RotateCw, CheckCircle2, ShieldAlert, Sparkles, Layers, Info } from 'lucide-react';

export interface FischerChiralCenter {
  carbonNum: number;
  configA: 'R' | 'S' | 'r' | 's';
  configB: 'R' | 'S' | 'r' | 's';
  leftA: string;
  rightA: string;
  leftB: string;
  rightB: string;
}

export interface FischerMoleculeData {
  name: { en: string; bn: string };
  formula: string;
  topGroup: string;
  bottomGroup: string;
  centers: FischerChiralCenter[];
  relationship: 'enantiomers' | 'identical' | 'diastereomers' | 'meso';
  isMeso?: boolean;
}

export const FISCHER_PAIRS_DATA: Record<number, FischerMoleculeData> = {
  0: {
    name: { en: "Lactic Acid (2-Hydroxypropanoic acid)", bn: "ল্যাকটিক অ্যাসিড" },
    formula: "C3H6O3",
    topGroup: "COOH",
    bottomGroup: "CH3",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
    ],
  },
  1: {
    name: { en: "(2R,3R)- vs (2S,3S)-Tartaric Acid (Chiral Enantiomers)", bn: "(২R,৩R)- বনাম (২S,৩S)-টারটারিক অ্যাসিড (এন্যানশিওমার)" },
    formula: "C4H6O6",
    topGroup: "COOH",
    bottomGroup: "COOH",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
      {
        carbonNum: 3,
        configA: 'R',
        configB: 'S',
        leftA: 'OH',
        rightA: 'H',
        leftB: 'H',
        rightB: 'OH',
      },
    ],
  },
  2: {
    name: { en: "meso-Tartaric Acid vs Mirror Image (Superimposable)", bn: "মেসো-টারটারিক অ্যাসিড বনাম দর্পণ প্রতিবিম্ব (উপরিবাতযোগ্য)" },
    formula: "C4H6O6",
    topGroup: "COOH",
    bottomGroup: "COOH",
    relationship: "identical",
    isMeso: true,
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
      {
        carbonNum: 3,
        configA: 'S',
        configB: 'R',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
    ],
  },
  3: {
    name: { en: "D-Erythrose vs D-Threose (Diastereomers)", bn: "ডি-এরিথ্রোজ বনাম ডি-থ্রিওজ (ডায়াস্টেরিওমার)" },
    formula: "C4H8O4",
    topGroup: "CHO",
    bottomGroup: "CH2OH",
    relationship: "diastereomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
      {
        carbonNum: 3,
        configA: 'R',
        configB: 'R',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'H',
        rightB: 'OH',
      },
    ],
  },
  4: {
    name: { en: "(R)- vs (S)-2-Chlorobutane (Enantiomers)", bn: "(R)- বনাম (S)-২-ক্লোরোবিউটেন (এন্যানশিওমার)" },
    formula: "C4H9Cl",
    topGroup: "CH3",
    bottomGroup: "C2H5",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'Cl',
        leftB: 'Cl',
        rightB: 'H',
      },
    ],
  },
};

interface FischerProjection2DProps {
  pairIndex: number;
}

export const FischerProjection2D: React.FC<FischerProjection2DProps> = ({ pairIndex }) => {
  const [showWedgeDash, setShowWedgeDash] = useState(false);
  const [rotated180B, setRotated180B] = useState(false);
  const [superimposeX, setSuperimposeX] = useState(0); // 0 (separated) to 1 (full overlay)

  const data = FISCHER_PAIRS_DATA[pairIndex] || FISCHER_PAIRS_DATA[1];
  const numCenters = data.centers.length;
  const isMeso = Boolean(data.isMeso);

  // Group color helper
  const getGroupBadgeColor = (grp: string) => {
    switch (grp) {
      case 'OH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Cl':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Br':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'H':
        return 'bg-slate-700/50 text-slate-200 border-slate-600/50';
      case 'COOH':
      case 'CHO':
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 font-bold';
      case 'CH3':
      case 'CH2OH':
      case 'C2H5':
        return 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  const renderSingleFischer = (
    isomerKey: 'A' | 'B',
    isRotated: boolean,
    labelTitle: string,
    badgeColor: string
  ) => {
    // Height calculation:
    // top group -> rung 1 -> rung 2 -> bottom group
    const rungGap = 85;
    const totalHeight = 100 + numCenters * rungGap;

    return (
      <div
        className="flex flex-col items-center p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-xl backdrop-blur-md relative transition-transform duration-500"
        style={{
          transform: isRotated ? 'rotate(180deg)' : 'none',
        }}
      >
        <span
          className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border mb-4 ${badgeColor}`}
          style={{ transform: isRotated ? 'rotate(180deg)' : 'none' }}
        >
          {labelTitle} {isRotated ? '(180° In-Plane Rotated)' : ''}
        </span>

        <svg width="260" height={totalHeight} className="overflow-visible">
          {/* Central Vertical Backbone Line */}
          {showWedgeDash ? (
            // Dashed backbone representing bonds going into the page (away from viewer)
            <line
              x1="130"
              y1="35"
              x2="130"
              y2={totalHeight - 35}
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6,4"
            />
          ) : (
            <line
              x1="130"
              y1="35"
              x2="130"
              y2={totalHeight - 35}
              stroke="#64748b"
              strokeWidth="3.5"
            />
          )}

          {/* Meso Plane of Symmetry (σ) line if applicable */}
          {isMeso && numCenters === 2 && (
            <g>
              <line
                x1="20"
                y1={35 + rungGap}
                x2="240"
                y2={35 + rungGap}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5,3"
                className="animate-pulse"
              />
              <text
                x="245"
                y={35 + rungGap + 4}
                fill="#34d399"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                σ (POS)
              </text>
            </g>
          )}

          {/* Top Group */}
          <foreignObject x="80" y="2" width="100" height="34">
            <div className="flex justify-center items-center h-full">
              <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold ${getGroupBadgeColor(data.topGroup)}`}>
                {data.topGroup}
              </span>
            </div>
          </foreignObject>

          {/* Horizontal Rungs (Chiral Centers) */}
          {data.centers.map((c, idx) => {
            const y = 35 + (idx + 0.5) * rungGap;
            const leftGrp = isomerKey === 'A' ? c.leftA : c.leftB;
            const rightGrp = isomerKey === 'A' ? c.rightA : c.rightB;
            const config = isomerKey === 'A' ? c.configA : c.configB;

            return (
              <g key={c.carbonNum}>
                {/* Horizontal Rung */}
                {showWedgeDash ? (
                  // Solid Wedges coming out of page (toward viewer)
                  <g>
                    {/* Left Wedge */}
                    <polygon
                      points={`130,${y} 55,${y - 6} 55,${y + 6}`}
                      fill="#38bdf8"
                      opacity="0.9"
                    />
                    {/* Right Wedge */}
                    <polygon
                      points={`130,${y} 205,${y - 6} 205,${y + 6}`}
                      fill="#38bdf8"
                      opacity="0.9"
                    />
                  </g>
                ) : (
                  <line
                    x1="55"
                    y1={y}
                    x2="205"
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                  />
                )}

                {/* Central Chiral Carbon Point & Config Badge */}
                <circle cx="130" cy={y} r="5" fill="#c084fc" />
                <foreignObject x="110" y={y - 24} width="40" height="20">
                  <div className="flex justify-center">
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950/90 text-purple-300 border border-purple-500/40">
                      C{c.carbonNum}({config})
                    </span>
                  </div>
                </foreignObject>

                {/* Left Group */}
                <foreignObject x="0" y={y - 14} width="55" height="28">
                  <div className="flex justify-end items-center h-full pr-1">
                    <span className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold ${getGroupBadgeColor(leftGrp)}`}>
                      {leftGrp}
                    </span>
                  </div>
                </foreignObject>

                {/* Right Group */}
                <foreignObject x="205" y={y - 14} width="55" height="28">
                  <div className="flex justify-start items-center h-full pl-1">
                    <span className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold ${getGroupBadgeColor(rightGrp)}`}>
                      {rightGrp}
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Bottom Group */}
          <foreignObject x="80" y={totalHeight - 34} width="100" height="34">
            <div className="flex justify-center items-center h-full">
              <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold ${getGroupBadgeColor(data.bottomGroup)}`}>
                {data.bottomGroup}
              </span>
            </div>
          </foreignObject>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-6 bg-gradient-to-b from-[#05111e] to-[#071728] rounded-2xl overflow-hidden space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {data.formula}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">{data.name.en}</h3>
          </div>
          <p className="text-xs text-slate-400 font-bengali mt-0.5">{data.name.bn}</p>
        </div>

        {/* View Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Wedge-Dash Toggle */}
          <button
            type="button"
            onClick={() => setShowWedgeDash(!showWedgeDash)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showWedgeDash
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{showWedgeDash ? '3D Wedge-Dash Overlay ON' : 'Show Wedge-Dash Mode'}</span>
          </button>

          {/* 180° In-Plane Rotate */}
          <button
            type="button"
            onClick={() => setRotated180B(!rotated180B)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              rotated180B
                ? 'border-purple-400 bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 transition-transform ${rotated180B ? 'rotate-180' : ''}`} />
            <span>{rotated180B ? 'Reset Rotation' : 'Rotate Mirror 180° in Plane'}</span>
          </button>
        </div>
      </div>

      {/* 2D Fischer Projection Stage */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-12 py-6 bg-slate-950/50 rounded-2xl border border-cyan-500/10 min-h-[380px]">
        {/* Molecule A */}
        <div
          className="transition-transform duration-300"
          style={{
            transform: `translateX(${superimposeX * 120}px)`,
            opacity: superimposeX > 0.8 ? 0.7 : 1,
          }}
        >
          {renderSingleFischer(
            'A',
            false,
            'Isomer A',
            'border-cyan-500/40 bg-cyan-950/60 text-cyan-300'
          )}
        </div>

        {/* Central Vertical Mirror Plane */}
        {superimposeX < 0.3 && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-48 w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_10px_#a855f7]" />
            <div className="px-2 py-1 rounded-md border border-purple-500/40 bg-purple-950/80 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
              Mirror Plane
            </div>
            <div className="h-48 w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_10px_#a855f7]" />
          </div>
        )}

        {/* Molecule B */}
        <div
          className="transition-transform duration-300"
          style={{
            transform: `translateX(${-superimposeX * 120}px)`,
            opacity: superimposeX > 0.8 ? 0.7 : 1,
          }}
        >
          {renderSingleFischer(
            'B',
            rotated180B,
            data.relationship === 'enantiomers'
              ? 'Mirror Image (Isomer B)'
              : 'Isomer B',
            'border-purple-500/40 bg-purple-950/60 text-purple-300'
          )}
        </div>

        {/* Superimposition Verdict Notification */}
        {superimposeX > 0.85 && (
          <div className="absolute top-4 inset-x-4 max-w-md mx-auto p-3 rounded-xl border bg-slate-900/95 backdrop-blur-xl shadow-2xl text-center z-20">
            {isMeso || data.relationship === 'identical' ? (
              rotated180B ? (
                <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>100% Superimposable! In-plane 180° rotation aligns all groups perfectly (Identical Meso).</span>
                </div>
              ) : (
                <div className="text-amber-300 font-bold text-xs">
                  Slide B onto A, then click &quot;Rotate Mirror 180° in Plane&quot; to verify identical alignment!
                </div>
              )
            ) : (
              <div className="text-rose-400 font-bold text-xs flex items-center justify-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Non-Superimposable! Groups clash even after 180° rotation (Genuine Enantiomers).</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2D Superposition Slider */}
      <div className="max-w-md mx-auto w-full p-3 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1.5">
          <span>Side-by-Side</span>
          <span className="text-cyan-400 font-mono">Test 2D Superposition: {Math.round(superimposeX * 100)}%</span>
          <span>Superimposed</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={superimposeX}
          onChange={(e) => setSuperimposeX(Number(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      {/* Educational Fischer Rules Pill Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-cyan-500/20 bg-slate-900/60">
          <span className="font-bold text-cyan-300 block mb-1">
            <BilingualText en="1. Horizontal Bonds" bn="১. অনুভূমিক বন্ধন" />
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <BilingualText
              en="Represent bonds projecting FORWARD out of the plane (Wedges pointing toward you)."
              bn="কাগজের তল থেকে সামনের দিকে বেরিয়ে আসা বন্ধন নির্দেশ করে (ওয়েজ বন্ড)।"
            />
          </p>
        </div>

        <div className="p-3 rounded-xl border border-purple-500/20 bg-slate-900/60">
          <span className="font-bold text-purple-300 block mb-1">
            <BilingualText en="2. Vertical Bonds" bn="২. উল্লম্ব বন্ধন" />
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <BilingualText
              en="Represent carbon backbone projecting BACKWARD behind the plane (Dashes pointing away)."
              bn="কাগজের তলের পেছনের দিকে চলে যাওয়া মূল কার্বন শৃঙ্খল নির্দেশ করে (ড্যাশ বন্ড)।"
            />
          </p>
        </div>

        <div className="p-3 rounded-xl border border-emerald-500/20 bg-slate-900/60">
          <span className="font-bold text-emerald-300 block mb-1">
            <BilingualText en="3. 180° In-Plane Rule" bn="৩. ১৮০° ঘূর্ণন নীতি" />
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <BilingualText
              en="Rotating a Fischer projection 180° in the plane preserves configuration; 90° rotation is strictly forbidden."
              bn="ফিশার প্রজেকশনকে ১৮০° তলে ঘোরালে কনফিগারেশন অপরিবর্তিত থাকে; কিন্তু ৯০° ঘোরানো সম্পূর্ণ নিষিদ্ধ।"
            />
          </p>
        </div>
      </div>
    </div>
  );
};
