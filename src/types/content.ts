export interface BilingualString {
  en: string;
  bn: string;
}

export interface Hint {
  id: string;
  order: number;
  content: BilingualString;
}

export interface Question {
  id: string;
  moduleId: string;
  topic?: string;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  skillType?: 'conceptual' | 'priority' | 'visual' | 'application';
  type?: 'mcq' | 'true_false' | 'assertion_reason';
  text: BilingualString;
  options: { id: string; text: BilingualString }[];
  correctOptionId: string;
  explanation: BilingualString;
  commonWrongAnswerExplanation?: BilingualString;
  hints?: Hint[];
}

export interface SectionContent {
  id: string;
  type: 'text' | 'formula' | 'example' | 'interactive_3d' | 'interactive_2d' | 'warning' | 'advanced_insight' | 'concept_map' | 'comparison_table' | 'misconception' | 'next_module_link';
  title?: BilingualString;
  content?: BilingualString;
  formulaTex?: string;
  modelConfig?: any;
}

export interface ModuleContent {
  id: string;
  order: number;
  title: BilingualString;
  learningObjectives: BilingualString[];
  sections: SectionContent[];
  misconceptions?: BilingualString[];
  summary?: BilingualString[];
  practiceQuestionIds?: string[];
  prerequisiteConcepts?: BilingualString[];
}

