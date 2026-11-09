import type { ModuleContent } from '../../types/content';

export const MODULE_00: ModuleContent = {
  id: "00-symmetry-chirality",
  order: 0,
  title: {
    en: "0. Foundations of Symmetry & Chirality",
    bn: "০. প্রতিসাম্য ও কাইরালিটির মূল ভিত্তি"
  },
  learningObjectives: [
    {
      en: "Distinguish between superimposable (achiral) and non-superimposable (chiral) 3D molecular structures.",
      bn: "উপরিপাতযোগ্য (অকাইরাল) এবং উপরিপাতহীন (কাইরাল) ৩ডি আণবিক গঠনের পার্থক্য চিহ্নিত করতে পারা।"
    },
    {
      en: "Identify the critical symmetry elements: Plane of Symmetry (σ / POS) and Center of Symmetry (i / COS).",
      bn: "গুরুত্বপূর্ণ প্রতিসাম্য উপাদানসমূহ: প্রতিসাম্য তল (σ / POS) এবং প্রতিসাম্য কেন্দ্র (i / COS) সঠিকভাবে শনাক্ত করা।"
    },
    {
      en: "Apply the definitive rule for optical activity: Absence of an improper alternating rotation axis (Sn).",
      bn: "আলোক সক্রিয়তার পরম নিয়ম: পর্যায়ক্রমিক ঘূর্ণন-প্রতিফলন অক্ষের (Sn) অনুপস্থিতি প্রয়োগ করা।"
    }
  ],
  sections: [
    {
      id: "intro-chirality",
      type: "text",
      title: {
        en: "What is Chirality? (The Handedness of Molecules)",
        bn: "কাইরালিটি কী? (অণুর বাম-ডান প্রকৃতি)"
      },
      content: {
        en: "The word 'chirality' originates from the Greek word cheir (χειρ), meaning 'hand'. Just as your left hand cannot be superimposed onto your right hand (even though they are mirror images), a chiral molecule cannot be superimposed on its three-dimensional mirror image. Chirality is the ultimate geometric property responsible for optical activity in chemistry and biology.",
        bn: "'কাইরালিটি' শব্দটি গ্রিক শব্দ 'cheir' থেকে এসেছে, যার অর্থ 'হাত'। আপনার বাম হাত এবং ডান হাত পরস্পর দর্পণ প্রতিবিম্ব হওয়া সত্ত্বেও যেমন তাদের একটির ওপর অপরটি হুবহু বসানো যায় না, তেমনি একটি কাইরাল অণুকে তার ত্রিমাত্রিক দর্পণ প্রতিবিম্বের ওপর উপরিপাত করা যায় না।"
      }
    },
    {
      id: "symmetry-elements",
      type: "comparison_table",
      title: {
        en: "The Four Fundamental Symmetry Elements in Stereochemistry",
        bn: "স্টেরিওরসায়নের চারটি মৌলিক প্রতিসাম্য উপাদান"
      },
      content: {
        en: "1. Simple Axis of Symmetry (Cn): Rotation by 360°/n yields an indistinguishable orientation. (Note: Presence of Cn DOES NOT make a molecule achiral!).\n2. Plane of Symmetry (σ / POS): An imaginary plane bisecting the molecule such that one half is the mirror image of the other half. If present -> ACHIRAL.\n3. Center of Inversion (i / COS): An imaginary central point such that drawing a straight line from any atom through this point to an equal distance on the opposite side encounters an identical atom. If present -> ACHIRAL.\n4. Alternating Axis of Symmetry (Sn): Rotation by 360°/n followed by reflection perpendicular to the rotation axis.",
        bn: "১. সরল ঘূর্ণন অক্ষ (Cn): ৩৬০°/n কোণে ঘোরালে অভিন্ন অবস্থা পাওয়া যায়। (মনে রাখবেন: Cn উপস্থিত থাকলেও অণু কাইরাল হতে পারে!)।\n২. প্রতিসাম্য তল (σ / POS): একটি কাল্পনিক তল যা অণুকে এমনভাবে দ্বিখণ্ডিত করে যেন এক অর্ধাংশ অপর অর্ধাংশের দর্পণ প্রতিবিম্ব হয়। উপস্থিত থাকলে -> অকাইরাল।\n৩. প্রতিসাম্য কেন্দ্র (i / COS): একটি কাল্পনিক কেন্দ্রবিন্দু যার মধ্য দিয়ে কোনো পরমাণু থেকে রেখা টানলে বিপরীত দিকে সমান দূরত্বে একই পরমাণু পাওয়া যায়। উপস্থিত থাকলে -> অকাইরাল।\n৪. পর্যায়ক্রমিক অক্ষ (Sn): ৩৬০°/n আবর্তনের পর লম্ব তলে প্রতিফলন।"
      }
    },
    {
      id: "chiral-center-warning",
      type: "misconception",
      title: {
        en: "Major Trap: Chiral Carbon vs Chiral Molecule",
        bn: "প্রধান বিভ্রান্তি: কাইরাল কার্বন বনাম কাইরাল অণু"
      },
      content: {
        en: "DO NOT equate having a chiral carbon with being a chiral molecule! (1) A molecule CAN have multiple chiral carbons and yet be completely ACHIRAL (e.g. meso-tartaric acid has 2 chiral carbons, but an internal plane of symmetry makes it achiral). (2) Conversely, a molecule CAN be completely CHIRAL WITHOUT HAVING ANY CHIRAL CARBONS (e.g. allenes, biphenyls, spiranes, and helicenes). Always test for symmetry elements, NOT just asterisks on carbons!",
        bn: "কাইরাল কার্বন থাকা মানেই অণুটি কাইরাল হবে এমন নয়! (১) একাধিক কাইরাল কার্বন থাকা সত্ত্বেও অণু অকাইরাল হতে পারে (যেমন মেসো-টারটারিক অ্যাসিডে ২টি কাইরাল কার্বন থাকলেও প্রতিসাম্য তলের কারণে এটি অকাইরাল)। (২) আবার কোনো কাইরাল কার্বন ছাড়াই একটি অণু সম্পূর্ণ কাইরাল হতে পারে (যেমন অ্যালিন, বাইফিনাইল, স্পাইরান ও হেলিকেসিন)। সর্বদা প্রতিসাম্য উপাদান পরীক্ষা করুন, শুধু কার্বনে তারকা চিহ্ন নয়!"
      }
    }
  ],
  summary: [
    {
      en: "An object or molecule is chiral if and only if it is non-superimposable on its mirror image.",
      bn: "একটি অণু কেবল তখনই কাইরাল হবে যখন এটি তার দর্পণ প্রতিবিম্বের ওপর উপরিপাতহীন হবে।"
    },
    {
      en: "Presence of a Plane of Symmetry (σ) or Center of Symmetry (i) guarantees that the molecule is ACHIRAL and optically inactive.",
      bn: "প্রতিসাম্য তল (σ) বা কেন্দ্র (i)-এর উপস্থিতি নিশ্চিত করে যে অণুটি অকাইরাল এবং আলোক নিষ্ক্রিয়।"
    }
  ]
};
