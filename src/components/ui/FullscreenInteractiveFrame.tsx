import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, Maximize2, Minimize2, RefreshCw, X } from 'lucide-react';
import { BilingualText } from '../BilingualText';
import { AccessibleModelSummary } from './States';

interface FullscreenInteractiveFrameProps {
  children: React.ReactNode;
  onReset?: () => void;
  title?: React.ReactNode;
  accessibleSummary?: React.ReactNode;
  className?: string;
}

export const FullscreenInteractiveFrame: React.FC<FullscreenInteractiveFrameProps> = ({
  children,
  onReset,
  title,
  accessibleSummary,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const wasNativeFullscreenRef = useRef(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const isFullscreen = nativeFullscreen || fallbackFullscreen;

  useEffect(() => {
    const handleFullscreenChange = () => {
      const frameIsFullscreen = document.fullscreenElement === containerRef.current;
      if (wasNativeFullscreenRef.current && !frameIsFullscreen) {
        window.setTimeout(() => fullscreenButtonRef.current?.focus(), 0);
      }
      wasNativeFullscreenRef.current = frameIsFullscreen;
      setNativeFullscreen(frameIsFullscreen);
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fallbackFullscreen) setFallbackFullscreen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fallbackFullscreen, isFullscreen]);

  useEffect(() => {
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
  }, [fallbackFullscreen]);

  const toggleFullscreen = async () => {
    setHelpOpen(false);

    if (fallbackFullscreen) {
      setFallbackFullscreen(false);
      window.setTimeout(() => fullscreenButtonRef.current?.focus(), 0);
      return;
    }
    if (nativeFullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen();
      else setNativeFullscreen(false);
      return;
    }

    const element = containerRef.current;
    if (!element?.requestFullscreen || !document.fullscreenEnabled) {
      setFallbackFullscreen(true);
      return;
    }

    try {
      await element.requestFullscreen();
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      if (document.fullscreenElement !== element) {
        setNativeFullscreen(false);
        setFallbackFullscreen(true);
      }
    } catch (error) {
      console.warn('Native fullscreen is unavailable; using the in-page fallback.', error);
      setFallbackFullscreen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`lab-frame ${isFullscreen ? 'fullscreen-active' : ''} ${className}`}
      data-fullscreen={isFullscreen}
      role="region"
      aria-label="Interactive chemistry laboratory"
    >
      <div className="lab-frame-toolbar">
        <div className="lab-frame-toolbar-title flex min-w-0 items-center gap-3">
          <span className="status-dot" aria-hidden="true" />
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-white">
              {title ?? <BilingualText en="Interactive laboratory" bn="ইন্টারেক্টিভ ল্যাবরেটরি" />}
            </div>
            <div className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-sky-100/60">
              <BilingualText en="Explore mode · Live model" bn="এক্সপ্লোর মোড · লাইভ মডেল" />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {onReset && (
            <button type="button" onClick={onReset} className="icon-button" title="Restore teaching camera" aria-label="Restore teaching camera">
              <RefreshCw className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={() => setHelpOpen((open) => !open)} className="icon-button hidden sm:inline-flex" title="Interaction help" aria-label="Show interaction help" aria-expanded={helpOpen}>
            <HelpCircle className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
          <button ref={fullscreenButtonRef} type="button" onClick={toggleFullscreen} className="icon-button" title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {helpOpen && (
        <div className="absolute right-3 top-[66px] z-40 w-[min(340px,calc(100%-24px))] rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-4 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-modal)]" role="status">
          <button type="button" onClick={() => setHelpOpen(false)} className="icon-button absolute right-2 top-2 h-8 w-8" aria-label="Close help"><X className="h-4 w-4" /></button>
          <p className="pr-9 font-bold text-[var(--text-primary)]"><BilingualText en="Model controls" bn="মডেল নিয়ন্ত্রণ" /></p>
          <div className="mt-2 leading-relaxed"><BilingualText en="Drag to rotate, use the wheel or pinch to zoom, and use the visible controls to change the model. Your current state is preserved in fullscreen." bn="ঘোরাতে ড্র্যাগ করুন, জুম করতে হুইল বা পিঞ্চ ব্যবহার করুন এবং মডেল পরিবর্তন করতে দৃশ্যমান নিয়ন্ত্রণগুলি ব্যবহার করুন। ফুলস্ক্রিনে আপনার বর্তমান অবস্থা সংরক্ষিত থাকে।" /></div>
        </div>
      )}

      <div className="lab-frame-content crystal-grid">{children}</div>
      {accessibleSummary && <AccessibleModelSummary>{accessibleSummary}</AccessibleModelSummary>}
      <span className="sr-only" aria-live="polite">{isFullscreen ? 'Interactive model entered fullscreen.' : 'Interactive model is in the page.'}</span>
    </div>
  );
};
