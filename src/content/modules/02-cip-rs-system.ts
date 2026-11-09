import type { ModuleContent } from '../../types/content';

export const MODULE_02: ModuleContent = {
  id: "02-cip-rs-system",
  order: 2,
  title: {
    en: "2. Stereochemical Projections & CIP R/S Notation",
    bn: "২. স্টেরিওরাসায়নিক অভিক্ষেপ ও সিআইপি R/S পদ্ধতি"
  },
  learningObjectives: [
    {
      en: "Interconvert between Flying Wedge, Fischer, Sawhorse, and Newman projections.",
      bn: "ওয়েজ-ড্যাশ, ফিশার, স হর্স এবং নিউম্যান প্রজেকশনের পারস্পরিক রূপান্তর আয়ত্ত করা।"
    },
    {
      en: "Apply the 4 Cahn-Ingold-Prelog (CIP) sequence rules without ambiguity.",
      bn: "কান-ইনগোল্ড-প্রীলগের (CIP) ৪টি অগ্রাধিকার নিয়ম নির্ভুলভাবে প্রয়োগ করা।"
    },
    {
      en: "Calculate the total number of stereoisomers (2^n rule, symmetrical vs unsymmetrical molecules).",
      bn: "মোট স্টেরিওসমাণুর সংখ্যা গণনা করা (২^n সূত্র, প্রতিসম ও অপ্রতিসম অণুর ক্ষেত্রে)।"
    }
  ],
  sections: [
    {
      id: "projections-overview",
      type: "text",
      title: {
        en: "The Four Classical Stereochemical Projections",
        bn: "চারটি সনাতন স্টেরিওরাসায়নিক অভিক্ষেপ"
      },
      content: {
        en: "1. Flying Wedge (Wedge-Dash): Solid line in plane; solid wedge pointing towards the observer (out of page); dashed wedge pointing away from the observer (into page).\n2. Fischer Projection: A 2D cross representation where VERTICAL bonds project away from you (behind page) and HORIZONTAL bonds project towards you (out of page)!\n3. Sawhorse Projection: A side-on 3D perspective along the carbon-carbon axis.\n4. Newman Projection: An end-on view directly along the carbon-carbon bond axis (front carbon is a vertex, back carbon is a large circle).",
        bn: "১. ওয়েজ-ড্যাশ: সাধারণ রেখা তলে থাকে; গাঢ় ওয়েজ দর্শকের দিকে এবং ড্যাশড ওয়েজ পেছনের দিকে থাকে।\n২. ফিশার প্রজেকশন: ২ডি ক্রস যেখানে উল্লম্ব বন্ধনগুলো দর্শকের থেকে দূরে এবং অনুভূমিক বন্ধনগুলো দর্শকের দিকে থাকে!\n৩. স হর্স প্রজেকশন: পাশ থেকে দেখা ত্রিমাত্রিক পরিপ্রেক্ষিত।\n৪. নিউম্যান প্রজেকশন: সরাসরি C-C বন্ধনের অক্ষ বরাবর সম্মুখ দৃশ্য (সামনের কার্বন বিন্দু এবং পেছনের কার্বন বৃত্ত)।"
      }
    },
    {
      id: "cip-rules",
      type: "comparison_table",
      title: {
        en: "The 4 Cahn-Ingold-Prelog (CIP) Rules for Assigning Priorities (1 to 4)",
        bn: "অগ্রাধিকার নির্ধারণের ৪টি সিআইপি নিয়ম"
      },
      content: {
        en: "Rule 1 (Atomic Number Z): Priority is based on the atomic number of the atom directly bonded to the stereocenter (e.g. -I (53) > -Br (35) > -Cl (17) > -OH (8) > -NH2 (7) > -CH3 (6) > -H (1)). Lone pairs are assigned priority 0.\nRule 2 (Isotopes): If atomic numbers are identical, the heavier isotope takes priority (e.g. Tritium (3) > Deuterium (2) > Protium (1); 13C > 12C).\nRule 3 (Tie-Breakers): If directly attached atoms are tied, list the atoms attached to each in decreasing order and compare atom-by-atom at the FIRST POINT OF DIFFERENCE (e.g. -CH2CH3 (bonded to C,H,H) beats -CH3 (bonded to H,H,H)).\nRule 4 (Double and Triple Bonds): Multiple bonds are treated as duplicated or triplicated 'phantom' atoms (e.g. -CH=O is treated as a carbon bonded to two oxygens (O, O, H); -C#N is treated as a carbon bonded to three nitrogens (N, N, N)).",
        bn: "নিয়ম ১ (পারমাণবিক সংখ্যা Z): সরাসরি যুক্ত পরমাণুর পারমাণবিক সংখ্যা বেশি হলে অগ্রাধিকার বেশি। নিঃসঙ্গ জোড় শূন্য পায়।\nনিয়ম ২ (আইসোটোপ): পারমাণবিক সংখ্যা এক হলে ভারী আইসোটোপ অগ্রাধিকার পায় (T > D > H)।\nনিয়ম ৩ (টাই-ব্রেকার): প্রথম পরমাণু এক হলে পরবর্তী পরমাণুগুলির তালিকা করে প্রথম পার্থক্যের বিন্দুতে তুলনা করা হয় (-CH2CH3 > -CH3)।\nনিয়ম ৪ (দ্বি ও ত্রিবন্ধন): দ্বিবন্ধনযুক্ত পরমাণুকে কাল্পনিক ডুপ্লিকেট হিসেবে ধরা হয় (-CH=O কে দুটি অক্সিজেনযুক্ত কার্বন ধরা হয়)।"
      }
    },
    {
      id: "rs-assignment-steps",
      type: "text",
      title: {
        en: "Step-by-Step Assignment of (R) and (S)",
        bn: "(R) ও (S) কনফিগারেশন নির্ধারণের ধাপসমূহ"
      },
      content: {
        en: "1. Assign priorities 1 (highest) to 4 (lowest) using CIP rules.\n2. Orient the lowest priority group (4) away from your eye.\n3. Trace the remaining groups 1 -> 2 -> 3.\n4. If 1 -> 2 -> 3 goes CLOCKWISE -> (R) (from Latin rectus, right).\n5. If 1 -> 2 -> 3 goes COUNTER-CLOCKWISE -> (S) (from Latin sinister, left).",
        bn: "১. সিআইপি নিয়ম অনুযায়ী ১ (সর্বোচ্চ) থেকে ৪ (সর্বনিম্ন) অগ্রাধিকার দিন।\n২. সর্বনিম্ন অগ্রাধিকারপ্রাপ্ত ৪ নম্বর গ্রুপকে চোখের থেকে দূরে রাখুন।\n৩. বাকি গ্রুপগুলোকে ১ -> ২ -> ৩ হিসেবে পর্যবেক্ষণ করুন।\n৪. ১ -> ২ -> ৩ ঘড়ির কাঁটার দিকে হলে -> (R)।\n৫. ১ -> ২ -> ৩ ঘড়ির কাঁটার বিপরীতে হলে -> (S)।"
      }
    },
    {
      id: "stereoisomer-formulas",
      type: "formula",
      title: {
        en: "Mathematical Calculation of Total Stereoisomers",
        bn: "মোট স্টেরিওসমাণু সংখ্যার গাণিতিক হিসাব"
      },
      content: {
        en: "For an organic compound with n chiral stereocenters:\n• Unsymmetrical Molecule: Total = 2^n (all optically active, 0 meso).\n• Symmetrical Molecule with EVEN n: Active = 2^(n-1), Meso = 2^(n/2 - 1), Total = 2^(n-1) + 2^(n/2 - 1).\n• Symmetrical Molecule with ODD n: Active = 2^(n-1) - 2^((n-1)/2), Meso = 2^((n-1)/2), Total = 2^(n-1).",
        bn: "n সংখ্যক কাইরাল কেন্দ্রযুক্ত যৌগের ক্ষেত্রে:\n• অপ্রতিসম অণু: মোট = ২^n (সব কয়টি সক্রিয়, ০ মেসো)।\n• জোড় n বিশিষ্ট প্রতিসম অণু: সক্রিয় = ২^(n-১), মেসো = ২^(n/২ - ১), মোট = ২^(n-১) + ২^(n/২ - ১)।\n• বিজোড় n বিশিষ্ট প্রতিসম অণু: মোট = ২^(n-১), মেসো = ২^((n-১)/২)।"
      },
      formulaTex: "N_{\\text{total}} = 2^{n-1} + 2^{\\frac{n}{2} - 1} \\quad (\\text{even symmetrical})"
    }
  ],
  summary: [
    {
      en: "CIP priorities depend strictly on atomic numbers, never on electronegativity or group weight.",
      bn: "সিআইপি অগ্রাধিকার সম্পূর্ণ পারমাণবিক সংখ্যার ওপর নির্ভর করে, তড়িৎঋণাত্মকতা বা আণবিক ভরের ওপর নয়।"
    },
    {
      en: "Fischer horizontal group 4 rule: In a Fischer projection, if group 4 is on a horizontal bond, the apparent result MUST be inverted (Clockwise = S, Counter-clockwise = R).",
      bn: "ফিশার অনুভূমিক নিয়ম: ৪ নম্বর গ্রুপ অনুভূমিক বন্ধনে থাকলে দৃশ্যমান ফলাফল উল্টে দিতে হবে (ঘড়ির কাঁটার দিক = S, বিপরীত দিক = R)।"
    }
  ]
};
