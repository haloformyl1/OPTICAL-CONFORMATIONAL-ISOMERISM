import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/LayoutPrimitives';
import { BilingualText } from '../components/BilingualText';
import { ExceptionalCasesLab } from '../components/labs/ExceptionalCasesLab';
import { Sparkles, ShieldAlert, Award, Compass } from 'lucide-react';

export const Exceptions: React.FC = () => {
  return (
    <div className="w-full">
      <PageContainer>
        <PageHeader
          eyebrow={<BilingualText en="Advanced Stereochemistry" bn="উন্নত স্টেরিওরসায়ন" />}
          icon={Sparkles}
          title={<BilingualText en="20 High-Yield Exceptional Cases" bn="২০টি গুরুত্বপূর্ণ ব্যতিক্রমী ক্ষেত্র" />}
          description={
            <BilingualText
              en="Master subtle stereochemical phenomena frequently tested in competitive examinations (JEE Advanced, NEET, CSIR NET): 10 Optical anomalies (Allenes, Atropisomerism, Spiranes, Paracyclophanes) and 10 Conformational anomalies (Gauche effect, Twist-boat dominance, Anomeric effect)."
              bn="সর্বভারতীয় ও প্রতিযোগিতামূলক পরীক্ষায় বহুল জিজ্ঞাসিত সূক্ষ্ম স্টেরিওরাসায়নিক নীতিগুলি আয়ত্ত করুন: ১০টি আলোকীয় ব্যতিক্রম (অ্যালিন, অ্যাট্রপআইসোমারিজম, স্পাইরেন, প্যারাসাইক্লোফেন) এবং ১০টি কনফর্মেশনাল ব্যতিক্রম (গশ প্রভাব, টুইস্ট-বোট স্থায়িত্ব, অ্যানোমেরিক প্রভাব)।"
            />
          }
        />

        {/* Quick Highlights Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
              <ShieldAlert className="h-4 w-4" />
              <BilingualText en="Chirality without Chiral Center" bn="কাইরাল কেন্দ্রবিহীন কাইরালিটি" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="Allenes, alkylidene cyclohexanes, and spiranes have perpendicular terminal π-clouds or rings creating chiral axes ($C_2$ symmetry) without any stereocenter."
                bn="অ্যালিন, অ্যালকাইলিডিন সাইক্লোহেক্সেন ও স্পাইরেনে লম্ব টার্মিনাল পাই-ক্লাউড বা রিং কোনো স্টেরিওসেন্টার ছাড়াই কাইরাল অক্ষ ($C_2$ প্রতিসাম্য) তৈরি করে।"
              />
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1.5">
              <Compass className="h-4 w-4" />
              <BilingualText en="Steric Hindrance to Rotation" bn="ঘূর্ণনে স্থানিক বাধার প্রভাব" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="Ortho-tetrasubstituted biphenyls (Atropisomerism) cannot undergo $sp^2-sp^2$ single-bond rotation due to bulky substituents, allowing isolation of enantiomers."
                bn="অর্থো-প্রতিস্থাপিত বাইফিনাইলে বৃহদাকার গ্রুপের বাধার কারণে $sp^2-sp^2$ একক বন্ধন ঘূর্ণন অসম্ভব হয়, ফলে এন্যানশিওমার পৃথক করা যায় (অ্যাট্রপআইসোমারিজম)।"
              />
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
              <Award className="h-4 w-4" />
              <BilingualText en="Intramolecular H-Bond & Hyperconjugation" bn="অন্তঃআণবিক এইচ-বন্ধন ও হাইপারকনজুগেশন" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <BilingualText
                en="Ethylene glycol and 2-fluoroethanol stabilize the Gauche conformer over Anti via 5-membered cyclic H-bonding and $\sigma_{C-H} \rightarrow \sigma^*_{C-F}$ hyperconjugation."
                bn="ইথিলিন গ্লাইকল ও ২-ফ্লুরোইথানলে ৫-সদস্যের অন্তঃআণবিক এইচ-বন্ধন ও হাইপারকনজুগেশন অ্যান্টি-এর চেয়ে গশ কনফর্মারকে অধিক স্থায়ী করে।"
              />
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ExceptionalCasesLab />
        </div>
      </PageContainer>
    </div>
  );
};
