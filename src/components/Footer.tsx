import React from 'react';
import { BrandMark } from './BrandMark';

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-[rgba(70,227,255,0.18)] bg-[rgba(8,19,30,0.92)] backdrop-blur-xl">
    <div className="mx-auto flex w-full max-w-[var(--page-max)] flex-col items-center justify-between gap-5 px-5 py-7 text-center sm:flex-row sm:text-left lg:px-8">
      <div>
        <BrandMark compact />
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#a9bfd2]">
          Optical &amp; Conformational Stereochemistry Learning Studio
        </p>
      </div>
      <p className="text-sm font-semibold leading-relaxed text-[#edf8ff]">
        <span className="block font-medium">Designed &amp; Prepared By- Arghyadeep Roy</span>
        <a
          href="tel:9830507435"
          className="block text-[#a9bfd2] hover:text-cyan-300 font-mono transition-colors"
        >
          Contact- 9830507435
        </a>
      </p>
    </div>
  </footer>
);

