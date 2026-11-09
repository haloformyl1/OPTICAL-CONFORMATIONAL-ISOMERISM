import type { ModuleContent } from '../../types/content';

export const MODULE_03: ModuleContent = {
  id: "03-conformational-acyclic",
  order: 3,
  title: {
    en: "3. Conformational Isomerism in Acyclic Systems",
    bn: "৩. মুক্তশিকল যৌগে কনফর্মেশনাল সমাণুতা"
  },
  learningObjectives: [
    {
      en: "Understand the concept of dihedral (torsion) angles and conformational rotamers.",
      bn: "ডাইহেড্রাল (টর্শন) কোণ এবং কনফর্মেশনাল ঘূর্ণকের ধারণা স্পষ্ট করা।"
    },
    {
      en: "Analyze the torsional strain in ethane (12 kJ/mol barrier) and propane (14 kJ/mol).",
      bn: "ইথেন (১২ কিজু/মোল) ও প্রোপেনের (১৪ কিজু/মোল) টর্শনাল বিকৃতি বিশ্লেষণ করা।"
    },
    {
      en: "Plot and interpret the complete potential energy diagram of n-butane (Anti, Gauche, Partially Eclipsed, Fully Eclipsed).",
      bn: "n-বিউটেনের সম্পূর্ণ বিভব শক্তি লেখচিত্র (অ্যান্টি, গশ, আংশিক গ্রহণযুক্ত, সম্পূর্ণ গ্রহণযুক্ত) অঙ্কন ও বিশ্লেষণ করা।"
    }
  ],
  sections: [
    {
      id: "dihedral-concept",
      type: "text",
      title: {
        en: "What are Conformational Isomers (Rotamers)?",
        bn: "কনফর্মেশনাল সমাণু (ঘূর্ণক) কী?"
      },
      content: {
        en: "Conformational isomers (conformers or rotamers) are different spatial arrangements of a molecule that result from temporary, rapid rotation around carbon-carbon SINGLE bonds (sigma bonds). Unlike stereoisomers that require breaking covalent bonds to interconvert (which have barriers > 100-260 kJ/mol), conformers interconvert continuously at room temperature via low energy barriers (12-25 kJ/mol) and cannot normally be isolated as separate bottles of chemicals.",
        bn: "কার্বন-কার্বন একক বন্ধনের (সিগমা বন্ধন) মুক্ত ঘূর্ণনের ফলে অণুর যে বিভিন্ন ক্ষণস্থায়ী ত্রিমাত্রিক বিন্যাস সৃষ্টি হয়, তাদের কনফর্মেশনাল সমাণু (ঘূর্ণক) বলে। সমযোজী বন্ধন না ভেঙে এরা সাধারণ তাপমাত্রায় অতি দ্রুত পরস্পর রূপান্তরিত হতে পারে (বাধা মাত্র ১২-২৫ কিজু/মোল)।"
      }
    },
    {
      id: "ethane-propane",
      type: "text",
      title: {
        en: "Conformations of Ethane and Propane",
        bn: "ইথেন ও প্রোপেনের কনফর্মেশন"
      },
      content: {
        en: "In Ethane (CH3-CH3), rotation produces two extreme forms: STAGGERED (dihedral angle theta = 60°, global minimum) and ECLIPSED (theta = 0°, global maximum). The energy difference is 12.0 kJ/mol (2.9 kcal/mol), known as Pitzer torsional strain. Because there are three pairs of eclipsed C-H bonds, each eclipsed H/H pair accounts for 4.0 kJ/mol.\nIn Propane (CH3-CH2-CH3), eclipsing one C-H bond with a methyl group costs 6.0 kJ/mol, raising the total barrier to 14.0 kJ/mol (3.4 kcal/mol).",
        bn: "ইথেনে দুটি মূল রূপ থাকে: স্ট্যাগার্ড (কোণ ৬০°, সর্বনিম্ন শক্তি) এবং এক্লিপসড (কোণ ০°, সর্বোচ্চ শক্তি)। এদের শক্তির ব্যবধান ১২.০ কিজু/মোল, যাকে পিটজার টর্শনাল বিকৃতি বলে। ৩ জোড়া C-H এক্লিপসিং বন্ধনের প্রতি জোড়া ৪.০ কিজু/মোল শক্তি যোগ করে।\nপ্রোপেনে একটি মিথাইল ও একটি হাইড্রোজেনের এক্লিপসিং ৬.০ কিজু/মোল হওয়ায় মোট বাধা ১৪.০ কিজু/মোল হয়।"
      }
    },
    {
      id: "butane-energy-curve",
      type: "comparison_table",
      title: {
        en: "Complete Energy Breakdown of n-Butane Rotamers",
        bn: "n-বিউটেনের ঘূর্ণকসমূহের পূর্ণ শক্তি বিভাজন"
      },
      content: {
        en: "1. Anti-periplanar (Anti, θ = 180°): 0 kJ/mol (Global Minimum). Two methyl groups are at maximum spatial distance; zero steric strain.\n2. Gauche (Synclinal, θ = 60° and 300°): +3.8 kJ/mol (Local Minimum). Staggered bonds, but methyl groups are separated by only 3.0 Å, experiencing van der Waals steric clash (Gauche interaction = 3.8 kJ/mol).\n3. Partially Eclipsed (Anticlinal, θ = 120° and 240°): +16.0 kJ/mol (Energy Barrier). Two H/CH3 eclipsed pairs (2 x 6.0 = 12 kJ) + one H/H eclipsed pair (4.0 kJ).\n4. Fully Eclipsed (Syn-periplanar, θ = 0° and 360°): +19.0 kJ/mol (Global Maximum). Maximum torsional + steric strain; two methyl groups collide head-on (CH3/CH3 clash = 11.0 kJ/mol).",
        bn: "১. অ্যান্টি-পেরিপ্ল্যানার (১৮০°): ০ কিজু/মোল (সর্বনিম্ন শক্তি)। দুটি মিথাইল সর্বাধিক দূরত্বে থাকে।\n২. গশ (৬০° ও ৩০০°): +৩.৮ কিজু/মোল (স্থানীয় নিম্নশক্তি)। স্ট্যাগার্ড হলেও মিথাইল দুটির মধ্যে ৩.০ Å দূরত্বের কারণে স্থানিক বিকর্ষণ ঘটে।\n৩. আংশিক গ্রহণযুক্ত (১২০° ও ২৪০°): +১৬.০ কিজু/মোল। দুটি H/CH3 গ্রহণযুক্ত জোড়া (১২ কিজু) এবং একটি H/H জোড়া (৪ কিজু)।\n৪. সম্পূর্ণ গ্রহণযুক্ত (০° ও ৩৬০°): +১৯.০ কিজু/মোল (সর্বোচ্চ শক্তি)। দুটি মিথাইল মুখোমুখি প্রচণ্ড সংঘর্ষে লিপ্ত হয়।"
      }
    }
  ],
  summary: [
    {
      en: "Anti is the most stable conformer of n-butane, followed by Gauche (3.8 kJ/mol higher). Fully eclipsed is the least stable (+19.0 kJ/mol).",
      bn: "n-বিউটেনের সবচেয়ে স্থিতিশীল রূপ হলো অ্যান্টি, এরপর গশ (৩.৮ কিজু/মোল উচ্চ)। সম্পূর্ণ গ্রহণযুক্ত রূপটি সর্বনিম্ন স্থিতিশীল (+১৯.০ কিজু/মোল)।"
    }
  ]
};
