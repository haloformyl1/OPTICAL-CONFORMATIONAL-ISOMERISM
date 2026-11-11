import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  RotateCcw,
  RotateCw,
  Scissors,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { BilingualText } from '../BilingualText';

export type Position = 'top' | 'bottom' | 'left' | 'right';

export interface GroupItem {
  id: string;
  formula: string;
  name: { en: string; bn: string };
  cipPriority: number; // 1 = highest, 4 = lowest
  atomicDetails: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgClass: string;
  badgeHex: string;
}

export interface MoleculePreset {
  id: string;
  name: { en: string; bn: string };
  formula: string;
  iupac: string;
  description: { en: string; bn: string };
  initialGroups: Record<Position, GroupItem>;
}

// Preset 1: (2R)-Lactic Acid (as explicitly requested: -COOH top, -CH3 bottom, -OH right, -H left)
const LACTIC_ACID_PRESET: MoleculePreset = {
  id: 'lactic-acid',
  name: { en: '(R)-Lactic Acid', bn: '(R)-ল্যাকটিক অ্যাসিড' },
  formula: 'C3H6O3',
  iupac: '2-Hydroxypropanoic acid',
  description: {
    en: 'Classic chiral hydroxy acid with 4 distinct groups: -OH (1), -COOH (2), -CH3 (3), -H (4).',
    bn: '৪টি পৃথক গ্রুপযুক্ত ক্লাসিক কাইরাল হাইড্রক্সি অ্যাসিড: -OH (১), -COOH (২), -CH3 (৩), -H (৪)।',
  },
  initialGroups: {
    top: {
      id: 'cooh',
      formula: 'COOH',
      name: { en: 'Carboxylic Acid', bn: 'কার্বক্সিলিক অ্যাসিড' },
      cipPriority: 2,
      atomicDetails: 'C bonded to (O, O, O) (Z=6)',
      color: '#06b6d4',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-500/50',
      bgClass: 'bg-cyan-500/20 shadow-[0_0_16px_rgba(6,182,212,0.25)]',
      badgeHex: '#06b6d4',
    },
    bottom: {
      id: 'ch3',
      formula: 'CH3',
      name: { en: 'Methyl Group', bn: 'মিথাইল গ্রুপ' },
      cipPriority: 3,
      atomicDetails: 'C bonded to (H, H, H) (Z=6)',
      color: '#6366f1',
      textColor: 'text-indigo-300',
      borderColor: 'border-indigo-500/50',
      bgClass: 'bg-indigo-500/20 shadow-[0_0_16px_rgba(99,102,241,0.25)]',
      badgeHex: '#6366f1',
    },
    right: {
      id: 'oh',
      formula: 'OH',
      name: { en: 'Hydroxyl Group', bn: 'হাইড্রক্সিল গ্রুপ' },
      cipPriority: 1,
      atomicDetails: 'Oxygen atom (Z=8, Highest)',
      color: '#f43f5e',
      textColor: 'text-rose-300',
      borderColor: 'border-rose-500/50',
      bgClass: 'bg-rose-500/20 shadow-[0_0_16px_rgba(244,63,94,0.25)]',
      badgeHex: '#f43f5e',
    },
    left: {
      id: 'h',
      formula: 'H',
      name: { en: 'Hydrogen Atom', bn: 'হাইড্রোজেন পরমাণু' },
      cipPriority: 4,
      atomicDetails: 'Hydrogen atom (Z=1, Lowest)',
      color: '#f8fafc',
      textColor: 'text-white',
      borderColor: 'border-slate-400/60',
      bgClass: 'bg-slate-700/60 shadow-[0_0_16px_rgba(248,250,252,0.15)]',
      badgeHex: '#94a3b8',
    },
  },
};

