import React from 'react';
import { useStore } from '../store/useStore';

interface BilingualTextProps {
  en: string | React.ReactNode;
  bn: string | React.ReactNode;
  className?: string;
  isInline?: boolean;
}

export const BilingualText: React.FC<BilingualTextProps> = ({ 
  en, 
  bn, 
  className = '', 
  isInline = false 
}) => {
  const language = useStore((state) => state.language);

  if (language === 'en') {
    return <span lang="en" className={className}>{en}</span>;
  }

  if (language === 'bn') {
    return <span lang="bn" className={`font-bengali ${className}`}>{bn}</span>;
  }

  if (isInline) {
    return (
      <span className={className}>
        <span lang="en">{en}</span>
        <span className="mx-1.5 text-[var(--border-strong)]" aria-hidden="true">/</span>
        <span lang="bn" className="font-bengali">{bn}</span>
      </span>
    );
  }

  return (
    <span className={`bilingual-layout ${className}`}>
      <span className="bilingual-pane min-w-0" lang="en">
        <span className="language-badge mb-1.5">EN</span>
        <span className="block">{en}</span>
      </span>
      <span className="bilingual-pane font-bengali min-w-0" lang="bn">
        <span className="language-badge mb-1.5">বাংলা</span>
        <span className="block">{bn}</span>
      </span>
    </span>
  );
};
