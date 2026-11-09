import type { ModuleContent } from '../../types/content';

export const MODULE_05: ModuleContent = {
  id: "05-exceptional-optical",
  order: 5,
  title: {
    en: "5. Masterclass: 10 Exceptional Cases in Optical Isomerism",
    bn: "৫. মাস্টারক্লাস: আলোক সমাণুতায় ১০টি ব্যতিক্রমী ক্ষেত্র"
  },
  learningObjectives: [
    {
      en: "Master chirality WITHOUT a chiral center (axial, planar, and helical chirality).",
      bn: "কাইরাল কেন্দ্রহীন কাইরালিটি (অক্ষীয়, সমতলীয় ও সর্পিলাকার) আয়ত্ত করা।"
    },
    {
      en: "Explain atropisomerism in biphenyls and nitrogen inversion in Tröger's base.",
      bn: "বাইফিনাইলে অ্যাট্রোপআইসোমারিজম এবং ট্রগার্স বেসে নাইট্রোজেন ইনভার্সন ব্যাখ্যা করা।"
    },
    {
      en: "Understand pseudoasymmetric centers (r/s) and topological mechanical chirality.",
      bn: "সিউডোঅপ্রতিসম কেন্দ্র (r/s) এবং টপোলজিক্যাল যান্ত্রিক কাইরালিটি অনুধাবন করা।"
    }
  ],
  sections: [
    {
      id: "allenes-and-spiranes",
      type: "text",
      title: {
        en: "1. Allenes, Spiranes & Alkylidene Cycloalkanes (Axial Chirality)",
        bn: "১. অ্যালিন, স্পাইরান ও অ্যালকিলিডিন সাইক্লোঅ্যালকেন (অক্ষীয় কাইরালিটি)"
      },
      content: {
        en: "In allenes with even cumulative double bonds (C=C=C), the central sp carbon's mutually perpendicular py and pz orbitals force terminal substituents into perpendicular planes (90°). If both terminal carbons are bonded to distinct groups (abC=C=Cab), the molecule possesses an AXIS of chirality (Ra/Sa) and exists as resolvable enantiomers without any tetrahedral chiral carbon! Spiranes and alkylidene cycloalkanes follow the exact same perpendicular orbital geometry.",
        bn: "জোড় সংখ্যক দ্বিবন্ধনযুক্ত অ্যালিনে কেন্দ্রীয় sp কার্বনের লম্ব পাই-অরবিটাল দুটি প্রান্তীয় প্রতিস্থাপককে ৯০° তলে স্থাপন করে। উভয় প্রান্তে দুটি ভিন্ন গ্রুপ থাকলে কোনো কাইরাল কার্বন ছাড়াই এটি অক্ষীয় কাইরালিটি (Ra/Sa) প্রদর্শন করে। স্পাইরান ও অ্যালকিলিডিন সাইক্লোঅ্যালকেন একই সমকৌণিক জ্যামিতি অনুসরণ করে।"
      }
    },
    {
      id: "atropisomerism-overview",
      type: "text",
      title: {
        en: "2. Atropisomerism in Biphenyls",
        bn: "২. অর্থো-প্রতিস্থাপিত বাইফিনাইলে অ্যাট্রোপআইসোমারিজম"
      },
      content: {
        en: "When four bulky substituents are located at the 2,2',6,6' ortho positions of a biphenyl, the steric hindrance prevents coplanar rotation around the central single bond (barrier > 100 kJ/mol). The two benzene rings are frozen perpendicular to each other. If each ring is substituted non-symmetrically, the molecule lacks all symmetry and can be separated into enantiomerically pure, optically active bottles at room temperature!",
        bn: "বাইফিনাইলের চারটি অর্থো অবস্থানে ভারী প্রতিস্থাপক (-NO2, -COOH, -Br) থাকলে স্থানিক সংঘর্ষের কারণে একক বন্ধনের ঘূর্ণন রুদ্ধ হয় (>১০০ কিজু/মোল বাধা)। রিং দুটি পরস্পরের সাথে লম্ব অবস্থায় আটকে যায় এবং স্থায়ী অপটিক্যাল সক্রিয় এন্যানশিওমার গঠন করে।"
      }
    },
    {
      id: "nitrogen-sulfur-inversion",
      type: "text",
      title: {
        en: "3. Amine Umbrella Inversion vs Locked Chiral Centers",
        bn: "৩. অ্যামিনের আমব্রেলা ইনভার্সন বনাম কাইরাল কেন্দ্র"
      },
      content: {
        en: "Simple amines (NR1R2R3) undergo rapid umbrella inversion at room temperature (barrier ~25 kJ/mol) and cannot be resolved. However, Tröger's base and bridgehead aziridines LOCK the nitrogen atoms in rigid bicyclic frameworks, preventing inversion and allowing stable enantiomer isolation! Furthermore, 3rd-period heteroatoms (sulfoxides R-SO-R' and phosphines PR1R2R3) have enormous inversion barriers (>150 kJ/mol) and are natively configurationally stable.",
        bn: "সাধারণ অ্যামিনে অতি দ্রুত আমব্রেলা ইনভার্সনের কারণে অপটিক্যাল রূপ পৃথক করা যায় না। তবে ট্রগার্স বেসে নাইট্রোজেন পরমাণু দুটি খাঁচায় আবদ্ধ থাকায় এরা সম্পূর্ণ স্থিতিশীল হয়। এছাড়া তৃতীয় পর্যায়ের সালফোক্সাইড ও ফসফিনের ইনভার্সন বাধা ১৫০ কিজু/মোল ছাড়িয়ে যাওয়ায় এরা ১০০°C তাপমাত্রার ওপরেও স্থায়ী থাকে।"
      }
    },
    {
      id: "helicenes-and-planar",
      type: "text",
      title: {
        en: "4. Helicenes ([6]Helicene) & Planar Chirality",
        bn: "৪. হেলিকেসিন ও প্ল্যানার কাইরালিটি"
      },
      content: {
        en: "In [6]helicene, six condensed benzene rings are forced into a non-planar 3D spiral helix to avoid steric collision between terminal rings. It exhibits extraordinary optical rotation ([alpha] > 3600°). In [2.2]paracyclophanes and 1,2-disubstituted ferrocenes, restricted rotation across sandwich planes produces planar chirality (Rp/Sp).",
        bn: "[৬]হেলিকেসিনে প্রান্তীয় রিংদ্বয়ের সংঘর্ষ এড়াতে অ্যারোমেটিক রিংটি ৩ডি সর্পিলাকার রূপ ধারণ করে এবং এর আপেক্ষিক ঘূর্ণন ৩৬০০ ডিগ্রির ওপরে হয়। প্যারাসাইক্লোফেন ও ফেরোসিনে সমান্তরাল তলের কারণে প্ল্যানার কাইরালিটি সৃষ্টি হয়।"
      }
    }
  ],
  summary: [
    {
      en: "Chirality is fundamentally a property of the WHOLE molecule's 3D symmetry (lack of Sn), not of individual carbon atoms.",
      bn: "কাইরালিটি কোনো একক কার্বনের ধর্ম নয়, বরং সমগ্র অণুর ত্রিমাত্রিক প্রতিসাম্যহীনতার (Sn-এর অনুপস্থিতি) বৈশিষ্ট্য।"
    }
  ]
};

