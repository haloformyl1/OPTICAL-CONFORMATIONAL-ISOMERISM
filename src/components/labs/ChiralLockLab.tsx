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
  ArrowRight,
  Zap,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
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

// Preset 2: 1-Bromo-1-chloromethan-1-ol
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

export type AnimationMode = 'idle' | 'propeller' | 'saw' | 'flip180';

export interface StepNarrative {
  step: number;
  title: { en: string; bn: string };
  badgeText: string;
  description: { en: string; bn: string };
  chemicalPrinciple: { en: string; bn: string };
}

// Fixed dimensions for the Fischer canvas coordinate system
const CANVAS_SIZE = 340;
const CENTER_X = 170;
const CENTER_Y = 170;
const RADIUS = 95;

export const ChiralLockLab: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = PRESETS[activePresetIndex];

  // Base state of groups before or after an operation
  const [groups, setGroups] = useState<Record<Position, GroupItem>>(() => ({
    ...activePreset.initialGroups,
  }));

  // Operation history counters
  const [bondsBrokenCount, setBondsBrokenCount] = useState(0);
  const [singleBondRotationsCount, setSingleBondRotationsCount] = useState(0);
  const [flips180Count, setFlips180Count] = useState(0);

  // Animation Engine State
  const [activeMode, setActiveMode] = useState<AnimationMode>('idle');
  const [animProgress, setAnimProgress] = useState<number>(0); // 0.0 to 1.0
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [totalRotationDeg, setTotalRotationDeg] = useState(0);

  const animFrameRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number | null>(null);
  const ANIM_DURATION = 3200; // ms for a full step-by-step cycle

  // Initial reference configuration for comparison
  const initialCIP = useMemo(() => calculateCIP(activePreset.initialGroups), [activePreset]);

  // Current real-time CIP calculation based on active displayed state
  const currentCIP = useMemo(() => calculateCIP(groups), [groups]);
  const isEnantiomer = currentCIP.configuration !== initialCIP.configuration;

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
    setTotalRotationDeg(0);
    setActiveMode('idle');
    setAnimProgress(0);
    setIsPlaying(false);
  }, [activePreset]);

  // =========================================================================
  // ANIMATION LOOP (Auto-play across 0.0 -> 1.0)
  // =========================================================================
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
        // Animation completed its cycle: finalize the permanent state
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
      setGroups((prev) => ({
        top: prev.top,
        left: prev.right,
        bottom: prev.left,
        right: prev.bottom,
      }));
    } else if (mode === 'saw') {
      setBondsBrokenCount((prev) => prev + 1);
      setGroups((prev) => ({
        top: prev.top,
        bottom: prev.bottom,
        left: prev.right,
        right: prev.left,
      }));
    } else if (mode === 'flip180') {
      setFlips180Count((prev) => prev + 1);
      setTotalRotationDeg((prev) => prev + 180);
      setGroups((prev) => ({
        top: prev.bottom,
        bottom: prev.top,
        left: prev.right,
        right: prev.left,
      }));
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
    if (activeMode === 'idle') setActiveMode('saw'); // default to saw demo if idle
    const progressMap = [0.1, 0.4, 0.7, 0.98];
    setAnimProgress(progressMap[stepNum - 1]);
  };

  // Reset to initial state
  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGroups({ ...activePreset.initialGroups });
    setBondsBrokenCount(0);
    setSingleBondRotationsCount(0);
    setFlips180Count(0);
    setTotalRotationDeg(0);
    setActiveMode('idle');
    setAnimProgress(0);
    setIsPlaying(false);
  };

  // =========================================================================
  // STEP NARRATIVE CONTENT FOR EACH INTERACTION
  // =========================================================================
  const currentNarrative: StepNarrative = useMemo(() => {
    if (activeMode === 'saw') {
      switch (currentStep) {
        case 1:
          return {
            step: 1,
            title: {
              en: 'Step 1: Identify & Target Covalent Bonds',
              bn: 'ধাপ ১: সমযোজী বন্ধন লক্ষ্য নির্ধারণ',
            },
            badgeText: 'TARGETING BONDS',
            description: {
              en: `Targeting the horizontal bonds connecting ${groups.left.formula} and ${groups.right.formula} to the chiral stereocenter C*. Notice that horizontal bonds represent wedges projecting out of the screen toward you.`,
              bn: `কাইরাল কেন্দ্র C*-এর সাথে যুক্ত অনুভূমিক বন্ধন ${groups.left.formula} এবং ${groups.right.formula}-কে লক্ষ্য করা হচ্ছে। অনুভূমিক বন্ধনগুলি আপনার দিকে মুখ করে থাকা ওয়েজ।`,
            },
            chemicalPrinciple: {
              en: 'Tetrahedral geometry locks substituents in space. They cannot swap without severing sigma bonds.',
              bn: 'চতুস্তলকীয় জ্যামিতিতে পরমাণুগুলি আবদ্ধ থাকে। সিগমা বন্ধন না ভেঙে এরা স্থান পরিবর্তন করতে পারে না।',
            },
          };
        case 2:
          return {
            step: 2,
            title: {
              en: 'Step 2: Covalent Bond Cleavage (Bonds Severed!)',
              bn: 'ধাপ ২: সমযোজী বন্ধন বিদারণ (বন্ধন ভাঙন!)',
            },
            badgeText: 'BONDS CLEAVED ⚡',
            description: {
              en: `Energy is supplied to sever the two horizontal sigma bonds! ${groups.left.formula} and ${groups.right.formula} physically detach from the stereocenter, creating floating fragments. 2 covalent bonds are broken!`,
              bn: `শক্তি প্রয়োগ করে দুটি অনুভূমিক সিগমা বন্ধন ভেঙে ফেলা হয়েছে! ${groups.left.formula} এবং ${groups.right.formula} বিচ্ছিন্ন হয়ে মুক্ত অংশে পরিণত হয়েছে। ২টি বন্ধন ভাঙা হলো!`,
            },
            chemicalPrinciple: {
              en: 'Bond dissociation energy required. The stereocenter loses its tetrahedral locking temporarily.',
              bn: 'বন্ধন বিয়োজন শক্তি প্রয়োজন। স্টেরিওসেন্টারটি সাময়িকভাবে চতুস্তলকীয় বন্ধন হারায়।',
            },
          };
        case 3:
          return {
            step: 3,
            title: {
              en: 'Step 3: Mid-Air Spatial Cross-Over (Inversion in Transit)',
              bn: 'ধাপ ৩: শূন্যে স্থান অতিক্রম (কাইরালিটি পরিবর্তন)',
            },
            badgeText: 'CROSSING OVER 🔀',
            description: {
              en: `The detached groups physically cross over each other in space! ${groups.right.formula} arcs UPWARD over the central carbon, while ${groups.left.formula} arcs DOWNWARD. They exchange sides in space.`,
              bn: `বিচ্ছিন্ন গ্রুপ দুটি শূন্যে একে অপরকে অতিক্রম করছে! ${groups.right.formula} উপরের দিক দিয়ে এবং ${groups.left.formula} নিচের দিক দিয়ে আবর্তিত হয়ে স্থান অদলবদল করছে।`,
            },
            chemicalPrinciple: {
              en: '1 single swap changes the permutation parity of the 4 coordinates from even to odd (parity inversion).',
              bn: '১টি একক অদলবদল ৪টি স্থানাঙ্কের বিন্যাস প্যারিটি পরিবর্তন করে (ইনভার্সন)।',
            },
          };
        case 4:
        default:
          return {
            step: 4,
            title: {
              en: 'Step 4: Re-attachment & Inversion to Enantiomer',
              bn: 'ধাপ ৪: পুনঃসংযোজন ও এন্যানশিওমারে রূপান্তর',
            },
            badgeText: 'ENANTIOMER CREATED ✨',
            description: {
              en: `The groups snap into the opposite positions and new covalent bonds reform! Because exactly 1 swap was executed, the stereocenter has inverted into its non-superimposable mirror image (Enantiomer)!`,
              bn: `গ্রুপ দুটি বিপরীত প্রান্তে গিয়ে নতুন বন্ধন তৈরি করল! ঠিক ১টি অদলবদল সম্পন্ন হওয়ায় কনফিগারেশন উল্টে গিয়ে এন্যানশিওমার সৃষ্টি হলো!`,
            },
            chemicalPrinciple: {
              en: 'Golden Rule: 1 Swap = Inversion of Configuration (R ⇄ S). Non-superimposable enantiomer formed.',
              bn: 'সোনালী সূত্র: ১টি অদলবদল = কনফিগারেশনের রূপান্তর (R ⇄ S)। অপ্রকৃত দর্পণ প্রতিবিম্ব তৈরি হয়।',
            },
          };
      }
    } else if (activeMode === 'propeller') {
      switch (currentStep) {
        case 1:
          return {
            step: 1,
            title: {
              en: 'Step 1: Lock Top Axis as Fixed Pivot',
              bn: 'ধাপ ১: শীর্ষ বন্ধনকে স্থির ঘূর্ণন অক্ষ হিসেবে লক করা',
            },
            badgeText: 'AXIS LOCKED 🔒',
            description: {
              en: `The top C-${groups.top.formula} bond is clamped tightly as a stationary rotational axis. It will NOT be broken, detached, or moved. It acts as the spindle of a 3D propeller.`,
              bn: `উপরের C-${groups.top.formula} বন্ধনটি একটি স্থির অক্ষ হিসেবে লক করা হলো। এটি অক্ষত থাকবে এবং প্রপেলারের স্পিন্ডল হিসেবে কাজ করবে।`,
            },
            chemicalPrinciple: {
              en: 'Single sigma bonds have cylindrical symmetry and allow free rotation in space without breaking bonds.',
              bn: 'একক সিগমা বন্ধনের সিলিন্ড্রিক্যাল প্রতিসাম্য থাকায় বন্ধন না ভেঙে মুক্ত ঘূর্ণন সম্ভব।',
            },
          };
        case 2:
          return {
            step: 2,
            title: {
              en: 'Step 2: Activate 3D Tripod Circular Orbit',
              bn: 'ধাপ ২: ৩ডি ট্রাইপড বৃত্তাকার পথ সক্রিয়করণ',
            },
            badgeText: 'TRIPOD ORBIT ⭕',
            description: {
              en: `The remaining three substituents (${groups.right.formula}, ${groups.left.formula}, ${groups.bottom.formula}) form a tetrahedral tripod. A circular trajectory appears connecting them.`,
              bn: `বাকি তিনটি গ্রুপ (${groups.right.formula}, ${groups.left.formula}, ${groups.bottom.formula}) একটি চতুস্তলকীয় ট্রাইপড গঠন করে। এদের সংযোগকারী বৃত্তাকার পথ দৃশ্যমান হয়েছে।`,
            },
            chemicalPrinciple: {
              en: 'Rotating a tripod around the 3-fold axis corresponds to a cyclic permutation of 3 groups (an even permutation).',
              bn: '৩-গ্রুপের ট্রাইপড ঘূর্ণন একটি সাইক্লিক পারমিউটেশন (যুগ্ম পারমিউটেশন)।',
            },
          };
        case 3:
          return {
            step: 3,
            title: {
              en: 'Step 3: Simultaneous 120° Counter-Clockwise Rotation',
              bn: 'ধাপ ৩: একসাথে ১২০° ঘড়ির কাঁটার বিপরীত ঘূর্ণন',
            },
            badgeText: 'ROTATING 120° 🔄',
            description: {
              en: `All three groups glide simultaneously along their curved circular track! ${groups.right.formula} sweeps to Left, ${groups.left.formula} glides to Bottom, and ${groups.bottom.formula} moves to Right. ZERO bonds are cleaved!`,
              bn: `তিনটি গ্রুপ একই সাথে তাদের বৃত্তাকার পথে এগিয়ে যাচ্ছে! কোনো বন্ধন ভাঙা হচ্ছে না, কেবল মহাশূন্যে ত্রিমাত্রিক ঘূর্ণন ঘটছে!`,
            },
            chemicalPrinciple: {
              en: 'Rigid body rotation in 3D Euclidean space SO(3) preserves chiral orientation and distance invariants.',
              bn: 'ত্রিমাত্রিক ইউক্লিডীয় স্থানে ঘূর্ণন কাইরাল দিক এবং দূরত্বের সমতা বজায় রাখে।',
            },
          };
        case 4:
        default:
          return {
            step: 4,
            title: {
              en: 'Step 4: Settle into New Fischer Projection (R/S Unchanged!)',
              bn: 'ধাপ ৪: নতুন ফিশার অবস্থানে স্থির (R/S অপরিবর্তিত!)',
            },
            badgeText: 'CONFIGURATION PRESERVED ✓',
            description: {
              en: `The three groups arrive at their new rungs. Notice: although the groups have changed positions on the cross, the true 3D stereocenter configuration remains strictly identical!`,
              bn: `তিনটি গ্রুপ নতুন অবস্থানে পৌঁছাল। লক্ষ্য করুন: ক্রসে গ্রুপগুলোর অবস্থান বদলালেও আসল ত্রিমাত্রিক কনফিগারেশন অপরিবর্তিত রয়েছে!`,
            },
            chemicalPrinciple: {
              en: 'Rule: 3-Group Rotation (Cyclic Permutation) = Exactly Identical Homomer. Configuration is preserved!',
              bn: 'সূত্র: ৩-গ্রুপ ঘূর্ণন = হুবহু অভিন্ন হোমোমার। কনফিগারেশন সংরক্ষিত থাকে!',
            },
          };
      }
    } else if (activeMode === 'flip180') {
      switch (currentStep) {
        case 1:
          return {
            step: 1,
            title: {
              en: 'Step 1: Original In-Plane Fischer Orientation',
              bn: 'ধাপ ১: মূল সমতলীয় ফিশার অবস্থান',
            },
            badgeText: 'STARTING VIEW 📐',
            description: {
              en: `Standard Fischer rules: Vertical rungs project AWAY from viewer (dashes), while horizontal rungs project TOWARDS viewer (wedges).`,
              bn: `প্রমাণ ফিশার নিয়ম: উল্লম্ব বন্ধন পাতার পিছনে (ড্যাশ) এবং অনুভূমিক বন্ধন সামনে (ওয়েজ)।`,
            },
            chemicalPrinciple: {
              en: 'A 2D Fischer cross is a shorthand projection of a 3D tetrahedron.',
              bn: 'একটি ২ডি ফিশার ক্রস হলো ৩ডি চতুস্তলকের সংক্ষিপ্ত অভিক্ষেপ।',
            },
          };
        case 2:
        case 3:
          return {
            step: currentStep,
            title: {
              en: 'Step 2 & 3: Smooth 180° In-Plane Spin',
              bn: 'ধাপ ২ ও ৩: সমতলে ১৮০° মসৃণ ঘূর্ণন',
            },
            badgeText: 'SPINNING 180° 🔄',
            description: {
              en: `The entire molecule spins smoothly like a steering wheel in the plane of the screen. Notice that spinning 180° maintains the vertical rungs as vertical and horizontal as horizontal!`,
              bn: `পুরো অণুটি সমতলে ১৮০° ঘুরছে। লক্ষ্য করুন ১৮০° ঘোরালে উল্লম্ব বন্ধন উল্লম্ব এবং অনুভূমিক বন্ধন অনুভূমিকই থাকে!`,
            },
            chemicalPrinciple: {
              en: '90° in-plane rotation is strictly FORBIDDEN because it converts dashes to wedges. 180° rotation is ALLOWED.',
              bn: '৯০° ঘূর্ণন নিষিদ্ধ কারণ তা ড্যাশ ও ওয়েজ বদলে দেয়। ১৮০° ঘূর্ণন সম্পূর্ণ অনুমোদিত।',
            },
          };
        case 4:
        default:
          return {
            step: 4,
            title: {
              en: 'Step 4: Superimposable Identical Homomer',
              bn: 'ধাপ ৪: উপরিপাতযোগ্য অভিন্ন হোমোমার',
            },
            badgeText: 'HOMOMER CONFIRMED ✓',
            description: {
              en: `180° rotation equals TWO simultaneous swaps (Top ↔ Bottom and Left ↔ Right). Two swaps cancel out parity changes: (-1) × (-1) = +1. The structure is 100% superimposable!`,
              bn: `১৮০° ঘূর্ণন মানে একই সাথে দুটি অদলবদল (উপর ↔ নিচ এবং বাম ↔ ডান)। দুটি অদলবদল কাইরালিটি অক্ষত রাখে: (-১) × (-১) = +১।`,
            },
            chemicalPrinciple: {
              en: 'Even number of swaps (2) preserves stereocenter configuration. Homomer verified.',
              bn: 'যুগ্ম সংখ্যক অদলবদল (২টি) কনফিগারেশন সংরক্ষণ করে। অভিন্নতা প্রমাণিত।',
            },
          };
      }
    } else {
      // Idle state
      return {
        step: 1,
        title: {
          en: 'Interactive Ready: Select an Operation Below',
          bn: 'প্রস্তুত: নিচে একটি ইন্টারঅ্যাকশন নির্বাচন করুন',
        },
        badgeText: 'READY TO EXPLORE 🔬',
        description: {
          en: 'Click "Rotate Single Bonds" to witness 3D tripod rotation preserving (R)/(S), or "Swap Horizontal Groups" to watch bond cleavage and enantiomer creation step-by-step!',
          bn: 'একক বন্ধন ঘূর্ণন দেখতে "একক বন্ধন আবর্তন" অথবা বন্ধন ভেঙে এন্যানশিওমার তৈরি দেখতে "অনুভূমিক গ্রুপ অদলবদল" বোতামে ক্লিক করুন!',
        },
        chemicalPrinciple: {
          en: 'Rule: 1 Swap = Enantiomer (Inversion). 3-Group Rotation = Identical Homomer.',
          bn: 'সূত্র: ১টি অদলবদল = এন্যানশিওমার। ৩-গ্রুপ ঘূর্ণন = অভিন্ন হোমোমার।',
        },
      };
    }
  }, [activeMode, currentStep, groups]);

  // =========================================================================
  // DYNAMIC 2D COORDINATE ENGINE FOR GROUPS UNDER ANIMATION
  // Calculates precise (x, y) coordinates for each of the 4 groups at animProgress p
  // =========================================================================
  const groupPositions = useMemo(() => {
    const p = animProgress;

    // Default static slot positions
    const pos = {
      top: { x: CENTER_X, y: CENTER_Y - RADIUS },
      bottom: { x: CENTER_X, y: CENTER_Y + RADIUS },
      left: { x: CENTER_X - RADIUS, y: CENTER_Y },
      right: { x: CENTER_X + RADIUS, y: CENTER_Y },
    };

    if (activeMode === 'saw') {
      // CHEMICAL SAW / HORIZONTAL BOND BREAKING & CROSSOVER
      // Left and Right detach, arc across, and snap
      const leftStartX = CENTER_X - RADIUS;
      const rightStartX = CENTER_X + RADIUS;

      if (p <= 0.25) {
        // Phase 1: Detachment (pulling outward slightly)
        const det = (p / 0.25) * 18;
        pos.left = { x: leftStartX - det, y: CENTER_Y };
        pos.right = { x: rightStartX + det, y: CENTER_Y };
      } else if (p <= 0.8) {
        // Phase 2: Crossover in mid-air
        const u = (p - 0.25) / 0.55;
        // Right moves to left, arcing UPWARD above center
        const rightX = (rightStartX + 18) - (rightStartX - leftStartX + 36) * u;
        const rightY = CENTER_Y - Math.sin(u * Math.PI) * 48;

        // Left moves to right, arcing DOWNWARD below center
        const leftX = (leftStartX - 18) + (rightStartX - leftStartX + 36) * u;
        const leftY = CENTER_Y + Math.sin(u * Math.PI) * 48;

        pos.right = { x: rightX, y: rightY };
        pos.left = { x: leftX, y: leftY };
      } else {
        // Phase 3: Snap into opposite slots
        const v = (p - 0.8) / 0.2;
        const snap = (1 - v) * 12;
        pos.right = { x: leftStartX - snap, y: CENTER_Y };
        pos.left = { x: rightStartX + snap, y: CENTER_Y };
      }
    } else if (activeMode === 'propeller') {
      // PROPELLER SPIN (Counter-Clockwise rotation of bottom 3 groups)
      // Top group stays locked at (CENTER_X, CENTER_Y - RADIUS)
      // Right (angle 0) moves towards Left (angle PI) via bottom/center arc
      // Left (angle PI) moves to Bottom (angle PI/2)
      // Bottom (angle PI/2) moves to Right (angle 0)

      // Group starting at Left -> moves to Bottom
      const angleLeft = Math.PI - (Math.PI / 2) * p;
      pos.left = {
        x: CENTER_X + RADIUS * Math.cos(angleLeft),
        y: CENTER_Y + RADIUS * Math.sin(angleLeft),
      };

      // Group starting at Bottom -> moves to Right
      const angleBottom = Math.PI / 2 - (Math.PI / 2) * p;
      pos.bottom = {
        x: CENTER_X + RADIUS * Math.cos(angleBottom),
        y: CENTER_Y + RADIUS * Math.sin(angleBottom),
      };

      // Group starting at Right -> sweeps across to Left
      // Arcs smoothly across with a slight dip below the central stereocenter
      const rx = (CENTER_X + RADIUS) - 2 * RADIUS * p;
      const ry = CENTER_Y + Math.sin(p * Math.PI) * 36;
      pos.right = { x: rx, y: ry };
    }

    return pos;
  }, [activeMode, animProgress]);

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
              Step-by-Step Fischer Dynamics & CIP Preservation
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
              en="Step-by-step visual proof: Single bond rotation preserves chirality, while bond breaking inverts it."
              bn="ধাপে ধাপে দৃশ্যমান প্রমাণ: একক বন্ধন ঘূর্ণন কাইরালিটি সংরক্ষণ করে, যেখানে বন্ধন ভাঙন এটিকে উল্টে দেয়।"
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

      {/* Golden Rule Banner */}
      <div className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-semibold shadow-sm">
        <div className="flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>
              <BilingualText en="Fundamental Stereochemistry Rule:" bn="মৌলিক স্টেরিওরসায়নের নিয়ম:" />
            </strong>{' '}
            <span className="font-mono text-amber-300">
              <BilingualText
                en="1 Bond Swap = Enantiomer (Inversion). 3-Group Rotation = Identical Homomer."
                bn="১টি বন্ধন অদলবদল = এন্যানশিওমার। ৩-গ্রুপ ঘূর্ণন = অভিন্ন হোমোমার।"
              />
            </span>
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30 shrink-0 hidden sm:inline">
          Board & NEET Exam Essential
        </span>
      </div>

      {/* Main Grid: Interactive Stage (Left) + Stereocenter Status Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: INTERACTIVE FISCHER PROJECTION ANIMATION STAGE     */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl space-y-4">
          {/* Subtle Circuit Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* STEP NARRATIVE CARD (Live Explanation for Current Frame) */}
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

          {/* STEP TABS: [Step 1] [Step 2] [Step 3] [Step 4] */}
          <div className="grid grid-cols-4 gap-1.5 w-full relative z-10">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => jumpToStep(stepNum)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border text-center ${
                  currentStep === stepNum
                    ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                Step {stepNum}
              </button>
            ))}
          </div>

          {/* ============================================================== */}
          {/* CENTRAL 2D FISCHER PROJECTION ANIMATION BOARD                 */}
          {/* ============================================================== */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center my-2 select-none overflow-visible">
            {/* 180° In-Plane Whole Molecule Rotation Wrapper */}
            <div
              style={{
                transform: `rotate(${totalRotationDeg + (activeMode === 'flip180' ? animProgress * 180 : 0)}deg)`,
                transformOrigin: '170px 170px',
                transition: activeMode === 'flip180' ? 'none' : 'transform 0.4s ease-out',
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
                  {/* Glowing Filter for Chemical Bond Cleavage Sparks */}
                  <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Vertical Bond Line (Center to Top & Bottom) */}
                {/* Dashes represent bonds going away behind plane */}
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y - RADIUS + 15}
                  x2={CENTER_X}
                  y2={CENTER_Y + RADIUS - 15}
                  stroke="#475569"
                  strokeWidth="5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />

                {/* Horizontal Bond Line (Center to Left & Right) */}
                {/* Solid cyan wedges representing bonds coming forward */}
                {activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.85 ? (
                  // Severed Horizontal Bonds with Broken Fracture Stubs!
                  <g filter="url(#laser-glow)">
                    {/* Left Broken Stub */}
                    <line
                      x1={CENTER_X}
                      y1={CENTER_Y}
                      x2={CENTER_X - 42}
                      y2={CENTER_Y}
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Right Broken Stub */}
                    <line
                      x1={CENTER_X}
                      y1={CENTER_Y}
                      x2={CENTER_X + 42}
                      y2={CENTER_Y}
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Laser Cleaver Sparks / Fracture Burst at Center */}
                    <circle cx={CENTER_X - 42} cy={CENTER_Y} r="5" fill="#f43f5e" />
                    <circle cx={CENTER_X + 42} cy={CENTER_Y} r="5" fill="#f43f5e" />
                    <line
                      x1={CENTER_X - 50}
                      y1={CENTER_Y - 14}
                      x2={CENTER_X - 35}
                      y2={CENTER_Y + 14}
                      stroke="#fb7185"
                      strokeWidth="3"
                    />
                    <line
                      x1={CENTER_X + 35}
                      y1={CENTER_Y - 14}
                      x2={CENTER_X + 50}
                      y2={CENTER_Y + 14}
                      stroke="#fb7185"
                      strokeWidth="3"
                    />
                  </g>
                ) : (
                  // Intact Solid Horizontal Bond
                  <line
                    x1={CENTER_X - RADIUS + 15}
                    y1={CENTER_Y}
                    x2={CENTER_X + RADIUS - 15}
                    y2={CENTER_Y}
                    stroke={activeMode === 'saw' ? '#f43f5e' : '#38bdf8'}
                    strokeWidth={activeMode === 'saw' ? '6' : '5'}
                    strokeLinecap="round"
                    className="transition-colors duration-300"
                  />
                )}

                {/* PROPELLER ROTATION CIRCULAR ORBIT TRACE */}
                {activeMode === 'propeller' && (
                  <g className="opacity-70">
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={RADIUS}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    {/* Directional Curved Arrows */}
                    <path
                      d={`M ${CENTER_X - RADIUS + 10} ${CENTER_Y + 40} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS - 10} ${CENTER_Y + 40}`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* CHEMICAL SAW CROSSOVER FLIGHT PATH ARCS */}
                {activeMode === 'saw' && animProgress > 0.1 && (
                  <g className="opacity-40" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" fill="none">
                    {/* Top Arc for Right Group */}
                    <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} Q ${CENTER_X} ${CENTER_Y - 60} ${CENTER_X - RADIUS} ${CENTER_Y}`} />
                    {/* Bottom Arc for Left Group */}
                    <path d={`M ${CENTER_X - RADIUS} ${CENTER_Y} Q ${CENTER_X} ${CENTER_Y + 60} ${CENTER_X + RADIUS} ${CENTER_Y}`} />
                  </g>
                )}
              </svg>

              {/* Central Stereocenter Carbon C* */}
              <div
                className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: CENTER_X, top: CENTER_Y }}
              >
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border-2 border-purple-500 shadow-[0_0_24px_rgba(168,85,247,0.45)]">
                  <span className="font-mono font-black text-sm text-purple-300">C*</span>
                  <span className="absolute -inset-1 rounded-full border border-purple-400/40 animate-ping opacity-30 pointer-events-none" />
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-400 mt-0.5 tracking-wider">
                  Stereocenter
                </span>
              </div>

              {/* TOP GROUP: Locked Pivot */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: groupPositions.top.x, top: groupPositions.top.y }}
              >
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1 transition-all ${
                    activeMode === 'propeller'
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <Lock className="h-2.5 w-2.5" />
                  <span>{activeMode === 'propeller' ? 'Locked Pivot' : 'Top Pivot'}</span>
                </div>
                <GroupPill group={groups.top} />
              </div>

              {/* BOTTOM GROUP */}
              <div
                className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: groupPositions.bottom.x, top: groupPositions.bottom.y }}
              >
                <GroupPill group={groups.bottom} />
              </div>

              {/* LEFT GROUP */}
              <div
                className="absolute z-30 flex items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: groupPositions.left.x, top: groupPositions.left.y }}
              >
                <GroupPill group={groups.left} isDetached={activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.8} />
              </div>

              {/* RIGHT GROUP */}
              <div
                className="absolute z-30 flex items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: groupPositions.right.x, top: groupPositions.right.y }}
              >
                <GroupPill group={groups.right} isDetached={activeMode === 'saw' && animProgress > 0.2 && animProgress < 0.8} />
              </div>
            </div>
          </div>

          {/* ANIMATION SCRUBBER SLIDER & CONTROLS */}
          <div className="w-full p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Animation Progress Scrub:</span>
              </span>
              <span className="text-cyan-300 font-bold">{Math.round(animProgress * 100)}%</span>
            </div>

            {/* Range Scrubber Track */}
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

            {/* Play, Pause & Step Buttons */}
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
          {/* THREE MAIN INTERACTIVE ACTION BUTTONS                          */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full relative z-10 pt-1">
            {/* Interaction 1: Propeller Spin */}
            <button
              type="button"
              onClick={() => startInteraction('propeller')}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'propeller'
                  ? 'border-purple-400 bg-purple-900/40 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-900 text-purple-200 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300 group-hover:text-purple-200">
                <RotateCcw className="h-4 w-4 text-purple-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>
                  <BilingualText en="Rotate Single Bonds" bn="একক বন্ধন আবর্তন" />
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
              onClick={() => startInteraction('saw')}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'saw'
                  ? 'border-rose-400 bg-rose-900/40 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900 text-rose-200 hover:border-rose-400'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300 group-hover:text-rose-200">
                <Scissors className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
                <span>
                  <BilingualText en="Swap Horizontal Groups" bn="অনুভূমিক গ্রুপ অদলবদল" />
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
              onClick={() => startInteraction('flip180')}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                activeMode === 'flip180'
                  ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-slate-900 text-cyan-200 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300 group-hover:text-cyan-200">
                <RotateCw className="h-4 w-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>
                  <BilingualText en="Rotate Entire Molecule 180°" bn="পুরো অণু ১৮০° ঘোরান" />
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
const GroupPill: React.FC<{
  group: GroupItem;
  isDetached?: boolean;
}> = ({ group, isDetached }) => {
  return (
    <div
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 backdrop-blur-md transition-all cursor-default select-none shadow-lg ${
        group.bgClass
      } ${group.borderColor} ${isDetached ? 'scale-110 shadow-[0_0_24px_rgba(244,63,94,0.6)] animate-pulse' : ''}`}
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
    </div>
  );
};
