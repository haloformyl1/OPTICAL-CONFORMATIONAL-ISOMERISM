import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getModuleById, ALL_MODULES } from '../content';
import { BilingualText } from '../components/BilingualText';
import { useStore } from '../store/useStore';
import { ArrowLeft, CheckCircle, Target, Sparkles, ChevronRight, Info } from 'lucide-react';
import { FullscreenInteractiveFrame } from '../components/ui/FullscreenInteractiveFrame';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Embedded interactive labs
import { DihedralEnergyLab } from '../components/labs/DihedralEnergyLab';
import { CyclohexaneLab } from '../components/labs/CyclohexaneLab';
import { SymmetryScannerLab } from '../components/labs/SymmetryScannerLab';
import { EnantiomerCompareLab } from '../components/labs/EnantiomerCompareLab';
import { CIPPriorityLab } from '../components/labs/CIPPriorityLab';
import { ExceptionalCasesLab } from '../components/labs/ExceptionalCasesLab';
import { PolarimeterLab } from '../components/labs/PolarimeterLab';
import { ChiralLockLab } from '../components/labs/ChiralLockLab';
import { MesoCompoundFeature } from '../components/labs/MesoCompoundFeature';

export const ModuleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const moduleData = getModuleById(id || '');
  const { markModuleCompleted, completedModules } = useStore();
  const [cipSubTab, setCipSubTab] = React.useState<'cip' | 'lock' | 'meso'>('lock');

  if (!moduleData) {
    return <Navigate to="/learn" replace />;
  }

  const isCompleted = completedModules.includes(moduleData.id);

  const handleToggleComplete = () => {
    markModuleCompleted(moduleData.id);
  };

  const currentIdx = ALL_MODULES.findIndex((m) => m.id === moduleData.id);
  const nextModule = currentIdx < ALL_MODULES.length - 1 ? ALL_MODULES[currentIdx + 1] : null;

  return (
    <div className="min-h-screen w-full pb-20">
      {/* Sticky Header Bar */}
      <div className="sticky top-[var(--header-height-mobile)] z-40 border-b border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.92)] shadow-xl backdrop-blur-xl md:top-[var(--header-height-desktop)]">
        <div className="mx-auto flex w-full max-w-[var(--page-max)] flex-col justify-between gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline bg-transparent border-0 cursor-pointer p-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <BilingualText en="Back to Modules" bn="অধ্যায়সমূহে ফিরে যান" />
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white break-words">
              <BilingualText en={moduleData.title.en} bn={moduleData.title.bn} />
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                  : 'border-cyan-500/30 bg-slate-900 text-slate-300 hover:border-cyan-400'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isCompleted ? 'Module Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Objectives Box */}
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400 mb-3 font-bold text-xs uppercase tracking-wider">
            <Target className="h-4 w-4" />
            <span>Learning Objectives</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
            {moduleData.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <BilingualText en={obj.en} bn={obj.bn} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Interactive 3D Lab Widget */}
        <FullscreenInteractiveFrame
          title={<BilingualText en={moduleData.title.en} bn={moduleData.title.bn} />}
        >
          <div className="h-[580px] w-full overflow-hidden">
            {moduleData.id === '00-symmetry-chirality' && <SymmetryScannerLab />}
            {moduleData.id === '01-enantiomers-diastereomers' && <EnantiomerCompareLab />}
            {moduleData.id === '02-cip-rs-system' && (
              <div className="flex flex-col h-full w-full">
                <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/90 px-4 py-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">
                    Interactive Tools:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCipSubTab('lock')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cipSubTab === 'lock'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. The Chiral Lock (Bond Rotations vs Swaps)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCipSubTab('cip')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cipSubTab === 'cip'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Step-by-Step CIP Priority Solver
                  </button>
                  <button
                    type="button"
                    onClick={() => setCipSubTab('meso')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cipSubTab === 'meso'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Meso Compound &amp; Plane of Symmetry (σ)
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {cipSubTab === 'lock' && <ChiralLockLab />}
                  {cipSubTab === 'cip' && <CIPPriorityLab />}
                  {cipSubTab === 'meso' && <MesoCompoundFeature />}
                </div>
              </div>
            )}
            {moduleData.id === '03-conformational-acyclic' && <DihedralEnergyLab />}
            {moduleData.id === '04-conformational-cyclic' && <CyclohexaneLab />}
            {moduleData.id === '05-exceptional-optical' && <ExceptionalCasesLab />}
            {moduleData.id === '06-exceptional-conformational' && <ExceptionalCasesLab />}
          </div>
        </FullscreenInteractiveFrame>

        {/* In-Depth Theory Sections */}
        <div className="space-y-8">
          {moduleData.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-3xl border border-slate-800 bg-[#091b2e]/60 p-6 sm:p-8 backdrop-blur-md space-y-4"
            >
              {section.title && (
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  <BilingualText en={section.title.en} bn={section.title.bn} />
                </h3>
              )}

              {section.content && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                  <BilingualText en={section.content.en} bn={section.content.bn} />
                </p>
              )}

              {section.formulaTex && (
                <div
                  className="my-4 p-4 rounded-2xl border border-cyan-500/20 bg-slate-950/80 text-cyan-300 overflow-x-auto text-center"
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(section.formulaTex, { throwOnError: false, displayMode: true }),
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Summary Card */}
        {moduleData.summary && (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Module Summary &amp; Key Takeaways:
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
              {moduleData.summary.map((sum, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>
                    <BilingualText en={sum.en} bn={sum.bn} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Module Navigation */}
        {nextModule && (
          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={() => {
                markModuleCompleted(moduleData.id);
                navigate(`/learn/${nextModule.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:scale-105 transition-all cursor-pointer border-0"
            >
              <span>Next: {nextModule.title.en.split('.')[1]}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