// Preset 2: 1-Bromo-1-chloroethanol / 1-Bromo-1-chloromethan-1-ol
const HALO_ALCOHOL_PRESET: MoleculePreset = {
  id: 'halo-alcohol',
  name: { en: '1-Bromo-1-chloromethan-1-ol', bn: '১-ব্রোমো-১-ক্লোরোমিথান-১-অল' },
  formula: 'CH2BrClO',
  iupac: 'Bromochloromethanol',
  description: {
    en: 'Tetra-halogenated alcohol with Br (1), Cl (2), OH (3), and H (4).',
    bn: 'ব্রোমিন (১), ক্লোরিন (২), হাইড্রক্সিল (৩) ও হাইড্রোজেন (৪) যুক্ত কাইরাল মিথানল।',
  },
  initialGroups: {
    top: {
      id: 'cl',
      formula: 'Cl',
      name: { en: 'Chlorine', bn: 'ক্লোরিন' },
      cipPriority: 2,
      atomicDetails: 'Chlorine atom (Z=17)',
      color: '#10b981',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/50',
      bgClass: 'bg-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
      badgeHex: '#10b981',
    },
    bottom: {
      id: 'oh',
      formula: 'OH',
      name: { en: 'Hydroxyl', bn: 'হাইড্রক্সিল' },
      cipPriority: 3,
      atomicDetails: 'Oxygen atom (Z=8)',
      color: '#f43f5e',
      textColor: 'text-rose-300',
      borderColor: 'border-rose-500/50',
      bgClass: 'bg-rose-500/20 shadow-[0_0_16px_rgba(244,63,94,0.25)]',
      badgeHex: '#f43f5e',
    },
    right: {
      id: 'br',
      formula: 'Br',
      name: { en: 'Bromine', bn: 'ব্রোমিন' },
      cipPriority: 1,
      atomicDetails: 'Bromine atom (Z=35, Highest)',
      color: '#dc2626',
      textColor: 'text-red-300',
      borderColor: 'border-red-500/50',
      bgClass: 'bg-red-500/20 shadow-[0_0_16px_rgba(220,38,38,0.25)]',
      badgeHex: '#dc2626',
    },
    left: {
      id: 'h',
      formula: 'H',
      name: { en: 'Hydrogen', bn: 'হাইড্রোজেন' },
      cipPriority: 4,
      atomicDetails: 'Hydrogen atom (Z=1, Lowest)',
      color: '#f8fafc',
      textColor: 'text-white',
      borderColor: 'border-slate-400/60',
      bgClass: 'bg-slate-700/60 shadow-[0_0_16px_rgba(248,250,252,0.15)]',
      badgeHex: '#94a3b8',
    },
  },
};

const PRESETS = [LACTIC_ACID_PRESET, HALO_ALCOHOL_PRESET];

const POS_COORDS: Record<Position, [number, number]> = {
  top: [0, 1],
  right: [1, 0],
  bottom: [0, -1],
  left: [-1, 0],
};

export interface CIPCalculation {
  configuration: 'R' | 'S';
  prio4Position: Position;
  isP4Horizontal: boolean;
  apparentDirection: 'Clockwise' | 'Counter-Clockwise';
  crossProduct: number;
  explanation: { en: string; bn: string };
}

/**
 * Mathematically calculates the CIP (R)/(S) configuration for any 4-group assignment on a Fischer cross
 */
