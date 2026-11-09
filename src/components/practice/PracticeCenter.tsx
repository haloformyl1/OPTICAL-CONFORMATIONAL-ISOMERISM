import React, { useState, useEffect } from 'react';
import { QUESTION_BANK } from '../../content/questions';
import { BilingualText } from '../BilingualText';
import { Clock, CheckCircle2, XCircle, ChevronRight, Award, RotateCcw, PenTool, Sparkles, Filter, Layers } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const PracticeCenter: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const { recordQuestionResult, solvedQuestions } = useStore();

  useEffect(() => {
    let timer: number;
    if (started && !finished && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, finished, timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setTimeRemaining(600);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsAnswerChecked(true);
    const currentQ = QUESTION_BANK[currentIndex];
    const isCorrect = selectedOption === currentQ.correctOptionId;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    recordQuestionResult(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < QUESTION_BANK.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setFinished(true);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-950/40">
          <Sparkles className="h-10 w-10 text-cyan-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">
          <BilingualText en="Timed Stereochemistry Assessment" bn="সময় নিয়ন্ত্রিত স্টেরিওরসায়ন মূল্যায়ন" />
        </h2>

        <p className="mt-3 max-w-lg text-sm text-slate-300 leading-relaxed">
          <BilingualText
            en="Test your mastery across Chirality, Symmetry (POS, COS), CIP R/S rules, Ethane/Butane conformational energy barriers, Cyclohexane ring flips, and High-Yield Exceptional Cases."
            bn="কাইরালিটি, প্রতিসাম্য, সিআইপি নিয়ম, ইথেন/বিউটেন শক্তি বাধা, সাইক্লোহেক্সেন রিং ফ্লিপ এবং ব্যতিক্রমী ক্ষেত্রসমূহের ওপর নিজের দক্ষতা যাচাই করুন।"
          />
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5">
            <PenTool className="h-4 w-4 text-cyan-400" />
            <span>{QUESTION_BANK.length} Curated Questions</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>10 Minutes</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 cursor-pointer border-0"
        >
          <BilingualText en="Start Challenge Now" bn="চ্যালেঞ্জ শুরু করুন" />
        </button>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / QUESTION_BANK.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-950/40">
          <Award className="h-10 w-10 text-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">
          <BilingualText en="Assessment Completed!" bn="মূল্যায়ন সম্পন্ন হয়েছে!" />
        </h2>

        <div className="my-6 flex items-baseline justify-center gap-2">
          <span className="text-5xl font-black text-cyan-300 font-mono">{score}</span>
          <span className="text-xl text-slate-500">/ {QUESTION_BANK.length}</span>
          <span className="ml-3 rounded-lg bg-cyan-950 border border-cyan-500/30 px-2.5 py-1 text-sm font-bold text-cyan-300">
            {percentage}%
          </span>
        </div>

        <p className="max-w-md text-sm text-slate-300 leading-relaxed mb-6">
          {percentage >= 80 ? (
            <BilingualText
              en="Outstanding! You have mastered Optical & Conformational Stereochemistry at an advanced competitive exam level."
              bn="অসাধারণ! আপনি উচ্চতর প্রতিযোগিতামূলক পরীক্ষার স্তরে স্টেরিওরসায়নে দক্ষতা অর্জন করেছেন।"
            />
          ) : percentage >= 50 ? (
            <BilingualText
              en="Good effort! Review the 3D Labs and Exceptional Cases to reinforce CIP priority tie-breakers and conformational energy barriers."
              bn="ভালো প্রচেষ্টা! সিআইপি নিয়ম এবং কনফর্মেশনাল বাধাগুলি আরও ঝালাই করতে ৩ডি ল্যাবগুলো পুনরায় দেখুন।"
            />
          ) : (
            <BilingualText
              en="Keep practicing! Work through the interactive 3D simulations in the Labs section to build your 3D spatial intuition."
              bn="অনুশীলন চালিয়ে যান! আপনার ৩ডি স্থানিক ধারণা স্পষ্ট করতে ল্যাব বিভাগের সিমুলেশনগুলো ব্যবহার করুন।"
            />
          )}
        </p>

        <button
          type="button"
          onClick={handleStart}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 cursor-pointer border-0"
        >
          <RotateCcw className="h-4 w-4" />
          <BilingualText en="Retake Assessment" bn="পুনরায় পরীক্ষা দিন" />
        </button>
      </div>
    );
  }

  const currentQ = QUESTION_BANK[currentIndex];

  return (
    <div className="flex flex-col rounded-3xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-lg px-2.5 py-1">
            Question {currentIndex + 1} of {QUESTION_BANK.length}
          </span>
          {currentQ.topic && (
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              • {currentQ.topic}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-lg px-2.5 py-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <div className="text-xs font-mono font-bold text-cyan-300">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          <BilingualText en={currentQ.text.en} bn={currentQ.text.bn} />
        </h3>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2.5 mb-6">
        {currentQ.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.id === currentQ.correctOptionId;

          let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white';
          if (isSelected) {
            btnStyle = 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]';
          }
          if (isAnswerChecked) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200';
            } else if (isSelected) {
              btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
            } else {
              btnStyle = 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isAnswerChecked}
              onClick={() => setSelectedOption(option.id)}
              className={`flex items-center justify-between rounded-2xl border p-3.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-bold text-cyan-300">
                  {option.id.toUpperCase()}
                </span>
                <span>
                  <BilingualText en={option.text.en} bn={option.text.bn} />
                </span>
              </div>
              {isAnswerChecked && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
              {isAnswerChecked && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (when checked) */}
      {isAnswerChecked && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4 mb-6 animate-in fade-in duration-200">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-1">
            Detailed Solution &amp; Explanation:
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <BilingualText en={currentQ.explanation.en} bn={currentQ.explanation.bn} />
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-slate-800">
        {!isAnswerChecked ? (
          <button
            type="button"
            disabled={!selectedOption}
            onClick={handleCheck}
            className={`rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 ${
              selectedOption
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <BilingualText en="Check Answer" bn="উত্তর যাচাই করুন" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-105 cursor-pointer border-0"
          >
            <span>{currentIndex < QUESTION_BANK.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
