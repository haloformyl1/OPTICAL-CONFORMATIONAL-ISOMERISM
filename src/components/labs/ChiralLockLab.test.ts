import { describe, it, expect } from 'vitest';
import { calculateCIP, type Position, type GroupItem } from './ChiralLockLab';

describe('ChiralLockLab - calculateCIP function', () => {
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

  it('Interaction 1 (Propeller Spin CCW): preserves (R) configuration after rotating bottom 3 groups', () => {
    // CCW cycle: left receives right, bottom receives left, right receives bottom. Top fixed.
    let current = { ...lacticAcidInitial };

    for (let step = 1; step <= 3; step++) {
      current = {
        top: current.top,
        left: current.right,
        bottom: current.left,
        right: current.bottom,
      };
      const result = calculateCIP(current);
      expect(result.configuration).toBe('R');
    }
  });

  it('Interaction 2 (Chemical Saw / Swap Horizontal Groups): inverts (R) to (S) enantiomer', () => {
    // Swap left and right
    const swapped = {
      ...lacticAcidInitial,
      left: lacticAcidInitial.right,
      right: lacticAcidInitial.left,
    };
    const result = calculateCIP(swapped);
    expect(result.configuration).toBe('S');
  });

  it('Interaction 3 (180° In-Plane Flip): preserves (R) configuration as identical homomer', () => {
    // 180° rotation: top <-> bottom, left <-> right
    const flipped = {
      top: lacticAcidInitial.bottom,
      bottom: lacticAcidInitial.top,
      left: lacticAcidInitial.right,
      right: lacticAcidInitial.left,
    };
    const result = calculateCIP(flipped);
    expect(result.configuration).toBe('R');
  });
});
