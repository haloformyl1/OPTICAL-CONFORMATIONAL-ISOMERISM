import { OPTICAL_EXAMPLES } from './opticalExamples';
import { CONFORMATIONAL_EXAMPLES } from './conformationalExamples';
import { EXCEPTIONAL_CASES } from './exceptionalCases';
import type { StereoisomerPair, IsomerismCategory } from '../../types/isomerism';

export { OPTICAL_EXAMPLES, CONFORMATIONAL_EXAMPLES, EXCEPTIONAL_CASES };

export const ALL_EXAMPLES: StereoisomerPair[] = [
  ...OPTICAL_EXAMPLES,
  ...CONFORMATIONAL_EXAMPLES,
  ...EXCEPTIONAL_CASES,
];

export const getExamplesByCategory = (category: IsomerismCategory | 'all'): StereoisomerPair[] => {
  if (category === 'all') return ALL_EXAMPLES;
  if (category === 'optical') return OPTICAL_EXAMPLES;
  if (category === 'conformational') return CONFORMATIONAL_EXAMPLES;
  if (category === 'exception') return EXCEPTIONAL_CASES;
  return ALL_EXAMPLES;
};

