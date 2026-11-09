import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BilingualText } from '../BilingualText';
import type { BilingualString } from '../../types/content';

interface MisconceptionCardProps {
  incorrect: BilingualString;
  correct: BilingualString;
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({ incorrect, correct }) => {
  return (
    <div className="my-8 rounded-xl overflow-hidden border-2 border-[var(--stat-warn)] shadow-[0_0_15px_rgba(217,119,6,0.1)] glass-panel">
      <div className="flex flex-col md:flex-row">
        {/* Incorrect Side */}
        <div className="flex-1 p-6 bg-[var(--stat-warn)]/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--stat-warn)]/20 rounded-full text-[var(--stat-warn)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[var(--stat-warn)] text-lg m-0">
              <BilingualText en="Misconception" bn="ভুল ধারণা" />
            </h4>
          </div>
          <p className="text-[var(--text-str)] leading-relaxed font-medium">
            <BilingualText en={incorrect.en} bn={incorrect.bn} />
          </p>
        </div>

        {/* Divider */}
        <div className="w-full md:w-px h-px md:h-auto bg-[var(--border-sub)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-main)] border border-[var(--border-sub)] flex items-center justify-center text-[var(--text-mut)] text-xs font-bold">
            VS
          </div>
        </div>

        {/* Correct Side */}
        <div className="flex-1 p-6 bg-[var(--stat-succ)]/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--stat-succ)]/20 rounded-full text-[var(--stat-succ)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[var(--stat-succ)] text-lg m-0">
              <BilingualText en="Reality" bn="বাস্তবতা" />
            </h4>
          </div>
          <p className="text-[var(--text-str)] leading-relaxed font-medium">
            <BilingualText en={correct.en} bn={correct.bn} />
          </p>
        </div>
      </div>
    </div>
  );
};
