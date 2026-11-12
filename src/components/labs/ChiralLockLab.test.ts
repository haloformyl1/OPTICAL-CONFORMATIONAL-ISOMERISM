import { describe, it, expect } from 'vitest';
import {
  calculateCIP,
  getUnanchoredPositions,
  rotateUnanchoredCCW,
  type Position,
  type GroupItem,
} from './ChiralLockLab';

describe('ChiralLockLab - calculateCIP & Stereochemical Dynamics', () => {
  const lacticAcidInitial: Record<Position, GroupItem> = {
    top: {
      id: 'cooh',
      formula: 'COOH',
      name: { en: 'Carboxylic Acid', bn: 'কার্বক্সিলিক অ্যাসিড' },
      cipPriority: 2,
      atomicDetails: 'C(O,O,O)',
      color: '#06b6d4',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-500',
      bgClass: 'bg-cyan-500/20',
      badgeHex: '#06b6d4',
    },
    bottom: {
      id: 'ch3',
      formula: 'CH3',
      name: { en: 'Methyl Group', bn: 'মিথাইল গ্রুপ' },
      cipPriority: 3,
      atomicDetails: 'C(H,H,H)',
      color: '#6366f1',
      textColor: 'text-indigo-300',
      borderColor: 'border-indigo-500',
      bgClass: 'bg-indigo-500/20',
      badgeHex: '#6366f1',
    },
    right: {
      id: 'oh',
      formula: 'OH',
      name: { en: 'Hydroxyl Group', bn: 'হাইড্রক্সিল গ্রুপ' },
      cipPriority: 1,
      atomicDetails: 'Oxygen (Z=8)',
      color: '#f43f5e',
      textColor: 'text-rose-300',
      borderColor: 'border-rose-500',
      bgClass: 'bg-rose-500/20',
      badgeHex: '#f43f5e',
    },
    left: {
      id: 'h',
      formula: 'H',
      name: { en: 'Hydrogen Atom', bn: 'হাইড্রোজেন পরমাণু' },
      cipPriority: 4,
      atomicDetails: 'Hydrogen (Z=1)',
      color: '#f8fafc',
      textColor: 'text-white',
      borderColor: 'border-slate-400',
      bgClass: 'bg-slate-700/60',
      badgeHex: '#94a3b8',
    },
  };

  it('correctly calculates initial state (-COOH top, -CH3 bottom, -OH right, -H left) as (R)', () => {
    const result = calculateCIP(lacticAcidInitial);
    expect(result.configuration).toBe('R');
    expect(result.isP4Horizontal).toBe(true);
    expect(result.apparentDirection).toBe('Counter-Clockwise');
  });

  it('Chemical Saw (Swap Horizontal Groups): inverts (R) to (S) enantiomer', () => {
    const swapped = {
      ...lacticAcidInitial,
      left: lacticAcidInitial.right,
      right: lacticAcidInitial.left,
    };
    const result = calculateCIP(swapped);
    expect(result.configuration).toBe('S');
  });

  it('180° In-Plane Flip: preserves (R) configuration as identical homomer', () => {
    const flipped = {
      top: lacticAcidInitial.bottom,
      bottom: lacticAcidInitial.top,
      left: lacticAcidInitial.right,
      right: lacticAcidInitial.left,
    };
    const result = calculateCIP(flipped);
    expect(result.configuration).toBe('R');
  });

  describe('Multi-Anchor Propeller Rotation Invariance', () => {
    const anchors: Position[] = ['top', 'bottom', 'left', 'right'];

    anchors.forEach((anchor) => {
      it(`preserves (R) configuration when anchoring [${anchor.toUpperCase()}] and rotating unanchored 3 groups`, () => {
        let current = { ...lacticAcidInitial };

        // Test 3 consecutive rotations around this anchor (completing a full 360° cycle)
        for (let step = 1; step <= 3; step++) {
          current = rotateUnanchoredCCW(current, anchor);
          // Anchor group must stay exactly in place
          expect(current[anchor].id).toBe(lacticAcidInitial[anchor].id);

          // Stereocenter configuration must remain strictly (R)
          const result = calculateCIP(current);
          expect(result.configuration).toBe('R');
        }

        // After 3 cyclic steps, the molecule must return to its exact initial configuration
        expect(current.top.id).toBe(lacticAcidInitial.top.id);
        expect(current.bottom.id).toBe(lacticAcidInitial.bottom.id);
        expect(current.left.id).toBe(lacticAcidInitial.left.id);
        expect(current.right.id).toBe(lacticAcidInitial.right.id);
      });
    });

    it('returns the 3 distinct non-anchor positions in getUnanchoredPositions', () => {
      anchors.forEach((anchor) => {
        const unanchored = getUnanchoredPositions(anchor);
        expect(unanchored.length).toBe(3);
        expect(unanchored.includes(anchor)).toBe(false);
      });
    });
  });
});
