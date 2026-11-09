import type { Question } from '../types/content';

export const QUESTION_BANK: Question[] = [
  {
    id: "q01",
    moduleId: "00-symmetry-chirality",
    topic: "Chirality & Symmetry",
    difficulty: "easy",
    type: "mcq",
    text: {
      en: "Which of the following symmetry elements MUST be absent for a molecule to exhibit optical activity?",
      bn: "কোন প্রতিসাম্য উপাদানটি অনুপস্থিত থাকলে একটি অণু নিশ্চিতভাবে আলোক সক্রিয় হয়?"
    },
    options: [
      { id: "a", text: { en: "Only Center of Symmetry (i)", bn: "কেবলমাত্র প্রতিসাম্য কেন্দ্র (i)" } },
      { id: "b", text: { en: "Only Simple Axis of Symmetry (Cn)", bn: "কেবলমাত্র ঘূর্ণন অক্ষ (Cn)" } },
      { id: "c", text: { en: "Alternating Axis of Symmetry (Sn)", bn: "পর্যায়ক্রমিক ঘূর্ণন-প্রতিফলন অক্ষ (Sn)" } },
      { id: "d", text: { en: "Only C2 axis", bn: "কেবলমাত্র C2 অক্ষ" } }
    ],
    correctOptionId: "c",
    explanation: {
      en: "The necessary and sufficient condition for optical activity is the absence of an improper rotation axis / alternating axis of symmetry (Sn). This automatically encompasses the absence of a plane of symmetry (sigma = S1) and a center of inversion (i = S2).",
      bn: "আলোক সক্রিয়তার জন্য প্রয়োজনীয় ও পর্যাপ্ত শর্ত হলো পর্যায়ক্রমিক ঘূর্ণন-প্রতিফলন অক্ষের (Sn) অনুপস্থিতি। এর মধ্যে প্রতিসাম্য তল (sigma = S1) এবং কেন্দ্র (i = S2) উভয়ই অন্তর্ভুক্ত।"
    }
  },
  {
    id: "q02",
    moduleId: "00-symmetry-chirality",
    topic: "Meso Compounds",
    difficulty: "easy",
    type: "mcq",
    text: {
      en: "Why is meso-tartaric acid optically inactive?",
      bn: "মেসো-টারটারিক অ্যাসিড আলোক নিষ্ক্রিয় কেন?"
    },
    options: [
      { id: "a", text: { en: "External compensation", bn: "বাহ্যিক ক্ষতিপূরণ" } },
      { id: "b", text: { en: "Internal compensation due to a plane of symmetry", bn: "অভ্যন্তরীণ প্রতিসাম্য তলের কারণে অভ্যন্তরীণ ক্ষতিপূরণ" } },
      { id: "c", text: { en: "It has no chiral carbons", bn: "এতে কোনো কাইরাল কার্বন নেই" } },
      { id: "d", text: { en: "Rapid umbrella inversion", bn: "দ্রুত আমব্রেলা ইনভার্সন" } }
    ],
    correctOptionId: "b",
    explanation: {
      en: "Meso-tartaric acid contains an internal plane of symmetry. The optical rotation caused by the upper chiral center (2R) is canceled out internally by the lower center (3S). This is known as internal compensation.",
      bn: "মেসো-টারটারিক অ্যাসিডে একটি অভ্যন্তরীণ প্রতিসাম্য তল থাকে। ওপরের কাইরাল কেন্দ্রের ঘূর্ণন নিচের বিপরীত কাইরাল কেন্দ্র দ্বারা ভেতরেই প্রশমিত হয়, যাকে অভ্যন্তরীণ ক্ষতিপূরণ বলে।"
    }
  },
  {
    id: "q03",
    moduleId: "01-enantiomers-diastereomers",
    topic: "Enantiomers vs Diastereomers",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "Which statement about diastereomers is INCORRECT?",
      bn: "ডায়াস্টেরিওমার সম্পর্কিত নিচের কোন বক্তব্যটি ভুল?"
    },
    options: [
      { id: "a", text: { en: "They have identical boiling and melting points", bn: "এদের স্ফুটনাঙ্ক ও গলনাঙ্ক হুবহু অভিন্ন" } },
      { id: "b", text: { en: "They are non-superimposable stereoisomers that are not mirror images", bn: "এরা পরস্পর দর্পণ প্রতিবিম্ব নয় এমন উপরিপাতহীন সমাণু" } },
      { id: "c", text: { en: "They can be separated by ordinary fractional crystallization", bn: "এদের সাধারণ আংশিক কেলাসন দ্বারা পৃথক করা যায়" } },
      { id: "d", text: { en: "They have different specific rotations [alpha]", bn: "এদের আপেক্ষিক ঘূর্ণনের মান সম্পূর্ণ ভিন্ন" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "Diastereomers possess DIFFERENT physical properties (different melting points, boiling points, solubilities, and dipole moments). Only enantiomers share identical achiral physical properties.",
      bn: "ডায়াস্টেরিওমারদের ভৌত ধর্ম (গলনাঙ্ক, স্ফুটনাঙ্ক, দ্রাব্যতা ও ডাইপোল) ভিন্ন হয়। কেবল এন্যানশিওমারদের ভৌত ধর্ম অভিন্ন থাকে।"
    }
  },
  {
    id: "q04",
    moduleId: "01-enantiomers-diastereomers",
    topic: "Polarimetry & Biot's Law",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "A solution of a chiral compound (c = 0.2 g/mL) in a 2 dm polarimeter tube exhibits an observed optical rotation of +4.8°. What is its specific rotation [alpha]?",
      bn: "একটি কাইরাল যৌগের দ্রবণে (c = ০.২ g/mL) ২ dm নলে পরীক্ষিত ঘূর্ণন +৪.৮°। যৌগটির আপেক্ষিক ঘূর্ণন [alpha] কত?"
    },
    options: [
      { id: "a", text: { en: "+12.0°", bn: "+১২.০°" } },
      { id: "b", text: { en: "+24.0°", bn: "+২৪.০°" } },
      { id: "c", text: { en: "+9.6°", bn: "+৯.৬°" } },
      { id: "d", text: { en: "+48.0°", bn: "+৪৮.০°" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "Biot's law: [alpha] = alpha_obs / (l * c) = +4.8 / (2 * 0.2) = 4.8 / 0.4 = +12.0°.",
      bn: "বায়োটের সূত্র: [alpha] = alpha_obs / (l * c) = +৪.৮ / (২ * ০.২) = ৪.৮ / ০.৪ = +১২.০°।"
    }
  },
  {
    id: "q05",
    moduleId: "01-enantiomers-diastereomers",
    topic: "Enantiomeric Excess (ee)",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "A mixture of (+)- and (-)-enantiomers contains 75% of the (+)-isomer and 25% of the (-)-isomer. What is the enantiomeric excess (% ee) of this mixture?",
      bn: "একটি মিশ্রণে ৭৫% (+) এবং ২৫% (-) এন্যানশিওমার রয়েছে। মিশ্রণটির এন্যানশিওমারিক এক্সেস (% ee) কত?"
    },
    options: [
      { id: "a", text: { en: "75%", bn: "৭৫%" } },
      { id: "b", text: { en: "50%", bn: "৫০%" } },
      { id: "c", text: { en: "25%", bn: "২৫%" } },
      { id: "d", text: { en: "100%", bn: "১০০%" } }
    ],
    correctOptionId: "b",
    explanation: {
      en: "% ee = % major - % minor = 75% - 25% = 50%. Equivalently, 50% is a racemic mixture (25% + and 25% -) which cancels out, leaving 50% pure (+) optical activity.",
      bn: "% ee = % প্রধান - % অপ্রধান = ৭৫% - ২৫% = ৫০%। অর্থাৎ ২৫% (+) এবং ২৫% (-) মিলে ৫০% রেসিমিক গঠন করে এবং বাকি ৫০% নেট অপটিক্যাল ঘূর্ণন প্রদর্শন করে।"
    }
  },
  {
    id: "q06",
    moduleId: "02-cip-rs-system",
    topic: "CIP Priority Rules",
    difficulty: "easy",
    type: "mcq",
    text: {
      en: "Which of the following groups has the HIGHEST priority according to CIP sequence rules?",
      bn: "সিআইপি ক্রম অনুযায়ী নিচের কোন গ্রুপটির অগ্রাধিকার সর্বোচ্চ?"
    },
    options: [
      { id: "a", text: { en: "-CH2Cl", bn: "-CH2Cl" } },
      { id: "b", text: { en: "-OH", bn: "-OH" } },
      { id: "c", text: { en: "-COOH", bn: "-COOH" } },
      { id: "d", text: { en: "-CH2CH3", bn: "-CH2CH3" } }
    ],
    correctOptionId: "b",
    explanation: {
      en: "Compare the directly attached atom: in -OH, it is Oxygen (Z=8). In -CH2Cl, -COOH, and -CH2CH3, the directly attached atom is Carbon (Z=6). Oxygen (Z=8) beats all carbons directly!",
      bn: "সরাসরি যুক্ত পরমাণু পরীক্ষা করুন: -OH-এ সরাসরি অক্সিজেন (Z=৮) যুক্ত। বাকিগুলোতে সরাসরি কার্বন (Z=৬) যুক্ত। ফলে অক্সিজেন সরাসরি সর্বোচ্চ অগ্রাধিকার পায়!"
    }
  },
  {
    id: "q07",
    moduleId: "02-cip-rs-system",
    topic: "Cysteine CIP Anomaly",
    difficulty: "challenging",
    type: "mcq",
    text: {
      en: "Why is natural L-cysteine assigned the (R) configuration, whereas all other natural L-amino acids are (S)?",
      bn: "অন্যান্য সকল প্রাকৃতিক L-অ্যামিনো অ্যাসিড (S) হওয়া সত্ত্বেও প্রাকৃতিক L-সিস্টাইন কেন (R) কনফিগারেশন বিশিষ্ট?"
    },
    options: [
      { id: "a", text: { en: "Cysteine has an inversion center", bn: "সিস্টাইনে প্রতিসাম্য কেন্দ্র রয়েছে" } },
      { id: "b", text: { en: "Sulfur (Z=16) in -CH2SH gives it higher priority than -COOH (Z=6), reversing the standard priority order", bn: "-CH2SH-এর সালফারের (Z=১৬) কারণে এটি -COOH অপেক্ষা বেশি অগ্রাধিকার পায়, ফলে ক্রম উল্টে যায়" } },
      { id: "c", text: { en: "It has a D-sugar backbone", bn: "এতে D-শর্করার কাঠামো থাকে" } },
      { id: "d", text: { en: "It mutarotates in water", bn: "পানিতে এর মিউটারোটেশন ঘটে" } }
    ],
    correctOptionId: "b",
    explanation: {
      en: "In standard amino acids: -NH2 (1) > -COOH (2) > -R sidechain (3) > -H (4). In cysteine, the sidechain is -CH2-SH; Sulfur (Z=16) gives -CH2SH priority 2 ahead of -COOH (Carbon bonded to O,O,O). This priority swap inverts the CIP assignment from (S) to (R) without changing the spatial layout!",
      bn: "অন্যান্য অ্যামিনো অ্যাসিডে: -NH2 (১) > -COOH (২) > পার্শ্বশিকল (৩) > -H (৪)। কিন্তু সিস্টাইনে পার্শ্বশিকল -CH2-SH-এ সালফারের পারমাণবিক সংখ্যা ১৬ হওয়ায় এটি -COOH-এর চেয়ে বেশি অগ্রাধিকার পেয়ে যায়! ফলে কনফিগারেশন উল্টে (R) হয়।"
    }
  },
  {
    id: "q08",
    moduleId: "03-conformational-acyclic",
    topic: "Ethane Rotational Barrier",
    difficulty: "easy",
    type: "mcq",
    text: {
      en: "What is the rotational barrier around the carbon-carbon single bond in ethane, and how much strain is contributed by each pair of eclipsed C-H bonds?",
      bn: "ইথেনে একক বন্ধনের ঘূর্ণন বাধা কত এবং প্রতি জোড়া গ্রহণযুক্ত C-H বন্ধন কতটা বিকৃতি যোগ করে?"
    },
    options: [
      { id: "a", text: { en: "12 kJ/mol total; 4 kJ/mol per H/H eclipsed pair", bn: "মোট ১২ কিজু/মোল; প্রতি H/H জোড়ায় ৪ কিজু/মোল" } },
      { id: "b", text: { en: "260 kJ/mol total; 80 kJ/mol per pair", bn: "মোট ২৬০ কিজু/মোল; প্রতি জোড়ায় ৮০ কিজু/মোল" } },
      { id: "c", text: { en: "3.8 kJ/mol total; 1.2 kJ/mol per pair", bn: "মোট ৩.৮ কিজু/মোল; প্রতি জোড়ায় ১.২ কিজু/মোল" } },
      { id: "d", text: { en: "19 kJ/mol total; 6.3 kJ/mol per pair", bn: "মোট ১৯ কিজু/মোল; প্রতি জোড়ায় ৬.৩ কিজু/মোল" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "Ethane has a total torsional barrier of ~12 kJ/mol (2.9 kcal/mol). In the eclipsed conformation, there are 3 pairs of eclipsed C-H bonds, so each pair contributes 12 / 3 = 4 kJ/mol (approx 1 kcal/mol).",
      bn: "ইথেনের মোট টর্শনাল বাধা প্রায় ১২ কিজু/মোল। এতে ৩ জোড়া গ্রহণযুক্ত C-H বন্ধন থাকায় প্রতি জোড়া বন্ধন ১২ / ৩ = ৪ কিজু/মোল বিকৃতি ঘটায়।"
    }
  },
  {
    id: "q09",
    moduleId: "03-conformational-acyclic",
    topic: "n-Butane Conformations",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "Arrange the conformations of n-butane in order of INCREASING potential energy (most stable first):",
      bn: "n-বিউটেনের কনফর্মেশনগুলিকে স্থিতিশীলতার ক্রমানুসারে (সর্বনিম্ন শক্তি প্রথমে) সাজাও:"
    },
    options: [
      { id: "a", text: { en: "Anti < Gauche < Partially Eclipsed < Fully Eclipsed", bn: "অ্যান্টি < গশ < আংশিক গ্রহণযুক্ত < সম্পূর্ণ গ্রহণযুক্ত" } },
      { id: "b", text: { en: "Gauche < Anti < Partially Eclipsed < Fully Eclipsed", bn: "গশ < অ্যান্টি < আংশিক গ্রহণযুক্ত < সম্পূর্ণ গ্রহণযুক্ত" } },
      { id: "c", text: { en: "Fully Eclipsed < Partially Eclipsed < Gauche < Anti", bn: "সম্পূর্ণ গ্রহণযুক্ত < আংশিক গ্রহণযুক্ত < গশ < অ্যান্টি" } },
      { id: "d", text: { en: "Anti < Partially Eclipsed < Gauche < Fully Eclipsed", bn: "অ্যান্টি < আংশিক গ্রহণযুক্ত < গশ < সম্পূর্ণ গ্রহণযুক্ত" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "Anti (180°, 0 kJ/mol) < Gauche (60°, 3.8 kJ/mol) < Partially Eclipsed (120°, 16 kJ/mol) < Fully Eclipsed (0°, 19 kJ/mol).",
      bn: "অ্যান্টি (১৮০°, ০ কিজু/মোল) < গশ (৬০°, ৩.৮ কিজু/মোল) < আংশিক গ্রহণযুক্ত (১২০°, ১৬ কিজু/মোল) < সম্পূর্ণ গ্রহণযুক্ত (০°, ১৯ কিজু/মোল)।"
    }
  },
  {
    id: "q10",
    moduleId: "04-conformational-cyclic",
    topic: "Cyclohexane Chair Flip",
    difficulty: "easy",
    type: "mcq",
    text: {
      en: "When cyclohexane undergoes a chair-chair ring flip, what happens to the axial and equatorial bonds?",
      bn: "সাইক্লোহেক্সেন চেয়ার-চেয়ার রিং ফ্লিপ করলে অক্ষীয় ও নিরক্ষীয় বন্ধনগুলির কী রূপান্তর ঘটে?"
    },
    options: [
      { id: "a", text: { en: "All axial bonds become equatorial, and all equatorial bonds become axial", bn: "সকল অক্ষীয় বন্ধন নিরক্ষীয় এবং নিরক্ষীয় বন্ধনগুলি অক্ষীয় হয়" } },
      { id: "b", text: { en: "Up-bonds point down, and down-bonds point up", bn: "ওপরের বন্ধন নিচে এবং নিচের বন্ধন ওপরে যায়" } },
      { id: "c", text: { en: "Carbon-carbon bonds are broken and reformed", bn: "কার্বন-কার্বন বন্ধন ভেঙে পুনরায় গঠিত হয়" } },
      { id: "d", text: { en: "All bonds remain unchanged", bn: "সকল বন্ধন অপরিবর্তিত থাকে" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "In a chair flip, every axial bond becomes equatorial, and every equatorial bond becomes axial! Note: bonds that point 'up' continue to point 'up' (an up-axial becomes an up-equatorial).",
      bn: "রিং ফ্লিপে প্রতিটি অক্ষীয় বন্ধন নিরক্ষীয় এবং নিরক্ষীয় বন্ধন অক্ষীয় হয়। তবে ওপরমুখী বন্ধন ওপরমুখীই থাকে (ওপর-অক্ষীয় ওপর-নিরক্ষীয় হয়)।"
    }
  },
  {
    id: "q11",
    moduleId: "04-conformational-cyclic",
    topic: "tert-Butyl A-Value",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "Why does tert-butylcyclohexane exist almost exclusively (>99.99%) in the equatorial chair conformation at room temperature?",
      bn: "সাধারণ তাপমাত্রায় টার্ট-বিউটাইলসাইক্লোহেক্সেন প্রায় সম্পূর্ণভাবে (>৯৯.৯৯%) নিরক্ষীয় চেয়ারে থাকে কেন?"
    },
    options: [
      { id: "a", text: { en: "Axial tert-butyl suffers severe 1,3-diaxial steric repulsion (A-value = 20.0 kJ/mol)", bn: "অক্ষীয় টার্ট-বিউটাইল মারাত্মক ১,৩-ডাইঅক্ষীয় স্থানিক বিকর্ষণের সম্মুখীন হয় (A-মান = ২০.০ কিজু/মোল)" } },
      { id: "b", text: { en: "Equatorial tert-butyl forms hydrogen bonds with the ring", bn: "নিরক্ষীয় টার্ট-বিউটাইল রিংয়ের সাথে হাইড্রোজেন বন্ধন তৈরি করে" } },
      { id: "c", text: { en: "It locks into a planar hexagon", bn: "এটি সমতলীয় ষড়ভুজে রূপ নেয়" } },
      { id: "d", text: { en: "Tert-butyl is an aromatic substituent", bn: "টার্ট-বিউটাইল একটি অ্যারোমেটিক গ্রুপ" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "The conformational free energy difference (A-value) of the bulky tert-butyl group is ~20.0 kJ/mol (4.9 kcal/mol). In an axial position, its 3 methyl groups cause severe van der Waals overlap with the axial hydrogens at C3 and C5, locking the ring equational.",
      bn: "টার্ট-বিউটাইল গ্রুপের স্থানিক বাধা বা A-মান প্রায় ২০.০ কিজু/মোল। অক্ষীয় অবস্থানে এর ৩টি মিথাইল C3 ও C5 অক্ষীয় হাইড্রোজেনের সাথে প্রচণ্ড সংঘর্ষে লিপ্ত হয়, যা একে নিরক্ষীয় অবস্থায় আটকে রাখে।"
    }
  },
  {
    id: "q12",
    moduleId: "05-exceptional-optical",
    topic: "Allene Chirality",
    difficulty: "challenging",
    type: "mcq",
    text: {
      en: "Which of the following allenes CANNOT exhibit optical isomerism?",
      bn: "নিচের কোন অ্যালিনটি আলোক সমাণুতা প্রদর্শন করতে পারে না?"
    },
    options: [
      { id: "a", text: { en: "CH3-CH=C=CH-CH3 (Penta-2,3-diene)", bn: "CH3-CH=C=CH-CH3 (পেন্টা-২,৩-ডাইইন)" } },
      { id: "b", text: { en: "CH2=C=CH-CH3 (Buta-1,2-diene)", bn: "CH2=C=CH-CH3 (বিউটা-১,২-ডাইইন)" } },
      { id: "c", text: { en: "C6H5-CH=C=CH-Cl", bn: "C6H5-CH=C=CH-Cl" } },
      { id: "d", text: { en: "CH3-CH=C=CH-COOH", bn: "CH3-CH=C=CH-COOH" } }
    ],
    correctOptionId: "b",
    explanation: {
      en: "Buta-1,2-diene has two identical hydrogen atoms on C1 (CH2=C=CH-CH3). For an allene to possess an axis of chirality, BOTH terminal carbons must be bonded to two non-identical groups (abC=C=Cab or abC=C=Ccd). Identical groups on C1 introduce a plane of symmetry.",
      bn: "বিউটা-১,২-ডাইইনে C1 কার্বনে দুটি একই হাইড্রোজেন রয়েছে (CH2=)। অ্যালিনে অক্ষীয় কাইরালিটির জন্য উভয় প্রান্তীয় কার্বনে দুটি ভিন্ন গ্রুপ যুক্ত থাকা বাধ্যতামূলক। দুটি হাইড্রোজেন থাকলে প্রতিসাম্য তল সৃষ্টি হয়।"
    }
  },
  {
    id: "q13",
    moduleId: "05-exceptional-optical",
    topic: "Atropisomerism Condition",
    difficulty: "challenging",
    type: "mcq",
    text: {
      en: "Which of the following substituted biphenyls is OPTICALLY INACTIVE?",
      bn: "নিচের কোন প্রতিস্থাপিত বাইফিনাইলটি আলোক নিষ্ক্রিয়?"
    },
    options: [
      { id: "a", text: { en: "2,2'-Dinitrobiphenyl-6,6'-dicarboxylic acid", bn: "২,২'-ডাইনাইট্রোবাইফিনাইল-৬,৬'-ডাইকার্বক্সিলিক অ্যাসিড" } },
      { id: "b", text: { en: "2,2'-Dichlorobiphenyl", bn: "২,২'-ডাইক্লোরোবাইফিনাইল" } },
      { id: "c", text: { en: "Biphenyl-2,2',6,6'-tetrasulfonic acid", bn: "বাইফিনাইল-২,২',৬,৬'-টেট্রাসালফোনিক অ্যাসিড" } },
      { id: "d", text: { en: "Both b and c", bn: "খ এবং গ উভয়ই" } }
    ],
    correctOptionId: "d",
    explanation: {
      en: "In 2,2'-dichlorobiphenyl, chlorine is not bulky enough to block rotation (rotational barrier too low). In biphenyl-2,2',6,6'-tetrasulfonic acid, all 4 ortho groups are identical (-SO3H), so each ring individually has a plane of symmetry! Both are optically inactive.",
      bn: "২,২'-ডাইক্লোরোবাইফিনাইলে ক্লোরিন পর্যাপ্ত ভারী নয়। আর টেট্রাসালফোনিক অ্যাসিডে ৪টি অর্থো গ্রুপই একই (-SO3H) হওয়ায় রিংটিতে প্রতিসাম্য তল বিদ্যমান! ফলে দুটিই আলোক নিষ্ক্রিয়।"
    }
  },
  {
    id: "q14",
    moduleId: "06-exceptional-conformational",
    topic: "Ethylene Glycol Gauche Effect",
    difficulty: "moderate",
    type: "mcq",
    text: {
      en: "Why is the Gauche conformer of ethylene glycol (ethane-1,2-diol) more stable than the Anti conformer in gas phase?",
      bn: "গ্যাসীয় অবস্থায় ইথিলিন গ্লাইকলের গশ কনফর্মেশন অ্যান্টি অপেক্ষা অধিক স্থিতিশীল কেন?"
    },
    options: [
      { id: "a", text: { en: "Formation of an intramolecular 5-membered cyclic hydrogen bond", bn: "৫-সদস্যের বলয়যুক্ত অন্তঃআণবিক হাইড্রোজেন বন্ধন গঠনের কারণে" } },
      { id: "b", text: { en: "Absence of steric strain", bn: "স্থানিক বাধার অনুপস্থিতি" } },
      { id: "c", text: { en: "Zero net dipole moment", bn: "নিট ডাইপোল মোমেন্ট শূন্য হওয়ার জন্য" } },
      { id: "d", text: { en: "Aromatic stabilization", bn: "অ্যারোমেটিক স্থিতিশীলতা" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "In the Gauche conformer, the dihedral angle of 60° brings the two -OH groups within hydrogen-bonding distance (~2.1 Å), forming an intramolecular 5-membered cyclic H-bond that releases ~8-12 kJ/mol of energy.",
      bn: "গশ কনফর্মেশনে ৬০° কোণের কারণে দুটি -OH গ্রুপ ২.১ Å দূরত্বে এসে ৫-সদস্যের বলয়যুক্ত অন্তঃআণবিক হাইড্রোজেন বন্ধন তৈরি করে, যা ~৮-১২ কিজু/মোল শক্তি নির্গত করে।"
    }
  },
  {
    id: "q15",
    moduleId: "06-exceptional-conformational",
    topic: "Fluorine Gauche Effect",
    difficulty: "challenging",
    type: "mcq",
    text: {
      en: "In 1,2-difluoroethane, the Gauche conformer is 3.3 kJ/mol more stable than the Anti conformer, despite having a high dipole moment. What stereoelectronic factor drives this?",
      bn: "উচ্চ ডাইপোল থাকা সত্ত্বেও ১,২-ডাইফ্লোরোইথেনে গশ কনফর্মেশন ৩.৩ কিজু/মোল বেশি স্থিতিশীল। কোন স্টেরিওইলেকট্রনিক কারণটি এর জন্য দায়ী?"
    },
    options: [
      { id: "a", text: { en: "Two antiperiplanar sigma_CH -> sigma*_CF hyperconjugative donations", bn: "দুটি অ্যান্টিপেরিপ্ল্যানার sigma_CH -> sigma*_CF হাইপারকনজুগেটিভ ইলেকট্রন স্থানান্তর" } },
      { id: "b", text: { en: "Intramolecular F···F covalent bond", bn: "অন্তঃআণবিক F···F সমযোজী বন্ধন" } },
      { id: "c", text: { en: "Van der Waals attraction between fluorines", bn: "ফ্লোরিনের মধ্যকার ভ্যান ডার ওয়ালস আকর্ষণ" } },
      { id: "d", text: { en: "Fluorine lone-pair repulsion", bn: "ফ্লোরিন নিঃসঙ্গ জোড় বিকর্ষণ" } }
    ],
    correctOptionId: "a",
    explanation: {
      en: "The C-H bond is an electron donor, while the low-lying C-F sigma* antibonding orbital is a potent electron acceptor. Gauche orientation achieves TWO stabilizing antiperiplanar sigma_CH -> sigma*_CF hyperconjugative overlaps.",
      bn: "C-H বন্ধন ইলেকট্রন দাতা এবং নিম্নশক্তির C-F সিগমা* অ্যান্টিবন্ডিং অরবিটাল উৎকৃষ্ট গ্রাহক। গশ বিন্যাসে দুটি অ্যান্টিপেরিপ্ল্যানার sigma_CH -> sigma*_CF অধিক্রমণ ঘটে যা ডাইপোল বিকর্ষণকে অতিক্রম করে।"
    }
  }
];

export const QUESTIONS = QUESTION_BANK;

