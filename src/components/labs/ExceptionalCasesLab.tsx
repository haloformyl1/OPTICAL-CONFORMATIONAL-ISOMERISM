import React, { useState } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { Molecule3DViewer } from '../3d/Molecule3DViewer';
import { BilingualText } from '../BilingualText';
import { EXCEPTIONAL_CASES } from '../../content/examples/exceptionalCases';
import { Flame, Eye, EyeOff, Layers, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

export const ExceptionalCasesLab: React.FC = () => {
  const [filterTopic, setFilterTopic] = useState<'all' | 'optical' | 'conformational'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeIsomer, setActiveIsomer] = useState<'A' | 'B'>('A');
  const [spaceFilling, setSpaceFilling] = useState<boolean>(false);

  const filteredCases = EXCEPTIONAL_CASES.filter((c) => {
    if (filterTopic === 'optical') return c.id.startsWith('exc-opt');
    if (filterTopic === 'conformational') return c.id.startsWith('exc-conf');
    return true;
  });

  const currentCase = filteredCases[selectedIndex] || filteredCases[0];
  const activeStructure = activeIsomer === 'A' ? currentCase.isomerA.structure : currentCase.isomerB.structure;

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 sm:p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-300">
            <BilingualText en="Filter Exceptions:" bn="ব্যতিক্রম ফিল্টার:" />
          </label>
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setFilterTopic('all'); setSelectedIndex(0); }}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                filterTopic === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All 20 Cases
            </button>
            <button
              type="button"
              onClick={() => { setFilterTopic('optical'); setSelectedIndex(0); }}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                filterTopic === 'optical' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Optical (10 Cases)
            </button>
            <button
              type="button"
              onClick={() => { setFilterTopic('conformational'); setSelectedIndex(0); }}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                filterTopic === 'conformational' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Conformational (10 Cases)
            </button>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2">
          {/* Isomer A / B Switcher */}
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900/80 p-0.5">
            <button
              type="button"
              onClick={() => setActiveIsomer('A')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
                activeIsomer === 'A'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Form A
            </button>
            <button
              type="button"
              onClick={() => setActiveIsomer('B')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
                activeIsomer === 'B'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Form B
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSpaceFilling(!spaceFilling)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              spaceFilling
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Space-Filling</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Left Master List + Right 3D Visualizer & Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] flex-1 min-h-[460px] lg:min-h-[560px]">
        {/* Left Column: Interactive List of Exceptional Cases */}
        <div className="border-r border-[rgba(70,227,255,0.14)] bg-[#071524]/90 overflow-y-auto max-h-[260px] lg:max-h-none p-2 space-y-1">
          {filteredCases.map((c, idx) => {
            const isOpt = c.id.startsWith('exc-opt');
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setActiveIsomer('A');
                }}
                className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left transition-all cursor-pointer border ${
                  isSelected
                    ? isOpt
                      ? 'border-purple-500/60 bg-purple-950/40 text-white shadow-md'
                      : 'border-amber-500/60 bg-amber-950/40 text-white shadow-md'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isOpt ? 'bg-purple-900/60 text-purple-300' : 'bg-amber-900/60 text-amber-300'
                    }`}>
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{c.iupacName.en.split('(')[0]}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400/80 block mt-0.5 truncate">{c.commonName?.en}</span>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-cyan-300' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Area: 3D Stage + Bottom Mechanism Card */}
        <div className="flex flex-col min-w-0 h-full">
          {/* 3D Model Stage */}
          <div className="relative flex-1 min-h-[300px] bg-gradient-to-b from-[#05111e] to-[#08182b]">
            <MolecularCanvas cameraPosition={[0, 1.2, 4.8]}>
              <Molecule3DViewer
                structure={activeStructure}
                showLabels={true}
                showPriorityBadges={true}
                spaceFilling={spaceFilling}
              />
            </MolecularCanvas>

            {/* Model Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3 backdrop-blur-md shadow-lg max-w-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {currentCase.id.startsWith('exc-opt') ? 'Optical Isomerism Exception' : 'Conformational Isomerism Exception'}
                </span>
                <h4 className="text-sm font-black text-white mt-0.5">{currentCase.iupacName.en}</h4>
                <p className="text-xs text-amber-300 font-bold mt-0.5">
                  Showing: {activeIsomer === 'A' ? currentCase.isomerA.label : currentCase.isomerB.label}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Mechanism & Exam Insight Drawer */}
          <div className="border-t border-[rgba(70,227,255,0.14)] bg-[#071524]/95 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Exception Mechanism &amp; Scientific Rationale:
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentCase.exceptionMechanism?.en}
            </p>
            {currentCase.pedagogicalNote && (
              <div className="rounded-lg bg-cyan-950/40 border border-cyan-500/20 p-2 text-[11px] text-cyan-200">
                <strong>Exam Alert: </strong>{currentCase.pedagogicalNote.en}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
