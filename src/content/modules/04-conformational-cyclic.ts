import type { ModuleContent } from '../../types/content';

export const MODULE_04: ModuleContent = {
  id: "04-conformational-cyclic",
  order: 4,
  title: {
    en: "4. Conformational Analysis of Cyclohexane & Cyclic Rings",
    bn: "৪. সাইক্লোহেক্সেন ও চাক্রিক যৌগের কনফর্মেশন বিশ্লেষণ"
  },
  learningObjectives: [
    {
      en: "Explain why the chair conformation of cyclohexane is completely strain-free.",
      bn: "সাইক্লোহেক্সেনের চেয়ার কনফর্মেশন কেন সম্পূর্ণ বিকৃতিহীন তা ব্যাখ্যা করা।"
    },
    {
      en: "Trace the energy trajectory of a chair-chair ring flip (Chair -> Half-Chair -> Twist-Boat -> Boat -> Chair).",
      bn: "চেয়ার-চেয়ার রিং ফ্লিপের শক্তি গতিপথ (চেয়ার -> হাফ-চেয়ার -> টুইস্ট-বোট -> বোট -> চেয়ার) অনুসরণ করা।"
    },
    {
      en: "Calculate equatorial vs axial conformational equilibria using A-values.",
      bn: "A-মানের সাহায্যে নিরক্ষীয় বনাম অক্ষীয় সাম্যাবস্থা গণনা করা।"
    }
  ],
  sections: [
    {
      id: "baeyer-vs-sachse",
      type: "text",
      title: {
        en: "Baeyer Strain Theory vs Sachse-Mohr Non-Planar Chairs",
        bn: "বায়ার বিকৃতি তত্ত্ব বনাম সাক্সে-মোর অমাতৃক চেয়ার"
      },
      content: {
        en: "In 1885, Adolf von Baeyer assumed all cycloalkanes were planar, predicting that cyclohexane (planar angle 120°) would experience severe angle strain. In 1890, Sachse and Mohr showed that cyclohexane is NOT planar! It puckers into a non-planar CHAIR conformation where every C-C-C angle is exactly 109.5° (zero angle strain) and every adjacent C-H bond is perfectly staggered (zero torsional strain)! Cyclohexane has heat of combustion per CH2 identical to open-chain alkanes, proving it is 100% strain-free.",
        bn: "১৮৮৫ সালে বায়ার সাইক্লোঅ্যালকেনগুলিকে সমতলীয় ধরে নিয়েছিলেন। কিন্তু ১৮৯০ সালে সাক্সে ও মোর প্রমাণ করেন যে সাইক্লোহেক্সেন সমতলীয় নয়! এটি একটি ত্রিমাত্রিক চেয়ারে মোচড়ায় যেখানে প্রতিটি কোণ ঠিক ১০৯.৫° এবং প্রতিটি বন্ধন নিখুঁত স্ট্যাগার্ড! ফলে সাইক্লোহেক্সেনে কোনো কোণ বা টর্শনাল বিকৃতি নেই।"
      }
    },
    {
      id: "axial-equatorial",
      type: "text",
      title: {
        en: "Axial and Equatorial Bonds in Cyclohexane",
        bn: "সাইক্লোহেক্সেনের অক্ষীয় ও নিরক্ষীয় বন্ধন"
      },
      content: {
        en: "Cyclohexane has two distinct types of bonds:\n1. Six AXIAL Bonds: Directed straight up or straight down parallel to the 3-fold symmetry axis.\n2. Six EQUATORIAL Bonds: Pointed slightly up or slightly down radiating outwards around the ring equator.\nIn a chair-chair ring flip, all axial bonds become equatorial, and all equatorial bonds become axial!",
        bn: "সাইক্লোহেক্সেনে দুই ধরনের বন্ধন থাকে:\n১. ৬টি অক্ষীয় বন্ধন: রিংটির অক্ষ বরাবর সম্পূর্ণ ওপরে বা নিচে নির্দেশ করে।\n২. ৬টি নিরক্ষীয় বন্ধন: রিংয়ের পরিধি বরাবর বাইরের দিকে সামান্য হেলে থাকে।\nরিং ফ্লিপের সময় সমস্ত অক্ষীয় বন্ধন নিরক্ষীয় এবং সমস্ত নিরক্ষীয় বন্ধন অক্ষীয় হয়ে যায়!"
      }
    },
    {
      id: "a-values-diaxial",
      type: "comparison_table",
      title: {
        en: "Conformational A-Values & 1,3-Diaxial Interactions",
        bn: "কনফর্মেশনাল A-মান ও ১,৩-ডাইঅক্ষীয় বিকৃতি"
      },
      content: {
        en: "Substituent A-values represent the free energy preference (Delta G°) for the equatorial position over the axial position:\n• Fluorine (-F): 1.0 kJ/mol (60% equatorial)\n• Chlorine (-Cl): 2.2 kJ/mol (70% equatorial)\n• Hydroxyl (-OH): 3.8 kJ/mol (83% equatorial)\n• Methyl (-CH3): 7.3 kJ/mol (95% equatorial; two 1,3-diaxial gauche-butane interactions)\n• Isopropyl (-CH(CH3)2): 9.2 kJ/mol (97% equatorial)\n• tert-Butyl (-C(CH3)3): 20.0 kJ/mol (>99.99% equatorial; CONFORMATIONAL LOCK!)",
        bn: "প্রতিস্থাপকের A-মান অক্ষীয় অবস্থানের তুলনায় নিরক্ষীয় অবস্থানের মুক্ত শক্তির অগ্রাধিকার নির্দেশ করে:\n• ফ্লোরিন (-F): ১.০ কিজু/মোল (৬০% নিরক্ষীয়)\n• ক্লোরিন (-Cl): ২.২ কিজু/মোল (৭০% নিরক্ষীয়)\n• হাইড্রক্সিল (-OH): ৩.৮ কিজু/মোল (৮৩% নিরক্ষীয়)\n• মিথাইল (-CH3): ৭.৩ কিজু/মোল (৯৫% নিরক্ষীয়; দুটি ১,৩-ডাইঅক্ষীয় গশ মিথস্ক্রিয়া)\n• টার্ট-বিউটাইল (-C(CH3)3): ২০.০ কিজু/মোল (>৯৯.৯৯% নিরক্ষীয়; কনফর্মেশনাল লক!)"
      }
    }
  ],
  summary: [
    {
      en: "Chair is the global minimum of cyclohexane. The boat is 30 kJ/mol higher due to flagpole hydrogens and eclipsing strain.",
      bn: "চেয়ার হলো সাইক্লোহেক্সেনের সর্বনিম্ন শক্তি অবস্থা। ফ্ল্যাগপোল ও এক্লিপসিং বাধার কারণে বোট ৩০ কিজু/মোল উচ্চশক্তিযুক্ত।"
    }
  ]
};