export const calculateCIP = (groups: Record<Position, GroupItem>): CIPCalculation => {
  let p1Pos: Position = 'right';
  let p2Pos: Position = 'top';
  let p3Pos: Position = 'bottom';
  let p4Pos: Position = 'left';

  (Object.keys(groups) as Position[]).forEach((pos) => {
    const p = groups[pos].cipPriority;
    if (p === 1) p1Pos = pos;
    if (p === 2) p2Pos = pos;
    if (p === 3) p3Pos = pos;
    if (p === 4) p4Pos = pos;
  });

  const [x1, y1] = POS_COORDS[p1Pos];
  const [x2, y2] = POS_COORDS[p2Pos];
  const [x3, y3] = POS_COORDS[p3Pos];

  // 2D Cross product of (P2 - P1) and (P3 - P2) in Cartesian coords
  const cross = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2);
  const apparentDirection = cross < 0 ? 'Clockwise' : 'Counter-Clockwise';
  const isP4Horizontal = p4Pos === 'left' || p4Pos === 'right';

  let config: 'R' | 'S';
  if (isP4Horizontal) {
    // Priority 4 is on a horizontal bond pointing towards the viewer: reverse apparent result!
    config = apparentDirection === 'Clockwise' ? 'S' : 'R';
  } else {
    // Priority 4 is on a vertical bond pointing away from the viewer: keep apparent result!
    config = apparentDirection === 'Clockwise' ? 'R' : 'S';
  }

  const p4Group = groups[p4Pos];

  const explanation = {
    en: isP4Horizontal
      ? `Priority 4 (${p4Group.formula}) is on a HORIZONTAL rung pointing TOWARDS you. Apparent ${apparentDirection} traces ${apparentDirection === 'Clockwise' ? 'R' : 'S'}, but the Golden Fischer Rule reverses it → (${config})!`
      : `Priority 4 (${p4Group.formula}) is on a VERTICAL rung pointing AWAY from you. Apparent ${apparentDirection} traces directly → (${config})!`,
    bn: isP4Horizontal
      ? `সর্বনিম্ন অগ্রাধিকার ৪ (${p4Group.formula}) অনুভূমিক বন্ধনে (সামনে) রয়েছে। আপাত ${apparentDirection === 'Clockwise' ? 'ঘড়ির কাঁটার দিকে' : 'বিপরীত দিকে'} হলেও গোল্ডেন ফিশার নিয়ম অনুযায়ী উল্টে গিয়ে হয় → (${config})!`
      : `সর্বনিম্ন অগ্রাধিকার ৪ (${p4Group.formula}) উল্লম্ব বন্ধনে (পিছনে) রয়েছে। সরাসরি পর্যবেক্ষণ অনুযায়ী ফলাফল → (${config})!`,
  };

  return {
    configuration: config,
    prio4Position: p4Pos,
    isP4Horizontal,
    apparentDirection,
    crossProduct: cross,
    explanation,
  };
};

