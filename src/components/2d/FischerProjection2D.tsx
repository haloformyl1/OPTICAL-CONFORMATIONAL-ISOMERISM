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
  5: {
    name: { en: "(R)- vs (S)-2-Bromobutane (Enantiomers)", bn: "(R)- বনাম (S)-২-ব্রোমোবিউটেন (এন্যানশিওমার)" },
    formula: "C4H9Br",
    topGroup: "CH3",
    bottomGroup: "C2H5",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'Br',
        leftB: 'Br',
        rightB: 'H',
      },
    ],
  },
  6: {
    name: { en: "(S)- vs (R)-Alanine (2-Aminopropanoic acid)", bn: "(S)- বনাম (R)-অ্যালানিন" },
    formula: "C3H7NO2",
    topGroup: "COOH",
    bottomGroup: "CH3",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'S',
        configB: 'R',
        leftA: 'H',
        rightA: 'NH2',
        leftB: 'NH2',
        rightB: 'H',
      },
    ],
  },
  7: {
    name: { en: "D- vs L-Glyceraldehyde (Reference Sugar)", bn: "D- বনাম L-গ্লিসারালডিহাইড" },
    formula: "C3H6O3",
    topGroup: "CHO",
    bottomGroup: "CH2OH",
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
  8: {
    name: { en: "(2R,3R)- vs (2S,3S)-2,3-Dichlorobutane (Chiral Pair)", bn: "(২R,৩R)- বনাম (২S,৩S)-২,৩-ডাইক্লোরোবিউটেন" },
    formula: "C4H8Cl2",
    topGroup: "CH3",
    bottomGroup: "CH3",
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
      {
        carbonNum: 3,
        configA: 'R',
        configB: 'S',
        leftA: 'Cl',
        rightA: 'H',
        leftB: 'H',
        rightB: 'Cl',
      },
    ],
  },
  9: {
    name: { en: "meso-2,3-Dichlorobutane vs Mirror Image (Superimposable)", bn: "মেসো-২,৩-ডাইক্লোরোবিউটেন (উপরিবাতযোগ্য)" },
    formula: "C4H8Cl2",
    topGroup: "CH3",
    bottomGroup: "CH3",
    relationship: "identical",
    isMeso: true,
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
      {
        carbonNum: 3,
        configA: 'S',
        configB: 'R',
        leftA: 'H',
        rightA: 'Cl',
        leftB: 'Cl',
        rightB: 'H',
      },
    ],
  },
  10: {
    name: { en: "(2R,3S)- vs (2R,3R)-3-Chloro-2-butanol (Diastereomers)", bn: "৩-ক্লোরো-২-বিউটানল (ডায়াস্টেরিওমার)" },
    formula: "C4H9ClO",
    topGroup: "CH3",
    bottomGroup: "CH3",
    relationship: "diastereomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'R',
        configB: 'R',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'H',
        rightB: 'OH',
      },
      {
        carbonNum: 3,
        configA: 'S',
        configB: 'R',
        leftA: 'H',
        rightA: 'Cl',
        leftB: 'Cl',
        rightB: 'H',
      },
    ],
  },
  11: {
    name: { en: "(R)- vs (S)-1-Phenylethanol (Aromatic Alcohol)", bn: "(R)- বনাম (S)-১-ফিনাইলইথানল" },
    formula: "C8H10O",
    topGroup: "Phenyl",
    bottomGroup: "CH3",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 1,
        configA: 'R',
        configB: 'S',
        leftA: 'H',
        rightA: 'OH',
        leftB: 'OH',
        rightB: 'H',
      },
    ],
  },
  12: {
    name: { en: "(R)- vs (S)-Butan-2-ol (sec-Butanol)", bn: "(R)- বনাম (S)-বিউটান-২-অল" },
    formula: "C4H10O",
    topGroup: "CH3",
    bottomGroup: "C2H5",
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
  13: {
    name: { en: "(R)- vs (S)-Bromochlorofluoromethane (CHBrClF)", bn: "ব্রোমোক্লোরোফ্লুরোমিথেন" },
    formula: "CHBrClF",
    topGroup: "Br",
    bottomGroup: "H",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 1,
        configA: 'R',
        configB: 'S',
        leftA: 'F',
        rightA: 'Cl',
        leftB: 'Cl',
        rightB: 'F',
      },
    ],
  },
  14: {
    name: { en: "(2S,3R)- vs (2R,3S)-2-Bromo-3-chlorobutane", bn: "২-ব্রোমো-৩-ক্লোরোবিউটেন (এন্যানশিওমার)" },
    formula: "C4H8BrCl",
    topGroup: "CH3",
    bottomGroup: "CH3",
    relationship: "enantiomers",
    centers: [
      {
        carbonNum: 2,
        configA: 'S',
        configB: 'R',
        leftA: 'H',
        rightA: 'Br',
        leftB: 'Br',
        rightB: 'H',
      },
      {
        carbonNum: 3,
        configA: 'R',
        configB: 'S',
        leftA: 'Cl',
        rightA: 'H',
        leftB: 'H',
        rightB: 'Cl',
      },
    ],
  },
};

