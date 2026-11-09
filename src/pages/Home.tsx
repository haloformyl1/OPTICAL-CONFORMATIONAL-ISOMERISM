import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Orbit, Sparkles, BookOpen, Layers, CheckCircle2, FlaskConical, Flame, Compass } from 'lucide-react';
import { HeroStereoAnimation } from '../components/3d/HeroStereoAnimation';
import { BilingualText } from '../components/BilingualText';
import { FullscreenInteractiveFrame } from '../components/ui/FullscreenInteractiveFrame';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height-mobile))] w-full flex-col md:min-h-[calc(100dvh-var(--header-height-desktop))]">
      <section className="mx-auto w-full max-w-[var(--page-max)] px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
        {/* Left Hero Content */}
        <div className="relative z-10 w-full max-w-[720px]">
          <div className="mb-4 sm:mb-5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span>Stereochemistry Learning Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#46e3ff] tracking-tight leading-[1.1] drop-shadow-[0_0_40px_rgba(70,227,255,0.45)]">
            <BilingualText
              en="Interactive Optical & Conformational Isomerism"
              bn="ইন্টারেক্টিভ অপটিক্যাল ও কনফর্মেশনাল সমাণুতা"
            />
          </h1>

          <div className="mt-4 sm:mt-6 max-w-[66ch] text-sm sm:text-base md:text-lg leading-relaxed text-[#a9bfd2]">
            <BilingualText
              en="Explore Gauche, Anti, Eclipsed & Partially Eclipsed rotamers, Enantiomers, Identical homomers, Diastereomers, and Meso compounds with real-time 3D interactive graphics across 100+ curated molecular models and 20 Masterclass Exceptions."
              bn="গশ, অ্যান্টি, এক্লিপসড, আংশিক গ্রহণযুক্ত ঘূর্ণক, এন্যানশিওমার, অভিন্ন হোমোমার, ডায়াস্টেরিওমার ও মেসো যৌগের ত্রিমাত্রিক ৩ডি মডেল এবং ১০০টিরও বেশি উদাহরণসহ ২০টি ব্যতিক্রমী ক্ষেত্র সরাসরি অন্বেষণ করুন।"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(70,227,255,0.35)] transition-all hover:scale-105 cursor-pointer border-0"
            >
              <BilingualText en="Start Learning Modules" bn="শেখা শুরু করুন" />
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/lab')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-[rgba(8,19,30,0.85)] px-6 py-3.5 text-sm font-bold text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer"
            >
              <FlaskConical className="h-4 w-4 text-purple-400" />
              <BilingualText en="Open 3D Labs" bn="৩ডি ল্যাব খুলুন" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/exceptions')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-950/30 px-5 py-3.5 text-sm font-bold text-amber-300 hover:bg-amber-950/50 cursor-pointer"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              <BilingualText en="20 Exceptions" bn="২০ ব্যতিক্রম" />
            </button>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[rgba(165,214,255,0.16)] pt-5 text-xs font-semibold text-[#a9bfd2]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <BilingualText en="50+ Optical Models" bn="৫০+ অপটিক্যাল মডেল" />
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <BilingualText en="50+ Conformational Models" bn="৫০+ কনফর্মেশনাল মডেল" />
            </span>
            <span className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-purple-400" />
              <BilingualText en="Real-Time Newman & PE Curves" bn="রিয়েল-টাইম নিউম্যান ও শক্তি লেখচিত্র" />
            </span>
            <span className="flex items-center gap-2">
              <Orbit className="h-4 w-4 text-amber-400" />
              <BilingualText en="Cyclohexane Ring-Flip Simulator" bn="সাইক্লোহেক্সেন রিং-ফ্লিপ সিমুলেটর" />
            </span>
          </div>
        </div>

        {/* Right Hero 3D Animation */}
        <div className="w-full">
          <FullscreenInteractiveFrame
            title={
              <BilingualText
                en="Interactive 3D Rotamer & Newman Simulator"
                bn="ইন্টারেক্টিভ ৩ডি রোটার ও নিউম্যান সিমুলেটর"
              />
            }
          >
            <HeroStereoAnimation />
          </FullscreenInteractiveFrame>
        </div>
      </section>
    </div>
  );
};

