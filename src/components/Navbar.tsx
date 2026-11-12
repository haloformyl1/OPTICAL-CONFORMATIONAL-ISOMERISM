import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Accessibility, Check, Maximize2, Menu, Minimize2, X, Phone, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BrandMark } from './BrandMark';
import { LanguageSelector } from './LanguageSelector';

const navLinks = [
  { path: '/learn', label: 'Learn', bnLabel: 'শিক্ষা' },
  { path: '/lab', label: '3D Labs', bnLabel: '৩ডি ল্যাব' },
  { path: '/examples', label: '100+ Examples', bnLabel: '১০০+ উদাহরণ' },
  { path: '/exceptions', label: '20 Exceptions', bnLabel: '২০ ব্যতিক্রম' },
  { path: '/practice', label: 'Practice', bnLabel: 'অনুশীলন' },
  { path: '/progress', label: 'Progress', bnLabel: 'অগ্রগতি' },
];

export const Navbar: React.FC = () => {
  const { reducedMotion, setReducedMotion, language } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appFullscreen, setAppFullscreen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccessibilityOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setAppFullscreen(document.fullscreenElement === document.documentElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleAppFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn('Application fullscreen is unavailable in this browser.', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-auto min-h-[var(--header-height-mobile)] items-center border-b border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.92)] py-1.5 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:min-h-[var(--header-height-desktop)]">
        <div className="mx-auto flex w-full max-w-[var(--page-max)] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
          {/* Logo & Designer Pill */}
          <div className="flex shrink-0 flex-col items-start gap-1">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl focus-visible:outline-none text-left bg-transparent border-0 p-0 cursor-pointer"
              aria-label="PIECHEM Stereochemistry home"
            >
              <BrandMark compact />
            </button>

            {/* Designed by Arghyadeep Roy badge */}
            <div className="hidden flex-wrap items-center gap-1.5 text-[10px] font-semibold text-[#a9bfd2] sm:flex sm:text-[11px]">
              <span className="rounded-md bg-cyan-950/70 px-2 py-0.5 border border-cyan-500/30 text-cyan-200">
                Prepared by: <span className="text-white font-bold">Arghyadeep Roy</span>
              </span>
              <a
                href="tel:9830507435"
                className="hidden sm:inline-flex items-center gap-1 rounded-md bg-slate-900/90 px-2 py-0.5 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-colors"
                title="Direct Phone Contact"
              >
                <Phone className="h-3 w-3 text-cyan-400" />
                <span>9830507435</span>
              </a>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 rounded-2xl border border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.7)] p-1 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {link.path === '/exceptions' && (
                    <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  )}
                  <span>{language === 'bn' ? link.bnLabel : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Accessibility, Fullscreen, Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="hidden sm:block">
              <LanguageSelector compact />
            </div>

            {/* Accessibility toggle button */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(70,227,255,0.22)] bg-[rgba(8,19,30,0.85)] text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer"
                title="Accessibility settings"
                aria-label="Accessibility"
              >
                <Accessibility className="h-4 w-4" />
              </button>

              {accessibilityOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-cyan-500/30 bg-[#091b2e] p-3 shadow-2xl backdrop-blur-xl z-50">
                  <p className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-700/60 pb-1">
                    Accessibility Options
                  </p>
                  <label className="flex items-center justify-between text-xs font-medium text-slate-300 cursor-pointer">
                    <span>Reduced Motion</span>
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      className="rounded border-cyan-500/40 text-cyan-500 focus:ring-0"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleAppFullscreen}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[rgba(70,227,255,0.22)] bg-[rgba(8,19,30,0.85)] text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 sm:flex cursor-pointer"
              title={appFullscreen ? 'Exit fullscreen' : 'Full screen'}
              aria-label="Fullscreen"
            >
              {appFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex xl:hidden h-10 w-10 items-center justify-center rounded-xl border border-[rgba(70,227,255,0.22)] bg-[rgba(8,19,30,0.85)] text-cyan-400 hover:border-cyan-400/50 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[var(--header-height-mobile)] bottom-0 z-40 bg-[#06101d]/95 backdrop-blur-2xl p-5 overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-xl p-3 text-sm font-bold border-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.path === '/exceptions' && <Flame className="h-4 w-4 text-amber-400" />}
                    <span>{language === 'bn' ? link.bnLabel : link.label}</span>
                  </span>
                  {isActive && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col gap-3 text-xs text-slate-400">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-pressed={reducedMotion}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-left font-semibold text-slate-200 cursor-pointer"
            >
              <span>Reduced Motion</span>
              <span className={`grid h-5 w-5 place-items-center rounded border ${reducedMotion ? 'border-cyan-400 bg-cyan-500 text-white' : 'border-slate-600'}`}>
                {reducedMotion && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleAppFullscreen}
              className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-left font-semibold text-slate-200 cursor-pointer"
            >
              {appFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span>{appFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
            </button>

            <div className="flex items-center justify-between">
              <span>Prepared &amp; Authored:</span>
              <span className="font-bold text-white">Arghyadeep Roy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Direct Hotline:</span>
              <a href="tel:9830507435" className="font-bold font-mono text-cyan-300">9830507435</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

