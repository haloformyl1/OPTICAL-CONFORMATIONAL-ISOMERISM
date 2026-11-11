// Chemistry utilities: CPK colors, atomic radii, CIP sequence comparison, 3D math & stereochemistry rules

export interface ElementCPK {
  color: string;
  radius: number; // Van der Waals radius scaled for 3D view
  atomicNumber: number;
}

export const ELEMENT_DATA: Record<string, ElementCPK> = {
  H: { color: '#ffffff', radius: 0.28, atomicNumber: 1 },
  D: { color: '#e0e7ff', radius: 0.28, atomicNumber: 1 }, // Deuterium
  T: { color: '#c7d2fe', radius: 0.28, atomicNumber: 1 }, // Tritium
  C: { color: '#334155', radius: 0.44, atomicNumber: 6 },
  N: { color: '#3b82f6', radius: 0.42, atomicNumber: 7 },
  O: { color: '#ef4444', radius: 0.40, atomicNumber: 8 },
  F: { color: '#22c55e', radius: 0.38, atomicNumber: 9 },
  Cl: { color: '#10b981', radius: 0.52, atomicNumber: 17 },
  Br: { color: '#991b1b', radius: 0.58, atomicNumber: 35 },
  I: { color: '#7e22ce', radius: 0.65, atomicNumber: 53 },
  P: { color: '#f97316', radius: 0.50, atomicNumber: 15 },
  S: { color: '#eab308', radius: 0.52, atomicNumber: 16 },
  B: { color: '#f472b6', radius: 0.46, atomicNumber: 5 },
};

export const getElementColor = (el: string): string => {
  return ELEMENT_DATA[el]?.color || '#94a3b8';
};

export const GROUP_COLORS: Record<string, string> = {
  // Halogens
  F: '#22c55e',          // Light Mint Green
  Cl: '#10b981',         // Emerald Green
  Br: '#dc2626',         // Reddish-Brown / Crimson
  I: '#7e22ce',          // Royal Violet / Purple
  // Oxygen functional groups
  OH: '#f43f5e',         // Rose / Coral Red
  COOH: '#06b6d4',       // Cyan / Teal
  CHO: '#f97316',        // Orange (Aldehyde)
  CH2OH: '#14b8a6',      // Teal
  CH2COOH: '#0ea5e9',    // Sky Blue
  // Alkyl chains - each distinct group has a distinct color!
  CH3: '#475569',        // Slate Charcoal (Methyl)
  CH2CH3: '#6366f1',     // Royal Indigo (Ethyl) - distinct from CH3!
  C2H5: '#6366f1',       // Royal Indigo (Ethyl)
  Propyl: '#84cc16',     // Lime Green
  C3H7: '#84cc16',       // Lime Green
  // Nitrogen functional groups
  NH2: '#2563eb',        // Cobalt Blue
  NHCH3: '#3b82f6',      // Dodger Blue
  NO2: '#ea580c',        // Vermilion
  CN: '#ec4899',         // Hot Pink
  // Aromatics
  Phenyl: '#c026d3',     // Magenta
  Ph: '#c026d3',         // Magenta
  C6H5: '#c026d3',       // Magenta
  // Sulfur
  SH: '#eab308',         // Amber Yellow
  // Hydrogen and isotopes
  H: '#f8fafc',          // Crisp White
  D: '#a5f3fc',          // Ice Blue (Deuterium)
  T: '#93c5fd',          // Sky Blue (Tritium)
};

export const getGroupColor = (label?: string, element?: string): string => {
  if (label) {
    const clean = label.replace(/[()*\s]/g, '');
    if (GROUP_COLORS[clean]) return GROUP_COLORS[clean];
    if (clean === 'CH2CH3' || clean === 'C2H5' || clean.includes('CH2CH3')) return '#6366f1';
    if (clean === 'CH3') return '#475569';
    if (clean.startsWith('OH')) return '#f43f5e';
    if (clean.startsWith('COOH')) return '#06b6d4';
    if (clean.startsWith('CHO')) return '#f97316';
    if (clean.startsWith('CH2OH')) return '#14b8a6';
    if (clean.startsWith('Cl')) return '#10b981';
    if (clean.startsWith('Br')) return '#dc2626';
    if (clean.startsWith('NH2')) return '#2563eb';
    if (clean.startsWith('Ph') || clean.includes('Phenyl')) return '#c026d3';
    if (clean === 'H') return '#f8fafc';
  }
  if (element && ELEMENT_DATA[element]) {
    return ELEMENT_DATA[element].color;
  }
  return '#94a3b8';
};

export const getElementRadius = (el: string): number => {
  return ELEMENT_DATA[el]?.radius || 0.4;
};

export const getAtomicNumber = (el: string): number => {
  return ELEMENT_DATA[el]?.atomicNumber || 0;
};

/**
 * Compare two atoms or groups by Cahn-Ingold-Prelog Rule 1 (Atomic Number) and Rule 2 (Isotopes)
 */
export const compareCIPAtoms = (
  atomA: { element: string; massNumber?: number },
  atomB: { element: string; massNumber?: number }
): number => {
  const zA = getAtomicNumber(atomA.element);
  const zB = getAtomicNumber(atomB.element);
  if (zA !== zB) return zA - zB;

  const getMass = (atom: { element: string; massNumber?: number }) => {
    if (atom.massNumber) return atom.massNumber;
    if (atom.element === 'H') return 1;
    if (atom.element === 'D') return 2;
    if (atom.element === 'T') return 3;
    return getAtomicNumber(atom.element) * 2;
  };
  return getMass(atomA) - getMass(atomB);
};

