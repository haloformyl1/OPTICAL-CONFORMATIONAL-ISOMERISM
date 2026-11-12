import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Layers,
  Zap,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  Box,
  Move,
  Flame,
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
export const LACTIC_ACID_PRESET: MoleculePreset = {
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

// Preset 2: 1-Bromo-1-chloromethan-1-ol
export const HALO_ALCOHOL_PRESET: MoleculePreset = {
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

export const PRESETS = [LACTIC_ACID_PRESET, HALO_ALCOHOL_PRESET];

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
 * Calculates CIP (R)/(S) configuration for any 4-group assignment on a Fischer cross
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

  const cross = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2);
  const apparentDirection = cross < 0 ? 'Clockwise' : 'Counter-Clockwise';
  const isP4Horizontal = p4Pos === 'left' || p4Pos === 'right';

  let config: 'R' | 'S';
  if (isP4Horizontal) {
    config = apparentDirection === 'Clockwise' ? 'S' : 'R';
  } else {
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

/**
 * Returns the 3 unanchored positions in cyclic order around the given anchor
 */
export const getUnanchoredPositions = (anchor: Position): [Position, Position, Position] => {
  switch (anchor) {
    case 'top':
      return ['right', 'bottom', 'left'];
    case 'bottom':
      return ['left', 'top', 'right'];
    case 'left':
      return ['top', 'right', 'bottom'];
    case 'right':
      return ['bottom', 'left', 'top'];
  }
};

/**
 * Executes a counter-clockwise cyclic permutation of the 3 unanchored groups around the anchor.
 * This is an even permutation (3-cycle), preserving the (R)/(S) configuration in 100% of cases.
 */
export const rotateUnanchoredCCW = (
  groups: Record<Position, GroupItem>,
  anchor: Position
): Record<Position, GroupItem> => {
  const next = { ...groups };
  switch (anchor) {
    case 'top':
      next.left = groups.right;
      next.bottom = groups.left;
      next.right = groups.bottom;
      break;
    case 'bottom':
      next.right = groups.left;
      next.top = groups.right;
      next.left = groups.top;
      break;
    case 'left':
      next.bottom = groups.top;
      next.right = groups.bottom;
      next.top = groups.right;
      break;
    case 'right':
      next.left = groups.top;
      next.bottom = groups.left;
      next.top = groups.bottom;
      break;
  }
  return next;
};

/**
 * Maps each position to its next target position under CCW propeller rotation around the given anchor
 */
export const getPropellerTargetPos = (pos: Position, anchor: Position): Position => {
  if (pos === anchor) return anchor;
  switch (anchor) {
    case 'top':
      if (pos === 'right') return 'left';
      if (pos === 'left') return 'bottom';
      return 'right';
    case 'bottom':
      if (pos === 'left') return 'right';
      if (pos === 'right') return 'top';
      return 'left';
    case 'left':
      if (pos === 'top') return 'bottom';
      if (pos === 'bottom') return 'right';
      return 'top';
    case 'right':
      if (pos === 'bottom') return 'top';
      if (pos === 'top') return 'left';
      return 'bottom';
  }
};

export type AnimationMode = 'idle' | 'propeller' | 'saw' | 'flip180' | 'flip90';

export interface StepNarrative {
  step: number;
  title: { en: string; bn: string };
  badgeText: string;
  description: { en: string; bn: string };
  chemicalPrinciple: { en: string; bn: string };
}

// Coordinate system for the Fischer canvas
const CANVAS_SIZE = 360;
const CENTER_X = 180;
const CENTER_Y = 180;
const RADIUS = 105;

const STATIC_POSITIONS: Record<Position, { x: number; y: number }> = {
  top: { x: CENTER_X, y: CENTER_Y - RADIUS },
  bottom: { x: CENTER_X, y: CENTER_Y + RADIUS },
  left: { x: CENTER_X - RADIUS, y: CENTER_Y },
  right: { x: CENTER_X + RADIUS, y: CENTER_Y },
};

/**
 * Calculates smooth parametric trajectory for a group moving from `from` to `to`
 */
const interpolateTrajectory = (
  from: Position,
  to: Position,
  t: number,
  anchor: Position
): { x: number; y: number } => {
  const fromCoord = STATIC_POSITIONS[from];
  const toCoord = STATIC_POSITIONS[to];

  const isOpposite =
    (from === 'left' && to === 'right') ||
    (from === 'right' && to === 'left') ||
    (from === 'top' && to === 'bottom') ||
    (from === 'bottom' && to === 'top');

  if (isOpposite) {
    // Arc curves around the stereocenter away from the locked anchor
    const midX = (fromCoord.x + toCoord.x) / 2;
    const midY = (fromCoord.y + toCoord.y) / 2;

    let pushX = 0;
    let pushY = 0;
    if (anchor === 'top') pushY = 46;
    else if (anchor === 'bottom') pushY = -46;
    else if (anchor === 'left') pushX = 46;
    else if (anchor === 'right') pushX = -46;

    const cx = midX + pushX;
    const cy = midY + pushY;
    const u = 1 - t;
    return {
      x: u * u * fromCoord.x + 2 * u * t * cx + t * t * toCoord.x,
      y: u * u * fromCoord.y + 2 * u * t * cy + t * t * toCoord.y,
    };
  } else {
    // Adjacent quarter-turn circular arc along perimeter
    const angleFrom = Math.atan2(fromCoord.y - CENTER_Y, fromCoord.x - CENTER_X);
    let angleTo = Math.atan2(toCoord.y - CENTER_Y, toCoord.x - CENTER_X);

    let dAngle = angleTo - angleFrom;
    while (dAngle > Math.PI) dAngle -= 2 * Math.PI;
    while (dAngle < -Math.PI) dAngle += 2 * Math.PI;

    const currentAngle = angleFrom + dAngle * t;
    return {
      x: CENTER_X + RADIUS * Math.cos(currentAngle),
      y: CENTER_Y + RADIUS * Math.sin(currentAngle),
    };
  }
};

export const ChiralLockLab: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = PRESETS[activePresetIndex];

  // Base state of groups
  const [groups, setGroups] = useState<Record<Position, GroupItem>>(() => ({
    ...activePreset.initialGroups,
  }));

  // NEW FEATURE 1: 2D vs 3D Reality View Toggle
  const [show3DReality, setShow3DReality] = useState<boolean>(true);

  // NEW FEATURE 2: Multi-Anchor Selection (default: 'top')
  const [anchorPosition, setAnchorPosition] = useState<Position>('top');

  // NEW FEATURE 3: Steric Crash State (triggered on illegal drag across center)
  const [isCrashing, setIsCrashing] = useState<boolean>(false);
  const [crashMessage, setCrashMessage] = useState<string | null>(null);

  // NEW FEATURE 4: Whole Molecule Rotation Restriction (90° invalid vs 180° valid)
  const [wholeMoleculeRotation, setWholeMoleculeRotation] = useState<number>(0);

  // NEW FEATURE 5: Dynamic Action Summary Tracker
  const [lastActionSummary, setLastActionSummary] = useState<{
    type: 'rotation' | 'swap' | 'flip90' | 'flip180' | 'crash' | 'idle';
    title: { en: string; bn: string };
    ruleText: { en: string; bn: string };
  }>({
    type: 'idle',
    title: {
      en: 'Physical Lock Ready: Explore Rotations vs Bond Cleavage',
      bn: 'ফিজিক্যাল লক প্রস্তুত: ঘূর্ণন বনাম বন্ধন ভাঙন পরীক্ষা করুন',
    },
    ruleText: {
      en: 'Rotation = Tumbling in Space (Same Molecule). Swapping = Breaking Bonds (Enantiomer).',
      bn: 'ঘূর্ণন = মহাশূন্যে সমাবর্তন (একই অণু)। অদলবদল = বন্ধন ভাঙন (এন্যানশিওমার)।',
    },
  });

  // Operation history counters
  const [bondsBrokenCount, setBondsBrokenCount] = useState(0);
  const [singleBondRotationsCount, setSingleBondRotationsCount] = useState(0);
  const [flips180Count, setFlips180Count] = useState(0);

  // Animation Engine State
  const [activeMode, setActiveMode] = useState<AnimationMode>('idle');
  const [animProgress, setAnimProgress] = useState<number>(0); // 0.0 to 1.0
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const animFrameRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number | null>(null);
  const ANIM_DURATION = 3000; // ms for a full step-by-step cycle

  // Initial reference configuration for comparison
  const initialCIP = useMemo(() => calculateCIP(activePreset.initialGroups), [activePreset]);

  // Current real-time CIP calculation based on active displayed state
  const currentCIP = useMemo(() => calculateCIP(groups), [groups]);
  const isEnantiomer = currentCIP.configuration !== initialCIP.configuration;

  // Evaluate whether the current in-plane rotation angle violates the Fischer convention
  const isInvalid90View = useMemo(() => {
    const norm = ((wholeMoleculeRotation % 360) + 360) % 360;
    return norm === 90 || norm === 270;
  }, [wholeMoleculeRotation]);

  // Active step calculation (1, 2, 3, or 4)
  const currentStep = useMemo(() => {
    if (animProgress < 0.25) return 1;
    if (animProgress < 0.55) return 2;
    if (animProgress < 0.85) return 3;
    return 4;
  }, [animProgress]);

  // Reset when preset changes
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGroups({ ...activePreset.initialGroups });
    setBondsBrokenCount(0);
    setSingleBondRotationsCount(0);
    setFlips180Count(0);
    setWholeMoleculeRotation(0);
    setAnchorPosition('top');
    setIsCrashing(false);
    setCrashMessage(null);
    setActiveMode('idle');
    setAnimProgress(0);
    setIsPlaying(false);
    setLastActionSummary({
      type: 'idle',
      title: {
        en: 'Preset Loaded: Initial Configuration',
        bn: 'নতুন অণু লোড হয়েছে: প্রারম্ভিক কনফিগারেশন',
      },
      ruleText: {
        en: 'Rotation = Tumbling in Space (Same Molecule). Swapping = Breaking Bonds (Enantiomer).',
        bn: 'ঘূর্ণন = মহাশূন্যে সমাবর্তন (একই অণু)। অদলবদল = বন্ধন ভাঙন (এন্যানশিওমার)।',
      },
    });
  }, [activePreset]);

  // ANIMATION LOOP
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animStartTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!animStartTimeRef.current) {
        animStartTimeRef.current = timestamp - animProgress * ANIM_DURATION;
      }
      const elapsed = timestamp - animStartTimeRef.current;
      const progress = Math.min(1, elapsed / ANIM_DURATION);

      setAnimProgress(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        finalizeOperation(activeMode);
        setIsPlaying(false);
        animStartTimeRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeMode]);

  // Finalize data state when an animation reaches 100%
  const finalizeOperation = (mode: AnimationMode) => {
    if (mode === 'propeller') {
      setSingleBondRotationsCount((prev) => prev + 1);
      setGroups((prev) => rotateUnanchoredCCW(prev, anchorPosition));
      setLastActionSummary({
        type: 'rotation',
        title: {
          en: `3D Propeller Rotation around Anchor (${groups[anchorPosition].formula})`,
          bn: `লকড নোঙ্গর (${groups[anchorPosition].formula})-এর সাপেক্ষে ত্রিমাত্রিক প্রপেলার ঘূর্ণন সম্পন্ন`,
        },
        ruleText: {
          en: 'Rotation = Tumbling in Space (Same Molecule). 0 bonds broken, distance invariants preserved. (R)/(S) strictly unchanged!',
          bn: 'ঘূর্ণন = মহাশূন্যে সমাবর্তন (একই অণু)। ০টি বন্ধন ভাঙা হয়েছে, দূরত্বের প্রতিসাম্য অক্ষত। (R)/(S) হুবহু সংরক্ষিত!',
        },
      });
    } else if (mode === 'saw') {
      setBondsBrokenCount((prev) => prev + 1);
      setGroups((prev) => ({
        ...prev,
        left: prev.right,
        right: prev.left,
      }));
      setLastActionSummary({
        type: 'swap',
        title: {
          en: 'Chemical Saw: 2 Covalent σ-Bonds Cleaved & Swapped',
          bn: 'রাসায়নিক করাত: ২টি সমযোজী সিগমা বন্ধন বিদারণ ও গ্রুপের অদলবদল',
        },
        ruleText: {
          en: 'Swapping = Breaking Bonds (Enantiomer). 1 Swap changes parity from even to odd → Configuration Inverted!',
          bn: 'অদলবদল = বন্ধন ভাঙন (এন্যানশিওমার)। ১টি সোয়াপ বিন্যাস প্যারিটি পরিবর্তন করে → কনফিগারেশন রূপান্তরিত!',
        },
      });
    } else if (mode === 'flip180') {
      setFlips180Count((prev) => prev + 1);
      setWholeMoleculeRotation((prev) => prev + 180);
      setGroups((prev) => ({
        top: prev.bottom,
        bottom: prev.top,
        left: prev.right,
        right: prev.left,
      }));
      setLastActionSummary({
        type: 'flip180',
        title: {
          en: '180° In-Plane Flip: Fischer View Preserved',
          bn: '১৮০° সমতলীয় ঘূর্ণন: ফিশার কনভেনশন সম্পূর্ণ সংরক্ষিত',
        },
        ruleText: {
          en: '180° Flip keeps vertical rungs vertical (dashes) and horizontal rungs horizontal (wedges). Result is 100% Identical Homomer!',
          bn: '১৮০° ঘূর্ণনে উল্লম্ব বন্ধন উল্লম্ব (ড্যাশ) এবং অনুভূমিক বন্ধন অনুভূমিক (ওয়েজ) থাকে। ফলাফল ১০০% অভিন্ন হোমোমার!',
        },
      });
    } else if (mode === 'flip90') {
      setWholeMoleculeRotation((prev) => prev + 90);
      setLastActionSummary({
        type: 'flip90',
        title: {
          en: '⚠️ 90° In-Plane Turn: FISCHER CONVENTION VIOLATED',
          bn: '⚠️ ৯০° সমতলীয় ঘূর্ণন: ফিশার নিয়ম লঙ্ঘিত',
        },
        ruleText: {
          en: 'Invalid Fischer View! Rotating by 90° forces forward-pointing wedges onto vertical axis, falsifying apparent CIP configuration.',
          bn: 'অবৈধ ফিশার রূপ! ৯০° ঘোরালে সামনের ওয়েজ বন্ধনগুলো উল্লম্ব অক্ষে চলে যায়, ফলে আপাত CIP কনফিগারেশন ভুলভাবে উল্টে যায়।',
        },
      });
    }
    setAnimProgress(0);
    setActiveMode('idle');
  };

  // Launch interaction in animated mode
  const startInteraction = (mode: AnimationMode) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setActiveMode(mode);
    setAnimProgress(0);
    setIsPlaying(true);
  };

  // Jump directly to a step (0%, 33%, 66%, 100%)
  const jumpToStep = (stepNum: number) => {
    setIsPlaying(false);
    if (activeMode === 'idle') setActiveMode('saw');
    const progressMap = [0.1, 0.4, 0.7, 0.98];
    setAnimProgress(progressMap[stepNum - 1]);
  };

  // Trigger Steric Crash when student attempts flat 2D drag through the core
  const triggerStericCrash = () => {
    setIsCrashing(true);
    setCrashMessage(
      'Physical Blockade! The 109.5° tetrahedral angle prevents groups from sliding past each other.'
    );
    setLastActionSummary({
      type: 'crash',
      title: {
        en: 'Steric Crash! Physical Blockade in Tetrahedral Core',
        bn: 'স্টেরিক সংঘর্ষ! চতুস্তলকীয় কেন্দ্রে শারীরিক বাধা',
      },
      ruleText: {
        en: 'Physical Blockade! In 3D tetrahedral geometry, bonded electron clouds cannot slide through each other in 2D. You must cleave bonds with the Chemical Saw!',
        bn: 'শারীরিক বাধা! ত্রিমাত্রিক চতুস্তলকীয় জ্যামিতিতে ইলেকট্রন মেঘ বন্ধন না ভেঙে একে অপরকে অতিক্রম করতে পারে না। অদলবদলের জন্য রাসায়নিক করাত ব্যবহার আবশ্যক!',
      },
    });

    setTimeout(() => {
      setIsCrashing(false);
    }, 3800);
  };

  // Quick action: Rotate whole molecule by 90 degrees
  const handleRotate90 = () => {
    if (isPlaying) return;
    const newAngle = wholeMoleculeRotation + 90;
    setWholeMoleculeRotation(newAngle);
    const isNowInvalid = newAngle % 180 !== 0;

    setLastActionSummary({
      type: isNowInvalid ? 'flip90' : 'flip180',
      title: isNowInvalid
        ? {
            en: '⚠️ 90° In-Plane Turn: Convention Violated!',
            bn: '⚠️ ৯০° ঘূর্ণন: ফিশার কনভেনশন লঙ্ঘিত!',
          }
        : {
            en: '180° In-Plane Orientation Restored!',
            bn: '১৮০° সমতলীয় অবস্থান পুনরুদ্ধার!',
          },
      ruleText: isNowInvalid
        ? {
            en: 'Invalid Fischer View! Wedges pointing towards you are now vertical rungs. On exams, 90° rotations are strictly forbidden!',
            bn: 'অবৈধ ফিশার চিত্র! আপনার দিকে তাক করা ওয়েজ বন্ধনগুলো উল্লম্ব হয়ে গেছে। পরীক্ষায় ৯০° আবর্তন কঠোরভাবে নিষিদ্ধ!',
          }
        : {
            en: 'Valid Fischer view restored! Horizontal rungs are wedges and vertical rungs are dashes once again.',
            bn: 'বৈধ ফিশার রূপ পুনরুদ্ধার হয়েছে! অনুভূমিক বন্ধন পুনরায় ওয়েজ ও উল্লম্ব বন্ধন ড্যাশে পরিণত হয়েছে।',
          },
    });
  };

  // Quick action: Rotate whole molecule by 180 degrees
  const handleRotate180 = () => {
    if (isPlaying) return;
    startInteraction('flip180');
  };

  // Reset to initial state
  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGroups({ ...activePreset.initialGroups });
    setBondsBrokenCount(0);
    setSingleBondRotationsCount(0);
    setFlips180Count(0);
    setWholeMoleculeRotation(0);
    setAnchorPosition('top');
    setIsCrashing(false);
    setCrashMessage(null);
    setActiveMode('idle');
    setAnimProgress(0);
    setIsPlaying(false);
    setLastActionSummary({
      type: 'idle',
      title: {
        en: 'Reset to Initial Stereochemical State',
        bn: 'প্রারম্ভিক স্টেরিওরাসায়নিক অবস্থানে রিসেট করা হয়েছে',
      },
      ruleText: {
        en: 'Rotation = Tumbling in Space (Same Molecule). Swapping = Breaking Bonds (Enantiomer).',
        bn: 'ঘূর্ণন = মহাশূন্যে সমাবর্তন (একই অণু)। অদলবদল = বন্ধন ভাঙন (এন্যানশিওমার)।',
      },
    });
  };

  // Step narrative content for current frame
  const currentNarrative: StepNarrative = useMemo(() => {
    if (activeMode === 'saw') {
      switch (currentStep) {
        case 1:
          return {
            step: 1,
            title: {
              en: 'Step 1: Target Covalent σ-Bonds for Cleavage',
              bn: 'ধাপ ১: বিদারণের জন্য সমযোজী সিগমা বন্ধন চিহ্নিতকরণ',
            },
            badgeText: 'TARGETING BONDS 🎯',
            description: {
              en: `Targeting horizontal bonds connecting ${groups.left.formula} and ${groups.right.formula} to C*. In 3D reality, these are wedged bonds extending out towards you.`,
              bn: `C*-এর সাথে যুক্ত ${groups.left.formula} ও ${groups.right.formula}-এর অনুভূমিক বন্ধন লক্ষ্য করা হচ্ছে। ত্রিমাত্রিক বাস্তবে এগুলি সামনের দিকে প্রসারিত ওয়েজ বন্ধন।`,
            },
            chemicalPrinciple: {
              en: '109.5° tetrahedral geometry locks groups rigidly. They cannot swap without severing sigma bonds.',
              bn: '১০৯.৫° চতুস্তলকীয় কোণ পরমাণুগুলোকে দৃঢ়ভাবে আবদ্ধ রাখে। সিগমা বন্ধন না ভেঙে এরা স্থান বদলাতে পারে না।',
            },
          };
        case 2:
          return {
            step: 2,
            title: {
              en: 'Step 2: Covalent Cleavage (Laser Fracture Stubs)',
              bn: 'ধাপ ২: সমযোজী বন্ধন ভাঙন (লেজার ফ্র্যাকচার স্টাব)',
            },
            badgeText: 'BONDS CLEAVED ⚡',
            description: {
              en: `Chemical energy ruptures both horizontal bonds! ${groups.left.formula} and ${groups.right.formula} physically detach, leaving active coordination stubs on the chiral center.`,
              bn: `রাসায়নিক শক্তিতে উভয় অনুভূমিক বন্ধন ভেঙে গেল! ${groups.left.formula} ও ${groups.right.formula} বিচ্ছিন্ন হয়ে মুক্ত অংশে পরিণত হয়েছে।`,
            },
            chemicalPrinciple: {
              en: 'Bond dissociation energy supplied. The stereocenter temporarily loses its tetrahedral coordinate lock.',
              bn: 'বন্ধন বিয়োজন শক্তি ব্যয়িত। স্টেরিওকেন্দ্রটি সাময়িকভাবে চতুস্তলকীয় অক্ষীয় বন্ধন হারায়।',
            },
          };
        case 3:
          return {
            step: 3,
            title: {
              en: 'Step 3: Mid-Air Spatial Crossover (Parity Inversion)',
              bn: 'ধাপ ৩: শূন্যে স্থান অতিক্রম (প্যারিটি রূপান্তর)',
            },
            badgeText: 'CROSSING OVER 🔀',
            description: {
              en: `The detached groups physically cross over in mid-air! ${groups.right.formula} arcs UPWARD over the core, while ${groups.left.formula} arcs DOWNWARD, transposing their 3D coordinates.`,
              bn: `বিচ্ছিন্ন গ্রুপ দুটি শূন্যে একে অপরকে অতিক্রম করছে! ${groups.right.formula} উপর দিয়ে এবং ${groups.left.formula} নিচ দিয়ে পথ অতিক্রম করে স্থান বিনিময় করছে।`,
            },
            chemicalPrinciple: {
              en: '1 single transposition changes mathematical permutation parity from even to odd (parity inversion).',
              bn: '১টি একক সোয়াপ বিন্যাস প্যারিটি যুগ্ম থেকে অযুগ্মতে রূপান্তর করে (প্যারিটি ইনভার্সন)।',
            },
          };
        case 4:
        default:
          return {
            step: 4,
            title: {
              en: 'Step 4: Re-attachment & Enantiomer Inversion (R ⇄ S)',
              bn: 'ধাপ ৪: পুনঃসংযোজন ও এন্যানশিওমারে রূপান্তর (R ⇄ S)',
            },
            badgeText: 'ENANTIOMER CREATED ✨',
            description: {
              en: `New covalent bonds reform in opposite sockets! Because exactly 1 swap was executed, the stereocenter has inverted into its non-superimposable mirror image!`,
              bn: `বিপরীত প্রান্তে নতুন সমযোজী বন্ধন গঠিত হয়েছে! ঠিক ১টি অদলবদল সম্পন্ন হওয়ায় অণুটি নন-সুপারইম্পোজিবল দর্পণ প্রতিবিম্বে (এন্যানশিওমার) রূপান্তরিত হলো!`,
            },
            chemicalPrinciple: {
              en: 'Golden Rule: 1 Swap = Inversion of Configuration (R ⇄ S). Non-superimposable enantiomer created.',
              bn: 'সোনালী সূত্র: ১টি অদলবদল = কনফিগারেশনের রূপান্তর (R ⇄ S)। অপ্রকৃত দর্পণ প্রতিবিম্ব তৈরি হয়।',
            },
          };
      }
    } else if (activeMode === 'propeller') {
      const anchorGrp = groups[anchorPosition];
      switch (currentStep) {
        case 1:
          return {
            step: 1,
            title: {
              en: `Step 1: Clamp Anchor [${anchorGrp.formula}] as Rigid Spindle`,
              bn: `ধাপ ১: নোঙ্গর [${anchorGrp.formula}]-কে স্থির ঘূর্ণন অক্ষ হিসেবে লক করা`,
            },
            badgeText: 'ANCHOR CLAMPED 🔒',
            description: {
              en: `The C-${anchorGrp.formula} bond is clamped tight as the stationary spindle. Any of the 4 groups can serve as this anchor! ZERO bonds on this axis will be cleaved.`,
              bn: `C-${anchorGrp.formula} বন্ধনটি একটি অনড় অক্ষ হিসেবে লক করা হলো। যেকোনো গ্রুপকেই নোঙ্গর করা যায়! এই অক্ষের কোনো বন্ধন ভাঙা হবে না।`,
            },
            chemicalPrinciple: {
              en: 'Single covalent σ-bonds possess cylindrical symmetry and allow free continuous rotation in space SO(3).',
              bn: 'একক সমযোজী সিগমা বন্ধনের সিলিন্ড্রিক্যাল প্রতিসাম্য থাকায় ত্রিমাত্রিক স্থানে মুক্ত ঘূর্ণন সম্ভব।',
            },
          };
        case 2:
          return {
            step: 2,
            title: {
              en: 'Step 2: Activate 3-Group Circular Orbit Base',
              bn: 'ধাপ ২: ৩-গ্রুপের বৃত্তাকার ট্রাইপড পথ সক্রিয়করণ',
            },
            badgeText: 'ORBIT ACTIVE ⭕',
            description: {
              en: `The remaining three substituents form a tetrahedral tripod base opposite the anchor. A circular trajectory connects them in 3D space.`,
              bn: `নোঙ্গরের বিপরীতে থাকা বাকি ৩টি গ্রুপ একটি চতুস্তলকীয় ট্রাইপড গঠন করে। মহাশূন্যে তাদের সংযোগকারী বৃত্তাকার পথ দৃশ্যমান হয়েছে।`,
            },
            chemicalPrinciple: {
              en: 'Rotating a 3-leg tripod corresponds to a cyclic permutation of 3 elements (a 3-cycle, an even permutation).',
              bn: '৩-গ্রুপ ট্রাইপড ঘূর্ণন একটি ৩-চক্র যুগ্ম পারমিউটেশন।',
            },
          };
        case 3:
          return {
            step: 3,
            title: {
              en: 'Step 3: Simultaneous 120° CCW Rotation Along Track',
              bn: 'ধাপ ৩: বৃত্তাকার পথে ১২০° ঘড়ির কাঁটার বিপরীত ঘূর্ণন',
            },
            badgeText: 'SPINNING 120° 🔄',
            description: {
              en: `All three unanchored groups glide harmoniously along their orbit! Zero covalent bonds are broken; the molecule is merely tumbling in 3D Euclidean space.`,
              bn: `৩টি গ্রুপ একই সাথে বৃত্তাকার ট্র্যাকে মসৃণভাবে এগিয়ে যাচ্ছে! কোনো বন্ধন ভাঙা হচ্ছে না, কেবল মহাশূন্যে ত্রিমাত্রিক আবর্তন ঘটছে।`,
            },
            chemicalPrinciple: {
              en: 'Rigid body rotation in Euclidean space SO(3) preserves chiral orientation and all internal distance invariants.',
              bn: 'ইউক্লিডীয় স্থানে অনমনীয় আবর্তন কাইরাল দিক এবং দূরত্বের সমতা সম্পূর্ণ বজায় রাখে।',
            },
          };
        case 4:
        default:
          return {
            step: 4,
            title: {
              en: 'Step 4: Arrival at New Fischer Rungs (R/S STRICTLY PRESERVED!)',
              bn: 'ধাপ ৪: নতুন ফিশার অবস্থানে স্থির (R/S অপরিবর্তিত ও সংরক্ষিত!)',
            },
            badgeText: 'CONFIGURATION INVARIANT ✓',
            description: {
              en: `The three groups settle into their new rungs. Although the 2D cross looks altered, the stereocenter configuration is strictly identical homomer!`,
              bn: `গ্রুপগুলো নতুন অবস্থানে স্থিত হলো। ক্রসের রূপ দৃশ্যত বদলালেও মূল ত্রিমাত্রিক কনফিগারেশন হুবহু অভিন্ন ও সংরক্ষিত রয়েছে!`,
            },
            chemicalPrinciple: {
              en: 'Universal Law: 3-Group Rotation around ANY Anchor = Exactly Identical Homomer. Parity is invariant.',
              bn: 'সার্বজনীন নিয়ম: যেকোনো নোঙ্গরের সাপেক্ষে ৩-গ্রুপ ঘূর্ণন = হুবহু অভিন্ন হোমোমার। প্যারিটি সংরক্ষিত।',
            },
          };
      }
    } else if (activeMode === 'flip180') {
      return {
        step: 4,
        title: {
          en: '180° In-Plane Flip: Permissible Homomer Operation',
          bn: '১৮০° সমতলীয় উল্টানো: অনুমোদিত হোমোমার রূপান্তর',
        },
        badgeText: 'VALID FLIP ✓',
        description: {
          en: 'Spinning the cross 180° equals TWO simultaneous group swaps (Top ↔ Bottom and Left ↔ Right). Two swaps cancel out parity changes (-1 × -1 = +1)!',
          bn: '১৮০° সমতলীয় ঘূর্ণন মানে একই সাথে ২টি অদলবদল (উপর ↔ নিচ এবং বাম ↔ ডান)। ২টি অদলবদল কাইরালিটি অক্ষত রাখে (-১ × -১ = +১)!',
        },
        chemicalPrinciple: {
          en: '180° rotation preserves horizontal wedges and vertical dashes. Superimposable identical homomer.',
          bn: '১৮০° ঘূর্ণন অনুভূমিক ওয়েজ ও উল্লম্ব ড্যাশ অক্ষত রাখে। হুবহু উপরিপাতযোগ্য হোমোমার।',
        },
      };
    } else {
      return {
        step: 1,
        title: {
          en: 'Interactive Ready: Select Any Action Below',
          bn: 'সিমুলেটর প্রস্তুত: নিচের যেকোনো ইন্টারঅ্যাকশন নির্বাচন করুন',
        },
        badgeText: 'EXPLORE STEREOCHEMISTRY 🔬',
        description: {
          en: 'Click any group to set as the Anchor, drag the left group to test steric blockade, or toggle 3D Reality to inspect tetrahedral wedges and dashes!',
          bn: 'যেকোনো গ্রুপে ক্লিক করে নোঙ্গর নির্বাচন করুন, স্টেরিক বাধার পরীক্ষার জন্য বাঁয়ের গ্রুপটি টেনে দেখুন, অথবা ৩ডি রিয়ালিটি চালু করুন!',
        },
        chemicalPrinciple: {
          en: 'Rotation = Tumbling in Space (Same Molecule). Swapping = Breaking Bonds (Enantiomer).',
          bn: 'ঘূর্ণন = মহাশূন্যে সমাবর্তন (একই অণু)। অদলবদল = বন্ধন ভাঙন (এন্যানশিওমার)।',
        },
      };
    }
  }, [activeMode, currentStep, groups, anchorPosition]);

  // Dynamic coordinate engine for groups
  const groupPositions = useMemo(() => {
    const p = animProgress;
    const pos = { ...STATIC_POSITIONS };

    if (activeMode === 'saw') {
      const leftStartX = STATIC_POSITIONS.left.x;
      const rightStartX = STATIC_POSITIONS.right.x;

      if (p <= 0.25) {
        const det = (p / 0.25) * 20;
        pos.left = { x: leftStartX - det, y: CENTER_Y };
        pos.right = { x: rightStartX + det, y: CENTER_Y };
      } else if (p <= 0.8) {
        const u = (p - 0.25) / 0.55;
        const rightX = (rightStartX + 20) - (rightStartX - leftStartX + 40) * u;
        const rightY = CENTER_Y - Math.sin(u * Math.PI) * 52;
        const leftX = (leftStartX - 20) + (rightStartX - leftStartX + 40) * u;
        const leftY = CENTER_Y + Math.sin(u * Math.PI) * 52;

        pos.right = { x: rightX, y: rightY };
        pos.left = { x: leftX, y: leftY };
      } else {
        const v = (p - 0.8) / 0.2;
        const snap = (1 - v) * 14;
        pos.right = { x: leftStartX - snap, y: CENTER_Y };
        pos.left = { x: rightStartX + snap, y: CENTER_Y };
      }
    } else if (activeMode === 'propeller') {
      pos[anchorPosition] = STATIC_POSITIONS[anchorPosition];

      const unanchored = getUnanchoredPositions(anchorPosition);
      unanchored.forEach((fromPos) => {
        const toPos = getPropellerTargetPos(fromPos, anchorPosition);
        pos[fromPos] = interpolateTrajectory(fromPos, toPos, p, anchorPosition);
      });
    }

    return pos;
  }, [activeMode, animProgress, anchorPosition]);

  return (
    <div className="flex flex-col w-full h-full bg-[#040d1a] text-slate-100 p-3 sm:p-5 lg:p-6 overflow-y-auto space-y-6">
      {/* Top Banner & Molecule Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="h-3 w-3" />
              <span>THE CHIRAL LOCK 2.0</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Tetrahedral Blockade & Multi-Anchor Dynamics
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            <BilingualText
              en="Chiral Center 'Physical Lock' & Tetrahedral Reality"
              bn="কাইরাল কেন্দ্র 'ফিজিক্যাল লক' ও চতুস্তলকীয় বাস্তবতা"
            />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            <BilingualText
              en="Visual proof: Why rotating single bonds preserves (R)/(S), why 2D sliding is physically blocked, and why 90° flips are invalid."
              bn="দৃশ্যমান প্রমাণ: কেন একক বন্ধন ঘূর্ণন (R)/(S) সংরক্ষণ করে, কেন ২ডি স্লাইড বাধাপ্রাপ্ত হয় এবং কেন ৯০° ঘূর্ণন অবৈধ।"
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

      {/* NEW FEATURE 5: DYNAMIC SUMMARY & ACTION LEDGER BOX */}
      <div className="w-full p-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                lastActionSummary.type === 'rotation' || lastActionSummary.type === 'flip180'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : lastActionSummary.type === 'swap'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : lastActionSummary.type === 'flip90' || lastActionSummary.type === 'crash'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
              }`}
            >
              {lastActionSummary.type === 'rotation' ? (
                <RotateCcw className="h-5 w-5 animate-spin-slow" />
              ) : lastActionSummary.type === 'swap' ? (
                <Scissors className="h-5 w-5" />
              ) : lastActionSummary.type === 'crash' ? (
                <AlertTriangle className="h-5 w-5 animate-bounce" />
              ) : lastActionSummary.type === 'flip90' ? (
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              ) : (
                <Zap className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Core Axiom
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  <BilingualText
                    en={lastActionSummary.title.en}
                    bn={lastActionSummary.title.bn}
                  />
                </span>
              </div>

              <div className="mt-1 text-sm font-black text-white tracking-wide">
                <BilingualText
                  en={lastActionSummary.ruleText.en}
                  bn={lastActionSummary.ruleText.bn}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {/* View Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setShow3DReality(!show3DReality)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shadow-sm ${
                show3DReality
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>{show3DReality ? '3D Reality (ON)' : 'Show 3D Reality'}</span>
            </button>
          </div>
        </div>

        {/* Persistent Tooltip Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>Fischer Rule: Horizontal bonds ALWAYS point towards you to be a valid view.</span>
          </span>
          <span className="hidden md:inline text-slate-500">
            Tetrahedral angle: 109.5° • SO(3) continuous symmetry
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Stage (Left) + Stereocenter Status Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: INTERACTIVE FISCHER PROJECTION ANIMATION STAGE     */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl space-y-4">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* STEP NARRATIVE CARD */}
          <div className="w-full p-4 rounded-2xl border border-slate-700 bg-slate-950/70 shadow-lg relative z-10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {currentNarrative.badgeText}
                </span>
                <span className="text-xs font-bold text-white">
                  <BilingualText
                    en={currentNarrative.title.en}
                    bn={currentNarrative.title.bn}
                  />
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-bold shrink-0">
                Phase {currentStep} / 4
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              <BilingualText
                en={currentNarrative.description.en}
                bn={currentNarrative.description.bn}
              />
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Info className="h-3 w-3 text-amber-400 shrink-0" />
              <span>
                <BilingualText
                  en={currentNarrative.chemicalPrinciple.en}
                  bn={currentNarrative.chemicalPrinciple.bn}
                />
              </span>
            </div>
          </div>

          {/* MULTI-ANCHOR SELECTOR PILLS */}
          <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs relative z-10">
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 font-bold">
              <Lock className="h-3 w-3 text-amber-400" />
              <span>Click Any Group to Anchor:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {(['top', 'bottom', 'left', 'right'] as Position[]).map((pos) => {
                const grp = groups[pos];
                const isSelected = anchorPosition === pos;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => {
                      if (isPlaying) return;
                      setAnchorPosition(pos);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5 opacity-60" />}
                    <span>{grp.formula}</span>
                    <span className="text-[9px] opacity-70">({pos[0].toUpperCase()})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTRAL FISCHER PROJECTION ANIMATION BOARD */}
          <div
            className={`relative w-[360px] h-[360px] flex items-center justify-center my-1 select-none overflow-visible rounded-3xl transition-all duration-500 ${
              isInvalid90View
                ? 'border-2 border-rose-500/90 bg-rose-950/20 shadow-[0_0_35px_rgba(244,63,94,0.35)]'
                : wholeMoleculeRotation % 180 === 0 && wholeMoleculeRotation > 0
                ? 'border border-emerald-500/60 bg-emerald-950/15 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                : 'border border-slate-800/80 bg-slate-950/40'
            }`}
          >
            {/* INVALID 90° WARNING OVERLAY BANNER */}
            <AnimatePresence>
              {isInvalid90View && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 z-40 px-3 py-1.5 rounded-xl bg-rose-900/90 border border-rose-400 text-rose-100 text-[11px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md animate-pulse"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-300" />
                  <span>Invalid Fischer View! The wedged bonds are now vertical.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STERIC CRASH COLLISION BANNER & MODAL */}
            <AnimatePresence>
              {isCrashing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="absolute z-50 p-4 rounded-2xl bg-slate-950/95 border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.65)] text-center backdrop-blur-xl max-w-[280px]"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/50 mb-2">
                    <Flame className="h-5 w-5 animate-bounce" />
                  </div>
                  <h5 className="font-bold text-rose-300 text-xs uppercase tracking-wider">
                    Physical Blockade!
                  </h5>
                  <p className="text-[11px] text-slate-200 mt-1 font-semibold leading-snug">
                    {crashMessage}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                    In real 3D space, atoms cannot pass through each other in 2D. Click <strong>"Chemical Saw / Swap Groups"</strong> to cleave covalent bonds!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCrashing(false)}
                    className="mt-3 px-3 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 border border-rose-400/50 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Understood
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Plane Whole Molecule Rotation Wrapper */}
            <div
              style={{
                transform: `rotate(${wholeMoleculeRotation + (activeMode === 'flip180' ? animProgress * 180 : 0)}deg)`,
                transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                transition: activeMode === 'flip180' ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
              }}
              className="relative"
            >
              {/* SVG BONDS & TRAJECTORY LAYER */}
              <svg
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="absolute inset-0 pointer-events-none overflow-visible"
              >
                <defs>
                  <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <linearGradient id="wedge-left-grad" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="wedge-right-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>

                {/* Steric Crash Red Shockwave */}
                {isCrashing && (
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r={55}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="4"
                    strokeDasharray="4 2"
                    className="animate-ping opacity-80"
                  />
                )}

                {/* VERTICAL BONDS */}
                {show3DReality ? (
                  <g className="opacity-90">
                    {[18, 32, 46, 60, 74, 88].map((dist, idx) => {
                      const barWidth = 24 - idx * 2.8;
                      const yPos = CENTER_Y - dist;
                      return (
                        <line
                          key={`top-dash-${dist}`}
                          x1={CENTER_X - barWidth / 2}
                          y1={yPos}
                          x2={CENTER_X + barWidth / 2}
                          y2={yPos}
                          stroke="#64748b"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {[18, 32, 46, 60, 74, 88].map((dist, idx) => {
                      const barWidth = 24 - idx * 2.8;
                      const yPos = CENTER_Y + dist;
                      return (
                        <line
                          key={`bottom-dash-${dist}`}
                          x1={CENTER_X - barWidth / 2}
                          y1={yPos}
                          x2={CENTER_X + barWidth / 2}
                          y2={yPos}
                          stroke="#64748b"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                ) : (
                  <line
                    x1={CENTER_X}
                    y1={CENTER_Y - RADIUS + 18}
                    x2={CENTER_X}
                    y2={CENTER_Y + RADIUS - 18}
                    stroke="#64748b"
                    strokeWidth="5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                )}

                {/* HORIZONTAL BONDS */}
                {activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.85 ? (
                  <g filter="url(#laser-glow)">
                    <line
                      x1={CENTER_X}
                      y1={CENTER_Y}
                      x2={CENTER_X - 44}
                      y2={CENTER_Y}
                      stroke="#f43f5e"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1={CENTER_X}
                      y1={CENTER_Y}
                      x2={CENTER_X + 44}
                      y2={CENTER_Y}
                      stroke="#f43f5e"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <circle cx={CENTER_X - 44} cy={CENTER_Y} r="6" fill="#f43f5e" />
                    <circle cx={CENTER_X + 44} cy={CENTER_Y} r="6" fill="#f43f5e" />
                    <line x1={CENTER_X - 52} y1={CENTER_Y - 14} x2={CENTER_X - 36} y2={CENTER_Y + 14} stroke="#fda4af" strokeWidth="3" />
                    <line x1={CENTER_X + 36} y1={CENTER_Y - 14} x2={CENTER_X + 52} y2={CENTER_Y + 14} stroke="#fda4af" strokeWidth="3" />
                  </g>
                ) : show3DReality ? (
                  <g>
                    <polygon
                      points={`${CENTER_X - 14},${CENTER_Y - 4} ${CENTER_X - RADIUS + 20},${CENTER_Y - 15} ${CENTER_X - RADIUS + 20},${CENTER_Y + 15} ${CENTER_X - 14},${CENTER_Y + 4}`}
                      fill="url(#wedge-left-grad)"
                      filter="drop-shadow(0 6px 12px rgba(6,182,212,0.45))"
                    />
                    <line
                      x1={CENTER_X - 14}
                      y1={CENTER_Y - 4}
                      x2={CENTER_X - RADIUS + 20}
                      y2={CENTER_Y - 15}
                      stroke="#e0f2fe"
                      strokeWidth="2"
                    />

                    <polygon
                      points={`${CENTER_X + 14},${CENTER_Y - 4} ${CENTER_X + RADIUS - 20},${CENTER_Y - 15} ${CENTER_X + RADIUS - 20},${CENTER_Y + 15} ${CENTER_X + 14},${CENTER_Y + 4}`}
                      fill="url(#wedge-right-grad)"
                      filter="drop-shadow(0 6px 12px rgba(6,182,212,0.45))"
                    />
                    <line
                      x1={CENTER_X + 14}
                      y1={CENTER_Y - 4}
                      x2={CENTER_X + RADIUS - 20}
                      y2={CENTER_Y - 15}
                      stroke="#e0f2fe"
                      strokeWidth="2"
                    />
                  </g>
                ) : (
                  <line
                    x1={CENTER_X - RADIUS + 18}
                    y1={CENTER_Y}
                    x2={CENTER_X + RADIUS - 18}
                    y2={CENTER_Y}
                    stroke="#38bdf8"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                )}

                {/* MULTI-ANCHOR ROTATION CIRCULAR ORBIT TRACE */}
                {activeMode === 'propeller' && (
                  <g className="opacity-75">
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={RADIUS}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                  </g>
                )}

                {/* CHEMICAL SAW CROSSOVER FLIGHT PATH ARCS */}
                {activeMode === 'saw' && animProgress > 0.1 && (
                  <g className="opacity-50" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" fill="none">
                    <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} Q ${CENTER_X} ${CENTER_Y - 65} ${CENTER_X - RADIUS} ${CENTER_Y}`} />
                    <path d={`M ${CENTER_X - RADIUS} ${CENTER_Y} Q ${CENTER_X} ${CENTER_Y + 65} ${CENTER_X + RADIUS} ${CENTER_Y}`} />
                  </g>
                )}
              </svg>

              {/* Central Stereocenter Carbon C* */}
              <div
                className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: CENTER_X, top: CENTER_Y }}
              >
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCrashing
                      ? 'bg-rose-950 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.8)] scale-110'
                      : 'bg-slate-900 border-purple-500 shadow-[0_0_24px_rgba(168,85,247,0.45)]'
                  }`}
                >
                  <span className="font-mono font-black text-sm text-purple-300">C*</span>
                  <span className="absolute -inset-1 rounded-full border border-purple-400/40 animate-ping opacity-30 pointer-events-none" />
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-400 mt-0.5 tracking-wider">
                  Stereocenter
                </span>
                {show3DReality && (
                  <span className="text-[8px] font-mono text-cyan-300/80 -mt-0.5">
                    sp³ 109.5°
                  </span>
                )}
              </div>

              {/* TOP GROUP */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: groupPositions.top.x, top: groupPositions.top.y }}
                onClick={() => !isPlaying && setAnchorPosition('top')}
              >
                <AnchorBadge isAnchor={anchorPosition === 'top'} activeMode={activeMode} />
                <GroupPill group={groups.top} isAnchor={anchorPosition === 'top'} />
              </div>

              {/* BOTTOM GROUP */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: groupPositions.bottom.x, top: groupPositions.bottom.y }}
                onClick={() => !isPlaying && setAnchorPosition('bottom')}
              >
                <AnchorBadge isAnchor={anchorPosition === 'bottom'} activeMode={activeMode} />
                <GroupPill group={groups.bottom} isAnchor={anchorPosition === 'bottom'} />
              </div>

              {/* LEFT GROUP (Draggable to demonstrate the Illegal Slide / Physical Blockade) */}
              <motion.div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                style={{ left: groupPositions.left.x, top: groupPositions.left.y }}
                onClick={() => !isPlaying && setAnchorPosition('left')}
                drag={activeMode === 'idle' && !isCrashing}
                dragConstraints={{ left: 0, right: 190, top: -30, bottom: 30 }}
                dragElastic={0.2}
                dragSnapToOrigin={true}
                onDrag={(_e, info) => {
                  if (info.offset.x > 65 && !isCrashing && activeMode === 'idle') {
                    triggerStericCrash();
                  }
                }}
                onDragEnd={(_e, info) => {
                  if (info.offset.x > 50 && !isCrashing && activeMode === 'idle') {
                    triggerStericCrash();
                  }
                }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <AnchorBadge isAnchor={anchorPosition === 'left'} activeMode={activeMode} />
                  {activeMode === 'idle' && (
                    <span className="flex items-center gap-0.5 px-1 py-0.2 rounded text-[7.5px] font-mono text-cyan-300/80 bg-cyan-950/60 border border-cyan-800/40">
                      <Move className="h-2 w-2" />
                      <span>Drag Me</span>
                    </span>
                  )}
                </div>
                <GroupPill
                  group={groups.left}
                  isAnchor={anchorPosition === 'left'}
                  isDetached={activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.8}
                />
              </motion.div>

              {/* RIGHT GROUP */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: groupPositions.right.x, top: groupPositions.right.y }}
                onClick={() => !isPlaying && setAnchorPosition('right')}
              >
                <AnchorBadge isAnchor={anchorPosition === 'right'} activeMode={activeMode} />
                <GroupPill
                  group={groups.right}
                  isAnchor={anchorPosition === 'right'}
                  isDetached={activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.8}
                />
              </div>
            </div>
          </div>

          {/* ANIMATION SCRUBBER SLIDER & CONTROLS */}
          <div className="w-full p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Animation Scrub:</span>
              </span>
              <span className="text-cyan-300 font-bold">{Math.round(animProgress * 100)}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={animProgress}
              onChange={(e) => {
                setIsPlaying(false);
                if (activeMode === 'idle') setActiveMode('saw');
                setAnimProgress(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  if (activeMode === 'idle') setActiveMode('saw');
                  setIsPlaying(!isPlaying);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isPlaying
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                }`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => jumpToStep(Math.max(1, currentStep - 1))}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="Previous Step"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => jumpToStep(Math.min(4, currentStep + 1))}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="Next Step"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* INTERACTION ACTION BUTTONS                                      */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full relative z-10 pt-1">
            {/* Interaction 1: Multi-Anchor Propeller Spin */}
            <button
              type="button"
              onClick={() => startInteraction('propeller')}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'propeller'
                  ? 'border-purple-400 bg-purple-900/40 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-900 text-purple-200 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-purple-300 group-hover:text-purple-200">
                <RotateCcw className="h-3.5 w-3.5 text-purple-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Spin Remaining Groups</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono mt-1 font-semibold">
                (Hold {groups[anchorPosition].formula} Anchor)
              </span>
              <span className="text-[8.5px] text-emerald-400 mt-0.5 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>0 Bonds Cleaved • Identical</span>
              </span>
            </button>

            {/* Interaction 2: The Chemical Saw (Bond Breaking) */}
            <button
              type="button"
              onClick={() => startInteraction('saw')}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'saw'
                  ? 'border-rose-400 bg-rose-900/40 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900 text-rose-200 hover:border-rose-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-rose-300 group-hover:text-rose-200">
                <Scissors className="h-3.5 w-3.5 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Chemical Saw / Swap</span>
              </div>
              <span className="text-[10px] text-rose-300/80 font-mono mt-1 font-semibold">
                (Break Horizontal Bonds)
              </span>
              <span className="text-[8.5px] text-rose-400 mt-0.5 font-semibold flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5" />
                <span>2 Bonds Cleaved • Enantiomer</span>
              </span>
            </button>

            {/* Interaction 3: Rotate Whole Molecule 90° (Demonstrating Invalid View) */}
            <button
              type="button"
              onClick={handleRotate90}
              className="flex flex-col items-center justify-center text-center p-3 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-slate-900 text-amber-200 hover:border-amber-400 transition-all cursor-pointer shadow-lg group"
            >
              <div className="flex items-center gap-1 font-bold text-xs text-amber-300 group-hover:text-amber-200">
                <RotateCw className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
                <span>Rotate Molecule 90°</span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono mt-1">
                (Paper Turn)
              </span>
              <span className="text-[8.5px] text-amber-400 mt-0.5 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="h-2.5 w-2.5" />
                <span>Invalid Fischer View!</span>
              </span>
            </button>

            {/* Interaction 4: Rotate Whole Molecule 180° (Valid Homomer) */}
            <button
              type="button"
              onClick={handleRotate180}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'flip180'
                  ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-slate-900 text-cyan-200 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-cyan-300 group-hover:text-cyan-200">
                <RotateCw className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>Rotate Molecule 180°</span>
              </div>
              <span className="text-[10px] text-cyan-300/80 font-mono mt-1">
                (In-Plane Flip)
              </span>
              <span className="text-[8.5px] text-emerald-400 mt-0.5 font-semibold flex items-center gap-0.5">
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
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
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
                        currentCIP.isP4Horizontal ? 'text-amber-300 font-bold' : 'text-cyan-300 font-bold'
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
              ).map(({ prio, badgeColor }) => {
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
                  Orientation
                </div>
                <div className="text-lg font-mono font-black text-cyan-400 mt-0.5">
                  {wholeMoleculeRotation}°
                </div>
                <div
                  className={`text-[9px] font-mono ${
                    isInvalid90View ? 'text-rose-400 font-bold' : 'text-emerald-400'
                  }`}
                >
                  {isInvalid90View ? 'Invalid' : 'Valid View'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PEDAGOGICAL MASTERCLASS: WHY ROTATION ≠ BOND BREAKING          */}
      {/* ============================================================== */}
      <div className="w-full mt-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="h-3 w-3" />
              <span>THEORETICAL MASTERCLASS</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              3D Spatial Geometry vs 2D Projections
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            <BilingualText
              en="Why Rotating is NOT Bond Breaking, but Swapping MUST Break Bonds"
              bn="কেন ঘূর্ণনে বন্ধন ভাঙে না, কিন্তু দুটি গ্রুপের অদলবদলে বন্ধন ভাঙা আবশ্যক?"
            />
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            <BilingualText
              en="A deep-dive explanation for students: Understanding the 3D reality behind 2D drawings using the Umbrella Tripod Model, the Hand & Glove Paradox, and Permutation Parity."
              bn="শিক্ষার্থীদের জন্য গভীর বিশ্লেষণ: ছাতা-ট্রাইপড মডেল, হাত-দস্তানা প্যারাডক্স ও পারমিউটেশন প্যারিটি দিয়ে ২ডি চিত্রের পেছনের আসল ৩ডি বাস্তবতা অনুধাবন।"
            />
          </p>
        </div>

        {/* 3 Core Conceptual Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: The Umbrella / Tripod Model */}
          <div className="flex flex-col p-5 rounded-2xl bg-slate-950/60 border border-purple-500/30 shadow-lg relative overflow-hidden group hover:border-purple-500/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs border border-purple-500/40">
                1
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                0 Bonds Broken
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mt-3 flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-purple-400" />
              <BilingualText
                en="The 3D Tripod / Umbrella Model"
                bn="৩ডি ট্রাইপড / ছাতা মডেল"
              />
            </h4>

            <div className="my-3 py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center">
              <svg width="180" height="95" viewBox="0 0 180 95" className="overflow-visible">
                <line x1="90" y1="12" x2="90" y2="45" stroke="#06b6d4" strokeWidth="3" strokeDasharray="3 2" />
                <circle cx="90" cy="12" r="7" fill="#06b6d4" />
                <text x="90" y="8" fill="#a5f3fc" fontSize="8" fontWeight="bold" textAnchor="middle">Anchor Shaft</text>

                <circle cx="90" cy="45" r="9" fill="#9333ea" />
                <text x="90" y="48" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">C*</text>

                <line x1="90" y1="45" x2="45" y2="82" stroke="#f43f5e" strokeWidth="2.5" />
                <circle cx="45" cy="82" r="6" fill="#f43f5e" />
                <text x="45" y="93" fill="#fda4af" fontSize="8" textAnchor="middle">Leg 1</text>

                <line x1="90" y1="45" x2="90" y2="85" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="90" cy="85" r="6" fill="#6366f1" />
                <text x="90" y="94" fill="#c7d2fe" fontSize="8" textAnchor="middle">Leg 2</text>

                <line x1="90" y1="45" x2="135" y2="82" stroke="#f8fafc" strokeWidth="2.5" />
                <circle cx="135" cy="82" r="6" fill="#f8fafc" />
                <text x="135" y="93" fill="#ffffff" fontSize="8" textAnchor="middle">Leg 3</text>

                <path d="M 50 86 Q 90 98 130 86" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="Single covalent σ-bonds have cylindrical symmetry. Just like an umbrella or camera tripod, holding any anchor shaft and spinning the 3 legs by 120° breaks zero bonds. Bond angles stay 109.5°. You are merely viewing the exact same molecule from a different angle!"
                bn="একক সমযোজী সিগমা বন্ধনের সিলিন্ড্রিক্যাল প্রতিসাম্য থাকায় মুক্ত ঘূর্ণন সম্ভব। ছাতার ডাঁট ধরে নিচের ৩টি শিকড় ১২০° ঘোরালে কোনো বন্ধন ভাঙে না। বন্ধন কোণ ১০৯.৫° অপরিবর্তিত থাকে। এটি কেবল ভিন্ন কোণ থেকে একই অণুকে দেখা!"
              />
            </p>
          </div>

          {/* Pillar 2: The Hand & Glove Paradox */}
          <div className="flex flex-col p-5 rounded-2xl bg-slate-950/60 border border-rose-500/30 shadow-lg relative overflow-hidden group hover:border-rose-500/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold flex items-center justify-center text-xs border border-rose-500/40">
                2
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2 Bonds Broken
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mt-3 flex items-center gap-1.5">
              <Scissors className="h-4 w-4 text-rose-400" />
              <BilingualText
                en="The Hand & Glove Paradox"
                bn="হাত ও দস্তানা প্যারাডক্স (অদলবদল)"
              />
            </h4>

            <div className="my-3 py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-2xl select-none">🤚</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1">Left Hand</span>
                <span className="text-[9px] text-slate-400 font-mono">Thumb on Right</span>
              </div>

              <div className="flex flex-col items-center px-1">
                <span className="text-xs font-mono font-black text-rose-400">CANNOT</span>
                <span className="text-[9px] font-mono text-slate-500">ROTATE INTO</span>
                <span className="text-xs text-rose-400 font-black">⇄</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl select-none">✋</span>
                <span className="text-[10px] font-mono text-rose-300 font-bold mt-1">Right Hand</span>
                <span className="text-[9px] text-slate-400 font-mono">Thumb on Left</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="Hold your left hand in front of you (palm facing you). Can you spin or twist your left hand to put your thumb on the left side while keeping your palm forward and fingers up? Physically impossible! The ONLY way to swap them is cutting the thumb and pinky off and switching them. That is why 1 swap breaks bonds and inverts (R) to (S)!"
                bn="আপনার বাঁ হাত সামনে রাখুন (তালু আপনার দিকে)। হাত না উল্টে কি বুড়ো আঙুলকে বাঁয়ে আর কনিষ্ঠাকে ডানে আনা সম্ভব? অসম্ভব! একমাত্র উপায় আঙুল কেটে অদলবদল করা। এ কারণেই ১টি অদলবদল মানেই বন্ধন ভাঙা এবং (R) থেকে (S) রূপান্তর!"
              />
            </p>
          </div>

          {/* Pillar 3: 3D Tetrahedron vs 2D Fischer */}
          <div className="flex flex-col p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/30 shadow-lg relative overflow-hidden group hover:border-cyan-500/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs border border-cyan-500/40">
                3
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Fischer 2D Rules
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mt-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              <BilingualText
                en="The Fischer 'Hugging' Geometry"
                bn="ফিশার 'আলিঙ্গন' জ্যামিতি"
              />
            </h4>

            <div className="my-3 py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center">
              <div className="text-[11px] font-mono text-slate-300 text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-amber-300 font-bold">Vertical (Top/Bottom):</span>
                  <span className="text-slate-400 text-[10px]">Dashes (Away from you)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-cyan-300 font-bold">Horizontal (Left/Right):</span>
                  <span className="text-slate-400 text-[10px]">Wedges (Hugging toward you)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="A Fischer cross is not flat. Horizontal arms reach forward like a hug (wedges), while vertical bonds curve backward (dashes). A 180° in-plane flip keeps vertical as vertical and horizontal as horizontal (allowed!). A 90° turn swaps wedges with dashes (strictly forbidden in static projections)."
                bn="ফিশার ক্রস সমতল নয়। অনুভূমিক বাহু দুটি আলিঙ্গনের মতো সামনে এগিয়ে আসে, আর উল্লম্ব বন্ধন পিছনে চলে যায়। ১৮০° ঘোরালে উল্লম্ব উল্লম্বই থাকে (অনুমোদিত!)। কিন্তু ৯০° ঘোরালে ড্যাশ ও ওয়েজ উল্টে যায় (কঠোরভাবে নিষিদ্ধ)।"
              />
            </p>
          </div>
        </div>

        {/* Master Comparison Matrix Table */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-400" />
            <BilingualText
              en="Comprehensive Stereochemical Operation Matrix"
              bn="স্টেরিওরাসায়নিক ক্রিয়াকলাপের পূর্ণাঙ্গ তুলনামূলক সারণী"
            />
          </h4>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Operation / Action</th>
                <th className="py-2.5 px-3">Bonds Broken</th>
                <th className="py-2.5 px-3">Physical Meaning</th>
                <th className="py-2.5 px-3">Mathematical Parity</th>
                <th className="py-2.5 px-3">CIP (R)/(S) Status</th>
                <th className="py-2.5 px-3">Isomer Formed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-bold text-purple-300 flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>Spin Remaining Groups (Any Anchor)</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">0 Bonds</td>
                <td className="py-3 px-3">Free 3D rotation of 3-leg tripod around chosen anchor spindle</td>
                <td className="py-3 px-3 font-mono text-cyan-300">Even (Cyclic 3-cycle)</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">Unchanged (R → R)</td>
                <td className="py-3 px-3 font-bold text-emerald-300">Identical Homomer</td>
              </tr>

              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-bold text-rose-300 flex items-center gap-1.5">
                  <Scissors className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Chemical Saw / Swap Groups</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-rose-400">2 Bonds Broken</td>
                <td className="py-3 px-3">Physically cleaving left & right sigma bonds, crossing over, and re-bonding</td>
                <td className="py-3 px-3 font-mono text-rose-300">Odd (1 Transposition)</td>
                <td className="py-3 px-3 font-mono font-bold text-rose-400">Inverted (R ⇄ S)</td>
                <td className="py-3 px-3 font-bold text-rose-300">Enantiomer (Mirror Image)</td>
              </tr>

              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Rotate Molecule 90° In Plane</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-amber-400">0 Bonds (Drawing)</td>
                <td className="py-3 px-3">Violates convention! Horizontal wedges are forced into vertical rungs</td>
                <td className="py-3 px-3 font-mono text-amber-300">Falsifies Projection</td>
                <td className="py-3 px-3 font-mono font-bold text-rose-400">Falsely Inverted</td>
                <td className="py-3 px-3 font-bold text-rose-300">INVALID FISCHER VIEW</td>
              </tr>

              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-bold text-cyan-300 flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Rotate Molecule 180° In Plane</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">0 Bonds</td>
                <td className="py-3 px-3">Spinning whole cross in paper plane; equals 2 simultaneous swaps</td>
                <td className="py-3 px-3 font-mono text-cyan-300">Even ((-1) × (-1) = +1)</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">Unchanged (R → R)</td>
                <td className="py-3 px-3 font-bold text-cyan-300">Identical Homomer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Anchor status badge displayed above each group
 */
const AnchorBadge: React.FC<{ isAnchor: boolean; activeMode: AnimationMode }> = ({
  isAnchor,
  activeMode,
}) => {
  if (isAnchor) {
    return (
      <div
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1 transition-all ${
          activeMode === 'propeller'
            ? 'bg-amber-500/40 text-amber-200 border border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.6)] animate-pulse'
            : 'bg-amber-500/20 text-amber-300 border border-amber-400/60'
        }`}
      >
        <Lock className="h-2.5 w-2.5" />
        <span>Locked</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium text-slate-400 opacity-60 hover:opacity-100 hover:text-cyan-300 transition-opacity mb-1">
      <Unlock className="h-2 w-2" />
      <span>Anchor</span>
    </div>
  );
};

/**
 * Functional Group Pill Badge rendered at the 4 rungs of the Fischer cross
 */
const GroupPill: React.FC<{
  group: GroupItem;
  isAnchor?: boolean;
  isDetached?: boolean;
}> = ({ group, isAnchor, isDetached }) => {
  return (
    <div
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 backdrop-blur-md transition-all cursor-pointer select-none shadow-lg ${
        group.bgClass
      } ${group.borderColor} ${
        isAnchor
          ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
          : 'hover:scale-105'
      } ${isDetached ? 'scale-115 shadow-[0_0_26px_rgba(244,63,94,0.7)] animate-pulse' : ''}`}
      style={{
        boxShadow: isAnchor ? '0 0 20px rgba(245,158,11,0.5)' : `0 0 16px ${group.color}40`,
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
    </div>
  );
};
