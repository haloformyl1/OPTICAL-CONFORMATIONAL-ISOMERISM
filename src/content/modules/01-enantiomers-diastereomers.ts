import type { ModuleContent } from '../../types/content';

export const MODULE_01: ModuleContent = {
  id: "01-enantiomers-diastereomers",
  order: 1,
  title: {
    en: "1. Enantiomers, Diastereomers & Meso Compounds",
    bn: "১. এন্যানশিওমার, ডায়াস্টেরিওমার ও মেসো যৌগ"
  },
  learningObjectives: [
    {
      en: "Define and identify enantiomers (non-superimposable mirror images).",
      bn: "এন্যানশিওমার (উপরিবাতহীন দর্পণ প্রতিবিম্ব) সংজ্ঞায়িত ও শনাক্ত করা।"
    },
    {
      en: "Contrast enantiomers with diastereomers (stereoisomers that are not mirror images).",
      bn: "ডায়াস্টেরিওমারের (পরস্পর দর্পণ প্রতিবিম্ব নয় এমন স্টেরিওসমাণু) বৈশিষ্ট্য তুলনা করা।"
    },
    {
      en: "Master polarimetry, specific rotation [alpha] = alpha / (l * c), and enantiomeric excess (ee).",
      bn: "পোলারিমেট্রি, আপেক্ষিক ঘূর্ণনের বায়োট সূত্র এবং এন্যানশিওমারিক এক্সেস (ee) আয়ত্ত করা।"
    }
  ],
  sections: [
    {
      id: "enantiomers-properties",
      type: "text",
      title: {
        en: "Enantiomers: The Mirror Stereoisomers",
        bn: "এন্যানশিওমার: দর্পণ স্টেরিওসমাণু"
      },
      content: {
        en: "Enantiomers are stereoisomers that are non-superimposable mirror images of each other. A chiral molecule and its enantiomer have identical achiral physical properties: identical boiling point, melting point, density, refractive index, and thermodynamic stability. However, they differ in two profound ways: (1) They rotate plane-polarized light in EQUAL but OPPOSITE directions (+ and -). (2) They interact differently with chiral environments, chiral catalysts, and biological receptors (e.g. drugs, enzymes, olfactory receptors).",
        bn: "এন্যানশিওমার হলো পরস্পর উপরিপাতহীন দর্পণ প্রতিবিম্ব স্টেরিওসমাণু। একটি কাইরাল অণু ও তার এন্যানশিওমারের সাধারণ ভৌত ধর্ম হুবহু অভিন্ন: সমান গলনাঙ্ক, স্ফুটনাঙ্ক, ঘনত্ব ও প্রতিসরাঙ্ক। তবে দুটি ক্ষেত্রে এদের আচরণ পৃথক: (১) এরা সমতল সমাবর্তিত আলোকে সমান কোণে বিপরীত দিকে (+ ও -) ঘোরায়। (২) কাইরাল অনুঘটক, মানবদেহের এনজাইম এবং রিসেপ্টরের সাথে এদের মিথস্ক্রিয়া সম্পূর্ণ ভিন্ন হয়।"
      }
    },
    {
      id: "diastereomers-properties",
      type: "text",
      title: {
        en: "Diastereomers: Non-Mirror Spatial Isomers",
        bn: "ডায়াস্টেরিওমার: দর্পণহীন ত্রিমাত্রিক সমাণু"
      },
      content: {
        en: "Diastereomers are stereoisomers that are NOT mirror images of each other. They occur when a molecule has two or more stereocenters, and some (but NOT all) of the stereocenters have inverted configuration (e.g. (2R,3R) vs (2R,3S)). Unlike enantiomers, diastereomers have DIFFERENT physical and chemical properties: different melting points, boiling points, NMR chemical shifts, dipole moments, and solubilities. They can be separated by ordinary fractional crystallization or standard column chromatography.",
        bn: "যেসব স্টেরিওসমাণু পরস্পরের দর্পণ প্রতিবিম্ব নয়, তাদের ডায়াস্টেরিওমার বলে। একাধিক কাইরাল কেন্দ্রযুক্ত অণুতে যখন কিছু কেন্দ্রের কনফিগারেশন অপরিবর্তিত থাকে এবং কিছুর পরিবর্তন ঘটে, তখন ডায়াস্টেরিওমার সৃষ্টি হয় (যেমন (2R,3R) বনাম (2R,3S))। এদের ভৌত ধর্ম সম্পূর্ণ পৃথক হওয়ায় সাধারণ কেলাসন বা ক্রোমাটোগ্রাফি দিয়ে এদের অনায়াসে আলাদা করা যায়।"
      }
    },
    {
      id: "biots-formula",
      type: "formula",
      title: {
        en: "Biot's Law of Optical Rotation",
        bn: "আলোক ঘূর্ণনের বায়োট সূত্র"
      },
      content: {
        en: "Specific optical rotation [alpha] at temperature T and wavelength lambda (usually sodium D-line, 589 nm) is a physical constant given by:",
        bn: "নির্দিষ্ট তাপমাত্রা T এবং তরঙ্গদৈর্ঘ্যে (সোডিয়াম D-লাইন, ৫৮৯ nm) কোনো পদার্থের আপেক্ষিক ঘূর্ণন [alpha] একটি ধ্রুবক, যা বায়োটের সূত্র দ্বারা সংজ্ঞায়িত:"
      },
      formulaTex: "[\\alpha]_\\lambda^T = \\frac{\\alpha_{\\text{obs}}}{l \\cdot c}"
    },
    {
      id: "ee-racemic",
      type: "text",
      title: {
        en: "Racemic Mixtures vs Enantiomeric Excess (ee)",
        bn: "রেসিমিক মিশ্রণ বনাম এন্যানশিওমারিক এক্সেস (ee)"
      },
      content: {
        en: "A 1:1 equimolar mixture of two enantiomers is called a RACEMIC MIXTURE (or racemate, denoted by (±) or dl-). A racemic mixture is OPTICALLY INACTIVE due to external compensation (the dextrorotation of one molecule is canceled by the levorotation of another). If the mixture is not 50:50, the optical purity or Enantiomeric Excess (ee) is calculated as: % ee = [ |d - l| / (d + l) ] * 100%.",
        bn: "দুটি এন্যানশিওমারের সমআণবিক (১:১) মিশ্রণকে রেসিমিক মিশ্রণ (বা রেসিমেট, (±) অথবা dl-) বলে। বাহ্যিক ক্ষতিপূরণের কারণে রেসিমিক মিশ্রণ অপটিক্যাল নিষ্ক্রিয় হয়। মিশ্রণে একটি রূপ বেশি থাকলে এন্যানশিওমারিক এক্সেস হিসাব করা হয়: % ee = [ |d - l| / (d + l) ] * ১০০%।"
      }
    }
  ],
  summary: [
    {
      en: "Enantiomers have identical physical properties except for the sign of optical rotation and chiral recognition.",
      bn: "আলোক ঘূর্ণনের দিক এবং কাইরাল রিসেপ্টর ছাড়া এন্যানশিওমারদের সকল ভৌত ধর্ম হুবহু এক।"
    },
    {
      en: "Diastereomers have different physical properties and can be separated easily by physical methods.",
      bn: "ডায়াস্টেরিওমারদের ভৌত ধর্ম ভিন্ন হওয়ায় ভৌত পদ্ধতিতে এদের সহজে পৃথক করা যায়।"
    }
  ]
};

