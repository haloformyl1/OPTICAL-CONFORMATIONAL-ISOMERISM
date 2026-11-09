import type { BilingualString } from './content';

export type IsomerismCategory = 'optical' | 'conformational' | 'exception';

export interface Atom3D {
  id: string;
  element: string; // 'C', 'H', 'Cl', 'Br', 'F', 'I', 'O', 'N', 'P', 'S', etc.
  name?: string;
  position: [number, number, number];
  color?: string;
  radius?: number;
  label?: string;
  charge?: number;
  cipPriority?: 1 | 2 | 3 | 4;
  isStereocenter?: boolean;
  configuration?: 'R' | 'S' | 'r' | 's';
  conformationType?: 'axial' | 'equatorial';
}

export interface Bond3D {
  from: string; // atom id
  to: string;   // atom id
  order: 1 | 2 | 3;
  color?: string;
  wedgeType?: 'solid' | 'wedge' | 'dash';
}

export interface DipoleVector {
  from: [number, number, number];
  to: [number, number, number];
  magnitude: number; // in Debyes
}

export interface SymmetryInfo {
  hasPOS: boolean; // Plane of Symmetry (sigma)
  posDescription?: BilingualString;
  hasCOS: boolean; // Center of Symmetry (i)
  cosDescription?: BilingualString;
  hasAAOS?: boolean; // Alternating Axis of Symmetry (Sn)
  isChiral: boolean;
  chiralReason: BilingualString;
}

export interface ConformationalInfo {
  conformerName: 'anti' | 'gauche' | 'partially-eclipsed' | 'fully-eclipsed' | 'chair' | 'boat' | 'twist-boat' | 'half-chair';
  dihedralAngleDeg?: number;
  relativeEnergyKJ: number; // in kJ/mol
  torsionalStrain?: string;
  stericStrain?: string;
  isException?: boolean;
  exceptionNote?: BilingualString;
}

export interface OpticalInfo {
  stereocentersCount: number;
  configurationRS?: string; // e.g. "(2R, 3R)", "(S)"
  opticalActivity: 'dextro (+)' | 'levo (-)' | 'racemic (±)' | 'inactive (meso)' | 'inactive (achiral)';
  specificRotation?: string; // e.g. "+13.5°", "0.0°"
  isMeso: boolean;
  isResolved?: boolean;
}

export interface MolecularStructure3D {
  name: BilingualString;
  formula: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  dipoleNet?: number;
  dipoleVectors?: DipoleVector[];
  stabilityRank?: 'most' | 'intermediate' | 'least';
  stabilityReason?: BilingualString;
  specialProperty?: BilingualString;
  symmetry?: SymmetryInfo;
  conformational?: ConformationalInfo;
  optical?: OpticalInfo;
}

export interface CIPStepDerivation {
  centerAtomId: string;
  centerAtomLabel: string;
  priorities: Array<{
    priority: 1 | 2 | 3 | 4;
    groupName: string;
    atomicNumber: number;
    ruleApplied: string;
  }>;
  result: 'R' | 'S' | 'r' | 's';
  explanation: BilingualString;
}

export interface StereoisomerPair {
  id: string;
  category: IsomerismCategory;
  iupacName: BilingualString;
  commonName?: BilingualString | null;
  formula: string;
  systemType: 'alkane' | 'haloalkane' | 'diol' | 'cyclohexane' | 'allene' | 'biphenyl' | 'spirane' | 'amine' | 'acid' | 'sugar' | 'alkene' | 'carbocycle';
  relationship: 'enantiomers' | 'diastereomers' | 'identical' | 'meso' | 'conformers' | 'rotamers';
  isomerA: {
    label: string; // e.g. "(R)-Lactic acid", "Anti-Butane", "Chair 1"
    descriptor: string;
    structure: MolecularStructure3D;
  };
  isomerB: {
    label: string; // e.g. "(S)-Lactic acid", "Gauche-Butane", "Twist-Boat"
    descriptor: string;
    structure: MolecularStructure3D;
  };
  cipDerivation?: CIPStepDerivation;
  energyProfile?: Array<{ angle: number; energy: number; label: string }>;
  pedagogicalNote: BilingualString;
  isException?: boolean;
  exceptionMechanism?: BilingualString;
}
