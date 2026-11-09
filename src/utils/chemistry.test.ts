import { describe, it, expect } from 'vitest';
import {
  calculateDihedralAngle,
  calculateSpecificRotation,
  calculateEnantiomericExcess,
  calculateStereoisomerCounts,
  compareCIPAtoms,
} from './chemistry';

describe('Stereochemistry Utilities', () => {
  it('calculates dihedral angles correctly for staggered vs eclipsed', () => {
    // 4 points on a plane (eclipsed 0 degrees)
    const p1: [number, number, number] = [0, 1, 0];
    const p2: [number, number, number] = [0, 0, 0];
    const p3: [number, number, number] = [1, 0, 0];
    const p4: [number, number, number] = [1, 1, 0];
    const angle = calculateDihedralAngle(p1, p2, p3, p4);
    expect(angle).toBeCloseTo(0, 0);

    // anti-periplanar 180 degrees
    const p4Anti: [number, number, number] = [1, -1, 0];
    const angleAnti = calculateDihedralAngle(p1, p2, p3, p4Anti);
    expect(angleAnti).toBeCloseTo(180, 0);
  });

  it('calculates specific rotation using Biot law', () => {
    // alpha = +2.7 deg, l = 2 dm, c = 0.1 g/mL -> [alpha] = 2.7 / (2 * 0.1) = 13.5
    const spec = calculateSpecificRotation(2.7, 2, 0.1);
    expect(spec).toBe(13.5);
  });

  it('calculates enantiomeric excess (ee)', () => {
    const res = calculateEnantiomericExcess(80, 20);
    expect(res.ee).toBe(60);
    expect(res.major).toBe('dextro');

    const rac = calculateEnantiomericExcess(50, 50);
    expect(rac.ee).toBe(0);
    expect(rac.major).toBe('racemic');
  });

  it('calculates stereoisomer counts for unsymmetrical and symmetrical molecules', () => {
    // 2 chiral centers unsymmetrical (e.g. 2-bromo-3-chlorobutane)
    const unsym = calculateStereoisomerCounts(2, false);
    expect(unsym.total).toBe(4);
    expect(unsym.meso).toBe(0);

    // 2 chiral centers symmetrical (e.g. tartaric acid)
    const symEven = calculateStereoisomerCounts(2, true);
    expect(symEven.total).toBe(3);
    expect(symEven.active).toBe(2);
    expect(symEven.meso).toBe(1);

    // 3 chiral centers symmetrical (e.g. trihydroxyglutaric acid)
    const symOdd = calculateStereoisomerCounts(3, true);
    expect(symOdd.total).toBe(4);
    expect(symOdd.meso).toBe(2);
  });

  it('correctly compares atoms by CIP atomic number', () => {
    expect(compareCIPAtoms({ element: 'Br' }, { element: 'Cl' })).toBeGreaterThan(0);
    expect(compareCIPAtoms({ element: 'Cl' }, { element: 'O' })).toBeGreaterThan(0);
    expect(compareCIPAtoms({ element: 'O' }, { element: 'C' })).toBeGreaterThan(0);
    expect(compareCIPAtoms({ element: 'D' }, { element: 'H' })).toBeGreaterThan(0);
  });
});

