import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { RotateCcw, ArrowRightLeft, Sparkles, ShieldCheck, Info } from 'lucide-react';

interface CyclohexaneChair2DProps {
  substituent?: 'H' | 'CH3' | 't-Bu';
  flipProgress?: number; // 0 = Chair 1, 1 = Chair 2
  onFlipToggle?: () => void;
}

export const CyclohexaneChair2D: React.FC<CyclohexaneChair2DProps> = ({
  substituent = 'CH3',
  flipProgress = 0,
  onFlipToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'chair' | 'haworth'>('chair');
  const [currentChair, setCurrentChair] = useState<'chair1' | 'chair2'>('chair1');

  const isFlipped = currentChair === 'chair2';

  // Toggle local chair flip if onFlipToggle not provided
  const handleFlip = () => {
    setCurrentChair((c) => (c === 'chair1' ? 'chair2' : 'chair1'));
    onFlipToggle?.();
  };

  // Thermodynamic data for 11th/12th grade
  const aValues: Record<string, { value: number; eqPct: string; notes: string }> = {
    H: { value: 0, eqPct: '50% Eq : 50% Ax', notes: 'Degenerate equilibrium: both chairs are identical in energy.' },
    CH3: { value: 7.3, eqPct: '95% Eq : 5% Ax', notes: 'Axial methyl has 2 gauche-butane type 1,3-diaxial clashes with C3 and C5 hydrogens.' },
    't-Bu': { value: 20.0, eqPct: '>99.9% Eq', notes: 'Bulky tert-butyl group locks the chair permanently into equatorial conformation!' },
  };

  const currentInfo = aValues[substituent] || aValues.CH3;

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
              2D Conformation Diagram
            </span>
            <span className="text-sm font-black text-white">Cyclohexane Chair &amp; Haworth Formulas</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class 11/12 Rule: Axial bonds are vertical (⇕); Equatorial bonds are slanted. In ring-flip: Ax ⇄ Eq!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('chair')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
              activeTab === 'chair'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Chair Skeleton
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('haworth')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${
              activeTab === 'haworth'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Haworth Polygon (Flat)
          </button>
        </div>
      </div>

      {/* Golden Rule Callout Banner */}
      <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="text-slate-200">
            <strong>Golden Rule of Ring-Flip:</strong> All <span className="text-rose-400 font-bold">Axial (ax)</span> become <span className="text-emerald-400 font-bold">Equatorial (eq)</span>, but <span className="text-cyan-300 font-bold">UP stays UP</span> and <span className="text-cyan-300 font-bold">DOWN stays DOWN</span>!
          </span>
        </div>
        <button
          type="button"
          onClick={handleFlip}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cyan-400/50 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold cursor-pointer"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          <span>Flip to {isFlipped ? 'Chair 1 (Equatorial)' : 'Chair 2 (Axial)'}</span>
        </button>
      </div>

      {/* 2D Drawing Stage */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative min-h-[300px]">
        {activeTab === 'chair' ? (
          <div className="flex flex-col items-center">
            <svg width="380" height="240" viewBox="0 0 380 240" className="overflow-visible">
              {/* Chair 1 (Left-slanted) vs Chair 2 (Right-slanted) */}
              {!isFlipped ? (
                // CHAIR 1: Standard chair skeleton
                <g>
                  {/* C-C Ring Bonds */}
                  <polygon
                    points="70,120 120,70 230,70 300,120 250,170 140,170"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />

                  {/* Vertices & Carbon Labels */}
                  <circle cx="70" cy="120" r="5" fill="#ffffff" />
                  <text x="50" y="125" fill="#94a3b8" fontSize="11" fontWeight="bold">C4</text>

                  <circle cx="120" cy="70" r="5" fill="#ffffff" />
                  <text x="115" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">C5</text>

                  <circle cx="230" cy="70" r="5" fill="#ffffff" />
                  <text x="235" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">C6</text>

                  <circle cx="300" cy="120" r="5" fill="#ffffff" />
                  <text x="315" y="125" fill="#38bdf8" fontSize="12" fontWeight="bold">C1</text>

                  <circle cx="250" cy="170" r="5" fill="#ffffff" />
                  <text x="255" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold">C2</text>

                  <circle cx="140" cy="170" r="5" fill="#ffffff" />
                  <text x="130" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold">C3</text>

                  {/* C1 Bonds: Equatorial is Down-Right, Axial is Straight UP */}
                  {/* C1 Axial (Straight UP - red dashed) */}
                  <line x1="300" y1="120" x2="300" y2="60" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,3" />
                  <text x="290" y="50" fill="#fda4af" fontSize="11" fontWeight="bold">H (ax-up)</text>

                  {/* C1 Equatorial (Down-right - green solid with substituent) */}
                  <line x1="300" y1="120" x2="360" y2="150" stroke="#10b981" strokeWidth="3.5" />
                  <foreignObject x="345" y="145" width="55" height="28">
                    <span className="px-2 py-0.5 rounded-lg border border-emerald-400 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold shadow-lg">
                      {substituent} (eq)
                    </span>
                  </foreignObject>

                  {/* C3 Axial (Straight UP) & C5 Axial (Straight UP) for 1,3-diaxial reference */}
                  <line x1="140" y1="170" x2="140" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <text x="135" y="235" fill="#94a3b8" fontSize="10">H (ax-dn)</text>

                  <line x1="120" y1="70" x2="120" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  <text x="110" y="15" fill="#94a3b8" fontSize="10">H (ax-up)</text>
                </g>
              ) : (
                // CHAIR 2 (FLIPPED): C1 becomes Axial!
                <g>
                  {/* Flipped Ring Bonds */}
                  <polygon
                    points="80,120 130,170 240,170 310,120 260,70 150,70"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />

                  {/* C1 is now at (80, 120) or right side */}
                  <circle cx="310" cy="120" r="5" fill="#ffffff" />
                  <text x="325" y="125" fill="#c084fc" fontSize="12" fontWeight="bold">C1</text>

                  {/* C1 Axial (Straight DOWN with substituent - RED clash warning!) */}
                  <line x1="310" y1="120" x2="310" y2="185" stroke="#ef4444" strokeWidth="3.5" />
                  <foreignObject x="290" y="185" width="55" height="28">
                    <span className="px-2 py-0.5 rounded-lg border border-rose-400 bg-rose-500/20 text-rose-300 text-xs font-mono font-bold shadow-lg animate-pulse">
                      {substituent} (ax)
                    </span>
                  </foreignObject>

                  {/* 1,3-Diaxial Repulsion Arc */}
                  {substituent !== 'H' && (
                    <g>
                      <path d="M 235,175 Q 270,210 305,185" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
                      <text x="210" y="225" fill="#f87171" fontSize="10" fontWeight="bold">
                        1,3-Diaxial Clash!
                      </text>
                    </g>
                  )}

                  {/* C1 Equatorial (Up-right) */}
                  <line x1="310" y1="120" x2="365" y2="90" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3,3" />
                  <text x="355" y="85" fill="#6ee7b7" fontSize="11" fontWeight="bold">H (eq)</text>
                </g>
              )}
            </svg>

            <div className="flex items-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-emerald-300 font-bold">Equatorial: Low Energy, Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-400 inline-block" />
                <span className="text-rose-300 font-bold">Axial: 1,3-Diaxial Crowding</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= HAWORTH POLYGON (FLAT HEXAGON) ================= */
          <div className="flex flex-col items-center">
            <svg width="340" height="220" viewBox="0 0 340 220" className="overflow-visible">
              {/* Flat Hexagon */}
              <polygon
                points="90,110 135,50 205,50 250,110 205,170 135,170"
                fill="#0f2b46"
                stroke="#64748b"
                strokeWidth="4"
              />

              {/* Bold front edge representing perspective coming out of page */}
              <line x1="135" y1="170" x2="205" y2="170" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />

              {/* Vertical Up/Down Sticks at each carbon */}
              {/* C1 at (250, 110) */}
              <line x1="250" y1="70" x2="250" y2="150" stroke="#ffffff" strokeWidth="2.5" />
              <text x="260" y="115" fill="#38bdf8" fontSize="12" fontWeight="bold">C1</text>
              <foreignObject x="235" y="38" width="50" height="26">
                <span className="px-1.5 py-0.5 rounded border border-emerald-400 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {substituent} (UP)
                </span>
              </foreignObject>
              <text x="245" y="168" fill="#94a3b8" fontSize="11">H (DN)</text>

              {/* C2 at (205, 170) */}
              <line x1="205" y1="130" x2="205" y2="210" stroke="#94a3b8" strokeWidth="2" />
              <text x="200" y="125" fill="#94a3b8" fontSize="10">H (UP)</text>
              <text x="200" y="222" fill="#94a3b8" fontSize="10">H (DN)</text>

              {/* C4 at (90, 110) */}
              <line x1="90" y1="70" x2="90" y2="150" stroke="#94a3b8" strokeWidth="2" />
              <text x="85" y="65" fill="#94a3b8" fontSize="10">H (UP)</text>
              <text x="85" y="165" fill="#94a3b8" fontSize="10">H (DN)</text>
            </svg>

            <p className="text-xs text-slate-300 mt-2 text-center max-w-sm">
              Haworth Projection: Flat hexagon view showing cis (both UP or both DOWN) vs trans (one UP, one DOWN).
            </p>
          </div>
        )}

        {/* Right Info Card: A-Value & Equilibrium Breakdown */}
        <div className="w-full md:w-64 p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-b border-slate-800 pb-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Thermodynamic A-Value</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Substituent:</span>
            <span className="font-bold text-white font-mono">{substituent}</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">A-Value (-ΔG°):</span>
            <span className="font-bold text-cyan-300 font-mono">{currentInfo.value} kJ/mol</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Equilibrium Ratio:</span>
            <span className="font-bold text-emerald-400 font-mono">{currentInfo.eqPct}</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
            {currentInfo.notes}
          </p>
        </div>
      </div>
    </div>
  );
};
