import { MODULE_00 } from './modules/00-symmetry-chirality';
import { MODULE_01 } from './modules/01-enantiomers-diastereomers';
import { MODULE_02 } from './modules/02-cip-rs-system';
import { MODULE_03 } from './modules/03-conformational-acyclic';
import { MODULE_04 } from './modules/04-conformational-cyclic';
import { MODULE_05 } from './modules/05-exceptional-optical';
import { MODULE_06 } from './modules/06-exceptional-conformational';
import type { ModuleContent } from '../types/content';

export const ALL_MODULES: ModuleContent[] = [
  MODULE_00,
  MODULE_01,
  MODULE_02,
  MODULE_03,
  MODULE_04,
  MODULE_05,
  MODULE_06,
];

export const getModuleById = (id: string): ModuleContent | undefined => {
  return ALL_MODULES.find((m) => m.id === id);
};

