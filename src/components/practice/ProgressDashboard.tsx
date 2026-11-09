import React from 'react';
import { useStore } from '../../store/useStore';
import { ALL_MODULES } from '../../content';
import { QUESTION_BANK } from '../../content/questions';
import { ALL_EXAMPLES } from '../../content/examples';
import { BilingualText } from '../BilingualText';
import { Trophy, CheckCircle2, BookmarkCheck, RotateCcw, BookOpen, Layers, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProgressDashboard: React.FC = () => {
  const { completedModules, solvedQuestions, bookmarkedExamples, resetProgress } = useStore();
  const navigate = useNavigate();

  const totalQuestionsSolved = Object.keys(solvedQuestions).length;
  const correctCount = Object.values(solvedQuestions).filter(Boolean).length;
  const accuracy = totalQuestionsSolved > 0 ? Math.round((correctCount / totalQuestionsSolved) * 100) : 0;

  const totalModules = ALL_MODULES.length;
  const modulesPct = Math.round((completedModules.length / totalModules) * 100);

  const bookmarkedItems = ALL_EXAMPLES.filter((ex) => bookmarkedExamples.includes(ex.id));

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module Completion */}
        <div className="rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Curriculum Progress</span>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{completedModules.length}</span>
            <span className="text-xs text-slate-500">/ {totalModules} Modules</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${modulesPct}%` }} />
          </div>
        </div>

        {/* Question Score */}
        <div className="rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Questions Solved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-300 font-mono">{correctCount}</span>
            <span className="text-xs text-slate-500">/ {QUESTION_BANK.length} Total</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Accuracy: <span className="font-bold text-white font-mono">{accuracy}%</span>
          </div>
        </div>

        {/* Curated Examples Explored */}
        <div className="rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chemical Models</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-300 font-mono">100+</span>
            <span className="text-xs text-slate-500">3D Interactive Models</span>
          </div>
          <div className="mt-3 text-[11px] text-purple-300 font-medium">
            50+ Optical • 50+ Conformational
          </div>
        </div>

        {/* Exceptional Cases */}
        <div className="rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Exceptional Cases</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 font-mono">20</span>
            <span className="text-xs text-slate-500">Masterclass Cases</span>
          </div>
          <div className="mt-3 text-[11px] text-amber-300 font-medium">
            10 Optical • 10 Conformational
          </div>
        </div>
      </div>

      {/* Bookmarked Examples Section */}
      <div className="rounded-3xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              <BilingualText en="Bookmarked Molecular Models" bn="বুকমার্ক করা আণবিক মডেলসমূহ" />
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {bookmarkedItems.length} Saved
          </span>
        </div>

        {bookmarkedItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            <BilingualText
              en="No molecules bookmarked yet. Click the bookmark icon on any molecule in the 100+ Examples catalog to save it for revision!"
              bn="কোনো অণু এখনও বুকমার্ক করা হয়নি। রিভিশনের জন্য সেভ করতে ১০০+ উদাহরণ ক্যাটালগে বুকমার্ক আইকনে ক্লিক করুন!"
            />
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookmarkedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/examples')}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-cyan-500/50 hover:bg-slate-800 cursor-pointer transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{item.iupacName.en}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{item.formula}</span>
                </div>
                <BookmarkCheck className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Progress Action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all your learning progress and quiz scores?')) {
              resetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer bg-transparent border-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Progress Data</span>
        </button>
      </div>
    </div>
  );
};

