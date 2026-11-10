import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { RotateCw, Compass, Sparkles, Eye, Info } from 'lucide-react';

interface PolarimeterRay2DProps {
  analyzerAngleDeg?: number;
  sampleLengthDm?: number;
  concentrationGmL?: number;
  specificRotation?: number;
  onAnalyzerChange?: (angle: number) => void;
}

export const PolarimeterRay2D: React.FC<PolarimeterRay2DProps> = ({
  analyzerAngleDeg: controlledAngle,
  sampleLengthDm = 1.0,
  concentrationGmL = 0.1,
  specificRotation = 13.5,
  onAnalyzerChange,
}) => {
  const [tubeLength, setTubeLength] = useState<number>(sampleLengthDm);
  const [concentration, setConcentration] = useState<number>(concentrationGmL);
  const [internalAngle, setInternalAngle] = useState<number>(controlledAngle ?? 0);

  const analyzerAngle = controlledAngle !== undefined ? controlledAngle : internalAngle;

  const handleAngleChange = (angle: number) => {
    setInternalAngle(angle);
    onAnalyzerChange?.(angle);
  };

  // Theoretical observed rotation by Biot's law: alpha = [alpha] * l * c
  const theoreticalAlpha = specificRotation * tubeLength * concentration;

  // Extinction / transmission intensity: Malus law I = I0 * cos^2(theta - alpha)
  const diffAngle = ((analyzerAngle - theoreticalAlpha) * Math.PI) / 180;
  const intensityPct = Math.round(Math.pow(Math.cos(diffAngle), 2) * 100);

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
              2D Optical Bench
            </span>
            <span className="text-sm font-black text-white">Polarimeter Ray Diagram &amp; Biot's Law Calculator</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class 11/12 Fundamental: Biot&apos;s Law [α] = α / (l × c). Trace light from unpolarized source to rotating analyzer!
          </p>
        </div>

        {/* Biot's Formula Pill */}
        <div className="px-3 py-1 rounded-xl border border-cyan-500/30 bg-cyan-950/60 text-xs font-mono text-cyan-200">
          [α] = α / (l × c)
        </div>
      </div>

      {/* Main 2D Ray Bench SVG */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 min-h-[280px] overflow-x-auto">
        <svg width="720" height="200" viewBox="0 0 720 200" className="overflow-visible">
          {/* Optical Axis Line */}
          <line x1="20" y1="100" x2="700" y2="100" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

          {/* 1. Monochromatic Light Source at (50, 100) */}
          <g>
            <circle cx="50" cy="100" r="22" fill="#eab308" filter="drop-shadow(0 0 10px #eab308)" />
            <text x="50" y="104" fill="#000000" fontSize="10" fontWeight="black" textAnchor="middle">Na (D)</text>
            <text x="50" y="145" fill="#facc15" fontSize="11" fontWeight="bold" textAnchor="middle">Light Source</text>
            <text x="50" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">(589 nm)</text>
          </g>

          {/* Unpolarized Light Waves (All directions) */}
          <g transform="translate(110, 100)">
            <line x1="0" y1="-25" x2="0" y2="25" stroke="#facc15" strokeWidth="2.5" />
            <line x1="-25" y1="0" x2="25" y2="0" stroke="#facc15" strokeWidth="2.5" />
            <line x1="-18" y1="-18" x2="18" y2="18" stroke="#facc15" strokeWidth="2" />
            <line x1="-18" y1="18" x2="18" y2="-18" stroke="#facc15" strokeWidth="2" />
            <text x="0" y="45" fill="#94a3b8" fontSize="10" textAnchor="middle">Unpolarized</text>
          </g>

          {/* 2. Polarizer (Nicol Prism) at (200, 100) */}
          <g transform="translate(190, 40)">
            <polygon points="0,0 30,0 20,120 -10,120" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <line x1="10" y1="10" x2="10" y2="110" stroke="#ffffff" strokeWidth="3" />
            <text x="10" y="145" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Polarizer</text>
            <text x="10" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">(Nicol Prism)</text>
          </g>

          {/* Plane-Polarized Light (Vertical only) */}
          <g transform="translate(265, 100)">
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#38bdf8" strokeWidth="3.5" />
            <polygon points="0,-30 -4,-22 4,-22" fill="#38bdf8" />
            <polygon points="0,30 -4,22 4,22" fill="#38bdf8" />
            <text x="0" y="45" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Plane Polarized</text>
          </g>

          {/* 3. Sample Tube (Cell) with Chiral Liquid at (340 to 480) */}
          <g transform="translate(330, 60)">
            <rect x="0" y="0" width="160" height="80" rx="8" fill="#0f2b46" stroke="#22d3ee" strokeWidth="2.5" />
            {/* Chiral Liquid Glow */}
            <rect x="4" y="4" width="152" height="72" rx="6" fill="#0891b2" opacity="0.3" />
            <text x="80" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              Chiral Solution ({concentration} g/mL)
            </text>
            <text x="80" y="105" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">
              Sample Cell (l = {tubeLength} dm)
            </text>
          </g>

          {/* Rotated Polarized Light (Tilted by theoreticalAlpha) */}
          <g transform={`translate(535, 100) rotate(${theoreticalAlpha})`}>
            <line x1="0" y1="-32" x2="0" y2="32" stroke="#a855f7" strokeWidth="4" />
            <polygon points="0,-32 -4,-24 4,-24" fill="#a855f7" />
            <polygon points="0,32 -4,24 4,24" fill="#a855f7" />
          </g>
          <text x="535" y="145" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">
            Rotated (α = +{theoreticalAlpha.toFixed(1)}°)
          </text>

          {/* 4. Analyzer Prism with Rotating Dial at (610, 100) */}
          <g transform="translate(610, 50)">
            <circle cx="20" cy="50" r="45" fill="#020617" stroke="#a855f7" strokeWidth="2.5" />
            {/* Analyzer slit rotated by analyzerAngle */}
            <g transform={`translate(20, 50) rotate(${analyzerAngle})`}>
              <line x1="0" y1="-38" x2="0" y2="38" stroke="#ffffff" strokeWidth="4" />
            </g>
            <text x="20" y="115" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">Analyzer Dial</text>
            <text x="20" y="130" fill="#94a3b8" fontSize="9" textAnchor="middle">θ = {analyzerAngle}°</text>
          </g>

          {/* 5. Observer Eyepiece / Photodetector at (690, 100) */}
          <g transform="translate(685, 80)">
            <circle cx="15" cy="20" r="16" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
            {/* Eye Pupil with brightness corresponding to intensityPct */}
            <circle
              cx="15"
              cy="20"
              r="10"
              fill={intensityPct > 50 ? '#facc15' : '#334155'}
              opacity={Math.max(0.2, intensityPct / 100)}
            />
            <text x="15" y="50" fill="#94a3b8" fontSize="9" textAnchor="middle">{intensityPct}% Bright</text>
          </g>
        </svg>
      </div>

      {/* Interactive Controls & Biot's Law Real-Time Calculation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-800">
        {/* Slider 1: Path Length l */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Tube Length (l):</span>
            <span className="font-mono text-cyan-300">{tubeLength} dm ({tubeLength * 10} cm)</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={tubeLength}
            onChange={(e) => setTubeLength(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Slider 2: Concentration c */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Concentration (c):</span>
            <span className="font-mono text-cyan-300">{concentration} g/mL</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={concentration}
            onChange={(e) => setConcentration(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Slider 3: Analyzer Dial Rotation */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Rotate Analyzer (θ):</span>
            <span className="font-mono text-purple-300">{analyzerAngle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            value={analyzerAngle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Numerical Biot's Law Summary Box for Class 11/12 Exams */}
      <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-emerald-300 block">
            Observed Optical Rotation (α):
          </span>
          <span className="font-mono text-base font-black text-white">
            α = [{specificRotation}°] × [{tubeLength} dm] × [{concentration} g/mL] = <span className="text-cyan-300">+{theoreticalAlpha.toFixed(2)}°</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAngleChange(Math.round(theoreticalAlpha))}
            className="px-3 py-1.5 rounded-lg border border-emerald-400/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold transition-all cursor-pointer"
          >
            Align Analyzer to Maximum Brightness (θ = {Math.round(theoreticalAlpha)}°)
          </button>
        </div>
      </div>
    </div>
  );
};
