import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { Sparkles, ShieldAlert, Atom, Layers, Flame, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import type { StereoisomerPair } from '../../types/isomerism';

interface ExceptionalCase2DProps {
  currentCase: StereoisomerPair;
  activeIsomer?: 'A' | 'B';
}

export const ExceptionalCase2D: React.FC<ExceptionalCase2DProps> = ({
  currentCase,
  activeIsomer = 'A',
}) => {
  const isOptical = currentCase.id.startsWith('exc-opt');

  // Determine mechanism diagram type
  const getDiagramType = () => {
    if (currentCase.id.includes('allene')) return 'allene';
    if (currentCase.id.includes('biphenyl')) return 'biphenyl';
    if (currentCase.id.includes('spiro')) return 'spirane';
    if (currentCase.id.includes('ethylene-glycol') || currentCase.id.includes('fluoroethanol')) return 'gauche-hbond';
    if (currentCase.id.includes('amine')) return 'amine-inversion';
    if (currentCase.id.includes('cyclooctatetraene')) return 'cot-tub';
    if (currentCase.id.includes('tbutyl')) return 'tbutyl-lock';
    return 'generic';
  };

  const diagramType = getDiagramType();

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={`min-w-0 max-w-full break-words text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
              isOptical ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              2D Mechanism Blueprint
            </span>
            <span className="min-w-0 break-words text-sm font-black text-white">{currentCase.iupacName.en}</span>
          </div>
          <p className="mt-0.5 break-words text-xs text-slate-400">
            Class 11/12 JEE/NEET Special Concept: {isOptical ? 'Chirality without asymmetric carbon center' : 'Steric locks and intramolecular H-bonding effects'}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Current Form:</span>
          <span className="min-w-0 break-words px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            {activeIsomer === 'A' ? currentCase.isomerA.label : currentCase.isomerB.label}
          </span>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        {/* SVG Mechanism Diagram Stage */}
        <div className="relative flex min-w-0 items-center justify-center overflow-hidden p-4 bg-slate-950/70 rounded-2xl border border-slate-800 min-h-[320px]">
          {diagramType === 'allene' && (
            <svg viewBox="0 0 360 260" className="w-full max-w-[360px] select-none">
              <defs>
                <linearGradient id="piY" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="piZ" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Title label */}
              <text x="180" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Orthogonal (Perpendicular) π-Orbital System
              </text>

              {/* Central C=C=C skeleton */}
              {/* C1-C2 bond */}
              <line x1="80" y1="130" x2="180" y2="130" stroke="#94a3b8" strokeWidth="4" />
              {/* C2-C3 bond */}
              <line x1="180" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="4" />

              {/* C1 Terminal Groups (In Plane of Screen) */}
              <line x1="80" y1="130" x2="30" y2="80" stroke="#f8fafc" strokeWidth="3" />
              <text x="20" y="75" fill="#f8fafc" fontSize="12" fontWeight="bold">H</text>

              <line x1="80" y1="130" x2="30" y2="180" stroke="#f8fafc" strokeWidth="3" />
              <text x="15" y="195" fill="#f8fafc" fontSize="12" fontWeight="bold">CH3</text>

              {/* C3 Terminal Groups (Perpendicular: Wedge and Dash) */}
              {/* Wedge (coming forward) */}
              <polygon points="280,130 330,85 340,95" fill="#38bdf8" />
              <text x="345" y="85" fill="#38bdf8" fontSize="12" fontWeight="bold">CH3 (Wedge ◿)</text>

              {/* Dash (going back) */}
              <line x1="280" y1="130" x2="330" y2="175" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 3" />
              <text x="340" y="185" fill="#94a3b8" fontSize="12" fontWeight="bold">H (Dash ╍)</text>

              {/* Carbons */}
              <circle cx="80" cy="130" r="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <text x="80" y="134" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">C1 (sp²)</text>

              <circle cx="180" cy="130" r="16" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
              <text x="180" y="134" textAnchor="middle" fill="#ec4899" fontSize="10" fontWeight="bold">C2 (sp)</text>

              <circle cx="280" cy="130" r="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <text x="280" y="134" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">C3 (sp²)</text>

              {/* 90-degree orbital twist badge */}
              <g transform="translate(180, 215)">
                <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#091b2e" stroke="#ec4899" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold">
                  90° Mutually Orthogonal Planes!
                </text>
              </g>
            </svg>
          )}

          {diagramType === 'biphenyl' && (
            <svg viewBox="0 0 360 260" className="w-full max-w-[360px] select-none">
              <text x="180" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Atropisomerism: Steric Hindrance at Ortho Positions
              </text>

              {/* Central single bond with rotational barrier lock */}
              <line x1="130" y1="130" x2="230" y2="130" stroke="#f43f5e" strokeWidth="4" />

              {/* Ring A (Flat in Plane) */}
              <polygon points="60,95 110,95 130,130 110,165 60,165 40,130" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="85" y="134" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">Ring A (Flat)</text>

              {/* Ring B (Perpendicular: Drawn with thickness / wedge) */}
              <ellipse cx="270" cy="130" rx="16" ry="48" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.5" />
              <text x="270" y="134" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold">Ring B (90°)</text>

              {/* Ortho substituents on Ring A */}
              <circle cx="110" cy="75" r="16" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
              <text x="110" y="79" textAnchor="middle" fill="#fecaca" fontSize="9" fontWeight="bold">NO2</text>

              <circle cx="110" cy="185" r="16" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="110" y="189" textAnchor="middle" fill="#dbeafe" fontSize="9" fontWeight="bold">COOH</text>

              {/* Ortho substituents on Ring B (pointing out of plane) */}
              <circle cx="270" cy="65" r="16" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="270" y="69" textAnchor="middle" fill="#dbeafe" fontSize="9" fontWeight="bold">COOH</text>

              <circle cx="270" cy="195" r="16" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
              <text x="270" y="199" textAnchor="middle" fill="#fecaca" fontSize="9" fontWeight="bold">NO2</text>

              {/* Steric Clash Warning Arrows */}
              <path d="M 125 75 Q 180 70 255 65" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="190" y="60" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">⚡ Severe Steric Clash!</text>

              {/* Barrier callout */}
              <g transform="translate(180, 235)">
                <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#091b2e" stroke="#f43f5e" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="bold">
                  Rotation Barrier &gt; 100 kJ/mol (Locked!)
                </text>
              </g>
            </svg>
          )}

          {diagramType === 'gauche-hbond' && (
            <svg viewBox="0 0 360 260" className="w-full max-w-[360px] select-none">
              <text x="180" y="24" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">
                Gauche Effect: Intramolecular Hydrogen Bonding
              </text>

              {/* Rear Carbon Large Circle */}
              <circle cx="180" cy="135" r="65" fill="#091b2e" stroke="#3b82f6" strokeWidth="2.5" />

              {/* Front Carbon Central Dot */}
              <circle cx="180" cy="135" r="6" fill="#38bdf8" />

              {/* Front Bonds (Y tripod) */}
              <line x1="180" y1="135" x2="180" y2="55" stroke="#38bdf8" strokeWidth="3.5" />
              <text x="180" y="48" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">H</text>

              <line x1="180" y1="135" x2="110" y2="175" stroke="#38bdf8" strokeWidth="3.5" />
              <text x="95" y="185" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">H</text>

              {/* Front C-OH */}
              <line x1="180" y1="135" x2="250" y2="175" stroke="#f43f5e" strokeWidth="4" />
              <g transform="translate(265, 185)">
                <circle cx="0" cy="0" r="14" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">O-H</text>
              </g>

              {/* Rear Bonds */}
              {/* Rear C-OH (at 60-degree Gauche angle!) */}
              <line x1="180" y1="135" x2="250" y2="95" stroke="#f43f5e" strokeWidth="4" />
              <g transform="translate(265, 85)">
                <circle cx="0" cy="0" r="14" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">O-H</text>
              </g>

              {/* Intramolecular Hydrogen Bond Dotted Line */}
              <line x1="265" y1="99" x2="265" y2="171" stroke="#34d399" strokeWidth="3" strokeDasharray="4 3" />
              <g transform="translate(295, 135)">
                <text x="0" y="0" textAnchor="start" fill="#34d399" fontSize="10" fontWeight="bold">
                  H-Bond (···)
                </text>
                <text x="0" y="14" textAnchor="start" fill="#a7f3d0" fontSize="9">
                  5-membered ring
                </text>
              </g>

              {/* Golden Note Banner */}
              <g transform="translate(180, 235)">
                <rect x="-95" y="-12" width="190" height="24" rx="12" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">
                  Gauche conformer is MORE stable than Anti!
                </text>
              </g>
            </svg>
          )}

          {diagramType === 'amine-inversion' && (
            <svg viewBox="0 0 360 260" className="w-full max-w-[360px] select-none">
              <text x="180" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Nitrogen Umbrella Inversion (Walden-like Flip)
              </text>

              {/* Pyramidal State 1 */}
              <g transform="translate(70, 110)">
                <ellipse cx="0" cy="-35" rx="8" ry="14" fill="#3b82f6" fillOpacity="0.6" stroke="#60a5fa" />
                <circle cx="0" cy="0" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">N</text>
                <line x1="0" y1="12" x2="-25" y2="35" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="12" x2="0" y2="38" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="12" x2="25" y2="35" stroke="#94a3b8" strokeWidth="2" />
                <text x="0" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">(R)-Pyramidal</text>
              </g>

              {/* Transition State (Planar sp2) */}
              <g transform="translate(180, 95)">
                <ellipse cx="0" cy="0" rx="12" ry="32" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" />
                <circle cx="0" cy="0" r="14" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">N</text>
                <line x1="-14" y1="0" x2="-35" y2="0" stroke="#94a3b8" strokeWidth="2" />
                <line x1="14" y1="0" x2="35" y2="0" stroke="#94a3b8" strokeWidth="2" />
                <text x="0" y="50" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="bold">Planar sp² (TS, 25 kJ/mol)</text>
              </g>

              {/* Pyramidal State 2 (Inverted) */}
              <g transform="translate(290, 110)">
                <ellipse cx="0" cy="35" rx="8" ry="14" fill="#3b82f6" fillOpacity="0.6" stroke="#60a5fa" />
                <circle cx="0" cy="0" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">N</text>
                <line x1="0" y1="-12" x2="-25" y2="-35" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="-12" x2="0" y2="-38" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="-12" x2="25" y2="-35" stroke="#94a3b8" strokeWidth="2" />
                <text x="0" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">(S)-Pyramidal</text>
              </g>

              {/* Fast equilibrium double arrow */}
              <text x="125" y="115" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">⇄</text>
              <text x="235" y="115" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">⇄</text>

              <g transform="translate(180, 235)">
                <rect x="-95" y="-12" width="190" height="24" rx="12" fill="#091b2e" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                  Flip Rate &gt; 100,000 / sec (Racemic mixture!)
                </text>
              </g>
            </svg>
          )}

          {(diagramType === 'spirane' || diagramType === 'cot-tub' || diagramType === 'tbutyl-lock' || diagramType === 'generic') && (
            <svg viewBox="0 0 360 260" className="w-full max-w-[360px] select-none">
              <text x="180" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                {currentCase.iupacName.en}
              </text>

              {/* Central Schematic representation */}
              <rect x="70" y="70" width="220" height="120" rx="16" fill="#091b2e" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />

              <g transform="translate(180, 115)">
                <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <Atom className="h-6 w-6 text-cyan-300 -translate-x-3 -translate-y-3" />
                <text x="0" y="38" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                  {currentCase.formula}
                </text>
                <text x="0" y="54" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  {currentCase.commonName?.en}
                </text>
              </g>

              <g transform="translate(180, 235)">
                <rect x="-90" y="-12" width="180" height="24" rx="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">
                  Special Conformational Equilibrium
                </text>
              </g>
            </svg>
          )}
        </div>

        {/* Right Info Box */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Why This is an Exception in Exams</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentCase.exceptionMechanism?.en || currentCase.pedagogicalNote.en}
            </p>
            {currentCase.exceptionMechanism?.bn && (
              <p className="text-[11px] text-slate-400 font-bengali leading-snug border-t border-slate-800/80 pt-1.5">
                {currentCase.exceptionMechanism.bn}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 space-y-1.5 text-xs">
            <span className="font-bold text-purple-300 flex items-center gap-1 text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Key Takeaway for Students</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isOptical
                ? 'Stereocenters are NOT required for chirality; the only true necessary and sufficient condition is the ABSENCE of alternating symmetry elements (no plane σ, no inversion center i).'
                : 'Steric bulk, ring strain, and intramolecular hydrogen bonding can completely invert normal thermodynamic stability hierarchies.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
