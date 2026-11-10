import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ALL_EXAMPLES } from '../../content/examples';
import { MolecularCanvas } from '../3d/MolecularCanvas';
import { Molecule3DViewer } from '../3d/Molecule3DViewer';
import { FischerProjection2D } from '../2d/FischerProjection2D';
import { NewmanSawhorse2D } from '../2d/NewmanSawhorse2D';
import { CyclohexaneChair2D } from '../2d/CyclohexaneChair2D';
import { BilingualText } from '../BilingualText';
import { Search, Filter, Layers, Eye, ChevronRight, BookOpen, Bookmark, BookmarkCheck, Maximize2, Minimize2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { IsomerismCategory } from '../../types/isomerism';

export const ExamplesCatalogLab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<IsomerismCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExampleId, setSelectedExampleId] = useState(ALL_EXAMPLES[0].id);
  const [activeIsomer, setActiveIsomer] = useState<'A' | 'B'>('A');
  const [mobileTab, setMobileTab] = useState<'catalog' | 'viewer'>('catalog');
  const [spaceFilling, setSpaceFilling] = useState(false);
  const [showDipole, setShowDipole] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isViewerFs, setIsViewerFs] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsViewerFs(document.fullscreenElement === viewerRef.current);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleViewerFs = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (viewerRef.current?.requestFullscreen) {
      await viewerRef.current.requestFullscreen();
    }
  };

  const { bookmarkedExamples, toggleBookmark } = useStore();

  const filteredExamples = useMemo(() => {
    return ALL_EXAMPLES.filter((ex) => {
      const matchCategory = selectedCategory === 'all' || ex.category === selectedCategory;
      const matchSearch =
        ex.iupacName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.commonName && ex.commonName.en.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentExample = ALL_EXAMPLES.find((ex) => ex.id === selectedExampleId) || ALL_EXAMPLES[0];
  const activeStructure = activeIsomer === 'A' ? currentExample.isomerA.structure : currentExample.isomerB.structure;
  const isBookmarked = bookmarkedExamples.includes(currentExample.id);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Mobile-only Segment Switcher */}
      <div className="lg:hidden flex rounded-xl border border-cyan-500/30 bg-[#091b2e] p-1 mb-4 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer border-0 text-center ${
            mobileTab === 'catalog'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Catalog ({filteredExamples.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('viewer')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer border-0 text-center truncate px-2 ${
            mobileTab === 'viewer'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          3D Model: {currentExample.formula}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-6 h-full min-h-[460px] lg:min-h-[640px] w-full">
        {/* Left Column: Filter & Searchable List of 100+ Examples */}
        <div
          className={`${
            mobileTab === 'catalog' ? 'flex' : 'hidden lg:flex'
          } flex-col rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-4 shadow-xl backdrop-blur-xl h-full max-h-[700px] overflow-hidden`}
        >
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by name, formula, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/30 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
            {(['all', 'optical', 'conformational', 'exception'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-bold whitespace-nowrap transition-all cursor-pointer border-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all'
                  ? 'All (100+)'
                  : cat === 'optical'
                  ? 'Optical (50+)'
                  : cat === 'conformational'
                  ? 'Conformational (50+)'
                  : 'Exceptions (20)'}
              </button>
            ))}
          </div>

          {/* Molecular Scroll List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {filteredExamples.map((ex, idx) => {
              const isSelected = ex.id === selectedExampleId;
              const isOpt = ex.category === 'optical';
              const isExc = ex.category === 'exception';

              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    setSelectedExampleId(ex.id);
                    setActiveIsomer('A');
                    setMobileTab('viewer');
                  }}
                  className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-cyan-400/80 bg-cyan-950/40 text-white shadow-md'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isExc
                          ? 'bg-amber-900/60 text-amber-300'
                          : isOpt
                          ? 'bg-purple-900/60 text-purple-300'
                          : 'bg-cyan-900/60 text-cyan-300'
                      }`}>
                        {ex.formula}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{ex.iupacName.en}</span>
                    </div>
                    {ex.commonName && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{ex.commonName.en}</span>
                    )}
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Full Interactive 3D Model Inspector */}
        <div
          ref={viewerRef}
          className={`${
            mobileTab === 'viewer' ? 'flex' : 'hidden lg:flex'
          } ${isViewerFs ? 'fixed inset-0 z-50 p-6 bg-[#06101d]' : 'rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.85)] p-4 shadow-xl backdrop-blur-xl h-full max-h-[700px]'} flex-col overflow-hidden`}
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {currentExample.formula}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">{currentExample.iupacName.en}</h3>
              </div>
              {currentExample.commonName && (
                <p className="text-xs text-slate-400 mt-0.5 font-bengali">{currentExample.commonName.bn}</p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleViewerFs}
                className="p-2 rounded-xl border border-cyan-500/30 bg-slate-900 text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
                title={isViewerFs ? 'Exit Fullscreen' : 'Fullscreen 3D Viewer'}
              >
                {isViewerFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => toggleBookmark(currentExample.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
                title="Bookmark for review"
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </button>

              {/* View Mode Toggle: 3D vs 2D */}
              <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                    viewMode === '3d'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer border-0 ${
                    viewMode === '2d'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2D Formula
                </button>
              </div>

              {/* Isomer Switcher */}
              <div className="flex rounded-xl border border-cyan-500/30 bg-slate-900 p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveIsomer('A')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer border-0 ${
                    activeIsomer === 'A'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentExample.isomerA.label.split(' ')[0]}
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
                  {currentExample.isomerB.label.split(' ')[0]}
                </button>
              </div>

              {viewMode === '3d' && (
                <button
                  type="button"
                  onClick={() => setSpaceFilling(!spaceFilling)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    spaceFilling
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                  title="Space-Filling (CPK spheres)"
                >
                  <Layers className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Model Viewport Stage */}
          <div className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden bg-gradient-to-b from-[#05111e] to-[#08182b] border border-cyan-500/10 flex">
            {viewMode === '3d' ? (
              <>
                <MolecularCanvas cameraPosition={[0, 1.2, 4.5]}>
                  <Molecule3DViewer
                    structure={activeStructure}
                    showLabels={true}
                    showPriorityBadges={true}
                    spaceFilling={spaceFilling}
                    showDipole={showDipole}
                  />
                </MolecularCanvas>

                <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 text-[11px] text-cyan-300 backdrop-blur-md">
                  Showing: <span className="font-bold text-white">{activeIsomer === 'A' ? currentExample.isomerA.label : currentExample.isomerB.label}</span>
                </div>
              </>
            ) : (
              <div className="h-full w-full overflow-y-auto p-2">
                {currentExample.category === 'conformational' ? (
                  currentExample.systemType === 'carbocycle' || currentExample.iupacName.en.toLowerCase().includes('cyclohexane') ? (
                    <CyclohexaneChair2D substituent={currentExample.formula.includes('CH3') ? 'CH3' : 'H'} />
                  ) : (
                    <NewmanSawhorse2D moleculeType={currentExample.formula.includes('C4') ? 'butane' : 'ethane'} />
                  )
                ) : (
                  <FischerProjection2D />
                )}
              </div>
            )}
          </div>

          {/* Pedagogical Note / Formula Card */}
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Pedagogical &amp; Stereochemical Notes:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {currentExample.pedagogicalNote.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

