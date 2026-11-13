import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { RotateCw, Compass, Info, Sparkles, Eye } from 'lucide-react';

interface NewmanSawhorse2DProps {
  angleDeg?: number;
  moleculeType?: 'ethane' | 'propane' | 'butane' | 'glycol';
  onAngleChange?: (angle: number) => void;
}

export const NewmanSawhorse2D: React.FC<NewmanSawhorse2DProps> = ({
  angleDeg = 180,
  moleculeType = 'butane',
  onAngleChange,
}) => {
  const [projectionType, setProjectionType] = useState<'newman' | 'sawhorse' | 'wedgedash'>('newman');

  // Determine substituent labels based on molecule type
  let frontTop = 'H';
  let frontBottomLeft = 'H';
  let frontBottomRight = 'H';
  let backTop = 'H';
  let backBottomLeft = 'H';
  let backBottomRight = 'H';

  if (moleculeType === 'ethane') {
    frontTop = 'H';
    frontBottomLeft = 'H';
    frontBottomRight = 'H';
    backTop = 'H';
    backBottomLeft = 'H';
    backBottomRight = 'H';
  } else if (moleculeType === 'propane') {
    frontTop = 'CH3';
    frontBottomLeft = 'H';
    frontBottomRight = 'H';
    backTop = 'H';
    backBottomLeft = 'H';
    backBottomRight = 'H';
  } else if (moleculeType === 'butane') {
    frontTop = 'CH3';
    frontBottomLeft = 'H';
    frontBottomRight = 'H';
    backTop = 'CH3';
    backBottomLeft = 'H';
    backBottomRight = 'H';
  } else if (moleculeType === 'glycol') {
    frontTop = 'OH';
    frontBottomLeft = 'H';
    frontBottomRight = 'H';
    backTop = 'OH';
    backBottomLeft = 'H';
    backBottomRight = 'H';
  }

  // Energy & Conformation state description for 11th/12th grade
  const normAngle = ((angleDeg % 360) + 360) % 360;
  let confNameEn = 'Skew Conformer';
  let confNameBn = 'স্কিউ কনফর্মার';
  let confStabilityEn = 'Intermediate Energy';
  let confStabilityBn = 'মধ্যবর্তী শক্তি';
  let stabilityColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40';

  if (normAngle >= 170 && normAngle <= 190) {
    confNameEn = 'Anti-Periplanar (Anti / Staggered)';
    confNameBn = 'অ্যান্টি-পেরিপ্ল্যানার (অ্যান্টি / স্ট্যাগার্ড)';
    confStabilityEn = 'Most Stable (Minimum Energy, Zero Torsional & Steric Strain)';
    confStabilityBn = 'সর্বাধিক সুস্থিত (সর্বনিম্ন শক্তি, শূন্য টরশনাল ও স্টেরিক বাধার কারণে)';
    stabilityColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
  } else if ((normAngle >= 50 && normAngle <= 70) || (normAngle >= 290 && normAngle <= 310)) {
    confNameEn = 'Gauche (Synclinal / Staggered)';
    confNameBn = 'গশ (সিনক্লিনাল / স্ট্যাগার্ড)';
    confStabilityEn = moleculeType === 'glycol' ? 'Most Stable! (Stabilized by Intramolecular H-Bond)' : 'Stable, but has 60° Steric Crowding (+3.8 kJ/mol)';
    confStabilityBn = moleculeType === 'glycol' ? 'সর্বাধিক সুস্থিত! (অন্তঃআণবিক হাইড্রোজেন বন্ধনের মাধ্যমে)' : 'সুস্থিত, তবে ৬০° দূরত্বে স্টেরিক চাপ বিদ্যমান (+৩.৮ kJ/mol)';
    stabilityColor = moleculeType === 'glycol' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' : 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
  } else if ((normAngle >= 110 && normAngle <= 130) || (normAngle >= 230 && normAngle <= 250)) {
    confNameEn = 'Partially Eclipsed (Anticlinal)';
    confNameBn = 'আংশিক গ্রহণযুক্ত (অ্যান্টিক্লিনাল)';
    confStabilityEn = 'Unstable: H & CH3 bonds eclipse each other (+16 kJ/mol)';
    confStabilityBn = 'অসুস্থিত: H ও CH3 বন্ধন পরস্পরের সম্মুখীন হয় (+১৬ kJ/mol)';
    stabilityColor = 'text-orange-400 border-orange-500/30 bg-orange-950/40';
  } else if (normAngle <= 10 || normAngle >= 350) {
    confNameEn = 'Fully Eclipsed (Syn-Periplanar)';
    confNameBn = 'পূর্ণ গ্রহণযুক্ত (সিন-পেরিপ্ল্যানার)';
    confStabilityEn = 'Least Stable: Massive Van der Waals clash between bulky groups (+19 kJ/mol)';
    confStabilityBn = 'সর্বাপেক্ষা অসুস্থিত: বৃহৎ গ্রুপগুলির মধ্যে তীব্র ভ্যান ডার ওয়ালস সংঘর্ষ (+১৯ kJ/mol)';
    stabilityColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40';
  }

  // Helper for converting angle & radius to 2D SVG coords
  const polarToCart = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const getSubstituentColor = (label: string) => {
    if (label === 'CH3') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
    if (label === 'OH') return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Top Header & Projection Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
              2D Stereochemical Projection
            </span>
            <span className="text-sm font-black text-white capitalize">{moleculeType} Conformations</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class 11/12 Fundamental: Observe Front Carbon (Dot) vs Rear Carbon (Circle) in 2D
          </p>
        </div>

        {/* Projection Mode Switcher */}
        <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setProjectionType('newman')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
              projectionType === 'newman'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Newman Projection
          </button>
          <button
            type="button"
            onClick={() => setProjectionType('sawhorse')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
              projectionType === 'sawhorse'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sawhorse Projection
          </button>
          <button
            type="button"
            onClick={() => setProjectionType('wedgedash')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
              projectionType === 'wedgedash'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Wedge-Dash Formula
          </button>
        </div>
      </div>

      {/* Active Conformation Status Badge */}
      <div className={`p-3 rounded-xl border mb-4 flex flex-wrap items-center justify-between gap-2 ${stabilityColor}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-white">{normAngle}° Dihedral (θ)</span>
            <span className="text-xs font-bold uppercase tracking-wider">• {confNameEn}</span>
          </div>
          <p className="text-[11px] font-bengali text-slate-300 mt-0.5">{confNameBn}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold block">{confStabilityEn}</span>
          <span className="text-[10px] font-bengali text-slate-300">{confStabilityBn}</span>
        </div>
      </div>

      {/* 2D Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative min-h-[320px]">
        {/* ================= NEWMAN PROJECTION 2D ================= */}
        {projectionType === 'newman' && (
          <div className="relative flex flex-col items-center">
            <svg width="340" height="300" viewBox="0 0 340 300" className="overflow-visible">
              <defs>
                <radialGradient id="rearCircleGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f2b46" />
                  <stop offset="100%" stopColor="#071526" />
                </radialGradient>
              </defs>

              {/* Angle Arc Indicator */}
              <circle cx="170" cy="150" r="35" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />

              {/* REAR CARBON: Large Outer Circle */}
              <circle
                cx="170"
                cy="150"
                r="64"
                fill="url(#rearCircleGrad)"
                stroke="#64748b"
                strokeWidth="3.5"
              />

              {/* REAR BONDS (Projecting from perimeter of circle) */}
              {(() => {
                const backAngles = [normAngle, normAngle + 120, normAngle + 240];
                const labels = [backTop, backBottomRight, backBottomLeft];
                const rInner = 64;
                const rOuter = 110;

                return backAngles.map((deg, i) => {
                  const p1 = polarToCart(170, 150, rInner, deg);
                  const p2 = polarToCart(170, 150, rOuter, deg);
                  const pText = polarToCart(170, 150, rOuter + 18, deg);
                  const label = labels[i];

                  return (
                    <g key={`back-${i}`}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <foreignObject x={pText.x - 24} y={pText.y - 14} width="48" height="28">
                        <div className="flex items-center justify-center h-full">
                          <span className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold ${getSubstituentColor(label)} shadow-lg`}>
                            {label}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                });
              })()}

              {/* FRONT CARBON: Bonds from Center (Y-Shape: 0°, 120°, 240°) */}
              {(() => {
                const frontAngles = [0, 120, 240];
                const labels = [frontTop, frontBottomRight, frontBottomLeft];
                const rOuter = 108;

                return frontAngles.map((deg, i) => {
                  const p2 = polarToCart(170, 150, rOuter, deg);
                  const pText = polarToCart(170, 150, rOuter + 18, deg);
                  const label = labels[i];

                  return (
                    <g key={`front-${i}`}>
                      <line
                        x1="170"
                        y1="150"
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#38bdf8"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      <foreignObject x={pText.x - 24} y={pText.y - 14} width="48" height="28">
                        <div className="flex items-center justify-center h-full">
                          <span className={`px-2 py-0.5 rounded-lg border text-xs font-mono font-bold ${getSubstituentColor(label)} shadow-lg`}>
                            {label}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                });
              })()}

              {/* FRONT CARBON: Center Point Intersection Dot */}
              <circle cx="170" cy="150" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Legend / Key for Class 11 & 12 */}
            <div className="flex items-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300 font-bold">Front Carbon (C2 Dot)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 border-slate-400 bg-transparent inline-block" />
                <span className="text-slate-400 font-bold">Rear Carbon (C3 Circle)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-mono font-bold">θ = {normAngle}°</span>
                <span className="text-slate-400">Dihedral</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= SAWHORSE PROJECTION 2D ================= */}
        {projectionType === 'sawhorse' && (
          <div className="relative flex flex-col items-center">
            <svg width="360" height="280" viewBox="0 0 360 280" className="overflow-visible">
              {/* Central C-C Axis (Tilted Line) */}
              <line x1="110" y1="180" x2="250" y2="100" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <text x="75" y="200" fill="#38bdf8" fontSize="12" fontWeight="bold">Front C</text>
              <text x="260" y="90" fill="#94a3b8" fontSize="12" fontWeight="bold">Rear C</text>

              {/* Front Carbon Tripod at (110, 180) */}
              {/* Top Vertical */}
              <line x1="110" y1="180" x2="110" y2="105" stroke="#38bdf8" strokeWidth="4" />
              <circle cx="110" cy="180" r="6" fill="#38bdf8" />
              <foreignObject x="90" y="75" width="45" height="26">
                <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(frontTop)}`}>
                  {frontTop}
                </span>
              </foreignObject>

              {/* Bottom Left */}
              <line x1="110" y1="180" x2="50" y2="230" stroke="#38bdf8" strokeWidth="4" />
              <foreignObject x="20" y="225" width="40" height="26">
                <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(frontBottomLeft)}`}>
                  {frontBottomLeft}
                </span>
              </foreignObject>

              {/* Bottom Right */}
              <line x1="110" y1="180" x2="160" y2="235" stroke="#38bdf8" strokeWidth="4" />
              <foreignObject x="155" y="235" width="40" height="26">
                <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(frontBottomRight)}`}>
                  {frontBottomRight}
                </span>
              </foreignObject>

              {/* Rear Carbon Tripod at (250, 100) - Rotated by normAngle */}
              {(() => {
                const cx = 250;
                const cy = 100;
                // Sawhorse back angles: Anti = points downward (-y)
                const backAngles = [normAngle + 180, normAngle + 300, normAngle + 60];
                const labels = [backTop, backBottomRight, backBottomLeft];

                return backAngles.map((deg, i) => {
                  const p = polarToCart(cx, cy, 75, deg);
                  const pTxt = polarToCart(cx, cy, 95, deg);
                  return (
                    <g key={`saw-back-${i}`}>
                      <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                      <foreignObject x={pTxt.x - 20} y={pTxt.y - 13} width="44" height="26">
                        <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(labels[i])}`}>
                          {labels[i]}
                        </span>
                      </foreignObject>
                    </g>
                  );
                });
              })()}
              <circle cx="250" cy="100" r="6" fill="#94a3b8" />
            </svg>

            <p className="text-xs text-slate-400 mt-2 text-center">
              Sawhorse View: Perspective view along the C2-C3 bond axis showing spatial stagger
            </p>
          </div>
        )}

        {/* ================= WEDGE-DASH FORMULA 2D ================= */}
        {projectionType === 'wedgedash' && (
          <div className="flex flex-col items-center max-w-md text-center p-4">
            <svg width="320" height="180" viewBox="0 0 320 180" className="overflow-visible">
              {/* In-Plane C-C line */}
              <line x1="100" y1="90" x2="220" y2="90" stroke="#ffffff" strokeWidth="4" />
              <text x="100" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold">C2</text>
              <text x="210" y="80" fill="#94a3b8" fontSize="12" fontWeight="bold">C3</text>

              {/* Left In-Plane Bond */}
              <line x1="100" y1="90" x2="50" y2="40" stroke="#ffffff" strokeWidth="3" />
              <foreignObject x="10" y="20" width="45" height="26">
                <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(frontTop)}`}>
                  {frontTop}
                </span>
              </foreignObject>

              {/* Left Solid Wedge (Coming Out) */}
              <polygon points="100,90 60,135 70,140" fill="#38bdf8" />
              <foreignObject x="35" y="140" width="35" height="26">
                <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-xs font-mono">H</span>
              </foreignObject>

              {/* Left Dashed Wedge (Going In) */}
              <line x1="100" y1="90" x2="120" y2="145" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" />
              <foreignObject x="115" y="145" width="35" height="26">
                <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-xs font-mono">H</span>
              </foreignObject>

              {/* Right In-Plane Bond (Anti = Opposite side) */}
              <line x1="220" y1="90" x2="270" y2="140" stroke="#ffffff" strokeWidth="3" />
              <foreignObject x="270" y="135" width="45" height="26">
                <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getSubstituentColor(backTop)}`}>
                  {backTop}
                </span>
              </foreignObject>

              {/* Right Solid Wedge */}
              <polygon points="220,90 260,45 250,40" fill="#94a3b8" />
              <foreignObject x="250" y="15" width="35" height="26">
                <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-xs font-mono">H</span>
              </foreignObject>

              {/* Right Dashed Wedge */}
              <line x1="220" y1="90" x2="200" y2="35" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3,3" />
              <foreignObject x="180" y="15" width="35" height="26">
                <span className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-xs font-mono">H</span>
              </foreignObject>
            </svg>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Standard 2D Zig-Zag Wedge-Dash representation: In-plane bonds (solid lines), Forward bonds (wedges), Backward bonds (hashes).
            </p>
          </div>
        )}
      </div>

      {/* Interactive Angle-by-Angle Scrubber & Preset Dihedral Angles */}
      <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-slate-800">
        {/* Angle-by-Angle Scrubbing Slider */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Scrub Angle-by-Angle (0° - 360°):</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-extrabold text-sm shadow-sm">
                θ = {Math.round(normAngle)}°
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onAngleChange?.(((normAngle - 5 + 360) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-mono cursor-pointer"
                  title="Rotate -5°"
                >
                  -5°
                </button>
                <button
                  type="button"
                  onClick={() => onAngleChange?.(((normAngle - 1 + 360) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-mono cursor-pointer"
                  title="Rotate -1°"
                >
                  -1°
                </button>
                <button
                  type="button"
                  onClick={() => onAngleChange?.(((normAngle + 1) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-mono cursor-pointer"
                  title="Rotate +1°"
                >
                  +1°
                </button>
                <button
                  type="button"
                  onClick={() => onAngleChange?.(((normAngle + 5) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-mono cursor-pointer"
                  title="Rotate +5°"
                >
                  +5°
                </button>
              </div>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={normAngle}
            onChange={(e) => onAngleChange?.(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            title="Drag slider for fine angle-by-angle rotation"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0° (Eclipsed)</span>
            <span className="text-cyan-300">60° (Gauche)</span>
            <span className="text-orange-300">120°</span>
            <span className="text-emerald-300 font-bold">180° (Anti)</span>
            <span>240°</span>
            <span className="text-cyan-300">300° (Gauche)</span>
            <span>360°</span>
          </div>
        </div>

        {/* Quick Jump to Standard Rotamers */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-400">Jump to Standard Rotamers:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onAngleChange?.(180)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                normAngle === 180 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Anti (180°)
            </button>
            <button
              type="button"
              onClick={() => onAngleChange?.(60)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                normAngle === 60 ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Gauche (60°)
            </button>
            <button
              type="button"
              onClick={() => onAngleChange?.(120)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                normAngle === 120 ? 'border-orange-400 bg-orange-500/20 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Part. Eclipsed (120°)
            </button>
            <button
              type="button"
              onClick={() => onAngleChange?.(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                normAngle === 0 ? 'border-rose-400 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Fully Eclipsed (0°)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
