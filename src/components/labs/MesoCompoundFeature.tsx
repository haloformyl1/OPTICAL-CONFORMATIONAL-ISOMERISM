import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Eye,
  EyeOff,
  RotateCw,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  Info,
  RefreshCw,
  Layers,
  Scale,
} from 'lucide-react';
import { BilingualText } from '../BilingualText';

export interface MesoCompoundFeatureProps {
  onClose?: () => void;
}

export type MesoPresetId = 'meso-tartaric' | 'meso-dichlorobutane' | 'meso-butanediol';

export interface MesoExampleData {
  id: MesoPresetId;
  name: { en: string; bn: string };
  iupac: string;
  formula: string;
  topGroup: string;
  bottomGroup: string;
  c2Left: string;
  c2Right: string;
  c3Left: string;
  c3Right: string;
  c2Config: 'R' | 'S';
  c3Config: 'R' | 'S';
  c2AngleContribution: string;
  c3AngleContribution: string;
  colors: {
    terminal: string;
    terminalText: string;
    c2Left: string;
    c2Right: string;
    c3Left: string;
    c3Right: string;
  };
}

export const MESO_EXAMPLES: MesoExampleData[] = [
  {
    id: 'meso-tartaric',
    name: { en: 'meso-Tartaric Acid', bn: 'মেসো-টারটারিক অ্যাসিড' },
    iupac: '(2R,3S)-2,3-Dihydroxybutanedioic acid',
    formula: 'C4H6O6',
    topGroup: 'COOH',
    bottomGroup: 'COOH',
    c2Left: 'H',
    c2Right: 'OH',
    c3Left: 'H',
    c3Right: 'OH',
    c2Config: 'R',
    c3Config: 'S',
    c2AngleContribution: '+12.7°',
    c3AngleContribution: '-12.7°',
    colors: {
      terminal: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200',
      terminalText: '#38bdf8',
      c2Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c2Right: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
      c3Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c3Right: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    },
  },
  {
    id: 'meso-dichlorobutane',
    name: { en: 'meso-2,3-Dichlorobutane', bn: 'মেসো-২,৩-ডাইক্লোরোবিউটেন' },
    iupac: '(2R,3S)-2,3-Dichlorobutane',
    formula: 'C4H8Cl2',
    topGroup: 'CH3',
    bottomGroup: 'CH3',
    c2Left: 'H',
    c2Right: 'Cl',
    c3Left: 'H',
    c3Right: 'Cl',
    c2Config: 'R',
    c3Config: 'S',
    c2AngleContribution: '+α',
    c3AngleContribution: '-α',
    colors: {
      terminal: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200',
      terminalText: '#818cf8',
      c2Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c2Right: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
      c3Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c3Right: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    },
  },
  {
    id: 'meso-butanediol',
    name: { en: 'meso-Butane-2,3-diol', bn: 'মেসো-বিউটেন-২,৩-ডাইঅল' },
    iupac: '(2R,3S)-Butane-2,3-diol',
    formula: 'C4H10O2',
    topGroup: 'CH3',
    bottomGroup: 'CH3',
    c2Left: 'H',
    c2Right: 'OH',
    c3Left: 'H',
    c3Right: 'OH',
    c2Config: 'R',
    c3Config: 'S',
    c2AngleContribution: '+13.5°',
    c3AngleContribution: '-13.5°',
    colors: {
      terminal: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200',
      terminalText: '#818cf8',
      c2Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c2Right: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
      c3Left: 'bg-slate-700/60 border-slate-500/50 text-white',
      c3Right: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    },
  },
];

