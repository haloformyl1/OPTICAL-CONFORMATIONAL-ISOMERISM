import React from 'react';
import { useStore } from '../store/useStore';

interface BrandMarkProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
  showSubtitle?: boolean;
  subtitle?: React.ReactNode;
  showText?: boolean;
}

export const BrandIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <div className={`relative group shrink-0 flex items-center justify-center ${className}`}>
    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500 pointer-events-none" />

    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative drop-shadow-[0_4px_12px_rgba(0,198,255,0.35)] transition-transform duration-300 transform group-hover:scale-105"
    >
      <defs>
        <linearGradient id="piechemHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#0066ff" />
          <stop offset="100%" stopColor="#7b2cbf" />
        </linearGradient>

        <linearGradient id="piechemCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a7bd5" />
          <stop offset="100%" stopColor="#00d2ff" />
        </linearGradient>

        <radialGradient id="piechemGlowAccent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
        </radialGradient>

        <filter id="piechemHexShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00c6ff" floodOpacity="0.5" />
        </filter>
      </defs>

      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        fill="none"
        stroke="url(#piechemHexGrad)"
        strokeWidth="4.5"
        strokeLinejoin="round"
        filter="url(#piechemHexShadow)"
      />

      <polygon
        points="50,15 80,32 80,68 50,85 20,68 20,32"
        fill="#061325"
        fillOpacity="0.9"
        stroke="url(#piechemHexGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <circle cx="50" cy="6" r="3.5" fill="#00f2fe" />
      <circle cx="88" cy="28" r="3.5" fill="#0066ff" />
      <circle cx="88" cy="72" r="3.5" fill="#7b2cbf" />
      <circle cx="50" cy="94" r="3.5" fill="#00f2fe" />
      <circle cx="12" cy="72" r="3.5" fill="#0066ff" />
      <circle cx="12" cy="28" r="3.5" fill="#7b2cbf" />

      <path
        d="M50 50 L50 24 A26 26 0 1 1 24 50 Z"
        fill="url(#piechemCoreGrad)"
        opacity="0.95"
      />

      <path
        d="M54 46 L76 46 A26 26 0 0 0 54 24 Z"
        fill="#00f2fe"
      />

      <circle cx="50" cy="50" r="5" fill="#ffffff" />
      <circle cx="50" cy="50" r="11" fill="url(#piechemGlowAccent)" />

      <ellipse
        cx="50"
        cy="50"
        rx="31"
        ry="13"
        fill="none"
        stroke="#00f2fe"
        strokeWidth="1.8"
        strokeDasharray="4 3"
        transform="rotate(-30 50 50)"
        opacity="0.85"
      />
    </svg>
  </div>
);

export const BrandMark: React.FC<BrandMarkProps> = ({
  compact = false,
  inverse = false,
  className = '',
  showSubtitle = true,
  subtitle,
  showText = true,
}) => {
  const iconSize = compact ? 34 : 44;
  const { language } = useStore();

  const defaultSubtitle =
    language === 'bn'
      ? 'অপটিক্যাল ও কনফর্মেশনাল সমাণুতা'
      : 'OPTICAL & CONFORMATIONAL ISOMERISM';

  const displaySubtitle = subtitle ?? defaultSubtitle;

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-2.5 sm:gap-3 select-none ${className}`}
      aria-label="PIECHEM"
    >
      <BrandIcon size={iconSize} />

      {showText && (
        <span className="flex flex-col justify-center leading-none text-left">
          <span
            className={`font-black tracking-wider font-sans uppercase flex items-center ${
              compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 drop-shadow-[0_2px_10px_rgba(0,242,254,0.35)]">
              PIE
            </span>
            <span className={`tracking-tight ml-0.5 ${inverse ? 'text-white' : 'text-white'}`}>
              CHEM
            </span>
          </span>
          {showSubtitle && (
            <span
              className={`tracking-[0.14em] text-cyan-300/80 font-bold uppercase ${
                compact
                  ? 'hidden min-[380px]:inline-block text-[7px] sm:text-[9px] mt-0.5 sm:tracking-[0.18em]'
                  : 'text-[8px] sm:text-[12px] mt-1 sm:tracking-[0.22em]'
              } sm:whitespace-nowrap whitespace-normal`}
            >
              {displaySubtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
