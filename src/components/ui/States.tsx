import React from 'react';
import { AlertTriangle, Boxes, RefreshCw } from 'lucide-react';
import { BilingualText } from '../BilingualText';
import { BrandMark } from '../BrandMark';

export const LoadingState: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={`grid place-items-center overflow-x-clip px-6 text-center ${compact ? 'min-h-48' : 'min-h-[55vh]'}`} role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <BrandMark compact />
        <span className="absolute -inset-3 -z-10 animate-ping rounded-2xl border border-[var(--accent-primary)] opacity-20" aria-hidden="true" />
      </div>
      <div>
        <div className="font-bold text-[var(--text-primary)]"><BilingualText en="Preparing the stereochemistry workspace" bn="স্টেরিওরসায়ন ওয়ার্কস্পেস প্রস্তুত হচ্ছে" /></div>
        <div className="mt-1 text-sm text-[var(--text-muted)]"><BilingualText en="PIECHEM is loading the learning studio." bn="PIECHEM লার্নিং স্টুডিও লোড করছে।" /></div>
      </div>
    </div>
  </div>
);

interface ErrorStateProps {
  title?: React.ReactNode;
  message?: React.ReactNode;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => (
  <div className="empty-state" role="alert">
    <div className="max-w-md">
      <AlertTriangle className="mx-auto mb-4 h-9 w-9 text-[var(--warning)]" aria-hidden="true" />
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{title ?? <BilingualText en="This model could not be displayed" bn="এই মডেলটি দেখানো যায়নি" />}</h2>
      <div className="mt-2 text-[var(--text-secondary)]">{message ?? <BilingualText en="Try reloading the activity or use the text summary below." bn="অ্যাক্টিভিটিটি পুনরায় লোড করুন অথবা নিচের পাঠ্য সারাংশটি ব্যবহার করুন।" />}</div>
      {onRetry && <button type="button" className="btn btn-secondary mt-5" onClick={onRetry}><RefreshCw className="h-4 w-4" /><BilingualText en="Try again" bn="আবার চেষ্টা করুন" /></button>}
    </div>
  </div>
);

export const AccessibleModelSummary: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <details className={`border-t border-[var(--border-default)] bg-[var(--narration-background)] px-4 py-3 text-sm text-[var(--text-secondary)] ${className}`}>
    <summary className="flex cursor-pointer items-center gap-2 font-bold text-[var(--text-primary)]">
      <Boxes className="h-4 w-4 text-[var(--accent-secondary)]" aria-hidden="true" />
      <BilingualText en="Accessible model summary" bn="অ্যাক্সেসযোগ্য মডেল সারাংশ" />
    </summary>
    <div className="mt-3 leading-relaxed">{children}</div>
  </details>
);

interface ErrorBoundaryState { hasError: boolean; }

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('PIECHEM interface error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell-compact">
          <ErrorState onRetry={() => window.location.reload()} />
        </div>
      );
    }
    return this.props.children;
  }
}