/**
 * Calculate the dihedral angle (torsion angle) in degrees between 4 points in 3D: A - B - C - D
 */
export const calculateDihedralAngle = (
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  p4: [number, number, number]
): number => {
  const b1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  const b2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];
  const b3 = [p4[0] - p3[0], p4[1] - p3[1], p4[2] - p3[2]];

  // Normal to plane 1-2-3: n1 = b1 x b2
  const n1 = [
    b1[1] * b2[2] - b1[2] * b2[1],
    b1[2] * b2[0] - b1[0] * b2[2],
    b1[0] * b2[1] - b1[1] * b2[0],
  ];

  // Normal to plane 2-3-4: n2 = b2 x b3
  const n2 = [
    b2[1] * b3[2] - b2[2] * b3[1],
    b2[2] * b3[0] - b2[0] * b3[2],
    b2[0] * b3[1] - b2[1] * b3[0],
  ];

  // Unit vector along b2
  const b2Len = Math.hypot(b2[0], b2[1], b2[2]);
  if (b2Len === 0) return 0;
  const m = [b2[0] / b2Len, b2[1] / b2Len, b2[2] / b2Len];

  // m x n1
  const mxn1 = [
    m[1] * n1[2] - m[2] * n1[1],
    m[2] * n1[0] - m[0] * n1[2],
    m[0] * n1[1] - m[1] * n1[0],
  ];

  const x = n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2];
  const y = mxn1[0] * n2[0] + mxn1[1] * n2[1] + mxn1[2] * n2[2];

  let deg = (Math.atan2(y, x) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return Math.round(deg * 10) / 10;
};

/**
 * Rotate a 3D point around an arbitrary axis defined by origin and unit direction vector by angle theta (radians)
 * Rodrigues' rotation formula
 */
export const rotatePointAroundAxis = (
  point: [number, number, number],
  axisOrigin: [number, number, number],
  axisDir: [number, number, number],
  angleRad: number
): [number, number, number] => {
  const p = [point[0] - axisOrigin[0], point[1] - axisOrigin[1], point[2] - axisOrigin[2]];
  const [ux, uy, uz] = axisDir;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Dot product p . u
  const dot = p[0] * ux + p[1] * uy + p[2] * uz;

  // Cross product u x p
  const cross = [
    uy * p[2] - uz * p[1],
    uz * p[0] - ux * p[2],
    ux * p[1] - uy * p[0],
  ];

  const rx = p[0] * cos + cross[0] * sin + ux * dot * (1 - cos);
  const ry = p[1] * cos + cross[1] * sin + uy * dot * (1 - cos);
  const rz = p[2] * cos + cross[2] * sin + uz * dot * (1 - cos);

  return [rx + axisOrigin[0], ry + axisOrigin[1], rz + axisOrigin[2]];
};

/**
 * Biot's law for specific rotation [alpha] = alpha / (l * c)
 * alpha: observed angle in degrees
 * l: pathlength in decimeters (dm)
 * c: concentration in g/mL
 */
export const calculateSpecificRotation = (
  observedDegrees: number,
  lengthDm: number,
  concentrationGml: number
): number => {
  if (lengthDm <= 0 || concentrationGml <= 0) return 0;
  return Math.round((observedDegrees / (lengthDm * concentrationGml)) * 100) / 100;
};

/**
 * Optical purity or enantiomeric excess (% ee)
 * % ee = |d - l| / (d + l) * 100
 */
export const calculateEnantiomericExcess = (
  dextroAmount: number,
  levoAmount: number
): { ee: number; major: 'dextro' | 'levo' | 'racemic' } => {
  const total = dextroAmount + levoAmount;
  if (total <= 0) return { ee: 0, major: 'racemic' };
  const diff = Math.abs(dextroAmount - levoAmount);
  const ee = Math.round((diff / total) * 1000) / 10;
  if (dextroAmount > levoAmount) return { ee, major: 'dextro' };
  if (levoAmount > dextroAmount) return { ee, major: 'levo' };
  return { ee: 0, major: 'racemic' };
};

/**
 * Calculate total number of stereoisomers for an organic compound
 * n = number of pseudo/chiral centers
 */
export const calculateStereoisomerCounts = (
  n: number,
  isSymmetrical: boolean
): { total: number; active: number; meso: number; formulaUsed: string } => {
  if (n <= 0) return { total: 1, active: 0, meso: 0, formulaUsed: 'No stereocenters' };

  if (!isSymmetrical) {
    const total = Math.pow(2, n);
    return {
      total,
      active: total,
      meso: 0,
      formulaUsed: '2^n (Unsymmetrical molecule)',
    };
  }

  // Symmetrical molecule
  if (n % 2 === 0) {
    // Even number of chiral centers
    const active = Math.pow(2, n - 1);
    const meso = Math.pow(2, n / 2 - 1);
    return {
      total: active + meso,
      active,
      meso,
      formulaUsed: 'Active = 2^(n-1), Meso = 2^(n/2 - 1)',
    };
  } else {
    // Odd number of chiral centers
    const total = Math.pow(2, n - 1);
    const active = total - Math.pow(2, (n - 1) / 2);
    const meso = Math.pow(2, (n - 1) / 2);
    return {
      total,
      active,
      meso,
      formulaUsed: 'Total = 2^(n-1), Meso = 2^((n-1)/2)',
    };
  }
};

