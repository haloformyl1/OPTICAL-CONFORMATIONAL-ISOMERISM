import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  as?: 'div' | 'section' | 'article';
}

export const PageContainer: React.FC<ContainerProps> = ({ children, className = '', compact = false, as: Tag = 'div' }) => (
  <Tag className={`mx-auto w-full max-w-[var(--page-max)] px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 ${className}`}>{children}</Tag>
);

export const ReadingContainer: React.FC<Omit<ContainerProps, 'compact'>> = ({ children, className = '', as: Tag = 'div' }) => (
  <Tag className={`max-w-[var(--reading-max)] mx-auto ${className}`}>{children}</Tag>
);

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, aside, icon: Icon, className = '' }) => (
  <header className={`flex flex-col gap-3.5 sm:gap-5 border-b border-[rgba(70,227,255,0.18)] pb-5 sm:pb-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
    <div className="max-w-[85ch] min-w-0">
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 sm:mb-3">
          {Icon && <Icon className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />}
          <span>{eyebrow}</span>
        </div>
      )}
      <h1 className="text-[clamp(1.5rem,4vw,2.75rem)] font-black leading-[1.15] text-white tracking-tight break-words">{title}</h1>
      {description && <div className="mt-2.5 sm:mt-4 max-w-[78ch] text-sm sm:text-base leading-relaxed text-slate-300 break-words">{description}</div>}
    </div>
    {aside && <div className="w-full shrink-0 sm:max-w-xs lg:w-auto mt-4 lg:mt-0">{aside}</div>}
  </header>
);

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  accent?: 'blue' | 'teal' | 'violet' | 'amber' | 'success';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon: Icon, accent = 'blue', className = '' }) => {
  const accentColors = {
    blue: 'text-cyan-400',
    teal: 'text-teal-400',
    violet: 'text-purple-400',
    amber: 'text-amber-400',
    success: 'text-emerald-400',
  };

  return (
    <header className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className={`h-5 w-5 shrink-0 ${accentColors[accent]}`} aria-hidden="true" />}
        <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
      </div>
      {subtitle && <div className="text-sm text-slate-400 max-w-[80ch]">{subtitle}</div>}
    </header>
  );
};