export const MesoCompoundFeature: React.FC<MesoCompoundFeatureProps> = () => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const currentExample = MESO_EXAMPLES[selectedExampleIndex];

  // Feature 2: Plane of Symmetry (sigma) visualizer
  const [showPOS, setShowPOS] = useState<boolean>(true);
  const [highlightPulse, setHighlightPulse] = useState<boolean>(false);

  // Feature 4: "Prove It" Superimpose Animation
  // Phase 0: Initial side-by-side (Isomer A and Mirror Isomer B)
  // Phase 1: 180° rotation of Isomer B in-plane
  // Phase 2: Translation / sliding Isomer B to overlay onto Isomer A
  // Phase 3: Snapped 100% Superimposed
  const [superimposePhase, setSuperimposePhase] = useState<number>(0); // 0, 1, 2, 3
  const [isSuperimposing, setIsSuperimposing] = useState<boolean>(false);
  const [rotationB, setRotationB] = useState<number>(0); // 0 to 180 deg
  const [slideX, setSlideX] = useState<number>(0); // 0 to 100% progress
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger pulse effect when POS is revealed
  useEffect(() => {
    if (showPOS) {
      setHighlightPulse(true);
      const timer = setTimeout(() => setHighlightPulse(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [showPOS, selectedExampleIndex]);

  // Handle Prove-It 180° Flip & Superimpose animation sequence
  const startSuperimposeAnimation = () => {
    if (isSuperimposing) return;
    setIsSuperimposing(true);
    setSuperimposePhase(1);

    // Step 1: Smooth 180 degree rotation of Isomer B (1.2s)
    let startTime: number | null = null;
    const rotDuration = 1200;

    const rotStep = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min(1, (now - startTime) / rotDuration);
      // easeInOutCubic
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setRotationB(eased * 180);

      if (progress < 1) {
        requestAnimationFrame(rotStep);
      } else {
        setRotationB(180);
        setSuperimposePhase(2);

        // Step 2: Smooth translation towards Isomer A (1.2s)
        let slideStartTime: number | null = null;
        const slideDuration = 1200;

        const slideStep = (sNow: number) => {
          if (slideStartTime === null) slideStartTime = sNow;
          const sProgress = Math.min(1, (sNow - slideStartTime) / slideDuration);
          const sEased = sProgress < 0.5 ? 2 * sProgress * sProgress : 1 - Math.pow(-2 * sProgress + 2, 2) / 2;
          setSlideX(sEased);

          if (sProgress < 1) {
            requestAnimationFrame(slideStep);
          } else {
            setSlideX(1);
            setSuperimposePhase(3);
            setIsSuperimposing(false);
          }
        };

        requestAnimationFrame(slideStep);
      }
    };

    requestAnimationFrame(rotStep);
  };

  const resetSuperimposeAnimation = () => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setIsSuperimposing(false);
    setSuperimposePhase(0);
    setRotationB(0);
    setSlideX(0);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#030914] text-slate-100 p-3 sm:p-5 lg:p-6 overflow-y-auto space-y-6">
      {/* Top Header & Meso Compound Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3 w-3" />
              <span>MESO SHORTCUT ENGINE</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Plane of Symmetry (σ) &amp; Internal Cancellation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
            <BilingualText
              en="Meso Compound &amp; Plane of Symmetry (σ) Shortcut"
              bn="মেসো যৌগ ও প্রতিসাম্য তল (σ) শর্টকাট"
            />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            <BilingualText
              en="Two foolproof shortcuts to instantly identify superimposable mirror images without complex 3D mental rotation!"
              bn="কঠিন ত্রিমাত্রিক মানসিক ঘূর্ণন ছাড়াই নিমেষে উপরিপাতযোগ্য মেসো যৌগ শনাক্ত করার দুটি অব্যর্থ শর্টকাট!"
            />
          </p>
        </div>

        {/* Meso Compound Example Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-700 bg-slate-900/90 p-1 text-xs">
            {MESO_EXAMPLES.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  setSelectedExampleIndex(idx);
                  resetSuperimposeAnimation();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border-0 ${
                  selectedExampleIndex === idx
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BilingualText en={ex.name.en} bn={ex.name.bn} />
              </button>
            ))}
          </div>

          {/* Plane of Symmetry Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPOS(!showPOS)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              showPOS
                ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
            title="Reveal the Internal Mirror Plane of Symmetry"
          >
            {showPOS ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
            <span>{showPOS ? 'Plane of Symmetry (σ) ON' : 'Reveal Plane of Symmetry (σ)'}</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC PRO-TIP SLIDE-IN POPUP (Feature 3) */}
      <AnimatePresence>
        {showPOS && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full p-4 rounded-2xl border-2 border-emerald-400/70 bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 shadow-[0_0_24px_rgba(16,185,129,0.25)] relative overflow-hidden"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shrink-0 shadow-inner">
                <Zap className="h-6 w-6 text-emerald-300 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                    EXAM PRO-TIP ⚡ SHORTCUT #1
                  </span>
                  <span className="text-xs text-emerald-200 font-bold">No Mental 3D Rotation Needed!</span>
                </div>
                <p className="text-sm font-semibold text-emerald-100 leading-relaxed">
                  &ldquo;Struggling to rotate this in your head? Look for the Plane of Symmetry! If the top half matches the bottom half, the mirror image is always an identical clone (Meso Compound). No mental rotation required!&rdquo;
                </p>
                <p className="text-xs text-emerald-300/80 pt-0.5 font-mono">
                  পরীক্ষার শর্টকাট: অণুটি মনে মনে ৩ডিতে না ঘুরিয়ে প্রতিসাম্য তল (σ) খুঁজুন! উপর ও নিচ হুবহু এক হলে দর্পণ প্রতিবিম্ব সবসময় সমাপতিত ক্লোন (মেসো যৌগ)।
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN TWO-COLUMN WORKSPACE: 2D PROJECTION & PROVE-IT SUPERIMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* COLUMN 1: INTERACTIVE 2D FISCHER & INTERNAL MIRROR VISUALIZER */}
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-[#071322] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                1. The Internal Mirror Blueprint
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{currentExample.name.en}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">({currentExample.formula})</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ACHIRAL MESO
            </span>
          </div>

          {/* DYNAMIC CIP R/S CANCELLATION MATH EQUATION BAR (Feature 2) */}
          <div className="mb-4 p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-200">
                Optical Cancellation Law:
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-extrabold text-white">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                C2: ({currentExample.c2Config})
              </span>
              <span className="text-emerald-400">+</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-purple-300">
                C3: ({currentExample.c3Config})
              </span>
              <span className="text-emerald-400">=</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-black shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                0° (Optically Inactive)
              </span>
            </div>
          </div>

          {/* SVG FISCHER PROJECTION CANVAS WITH GLOWING POS PLANE */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 relative min-h-[340px]">
            {/* Top Half Highlight Pulse Envelope */}
            <motion.div
              animate={{
                opacity: showPOS && highlightPulse ? [0.2, 0.65, 0.2] : 0,
              }}
              transition={{ duration: 1.6, repeat: highlightPulse ? 1 : 0 }}
              className="absolute top-8 inset-x-8 h-[120px] rounded-xl bg-cyan-500/15 border border-cyan-400/40 pointer-events-none"
            />

            {/* Bottom Half Highlight Pulse Envelope */}
            <motion.div
              animate={{
                opacity: showPOS && highlightPulse ? [0.2, 0.65, 0.2] : 0,
              }}
              transition={{ duration: 1.6, repeat: highlightPulse ? 1 : 0 }}
              className="absolute bottom-8 inset-x-8 h-[120px] rounded-xl bg-purple-500/15 border border-purple-400/40 pointer-events-none"
            />

            <svg width="340" height="320" viewBox="0 0 340 320" className="overflow-visible relative z-10">
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Vertical Carbon Backbone Line */}
              <line x1="170" y1="36" x2="170" y2="284" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

              {/* Top Terminal Group (e.g. -COOH) */}
              <g>
                <rect
                  x="125"
                  y="12"
                  width="90"
                  height="34"
                  rx="10"
                  className={currentExample.colors.terminal}
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text
                  x="170"
                  y="34"
                  fill="#7dd3fc"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {currentExample.topGroup}
                </text>
              </g>

              {/* C2 Horizontal Rung at y = 95 */}
              <g>
                <line x1="60" y1="95" x2="280" y2="95" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                {/* Central C2 Stereocenter */}
                <circle cx="170" cy="95" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="170" y="82" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  C2* (R)
                </text>

                {/* C2 Left Ligand */}
                <rect x="25" y="78" width="46" height="34" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="48" y="100" fill="#f8fafc" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {currentExample.c2Left}
                </text>

                {/* C2 Right Ligand */}
                <rect x="268" y="78" width="50" height="34" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                <text x="293" y="100" fill="#fecdd3" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {currentExample.c2Right}
                </text>
              </g>

              {/* C3 Horizontal Rung at y = 225 */}
              <g>
                <line x1="60" y1="225" x2="280" y2="225" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                {/* Central C3 Stereocenter */}
                <circle cx="170" cy="225" r="9" fill="#7e22ce" stroke="#c084fc" strokeWidth="2.5" />
                <text x="170" y="246" fill="#d8b4fe" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  C3* (S)
                </text>

                {/* C3 Left Ligand */}
                <rect x="25" y="208" width="46" height="34" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="48" y="230" fill="#f8fafc" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {currentExample.c3Left}
                </text>

                {/* C3 Right Ligand */}
                <rect x="268" y="208" width="50" height="34" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                <text x="293" y="230" fill="#fecdd3" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {currentExample.c3Right}
                </text>
              </g>

              {/* Bottom Terminal Group (e.g. -COOH) */}
              <g>
                <rect
                  x="125"
                  y="274"
                  width="90"
                  height="34"
                  rx="10"
                  className={currentExample.colors.terminal}
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text
                  x="170"
                  y="296"
                  fill="#7dd3fc"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {currentExample.bottomGroup}
                </text>
              </g>

              {/* FEATURE 2: INTERNAL MIRROR PLANE OF SYMMETRY (σ) CUTTING CENTRAL C2-C3 BOND */}
              {showPOS && (
                <g filter="url(#neon-glow)">
                  {/* Neon Green Glowing Horizontal Dashed Line at y = 160 */}
                  <line
                    x1="10"
                    y1="160"
                    x2="330"
                    y2="160"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray="8,5"
                    className="animate-pulse"
                  />
                  {/* Plane Label Badge */}
                  <rect x="75" y="146" width="190" height="28" rx="8" fill="#022c22" stroke="#34d399" strokeWidth="2" />
                  <text
                    x="170"
                    y="165"
                    fill="#6ee7b7"
                    fontSize="11"
                    fontWeight="black"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    PLANE OF SYMMETRY (σ) 🪞
                  </text>

                  {/* Top / Bottom Reflection Arrows */}
                  <path d="M 290 142 L 290 120" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrow)" />
                  <path d="M 290 178 L 290 200" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrow)" />
                </g>
              )}
            </svg>

            {/* Reflection Verification Legend */}
            {showPOS && (
              <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Top Half = Bottom Half Reflection</span>
                </span>
                <span className="text-slate-400">
                  Internal Compensation: Net [α] = 0.0°
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: THE "PROVE IT" SUPERIMPOSITION ANIMATION (Feature 4) */}
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-[#071322] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                2. The &ldquo;Prove It&rdquo; Superimposition Test
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>Split-Screen: Original A vs Mirror Image B</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startSuperimposeAnimation}
                disabled={isSuperimposing || superimposePhase === 3}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  superimposePhase === 3
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-purple-400 bg-purple-500/25 text-purple-200 hover:bg-purple-500/35 hover:border-purple-300'
                }`}
                title="Rotate 180° like a steering wheel and slide to superimpose"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isSuperimposing ? 'animate-spin' : ''}`} />
                <span>
                  {superimposePhase === 3
                    ? '✓ Superimposed!'
                    : isSuperimposing
                    ? 'Superimposing...'
                    : 'Auto-Superimpose (180° Flip)'}
                </span>
              </button>

              <button
                type="button"
                onClick={resetSuperimposeAnimation}
                className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Reset animation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Superimposition Stage Visualizer */}
          <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 relative min-h-[340px] overflow-hidden">
            {/* Verdict Banner on 100% Superposition Success */}
            <AnimatePresence>
              {superimposePhase === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-3 inset-x-4 z-30 p-2.5 rounded-xl border-2 border-emerald-400 bg-emerald-950/95 text-center shadow-[0_0_20px_rgba(52,211,153,0.4)] backdrop-blur-md"
                >
                  <span className="text-xs sm:text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Superimposable = Identical (Achiral Homomer)</span>
                  </span>
                  <p className="text-[11px] text-emerald-200/90 font-mono mt-0.5">
                    180° in-plane flip + horizontal slide matched every single bond 100%!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Split Screen Stage */}
            <div className="relative h-64 w-full flex items-center justify-around">
              {/* Left Molecule: Isomer A (Stationary Target) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 mb-2">
                  Isomer A (Original)
                </span>
                <div className="relative w-36 h-48 border border-cyan-500/20 bg-slate-900/60 rounded-xl flex items-center justify-center shadow-inner">
                  {/* Miniature Fischer Cross A */}
                  <svg width="120" height="150" viewBox="0 0 120 150">
                    <line x1="60" y1="18" x2="60" y2="132" stroke="#64748b" strokeWidth="3" />
                    {/* Top COOH */}
                    <text x="60" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {currentExample.topGroup}
                    </text>
                    {/* C2 Rung */}
                    <line x1="22" y1="52" x2="98" y2="52" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="60" cy="52" r="4" fill="#0284c7" />
                    <text x="14" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c2Left}
                    </text>
                    <text x="106" y="56" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c2Right}
                    </text>
                    {/* C3 Rung */}
                    <line x1="22" y1="98" x2="98" y2="98" stroke="#a855f7" strokeWidth="2.5" />
                    <circle cx="60" cy="98" r="4" fill="#7e22ce" />
                    <text x="14" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c3Left}
                    </text>
                    <text x="106" y="102" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c3Right}
                    </text>
                    {/* Bottom COOH */}
                    <text x="60" y="144" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {currentExample.bottomGroup}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Central Mirror Plane Divider (Fades out when superimposing) */}
              <motion.div
                animate={{ opacity: slideX > 0.1 ? 0 : 1 }}
                className="flex flex-col items-center justify-center gap-1 z-10"
              >
                <div className="w-0.5 h-36 bg-gradient-to-b from-purple-500/10 via-purple-400 to-purple-500/10" />
                <span className="text-[9px] font-mono font-bold text-purple-300 uppercase rotate-90 my-2">
                  Mirror
                </span>
                <div className="w-0.5 h-36 bg-gradient-to-b from-purple-500/10 via-purple-400 to-purple-500/10" />
              </motion.div>

              {/* Right Molecule: Isomer B (Reflected Mirror Image that flips and slides) */}
              <motion.div
                className="flex flex-col items-center"
                style={{
                  transform: `translateX(-${slideX * 180}px)`,
                }}
              >
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 mb-2"
                  style={{ opacity: Math.max(0, 1 - slideX * 1.5) }}
                >
                  Isomer B (Mirror Image)
                </span>
                <div
                  className="relative w-36 h-48 border border-purple-500/30 bg-slate-900/60 rounded-xl flex items-center justify-center shadow-inner transition-colors duration-300"
                  style={{
                    transform: `rotate(${rotationB}deg)`,
                    borderColor: superimposePhase === 3 ? '#34d399' : undefined,
                    boxShadow: superimposePhase === 3 ? '0 0 20px rgba(52,211,153,0.5)' : undefined,
                  }}
                >
                  {/* Miniature Fischer Cross B (Reflected initially: OH on Left, H on Right) */}
                  <svg width="120" height="150" viewBox="0 0 120 150">
                    <line x1="60" y1="18" x2="60" y2="132" stroke="#64748b" strokeWidth="3" />
                    {/* Top COOH */}
                    <text x="60" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {currentExample.topGroup}
                    </text>
                    {/* C2 Rung (Reflected: OH left, H right) */}
                    <line x1="22" y1="52" x2="98" y2="52" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="60" cy="52" r="4" fill="#0284c7" />
                    <text x="14" y="56" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c2Right}
                    </text>
                    <text x="106" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c2Left}
                    </text>
                    {/* C3 Rung (Reflected: OH left, H right) */}
                    <line x1="22" y1="98" x2="98" y2="98" stroke="#a855f7" strokeWidth="2.5" />
                    <circle cx="60" cy="98" r="4" fill="#7e22ce" />
                    <text x="14" y="102" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c3Right}
                    </text>
                    <text x="106" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      {currentExample.c3Left}
                    </text>
                    {/* Bottom COOH */}
                    <text x="60" y="144" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {currentExample.bottomGroup}
                    </text>
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Animation Step Narrative Timeline */}
            <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Phase {superimposePhase + 1} of 4:
              </span>
              <span className="font-bold text-cyan-300">
                {superimposePhase === 0 && 'Side-by-side mirror reflection generated'}
                {superimposePhase === 1 && `Rotating Molecule B in-plane (${Math.round(rotationB)}°)`}
                {superimposePhase === 2 && 'Sliding B horizontally onto A'}
                {superimposePhase === 3 && '✓ 100% Superimposition Match!'}
              </span>
              <span className="text-[10px] text-slate-500">
                {superimposePhase === 3 ? 'Identical Homomer' : 'Testing Chirality'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY COMPARISON CHEAT-SHEET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            <span>Shortcut #1: The Internal Mirror Plane (σ)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In Fischer projection, if top terminal group equals bottom terminal group and left/right groups reflect symmetrically across the center, the molecule has an internal plane of symmetry. <strong>Result: Achiral Meso (Always Optically Inactive).</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <RotateCw className="h-4 w-4" />
            <span>Shortcut #2: The 180° In-Plane Flip</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rotating any valid Fischer projection 180° in the plane of the screen preserves configuration. If a reflected mirror image after 180° in-plane rotation becomes identical to the original, they are <strong>Superimposable Homomers</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
