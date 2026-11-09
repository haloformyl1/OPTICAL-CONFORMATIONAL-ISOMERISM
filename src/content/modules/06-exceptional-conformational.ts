import type { ModuleContent } from '../../types/content';

export const MODULE_06: ModuleContent = {
  id: "06-exceptional-conformational",
  order: 6,
  title: {
    en: "6. Masterclass: 10 Exceptional Cases in Conformational Isomerism",
    bn: "৬. মাস্টারক্লাস: কনফর্মেশনাল সমাণুতায় ১০টি ব্যতিক্রমী ক্ষেত্র"
  },
  learningObjectives: [
    {
      en: "Explain the Gauche Effect anomalies in ethylene glycol, 2-fluoroethanol, and 1,2-difluoroethane.",
      bn: "ইথিলিন গ্লাইকল, ২-ফ্লোরোইথানল এবং ১,২-ডাইফ্লোরোইথেনে গশ প্রভাবের ব্যতিক্রম ব্যাখ্যা করা।"
    },
    {
      en: "Understand why cis-1,4-di-tert-butylcyclohexane adopts a twist-boat conformation.",
      bn: "সিস-১,৪-ডাই-টার্ট-বিউটাইলসাইক্লোহেক্সেন কেন টুইস্ট-বোট কনফর্মেশন গ্রহণ করে তা অনুধাবন করা।"
    },
    {
      en: "Master the Anomeric Effect and axial halogen preferences in alpha-halocyclohexanones.",
      bn: "অ্যানোমেরিক প্রভাব এবং আলফা-হ্যালোসাইক্লোহেক্সানোনে অক্ষীয় হ্যালোজেনের প্রাধান্য আয়ত্ত করা।"
    }
  ],
  sections: [
    {
      id: "gauche-effects",
      type: "text",
      title: {
        en: "1. The Classical and Stereoelectronic Gauche Effects",
        bn: "১. চিরায়ত ও স্টেরিওইলেকট্রনিক গশ প্রভাব"
      },
      content: {
        en: "Why is Gauche more stable than Anti in certain molecules?\n• Ethylene Glycol (1,2-ethanediol): Forms a 5-membered cyclic intramolecular hydrogen bond (O-H···O) in the Gauche conformation, releasing 8-12 kJ/mol of stabilization enthalpy.\n• 2-Fluoroethanol: Cooperative intramolecular O-H···F hydrogen bonding and sigma_CH -> sigma*_CF hyperconjugation makes Gauche ~8.4 kJ/mol more stable.\n• 1,2-Difluoroethane: The pure stereoelectronic Gauche Effect! Despite dipole repulsion, Gauche is favored by 3.3 kJ/mol because two antiperiplanar sigma_CH -> sigma*_CF hyperconjugative transfers stabilize the system.",
        bn: "কিছু যৌগে কেন গশ রূপটি অ্যান্টি অপেক্ষা বেশি স্থিতিশীল?\n• ইথিলিন গ্লাইকল: গশ অবস্থায় ৫-সদস্যের বলয়যুক্ত অন্তঃআণবিক হাইড্রোজেন বন্ধন (O-H···O) গঠন করে ৮-১২ কিজু/মোল শক্তি নির্গত করে।\n• ২-ফ্লোরোইথানল: যুগপৎ O-H···F বন্ধন এবং হাইপারকনজুগেশন একে ~৮.৪ কিজু/মোল বেশি স্থিতিশীল করে।\n• ১,২-ডাইফ্লোরোইথেন: খাঁটি স্টেরিওইলেকট্রনিক গশ প্রভাব! ডাইপোল বিকর্ষণ সত্ত্বেও দুটি অ্যান্টিপেরিপ্ল্যানার sigma_CH -> sigma*_CF হাইপারকনজুগেটিভ স্থানান্তরের কারণে গশ ৩.৩ কিজু/মোল প্রাধান্য পায়।"
      }
    },
    {
      id: "twist-boat-lock",
      type: "text",
      title: {
        en: "2. The Forced Twist-Boat: cis-1,4-Di-tert-butylcyclohexane",
        bn: "২. বাধ্যতামূলক টুইস্ট-বোট: সিস-১,৪-ডাই-টার্ট-বিউটাইলসাইক্লোহেক্সেন"
      },
      content: {
        en: "Normally, cyclohexanes adopt chair conformations because twist-boats are 23 kJ/mol higher in energy. In cis-1,4-di-tert-butylcyclohexane, however, a chair conformation would force one of the bulky tert-butyl groups into the strongly repulsive axial position (A-value = 20.0 kJ/mol). To relieve this catastrophic steric clash, the entire molecule snaps out of the chair and permanently adopts a TWIST-BOAT conformation where BOTH tert-butyl groups reside in quasi-equatorial orientations!",
        bn: "সাধারণত সাইক্লোহেক্সেন চেয়ারে থাকে কারণ টুইস্ট-বোট ২৩ কিজু/মোল উচ্চশক্তিযুক্ত। কিন্তু সিস-১,৪-এ চেয়ার গঠন করতে গেলে একটি টার্ট-বিউটাইল অক্ষীয় হতে বাধ্য হয় (২০ কিজু/মোল বিকৃতি)। এই ভয়াবহ বিকৃতি এড়াতে পুরো অণুটি চেয়ার ত্যাগ করে স্থায়ীভাবে একটি টুইস্ট-বোট গ্রহণ করে যেখানে উভয় টার্ট-বিউটাইলই আধা-নিরক্ষীয় থাকে!"
      }
    },
    {
      id: "anomeric-and-haloketone",
      type: "text",
      title: {
        en: "3. The Anomeric Effect & 2-Halocyclohexanone Axial Halogens",
        bn: "৩. অ্যানোমেরিক প্রভাব ও ২-হ্যালোসাইক্লোহেক্সানোনে অক্ষীয় হ্যালোজেন"
      },
      content: {
        en: "• The Anomeric Effect: In 2-methoxytetrahydropyran and alpha-D-glucopyranose, the methoxy/hydroxy group at C1 preferentially occupies the AXIAL position (by ~5.9 kJ/mol). Mechanism: In the axial conformer, the endocyclic oxygen lone pair (n_O) donates into the antiperiplanar C-O sigma* antibonding orbital (n_O -> sigma*_CO).\n• 2-Halocyclohexanones: In non-polar solvents, the axial halogen is favored because an equatorial halogen points parallel to the C=O carbonyl dipole, causing severe electrostatic dipole-dipole repulsion.",
        bn: "• অ্যানোমেরিক প্রভাব: পাইরানোজ রিংয়ে C1-এর মিথক্সি বা হাইড্রক্সিল গ্রুপ নিরক্ষীয়র বদলে অক্ষীয় অবস্থানে থাকতে পছন্দ করে (৫.৯ কিজু/মোল)। কারণ: রিংয়ের অক্সিজেনের নিঃসঙ্গ জোড় অক্ষীয় বন্ধনের অ্যান্টিবন্ডিং অরবিটালে ইলেকট্রন দান করে (n_O -> sigma*_CO)।\n• ২-হ্যালোসাইক্লোহেক্সানোন: অমেরু মাধ্যমে অক্ষীয় হ্যালোজেন অধিক স্থিতিশীল কারণ নিরক্ষীয় অবস্থানে C=O এবং C-X সমান্তরাল হয়ে প্রচণ্ড ডাইপোল বিকর্ষণ ঘটায়।"
      }
    }
  ],
  summary: [
    {
      en: "Stereoelectronic hyperconjugation and intramolecular hydrogen bonding can completely reverse classical steric preferences.",
      bn: "স্টেরিওইলেকট্রনিক হাইপারকনজুগেশন এবং অন্তঃআণবিক হাইড্রোজেন বন্ধন প্রচলিত স্থানিক নিয়মকে সম্পূর্ণ উল্টে দিতে পারে।"
    }
  ]
};

