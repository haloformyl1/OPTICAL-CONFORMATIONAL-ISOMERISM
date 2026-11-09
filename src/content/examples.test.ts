import { describe, it, expect } from 'vitest';
import { OPTICAL_EXAMPLES } from './examples/opticalExamples';
import { CONFORMATIONAL_EXAMPLES } from './examples/conformationalExamples';
import { EXCEPTIONAL_CASES } from './examples/exceptionalCases';
import { QUESTIONS } from './questions';
import { ALL_MODULES } from './index';

describe('Curated Database Integrity', () => {
  it('has at least 50 Optical Isomerism 3D examples', () => {
    expect(OPTICAL_EXAMPLES.length).toBeGreaterThanOrEqual(50);
    for (const ex of OPTICAL_EXAMPLES) {
      expect(ex.id).toBeTruthy();
      expect(ex.iupacName.en).toBeTruthy();
      expect(ex.iupacName.bn).toBeTruthy();
      expect(ex.formula).toBeTruthy();
      expect(ex.category).toBe('optical');
      expect(ex.isomerA.structure.atoms.length).toBeGreaterThan(0);
      expect(ex.isomerB.structure.atoms.length).toBeGreaterThan(0);
    }
  });

  it('has at least 50 Conformational Isomerism 3D examples', () => {
    expect(CONFORMATIONAL_EXAMPLES.length).toBeGreaterThanOrEqual(50);
    for (const ex of CONFORMATIONAL_EXAMPLES) {
      expect(ex.id).toBeTruthy();
      expect(ex.iupacName.en).toBeTruthy();
      expect(ex.iupacName.bn).toBeTruthy();
      expect(ex.formula).toBeTruthy();
      expect(ex.category).toBe('conformational');
      expect(ex.isomerA.structure.atoms.length).toBeGreaterThan(0);
      expect(ex.isomerB.structure.atoms.length).toBeGreaterThan(0);
    }
  });

  it('has at least 20 Exceptional Cases (>=10 optical and >=10 conformational)', () => {
    const opticalExceptions = EXCEPTIONAL_CASES.filter((c) => c.id.startsWith('exc-opt'));
    const conformationalExceptions = EXCEPTIONAL_CASES.filter((c) => c.id.startsWith('exc-conf'));

    expect(opticalExceptions.length).toBeGreaterThanOrEqual(10);
    expect(conformationalExceptions.length).toBeGreaterThanOrEqual(10);
    expect(EXCEPTIONAL_CASES.length).toBeGreaterThanOrEqual(20);

    for (const ex of EXCEPTIONAL_CASES) {
      expect(ex.id).toBeTruthy();
      expect(ex.iupacName.en).toBeTruthy();
      expect(ex.iupacName.bn).toBeTruthy();
      expect(ex.exceptionMechanism?.en).toBeTruthy();
      expect(ex.exceptionMechanism?.bn).toBeTruthy();
      expect(ex.isomerA.structure.atoms.length).toBeGreaterThan(0);
      expect(ex.isomerB.structure.atoms.length).toBeGreaterThan(0);
    }
  });

  it('has curriculum modules with bilingual content', () => {
    expect(ALL_MODULES.length).toBeGreaterThanOrEqual(7);
    for (const mod of ALL_MODULES) {
      expect(mod.id).toBeTruthy();
      expect(mod.title.en).toBeTruthy();
      expect(mod.title.bn).toBeTruthy();
      expect(mod.sections.length).toBeGreaterThan(0);
    }
  });

  it('has valid practice questions with bilingual explanations', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(15);
    for (const q of QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.text.en).toBeTruthy();
      expect(q.text.bn).toBeTruthy();
      expect(q.options.length).toBe(4);
      expect(q.options.map((o) => o.id)).toContain(q.correctOptionId);
      expect(q.explanation.en).toBeTruthy();
      expect(q.explanation.bn).toBeTruthy();
    }
  });
});
