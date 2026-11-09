import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useStore, type LanguageMode } from '../store/useStore';

interface LanguageSelectorProps {
  compact?: boolean;
}

const options: { value: LanguageMode; label: string; shortLabel: string; lang?: string }[] = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'bn', label: 'বাংলা', shortLabel: 'বাংলা', lang: 'bn' },
  { value: 'bilingual', label: 'English + বাংলা', shortLabel: 'EN+বাংলা' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const activeOption = options.find((option) => option.value === language) ?? options[0];

  useEffect(() => {
    const closeFromOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', closeFromOutside);
    document.addEventListener('keydown', closeFromKeyboard);
    return () => {
      document.removeEventListener('mousedown', closeFromOutside);
      document.removeEventListener('keydown', closeFromKeyboard);
    };
  }, []);

  return (
    <div className={`relative ${compact ? '' : 'w-full'}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex min-h-10 items-center gap-2 rounded-xl border border-[rgba(70,227,255,0.22)] bg-[rgba(8,19,30,0.85)] px-3 text-xs sm:text-sm font-bold text-[#edf8ff] shadow-sm backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer ${
          compact ? '' : 'w-full justify-between px-3.5'
        }`}
        aria-label="Language / ভাষা"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Globe2 className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
          <span className={compact ? 'hidden xl:inline' : ''}>
            Language / <span lang="bn">ভাষা</span>
          </span>
          <span
            className={`${
              compact ? 'hidden sm:inline xl:hidden' : 'hidden'
            } max-w-[74px] truncate text-[11px] text-cyan-300`}
            lang={activeOption.lang}
          >
            {activeOption.shortLabel}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-cyan-500/30 bg-[#091b2e] p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((option) => (
            <button
              key={option.value}
              role="menuitem"
              type="button"
              onClick={() => {
                setLanguage(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer border-0 ${
                language === option.value
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{option.label}</span>
              {language === option.value && (
                <Check className="h-3.5 w-3.5 text-cyan-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

