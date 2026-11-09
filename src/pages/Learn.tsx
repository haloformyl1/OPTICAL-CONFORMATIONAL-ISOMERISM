import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle2, Orbit, ShieldAlert, Sparkles, Layers, Flame, Compass, ChevronRight } from 'lucide-react';
import { BilingualText } from '../components/BilingualText';
import { PageContainer, PageHeader } from '../components/ui/LayoutPrimitives';
import { ALL_MODULES } from '../content';
import { useStore } from '../store/useStore';

const moduleIcons = [Orbit, Layers, Sparkles, Compass, Orbit, Flame, ShieldAlert];

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const completedModules = useStore((state) => state.completedModules);
  const percentage = Math.round((completedModules.length / ALL_MODULES.length) * 100);

  const progressSummary = (
    <div className="flex w-full min-w-0 max-w-sm items-center gap-4 p-4 sm:min-w-[220px] rounded-2xl border border-cyan-500/20 bg-[#07192be8] backdrop-blur-md">
      <div
        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#00f2fe ${percentage * 3.6}deg, #1e293b 0deg)`,
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-[#06101d] text-sm font-black text-cyan-300 font-mono">
          {percentage}%
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
          <BilingualText en="Curriculum progress" bn="অগ্রগতি" />
        </p>
        <p className="mt-1 font-bold text-white text-sm">
          <BilingualText
            en={`${completedModules.length} of ${ALL_MODULES.length} completed`}
            bn={`${ALL_MODULES.length}টির মধ্যে ${completedModules.length}টি সম্পূর্ণ`}
          />
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100dvh-var(--header-height-desktop))] w-full">
      <PageContainer>
        <PageHeader
          eyebrow={<BilingualText en="Curriculum Pathway" bn="পাঠ্যক্রম সূচি" />}
          icon={BookOpen}
          title={<BilingualText en="Stereochemistry Learning Modules" bn="স্টেরিওরসায়ন শিক্ষণ অধ্যায়সমূহ" />}
          description={<BilingualText en="Select a module below to explore step-by-step interactive 3D simulations, projection transformations, and masterclass exceptions." bn="ধাপে ধাপে ইন্টারেক্টিভ ৩ডি সিমুলেশন, প্রজেকশন রূপান্তর এবং ব্যতিক্রমী ক্ষেত্রসমূহ দেখতে নিচের যেকোনো অধ্যায় নির্বাচন করুন।" />}
          aside={progressSummary}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_MODULES.map((module, index) => {
            const completed = completedModules.includes(module.id);
            const Icon = moduleIcons[index] ?? Orbit;

            return (
              <div
                key={module.id}
                onClick={() => navigate(`/learn/${module.id}`)}
                className="group relative flex flex-col justify-between rounded-3xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    {completed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Module #{index}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                    <BilingualText en={module.title.en} bn={module.title.bn} />
                  </h3>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    {module.learningObjectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          <BilingualText en={obj.en} bn={obj.bn} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Enter Module</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
};