export const ChiralLockLab: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = PRESETS[activePresetIndex];

  // Current positions of the four groups
  const [groups, setGroups] = useState<Record<Position, GroupItem>>(() => ({
    ...activePreset.initialGroups,
  }));

  // Track operations
  const [bondsBrokenCount, setBondsBrokenCount] = useState(0);
  const [singleBondRotationsCount, setSingleBondRotationsCount] = useState(0);
  const [flips180Count, setFlips180Count] = useState(0);

  // Active animation trigger
  const [animationMode, setAnimationMode] = useState<null | 'propeller' | 'saw' | 'flip180'>(null);
  const [activeNotification, setActiveNotification] = useState<{
    type: 'success' | 'danger' | 'info';
    title: { en: string; bn: string };
    desc: { en: string; bn: string };
  } | null>(null);

  // Total in-plane rotation angle for visual 180° flip
  const [totalRotationDeg, setTotalRotationDeg] = useState(0);

  // Initial reference configuration for comparison
  const initialCIP = useMemo(() => calculateCIP(activePreset.initialGroups), [activePreset]);

  // Current real-time CIP calculation
  const currentCIP = useMemo(() => calculateCIP(groups), [groups]);

  // Check if current matches starting isomer
  const isEnantiomer = currentCIP.configuration !== initialCIP.configuration;

  // Reset when preset changes
  useEffect(() => {
    setGroups({ ...activePreset.initialGroups });
    setBondsBrokenCount(0);
    setSingleBondRotationsCount(0);
    setFlips180Count(0);
    setTotalRotationDeg(0);
    setAnimationMode(null);
    setActiveNotification(null);
  }, [activePreset]);

  // Clear animation mode after duration
  useEffect(() => {
    if (!animationMode) return;
    const timer = setTimeout(() => {
      setAnimationMode(null);
    }, 900);
    return () => clearTimeout(timer);
  }, [animationMode]);

  // =========================================================================
  // INTERACTION 1: "The Propeller Spin" (Free Rotation / Single Bond Rotation)
  // Holds Top Group completely fixed, rotates bottom 3 groups counter-clockwise
  // =========================================================================
  const handlePropellerSpin = () => {
    setAnimationMode('propeller');
    setSingleBondRotationsCount((prev) => prev + 1);

    // Counter-clockwise cycle of the 3 bottom positions:
    // Left receives Right
    // Bottom receives Left
    // Right receives Bottom
    // Top remains completely fixed!
    setGroups((prev) => ({
      top: prev.top, // Fixed pivot!
      left: prev.right,
      bottom: prev.left,
      right: prev.bottom,
    }));

    setActiveNotification({
      type: 'success',
      title: {
        en: '✓ Single Bonds Rotated! Configuration Unchanged',
        bn: '✓ একক বন্ধন আবর্তিত! কনফিগারেশন অপরিবর্তিত',
      },
      desc: {
        en: 'The top bond remained locked as a pivot axis. A rigid 3D tripod rotation breaks 0 bonds, so the (R)/(S) configuration is strictly preserved (Identical Homomer)!',
        bn: 'উপরের বন্ধনটি স্থির অক্ষে আটকানো ছিল। ৩ডি ট্রাইপড ঘূর্ণনে কোনো বন্ধন ভাঙেনি, তাই (R)/(S) কনফিগারেশন সম্পূর্ণ অপরিবর্তিত থাকে (অভিন্ন হোমোমার)!',
      },
    });
  };

  // =========================================================================
  // INTERACTION 2: "The Chemical Saw" (Bond Breaking/Swapping)
  // Breaks left and right horizontal bonds, swaps them, and reattaches them
  // =========================================================================
  const handleHorizontalSwap = () => {
    setAnimationMode('saw');
    setBondsBrokenCount((prev) => prev + 1);

    // Swap horizontal groups (1 odd transposition)
    setGroups((prev) => ({
      top: prev.top,
      bottom: prev.bottom,
      left: prev.right,
      right: prev.left,
    }));

    setActiveNotification({
      type: 'danger',
      title: {
        en: '⚡ Bonds Broken! Enantiomer Created.',
        bn: '⚡ বন্ধন ভাঙা হয়েছে! এন্যানশিওমার তৈরি হয়েছে।',
      },
      desc: {
        en: 'Two covalent bonds were physically cleaved and reformed in swapped positions (1 Swap). Chirality inverted from (R) ⇄ (S) into its non-superimposable mirror image (Enantiomer)!',
        bn: 'দুটি সমযোজী বন্ধন ভেঙে স্থান পরিবর্তন করে পুনঃসংযুক্ত করা হয়েছে (১টি অদলবদল)। কাইরালিটি (R) ⇄ (S) এ পরিবর্তিত হয়ে এন্যানশিওমার সৃষ্টি করেছে!',
      },
    });
  };

  // =========================================================================
  // INTERACTION 3: "The 180° Plane Flip" (Proving Identity)
  // Rotates the entire Fischer projection by 180° in the plane
  // =========================================================================
  const handle180PlaneFlip = () => {
    setAnimationMode('flip180');
    setFlips180Count((prev) => prev + 1);
    setTotalRotationDeg((prev) => prev + 180);

    // 180° in-plane flip swaps top <-> bottom AND left <-> right (2 simultaneous swaps = even parity!)
    setGroups((prev) => ({
      top: prev.bottom,
      bottom: prev.top,
      left: prev.right,
      right: prev.left,
    }));

    setActiveNotification({
      type: 'info',
      title: {
        en: '🔄 Molecule Rotated 180° in Plane! Identity Preserved',
        bn: '🔄 অণুটি ১৮০° সমতলে আবর্তিত! অভিন্নতা সংরক্ষিত',
      },
      desc: {
        en: 'Spinning a Fischer projection 180° in the plane is an allowed operation (equivalent to 2 simultaneous swaps: Top-Bottom and Left-Right). The resulting molecule is 100% superimposable (Identical)!',
        bn: 'ফিশার প্রজেকশন ১৮০° সমতলে ঘোরানো একটি বৈধ নিয়ম (এটি একই সাথে দুটি অদলবদল: উপর-নিচ ও বাম-ডান)। প্রাপ্ত অণুটি সম্পূর্ণ উপরিপাতযোগ্য (অভিন্ন)!',
      },
    });
  };

  // Reset to initial state
  const handleReset = () => {
    setGroups({ ...activePreset.initialGroups });
    setBondsBrokenCount(0);
    setSingleBondRotationsCount(0);
    setFlips180Count(0);
    setTotalRotationDeg(0);
    setAnimationMode(null);
    setActiveNotification(null);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#040d1a] text-slate-100 p-3 sm:p-5 lg:p-6 overflow-y-auto space-y-6">
      {/* Top Banner & Molecule Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="h-3 w-3" />
              <span>THE CHIRAL LOCK</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Fischer Operations & (R)/(S) Invariance
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            <BilingualText
              en="Stereocenter 'Physical Lock' Simulator"
              bn="স্টেরিওসেন্টার 'ফিজিক্যাল লক' সিমুলেটর"
            />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            <BilingualText
              en="Prove that rotating single bonds preserves (R)/(S) configuration, while breaking bonds inverts it."
              bn="প্রমাণ করুন যে একক বন্ধন ঘূর্ণন (R)/(S) কনফিগারেশন অপরিবর্তিত রাখে, যেখানে বন্ধন ভাঙন এটিকে এন্যানশিওমারে রূপান্তরিত করে।"
            />
          </p>
        </div>

        {/* Preset Selector & Reset Button */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-700 bg-slate-900/90 p-1 text-xs">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePresetIndex(idx)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border-0 ${
                  activePresetIndex === idx
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BilingualText en={preset.name.en} bn={preset.name.bn} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer shadow-sm"
            title="Reset to Initial Configuration"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              <BilingualText en="Reset" bn="রিসেট" />
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Stage (Center/Left) + Stereocenter Status Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: INTERACTIVE FISCHER PROJECTION STAGE              */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
          {/* Subtle Background Circuit Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* Educational Tooltip Banner: "Rule: 1 Swap = Enantiomer. 3-Group Rotation = Identical." */}
          <div className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-semibold mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>
                  <BilingualText en="Golden Stereochemistry Rule:" bn="স্টেরিওরসায়নের সোনালী সূত্র:" />
                </strong>{' '}
                <span className="font-mono text-amber-300">
                  <BilingualText
                    en="1 Swap = Enantiomer (Inversion). 3-Group Rotation = Identical Homomer."
                    bn="১টি অদলবদল = এন্যানশিওমার। ৩-গ্রুপ ঘূর্ণন = অভিন্ন হোমোমার।"
                  />
                </span>
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
              Exam Core
            </span>
          </div>

          {/* Interactive Floating Alert Notifications */}
          <AnimatePresence mode="wait">
            {activeNotification && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`w-full p-3 mb-4 rounded-2xl border text-xs font-medium flex items-start gap-2.5 shadow-lg ${
                  activeNotification.type === 'danger'
                    ? 'border-rose-500/60 bg-rose-950/80 text-rose-200'
                    : activeNotification.type === 'success'
                    ? 'border-emerald-500/60 bg-emerald-950/80 text-emerald-200'
                    : 'border-blue-500/60 bg-blue-950/80 text-blue-200'
                }`}
              >
                {activeNotification.type === 'danger' && (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                )}
                {activeNotification.type === 'success' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {activeNotification.type === 'info' && (
                  <RotateCw className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    <BilingualText
                      en={activeNotification.title.en}
                      bn={activeNotification.title.bn}
                    />
                  </div>
                  <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                    <BilingualText
                      en={activeNotification.desc.en}
                      bn={activeNotification.desc.bn}
                    />
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central 2D Fischer Projection Visualizer */}
          <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center my-4 select-none">
            {/* 180° In-Plane Rotating SVG Cross Canvas */}
            <motion.div
              animate={{ rotate: totalRotationDeg }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* SVG Bonds & Chiral Axes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                  {/* Glowing Filter for Active Bonds */}
                  <filter id="glow-bond" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  {/* Laser Cut Gradient for Chemical Saw */}
                  <linearGradient id="laser-cut" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Central Cross Lines */}
                {/* Vertical Bond: Center (170, 170) -> Top (170, 50) and Bottom (170, 290) */}
                {/* Dashes representing bonds going away behind plane */}
                <line
                  x1="50%"
                  y1="50"
                  x2="50%"
                  y2="calc(100% - 50px)"
                  stroke="#475569"
                  strokeWidth="5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />

                {/* Horizontal Bond: Center (170, 170) -> Left (50, 170) and Right (290, 170) */}
                {/* Solid representing wedges coming forward out of plane */}
                <line
                  x1="50"
                  y1="50%"
                  x2="calc(100% - 50px)"
                  y2="50%"
                  stroke={animationMode === 'saw' ? '#f43f5e' : '#38bdf8'}
                  strokeWidth={animationMode === 'saw' ? '6' : '5'}
                  strokeLinecap="round"
                  filter={animationMode === 'saw' ? 'url(#glow-bond)' : undefined}
                  className="transition-colors duration-300"
                />

                {/* Chemical Saw Laser Sparks Animation when breaking horizontal bonds */}
                {animationMode === 'saw' && (
                  <g className="animate-pulse">
                    <line
                      x1="45"
                      y1="50%"
                      x2="calc(100% - 45px)"
                      y2="50%"
                      stroke="url(#laser-cut)"
                      strokeWidth="10"
                      strokeDasharray="10 6"
                    />
                    <circle cx="50%" cy="50%" r="28" fill="#f43f5e" fillOpacity="0.2" />
                  </g>
                )}

                {/* Propeller Rotation Arc Trace when rotating bottom 3 groups */}
                {animationMode === 'propeller' && (
                  <path
                    d="M 65 50% A 100 100 0 1 0 50% calc(100% - 65px) A 100 100 0 0 0 calc(100% - 65px) 50%"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-spin"
                    style={{ transformOrigin: 'center' }}
                  />
                )}
              </svg>

              {/* Central Stereocenter Carbon C* */}
              <div className="absolute z-10 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <span className="font-mono font-black text-sm text-purple-300">C*</span>
                  {/* Subtle orbiting chiral glow ring */}
                  <span className="absolute -inset-1 rounded-full border border-purple-400/40 animate-ping opacity-30 pointer-events-none" />
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-400 mt-0.5 tracking-wider">
                  Stereocenter
                </span>
              </div>

              {/* TOP GROUP: Locked Pivot when Propeller Rotating */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                {/* Padlock indicator above top group */}
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1 transition-all ${
                    animationMode === 'propeller'
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <Lock className="h-2.5 w-2.5" />
                  <span>
                    {animationMode === 'propeller' ? 'Locked Pivot' : 'Top Pivot'}
                  </span>
                </div>

                <GroupBadge group={groups.top} position="top" />
              </div>

              {/* BOTTOM GROUP */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <GroupBadge group={groups.bottom} position="bottom" />
              </div>

              {/* LEFT GROUP */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center">
                <GroupBadge group={groups.left} position="left" isSawing={animationMode === 'saw'} />
              </div>

              {/* RIGHT GROUP */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center">
                <GroupBadge group={groups.right} position="right" isSawing={animationMode === 'saw'} />
              </div>
            </motion.div>
          </div>

          {/* Bond Orientation Explainer Footnote */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800 w-full mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-slate-400 inline-block" />
              <span>
                <BilingualText en="Vertical Bonds: Going AWAY (Dashes into page)" bn="উল্লম্ব বন্ধন: দূরে যাচ্ছে (পাতার পিছনে)" />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1.5 bg-cyan-400 rounded-sm inline-block" />
              <span>
                <BilingualText en="Horizontal Bonds: Coming FORWARD (Wedges toward you)" bn="অনুভূমিক বন্ধন: সামনে আসছে (আপনার দিকে)" />
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* THREE INTERACTIVE ACTION BUTTONS                               */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-5">
            {/* Interaction 1: Propeller Spin */}
            <button
              type="button"
              onClick={handlePropellerSpin}
              className="flex flex-col items-center justify-center text-center p-3 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-900 text-purple-200 hover:border-purple-400 hover:from-purple-900/50 hover:to-slate-900 transition-all cursor-pointer shadow-lg group"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300 group-hover:text-purple-200">
                <RotateCcw className="h-4 w-4 text-purple-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>
                  <BilingualText
                    en="Rotate Single Bonds"
                    bn="একক বন্ধন আবর্তন"
                  />
                </span>
              </div>
              <span className="text-[10px] text-purple-300/80 font-mono mt-1">
                (Hold Top Group)
              </span>
              <span className="text-[9px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>0 Bonds Broken • Identical</span>
              </span>
            </button>

            {/* Interaction 2: The Chemical Saw (Bond Breaking) */}
            <button
              type="button"
              onClick={handleHorizontalSwap}
              className="flex flex-col items-center justify-center text-center p-3 rounded-2xl border border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900 text-rose-200 hover:border-rose-400 hover:from-rose-900/50 hover:to-slate-900 transition-all cursor-pointer shadow-lg group"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300 group-hover:text-rose-200">
                <Scissors className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
                <span>
                  <BilingualText
                    en="Swap Horizontal Groups"
                    bn="অনুভূমিক গ্রুপ অদলবদল"
                  />
                </span>
              </div>
              <span className="text-[10px] text-rose-300/80 font-mono mt-1">
                (Break Bonds)
              </span>
              <span className="text-[9px] text-rose-400 mt-1 font-semibold flex items-center gap-1">
                <Zap className="h-2.5 w-2.5" />
                <span>2 Bonds Broken • Enantiomer</span>
              </span>
            </button>

            {/* Interaction 3: 180° Plane Flip */}
            <button
              type="button"
              onClick={handle180PlaneFlip}
              className="flex flex-col items-center justify-center text-center p-3 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-slate-900 text-cyan-200 hover:border-cyan-400 hover:from-cyan-900/50 hover:to-slate-900 transition-all cursor-pointer shadow-lg group"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300 group-hover:text-cyan-200">
                <RotateCw className="h-4 w-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>
                  <BilingualText
                    en="Rotate Entire Molecule 180°"
                    bn="পুরো অণু ১৮০° ঘোরান"
                  />
                </span>
              </div>
              <span className="text-[10px] text-cyan-300/80 font-mono mt-1">
                (In-Plane Flip)
              </span>
              <span className="text-[9px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>Allowed Flip • Identical</span>
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: REAL-TIME STEREOCENTER STATUS PANEL              */}
        {/* ============================================================== */}
        <div className="flex flex-col space-y-4">
          {/* Main Status Header Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Real-Time Stereocenter Status</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isEnantiomer
                    ? 'border-rose-400/50 bg-rose-500/20 text-rose-300'
                    : 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isEnantiomer ? 'ENANTIOMER (INVERTED)' : 'HOMOMER (IDENTICAL)'}
              </span>
            </div>

            {/* Giant Glowing CIP Configuration Display */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <motion.div
                  key={currentCIP.configuration}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`w-18 h-18 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl border-2 ${
                    currentCIP.configuration === 'R'
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                      : 'bg-gradient-to-br from-rose-600 to-pink-700 text-white border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                  }`}
                >
                  ({currentCIP.configuration})
                </motion.div>

                <div>
                  <div className="text-sm font-black text-white">
                    {currentCIP.configuration === 'R' ? 'Rectus (Right-Handed)' : 'Sinister (Left-Handed)'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {currentCIP.apparentDirection} arc (1 → 2 → 3)
                  </div>
                  <div className="text-[11px] font-mono font-bold mt-1 text-slate-300">
                    Priority 4 ({groups[currentCIP.prio4Position].formula}) is on{' '}
                    <span
                      className={
                        currentCIP.isP4Horizontal ? 'text-amber-300' : 'text-cyan-300'
                      }
                    >
                      {currentCIP.isP4Horizontal ? 'HORIZONTAL rung (Wedge)' : 'VERTICAL rung (Dash)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Pedagogical Explanation Text Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs leading-relaxed text-slate-300">
              <BilingualText
                en={currentCIP.explanation.en}
                bn={currentCIP.explanation.bn}
              />
            </div>
          </div>

          {/* CIP Priority Ranking Breakdown Table */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Cahn-Ingold-Prelog (CIP) Priorities</span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                Atomic Number (Z) Rule
              </span>
            </h4>

            <div className="space-y-2">
              {(
                [
                  { prio: 1, label: 'Priority 1 (Highest)', badgeColor: 'bg-rose-500 text-white' },
                  { prio: 2, label: 'Priority 2', badgeColor: 'bg-amber-500 text-slate-900' },
                  { prio: 3, label: 'Priority 3', badgeColor: 'bg-blue-500 text-white' },
                  { prio: 4, label: 'Priority 4 (Lowest)', badgeColor: 'bg-emerald-500 text-slate-900' },
                ] as const
              ).map(({ prio, label, badgeColor }) => {
                const pos = (Object.keys(groups) as Position[]).find(
                  (k) => groups[k].cipPriority === prio
                )!;
                const grp = groups[pos];

                return (
                  <div
                    key={prio}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[11px] shrink-0 ${badgeColor}`}
                      >
                        {prio}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {grp.formula}
                      </span>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        (<BilingualText en={grp.name.en} bn={grp.name.bn} />)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {grp.atomicDetails}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {pos.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operation Ledger & Bond Integrity Counter */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Operation Ledger & Bond Integrity</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  3D Rotations
                </div>
                <div className="text-lg font-mono font-black text-purple-400 mt-0.5">
                  {singleBondRotationsCount}
                </div>
                <div className="text-[9px] text-emerald-400 font-mono">0 Cleaved</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  Bond Swaps
                </div>
                <div className="text-lg font-mono font-black text-rose-400 mt-0.5">
                  {bondsBrokenCount}
                </div>
                <div className="text-[9px] text-rose-400 font-mono">
                  {bondsBrokenCount % 2 === 1 ? 'Inverted' : 'Restored'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  180° Flips
                </div>
                <div className="text-lg font-mono font-black text-cyan-400 mt-0.5">
                  {flips180Count}
                </div>
                <div className="text-[9px] text-emerald-400 font-mono">Identical</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Functional Group Pill Badge rendered at the 4 rungs of the Fischer cross
 */
const GroupBadge: React.FC<{
  group: GroupItem;
  position: Position;
  isSawing?: boolean;
}> = ({ group, position, isSawing }) => {
  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 backdrop-blur-md transition-shadow cursor-default ${
        group.bgClass
      } ${group.borderColor} ${isSawing ? 'animate-bounce' : ''}`}
      style={{
        boxShadow: `0 0 16px ${group.color}40`,
      }}
    >
      {/* CIP Priority Number Pill */}
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center font-mono font-black text-[10px] text-slate-950 shadow-sm shrink-0"
        style={{ backgroundColor: group.color }}
      >
        {group.cipPriority}
      </span>

      {/* Group Chemical Formula */}
      <span className="font-mono font-black text-sm tracking-tight text-white drop-shadow-sm">
        {group.formula}
      </span>
    </motion.div>
  );
};
