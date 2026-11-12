import React, { useState, useRef, useEffect } from 'react';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { Molecule3DViewer } from '../3d/Molecule3DViewer';
import { ExceptionalCase2D } from '../2d/ExceptionalCase2D';
import { BilingualText } from '../BilingualText';
import { EXCEPTIONAL_CASES } from '../../content/examples/exceptionalCases';
import { Flame, Eye, EyeOff, Layers, ShieldAlert, Sparkles, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export const ExceptionalCasesLab: React.FC = () => {
  const [filterTopic, setFilterTopic] = useState<'all' | 'optical' | 'conformational'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeIsomer, setActiveIsomer] = useState<'A' | 'B'>('A');
  const [spaceFilling, setSpaceFilling] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split');
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (rootRef.current?.requestFullscreen) {
      await rootRef.current.requestFullscreen();
    }
  };

  const filteredCases = EXCEPTIONAL_CASES.filter((c) => {
    if (filterTopic === 'optical') return c.id.startsWith('exc-opt');
    if (filterTopic === 'conformational') return c.id.startsWith('exc-conf');
    return true;
  });

  const currentCase = filteredCases[selectedIndex] || filteredCases[0];
  const activeStructure = activeIsomer === 'A' ? currentCase.isomerA.structure : currentCase.isomerB.structure;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col h-full w-full overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#06101d]' : 'bg-transparent'
      }`}
    >
      {/* Top Filter Bar */}
      <div className="flex flex-col items-stretch gap-3 border-b border-[rgba(70,227,255,0.14)] bg-[#091b2e]/90 p-3 backdrop-blur-md sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <label className="text-xs font-bold text-slate-300">
            <BilingualText en="Filter Exceptions:" bn="ব্যতিক্রম ফিল্টার:" />
          </label>
          <div className="flex min-w-0 overflow-x-auto rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-semibold sm:w-auto">
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

        {/* View Mode & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Model
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === '2d'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Blueprint
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Split (2D + 3D)
            </button>
          </div>

          {/* Isomer A / B Switcher */}
          <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900/80 p-0.5">
            <button
              type="button"
              onClick={() => setActiveIsomer('A')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
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
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
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
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              spaceFilling
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CPK</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/90 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Laboratory'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Left Master List + Right 3D Visualizer & Theory */}
      <div className="grid min-h-[460px] flex-1 grid-cols-1 lg:min-h-[560px] lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left Column: Interactive List of Exceptional Cases */}
        <div className="border-r border-[rgba(70,227,255,0.14)] bg-[#071524]/90 overflow-y-auto max-h-[240px] lg:max-h-none p-2 space-y-1">
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

        {/* Right Area: Visualizer Stage + Bottom Mechanism Card */}
        <div className="flex h-full min-w-0 flex-col">
          {/* Visualizer Stage */}
          <div className={`relative flex-1 bg-gradient-to-b from-[#05111e] to-[#08182b] flex flex-col overflow-hidden ${viewMode === 'split' ? 'min-h-[600px] xl:min-h-[300px] xl:flex-row' : 'min-h-[300px]'}`}>
            {/* 3D Model Stage */}
            {(viewMode === '3d' || viewMode === 'split') && (
              <div className={`relative min-h-[300px] min-w-0 flex-1 ${viewMode === 'split' ? 'w-full border-b border-slate-800 xl:w-1/2 xl:border-b-0 xl:border-r' : 'w-full'}`}>
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
                  <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-2.5 backdrop-blur-md shadow-lg max-w-[240px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {currentCase.id.startsWith('exc-opt') ? 'Optical Exception' : 'Conformational Exception'}
                    </span>
                    <h4 className="text-xs font-black text-white mt-0.5 truncate">{currentCase.iupacName.en}</h4>
                    <p className="text-[11px] text-amber-300 font-bold">
                      {activeIsomer === 'A' ? currentCase.isomerA.label : currentCase.isomerB.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2D Mechanism Blueprint Stage */}
            {(viewMode === '2d' || viewMode === 'split') && (
              <div className={`min-h-[300px] min-w-0 flex-1 ${viewMode === 'split' ? 'w-full xl:w-1/2' : 'w-full'} overflow-y-auto`}>
                <ExceptionalCase2D currentCase={currentCase} activeIsomer={activeIsomer} />
              </div>
            )}
          </div>

          {/* Bottom Mechanism & Exam Insight Drawer */}
          <div className="border-t border-[rgba(70,227,255,0.14)] bg-[#071524]/95 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Exception Mechanism &amp; Scientific Rationale:
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentCase.exceptionMechanism?.en || currentCase.pedagogicalNote.en}
            </p>
            {currentCase.exceptionMechanism?.bn && (
              <p className="text-[11px] text-slate-400 font-bengali leading-snug">
                {currentCase.exceptionMechanism.bn}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