interface FischerProjection2DProps {
  pairIndex?: number;
  externalProgress?: number;
  onProgressChange?: (p: number) => void;
  externalIsRotated?: boolean;
  onRotateChange?: (r: boolean) => void;
}

export const FischerProjection2D: React.FC<FischerProjection2DProps> = ({
  pairIndex = 1,
  externalProgress,
  onProgressChange,
  externalIsRotated,
  onRotateChange,
}) => {
  const [showWedgeDash, setShowWedgeDash] = useState(false);
  const [internalRotated180B, setInternalRotated180B] = useState(false);
  const [internalSuperimposeX, setInternalSuperimposeX] = useState(0);

  const rotated180B = externalIsRotated !== undefined ? externalIsRotated : internalRotated180B;
  const setRotated180B = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(rotated180B) : val;
    setInternalRotated180B(nextVal);
    onRotateChange?.(nextVal);
  };

  const superimposeX = externalProgress !== undefined ? externalProgress : internalSuperimposeX;
  const setSuperimposeX = onProgressChange || setInternalSuperimposeX;

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
        return 'bg-red-950/60 text-red-300 border-red-500/50';
      case 'F':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'I':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/40';
      case 'H':
        return 'bg-slate-700/50 text-slate-200 border-slate-600/50';
      case 'COOH':
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 font-bold';
      case 'CHO':
        return 'bg-orange-500/20 text-orange-200 border-orange-500/40 font-bold';
      case 'CH3':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'CH2CH3':
      case 'C2H5':
        return 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 font-bold';
      case 'CH2OH':
        return 'bg-teal-500/20 text-teal-200 border-teal-500/40';
      case 'NH2':
        return 'bg-blue-600/25 text-blue-200 border-blue-500/50 font-bold';
      case 'Phenyl':
      case 'Ph':
        return 'bg-fuchsia-600/25 text-fuchsia-200 border-fuchsia-500/50 font-bold';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  // Symmetric Vertical Geometry:
  // Center is exactly svgHeight / 2.
  // 180° rotation around (130, svgHeight / 2) maps top <-> bottom and center i <-> center (N - 1 - i).
  const rungGap = 80;
  const topGroupY = 35;
  const svgHeight = 70 + (numCenters + 1) * rungGap;
  const centerY = svgHeight / 2;

  // Comparison logic accounting for 180° in-plane rotation of Molecule B
  const topMatches = data.topGroup === (rotated180B ? data.bottomGroup : data.topGroup);
  const bottomMatches = data.bottomGroup === (rotated180B ? data.topGroup : data.bottomGroup);

  const centerMatches = data.centers.map((cA, idx) => {
    const origB = rotated180B ? data.centers[numCenters - 1 - idx] : data.centers[idx];
    const screenLeftB = rotated180B ? origB.rightB : origB.leftB;
    const screenRightB = rotated180B ? origB.leftB : origB.rightB;

    const leftMatch = cA.leftA === screenLeftB;
    const rightMatch = cA.rightA === screenRightB;
    return {
      leftMatch,
      rightMatch,
      allMatch: leftMatch && rightMatch,
      screenLeftB,
      screenRightB,
    };
  });

  const isSuperimposing = superimposeX > 0.6;
  const clashProgress = Math.max(0, Math.min(1, (superimposeX - 0.6) / 0.4));

  const renderSingleFischer = (
    isomerKey: 'A' | 'B',
    isRotated: boolean,
    labelTitle: string,
    badgeColor: string
  ) => {
    // Card background transparency during overlay
    const bgAlpha = Math.max(0, 0.75 * (1 - superimposeX * 1.5));
    const borderAlpha = Math.max(0, 0.8 * (1 - superimposeX * 1.5));

    return (
      <div
        className="flex flex-col items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 relative"
        style={{
          backgroundColor: superimposeX > 0.05 ? `rgba(2, 6, 23, ${bgAlpha})` : undefined,
          borderColor: superimposeX > 0.05 ? `rgba(30, 41, 59, ${borderAlpha})` : undefined,
          boxShadow: superimposeX > 0.5 ? 'none' : undefined,
        }}
      >
        {/* Isomer Title Badge (Fades out when superimposing to prevent collision) */}
        <span
          className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border mb-3 transition-opacity duration-300 ${badgeColor}`}
          style={{
            opacity: Math.max(0, 1 - superimposeX * 1.6),
          }}
        >
          {labelTitle} {isRotated ? '(180° Rotated)' : ''}
        </span>

        {/* SVG Container with 180° in-plane rotation support */}
        <div
          style={{
            transform: isRotated ? 'rotate(180deg)' : 'none',
            transformOrigin: '130px center',
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          <svg width="260" height={svgHeight} className="overflow-visible">
            {/* Central Vertical Backbone Line */}
            {showWedgeDash ? (
              // Dashed backbone representing bonds going into the page (away from viewer)
              <line
                x1="130"
                y1={topGroupY}
                x2="130"
                y2={svgHeight - topGroupY}
                stroke={superimposeX > 0.4 ? (isomerKey === 'A' ? '#38bdf8' : '#c084fc') : '#38bdf8'}
                strokeWidth={superimposeX > 0.5 ? '4.5' : '4'}
                strokeDasharray="6,4"
              />
            ) : (
              <line
                x1="130"
                y1={topGroupY}
                x2="130"
                y2={svgHeight - topGroupY}
                stroke={
                  superimposeX > 0.4
                    ? (isomerKey === 'A' ? '#06b6d4' : '#c084fc')
                    : '#64748b'
                }
                strokeWidth={superimposeX > 0.5 ? '4' : '3.5'}
              />
            )}

            {/* Meso Plane of Symmetry (σ) line if applicable */}
            {isMeso && numCenters === 2 && (
              <g>
                <line
                  x1="20"
                  y1={centerY}
                  x2="240"
                  y2={centerY}
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                  className="animate-pulse"
                />
                <text
                  x="242"
                  y={centerY + 4}
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
            {(() => {
              const matches = topMatches;
              const isHidden = isomerKey === 'B' && matches && superimposeX >= 0.85;
              const shiftY = matches
                ? 0
                : (isomerKey === 'A' ? -10 : (isRotated ? 10 : 10)) * clashProgress;

              return (
                <foreignObject
                  x="70"
                  y={topGroupY - 16}
                  width="120"
                  height="34"
                  style={{ opacity: isHidden ? 0 : 1 }}
                >
                  <div
                    className="flex justify-center items-center h-full transition-transform duration-200"
                    style={{
                      transform: `${isRotated ? 'rotate(180deg)' : ''} translateY(${shiftY}px)`,
                    }}
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                        superimposeX >= 0.85 && matches
                          ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                          : superimposeX >= 0.85
                          ? (isomerKey === 'A'
                              ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300'
                              : 'border-purple-400 bg-purple-950/90 text-purple-300')
                          : getGroupBadgeColor(data.topGroup)
                      }`}
                    >
                      {superimposeX >= 0.85 && matches
                        ? `✓ ${data.topGroup}`
                        : superimposeX >= 0.85
                        ? `${isomerKey}: ${data.topGroup}`
                        : data.topGroup}
                    </span>
                  </div>
                </foreignObject>
              );
            })()}

            {/* Horizontal Rungs (Chiral Centers) */}
            {data.centers.map((c, idx) => {
              const y = topGroupY + (idx + 1) * rungGap;
              const leftGrp = isomerKey === 'A' ? c.leftA : c.leftB;
              const rightGrp = isomerKey === 'A' ? c.rightA : c.rightB;
              const config = isomerKey === 'A' ? c.configA : c.configB;

              const cMatch = centerMatches[idx];
              const leftMatches = cMatch?.leftMatch ?? false;
              const rightMatches = cMatch?.rightMatch ?? false;
              const rungMatches = cMatch?.allMatch ?? false;

              // Compute clash vertical shifts to prevent overlapping text
              // Molecule A shifts UP, Molecule B shifts DOWN in screen space
              const leftShift = leftMatches
                ? 0
                : (isomerKey === 'A' ? -12 : (isRotated ? -12 : 12)) * clashProgress;
              const rightShift = rightMatches
                ? 0
                : (isomerKey === 'A' ? -12 : (isRotated ? -12 : 12)) * clashProgress;

              // When superimposed and matching, hide B's badge so A renders the unified check badge
              const hideLeftB = isomerKey === 'B' && leftMatches && superimposeX >= 0.85;
              const hideRightB = isomerKey === 'B' && rightMatches && superimposeX >= 0.85;

              return (
                <g key={c.carbonNum}>
                  {/* Horizontal Rung */}
                  {showWedgeDash ? (
                    // Solid Wedges coming out of page (toward viewer)
                    <g>
                      {/* Left Wedge */}
                      <polygon
                        points={`130,${y} 55,${y - 6} 55,${y + 6}`}
                        fill={superimposeX > 0.4 ? (isomerKey === 'A' ? '#38bdf8' : '#c084fc') : '#38bdf8'}
                        opacity="0.9"
                      />
                      {/* Right Wedge */}
                      <polygon
                        points={`130,${y} 205,${y - 6} 205,${y + 6}`}
                        fill={superimposeX > 0.4 ? (isomerKey === 'A' ? '#38bdf8' : '#c084fc') : '#38bdf8'}
                        opacity="0.9"
                      />
                    </g>
                  ) : (
                    <line
                      x1="55"
                      y1={y}
                      x2="205"
                      y2={y}
                      stroke={
                        superimposeX > 0.4
                          ? (isomerKey === 'A' ? '#0ea5e9' : '#d946ef')
                          : '#94a3b8'
                      }
                      strokeWidth={superimposeX > 0.5 ? '4' : '3.5'}
                    />
                  )}

                  {/* Central Chiral Carbon Point */}
                  <circle
                    cx="130"
                    cy={y}
                    r={superimposeX > 0.5 ? 6 : 5}
                    fill={
                      superimposeX >= 0.85
                        ? (rungMatches ? '#34d399' : '#f43f5e')
                        : (isomerKey === 'A' ? '#38bdf8' : '#c084fc')
                    }
                  />

                  {/* Central Chiral Carbon Config Badge */}
                  {/* Only rendered by Molecule A when superimposed to avoid text collision */}
                  {!(isomerKey === 'B' && superimposeX >= 0.7) && (
                    <foreignObject x="85" y={y - 25} width="90" height="24">
                      <div
                        className="flex justify-center items-center h-full"
                        style={{ transform: isRotated ? 'rotate(180deg)' : 'none' }}
                      >
                        {superimposeX >= 0.85 ? (
                          rungMatches ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950/95 text-emerald-300 border border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)] whitespace-nowrap">
                              ✓ C{c.carbonNum} Match
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-950/95 text-rose-300 border border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)] whitespace-nowrap">
                              ⚠️ C{c.carbonNum} Clash
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950/90 text-purple-300 border border-purple-500/40">
                            C{c.carbonNum}({config})
                          </span>
                        )}
                      </div>
                    </foreignObject>
                  )}

                  {/* Left Group */}
                  <foreignObject
                    x="0"
                    y={y - 14}
                    width="60"
                    height="28"
                    style={{ opacity: hideLeftB ? 0 : 1 }}
                  >
                    <div
                      className="flex justify-end items-center h-full pr-1 transition-transform duration-200"
                      style={{
                        transform: `${isRotated ? 'rotate(180deg)' : ''} translateY(${leftShift}px)`,
                      }}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                          superimposeX >= 0.85 && leftMatches
                            ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : superimposeX >= 0.85
                            ? (isomerKey === 'A'
                                ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300'
                                : 'border-purple-400 bg-purple-950/90 text-purple-300')
                            : getGroupBadgeColor(leftGrp)
                        }`}
                      >
                        {superimposeX >= 0.85 && leftMatches
                          ? `✓ ${leftGrp}`
                          : superimposeX >= 0.85
                          ? `${isomerKey}: ${leftGrp}`
                          : leftGrp}
                      </span>
                    </div>
                  </foreignObject>

                  {/* Right Group */}
                  <foreignObject
                    x="200"
                    y={y - 14}
                    width="60"
                    height="28"
                    style={{ opacity: hideRightB ? 0 : 1 }}
                  >
                    <div
                      className="flex justify-start items-center h-full pl-1 transition-transform duration-200"
                      style={{
                        transform: `${isRotated ? 'rotate(180deg)' : ''} translateY(${rightShift}px)`,
                      }}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                          superimposeX >= 0.85 && rightMatches
                            ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : superimposeX >= 0.85
                            ? (isomerKey === 'A'
                                ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300'
                                : 'border-purple-400 bg-purple-950/90 text-purple-300')
                            : getGroupBadgeColor(rightGrp)
                        }`}
                      >
                        {superimposeX >= 0.85 && rightMatches
                          ? `✓ ${rightGrp}`
                          : superimposeX >= 0.85
                          ? `${isomerKey}: ${rightGrp}`
                          : rightGrp}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Bottom Group */}
            {(() => {
              const matches = bottomMatches;
              const isHidden = isomerKey === 'B' && matches && superimposeX >= 0.85;
              const shiftY = matches
                ? 0
                : (isomerKey === 'A' ? 10 : (isRotated ? -10 : -10)) * clashProgress;

              return (
                <foreignObject
                  x="70"
                  y={svgHeight - topGroupY - 14}
                  width="120"
                  height="34"
                  style={{ opacity: isHidden ? 0 : 1 }}
                >
                  <div
                    className="flex justify-center items-center h-full transition-transform duration-200"
                    style={{
                      transform: `${isRotated ? 'rotate(180deg)' : ''} translateY(${shiftY}px)`,
                    }}
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                        superimposeX >= 0.85 && matches
                          ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                          : superimposeX >= 0.85
                          ? (isomerKey === 'A'
                              ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300'
                              : 'border-purple-400 bg-purple-950/90 text-purple-300')
                          : getGroupBadgeColor(data.bottomGroup)
                      }`}
                    >
                      {superimposeX >= 0.85 && matches
                        ? `✓ ${data.bottomGroup}`
                        : superimposeX >= 0.85
                        ? `${isomerKey}: ${data.bottomGroup}`
                        : data.bottomGroup}
                    </span>
                  </div>
                </foreignObject>
              );
            })()}
          </svg>
        </div>
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

      {/* 2D Fischer Projection Stage: CSS Grid with Shared Origin */}
      {/* Both Molecule A and Molecule B are centered at the exact same stage center */}
      {/* translateX = calc(± stageOffset * (1 - superimposeX)). At superimposeX = 1, offset is 0px! */}
      <div className="relative grid grid-cols-1 grid-rows-1 place-items-center py-6 bg-slate-950/50 rounded-2xl border border-cyan-500/10 min-h-[440px] sm:min-h-[460px] overflow-hidden [--stage-offset:145px] sm:[--stage-offset:185px] md:[--stage-offset:210px]">
        {/* Molecule A */}
        <div
          className="col-start-1 row-start-1 transition-transform duration-300 ease-out flex flex-col items-center"
          style={{
            transform: `translateX(calc(-1 * var(--stage-offset) * ${1 - superimposeX}))`,
            zIndex: 10,
          }}
        >
          {renderSingleFischer(
            'A',
            false,
            'Isomer A',
            'border-cyan-500/40 bg-cyan-950/60 text-cyan-300'
          )}
        </div>

        {/* Central Vertical Mirror Plane (Fades away as molecules superimpose) */}
        <div
          className="col-start-1 row-start-1 pointer-events-none transition-all duration-300 flex flex-col items-center gap-2"
          style={{
            opacity: Math.max(0, 1 - superimposeX * 2.5),
            transform: `scale(${Math.max(0.7, 1 - superimposeX * 0.3)})`,
            zIndex: 15,
          }}
        >
          <div className="h-44 sm:h-52 w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_10px_#a855f7]" />
          <div className="px-2 py-0.5 rounded-md border border-purple-500/40 bg-purple-950/80 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
            Mirror Plane
          </div>
          <div className="h-44 sm:h-52 w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_10px_#a855f7]" />
        </div>

        {/* Molecule B */}
        <div
          className="col-start-1 row-start-1 transition-transform duration-300 ease-out flex flex-col items-center"
          style={{
            transform: `translateX(calc(var(--stage-offset) * ${1 - superimposeX}))`,
            zIndex: 20,
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

        {/* Sliding Superposition Legend Pill (Active while sliding) */}
        {superimposeX > 0.35 && superimposeX < 0.85 && (
          <div className="absolute top-4 inset-x-0 flex justify-center items-center pointer-events-none z-30">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-700/80 bg-slate-900/90 backdrop-blur-md shadow-xl text-[11px] font-bold">
              <span className="text-cyan-400">Molecule A (Cyan)</span>
              <ArrowLeftRight className="h-3 w-3 text-slate-400" />
              <span className="text-purple-400">Molecule B (Purple)</span>
              <span className="text-slate-400 font-normal">| Sliding together...</span>
            </div>
          </div>
        )}

        {/* Superimposition Verdict Notification (Active at >= 85% overlay) */}
        {superimposeX >= 0.85 && (
          <div className="absolute top-4 inset-x-4 max-w-lg mx-auto p-3 sm:p-3.5 rounded-xl border bg-slate-900/95 backdrop-blur-xl shadow-2xl text-center z-30 transition-all duration-300">
            {data.relationship === 'diastereomers' ? (
              <div className="flex flex-col items-center gap-1">
                <div className="text-amber-400 font-bold text-xs flex items-center justify-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Non-Superimposable Diastereomers! (Not Mirror Images)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  C3 matches (<span className="text-emerald-300 font-mono">3R = 3R</span>), but C2 clashes (<span className="text-rose-300 font-mono">2R ≠ 2S</span>). Stereoisomers that are not mirror images are <strong className="text-amber-300">Diastereomers</strong>.
                </p>
              </div>
            ) : isMeso || data.relationship === 'identical' ? (
              rotated180B ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>100% Superimposable! (Identical Meso Homomer)</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    After 180° in-plane rotation, every atom and stereocenter aligns 100% with Molecule A. It is <strong className="text-emerald-300">Achiral (Meso)</strong>!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="text-amber-300 font-bold text-xs flex items-center justify-center gap-2">
                    <Info className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>Molecules are overlaid! Now click &quot;Rotate Mirror 180° in Plane&quot; above to verify 100% match!</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Fischer projections allow 180° in-plane rotations without changing configuration.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="text-rose-400 font-bold text-xs flex items-center justify-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Non-Superimposable Mirror Images (Genuine Enantiomers)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {rotated180B
                    ? "Even after 180° in-plane rotation, groups clash and fail to superimpose. These non-superimposable mirror images are Enantiomers!"
                    : "Groups clash across chiral centers. Click \"Rotate Mirror 180° in Plane\" to verify that in-plane rotation still fails to superimpose."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2D Superposition Slider */}
      <div className="max-w-md mx-auto w-full p-3 sm:p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1.5">
          <span>Side-by-Side</span>
          <span className="text-cyan-400 font-mono">Test 2D Superposition: {Math.round(superimposeX * 100)}%</span>
          <span>100% Superimposed</span>
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
