import React, { useState } from 'react';
import { BilingualText } from '../BilingualText';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, RotateCw, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

interface CIPMoleculeOption {
  id: string;
  name: string;
  nameBn: string;
  top: { formula: string; priority: number; atomZ: string };
  bottom: { formula: string; priority: number; atomZ: string };
  left: { formula: string; priority: number; atomZ: string };
  right: { formula: string; priority: number; atomZ: string };
  chiralCarbonLabel: string;
  explanationEn: string;
  explanationBn: string;
}

const PRESET_MOLECULES: CIPMoleculeOption[] = [
  {
    id: 'lactic-r',
    name: '(R)-Lactic Acid',
    nameBn: '(R)-ল্যাকটিক অ্যাসিড',
    top: { formula: 'COOH', priority: 2, atomZ: 'C (attached to =O, -OH)' },
    bottom: { formula: 'CH3', priority: 3, atomZ: 'C (attached to -H, -H, -H)' },
    left: { formula: 'H', priority: 4, atomZ: 'H (Z=1, Lowest Priority)' },
    right: { formula: 'OH', priority: 1, atomZ: 'O (Z=8, Highest Priority)' },
    chiralCarbonLabel: 'C2*',
    explanationEn: 'Group 4 (H) is on a HORIZONTAL rung. Path 1(OH) -> 2(COOH) -> 3(CH3) is counter-clockwise (apparent S). Because 4 is on horizontal, REVERSE to (R)!',
    explanationBn: 'গ্রুপ ৪ (H) অনুভূমিক বন্ধনে আছে। ১(OH) -> ২(COOH) -> ৩(CH3) ঘূর্ণন ঘড়ির কাঁটার বিপরীতে (আপাত S)। ৪ অনুভূমিকে থাকায় উত্তর উল্টে হবে (R)!',
  },
  {
    id: 'lactic-s',
    name: '(S)-Lactic Acid',
    nameBn: '(S)-ল্যাকটিক অ্যাসিড',
    top: { formula: 'COOH', priority: 2, atomZ: 'C (attached to =O, -OH)' },
    bottom: { formula: 'CH3', priority: 3, atomZ: 'C (attached to -H, -H, -H)' },
    left: { formula: 'OH', priority: 1, atomZ: 'O (Z=8, Highest Priority)' },
    right: { formula: 'H', priority: 4, atomZ: 'H (Z=1, Lowest Priority)' },
    chiralCarbonLabel: 'C2*',
    explanationEn: 'Group 4 (H) is on a HORIZONTAL rung. Path 1(OH) -> 2(COOH) -> 3(CH3) is clockwise (apparent R). Because 4 is on horizontal, REVERSE to (S)!',
    explanationBn: 'গ্রুপ ৪ (H) অনুভূমিক বন্ধনে আছে। ১(OH) -> ২(COOH) -> ৩(CH3) ঘূর্ণন ঘড়ির কাঁটার দিকে (আপাত R)। ৪ অনুভূমিকে থাকায় উত্তর উল্টে হবে (S)!',
  },
  {
    id: 'chlorobutane-r',
    name: '(R)-2-Chlorobutane',
    nameBn: '(R)-২-ক্লোরোবিউটেন',
    top: { formula: 'CH2CH3', priority: 2, atomZ: 'C (attached to C, H, H)' },
    bottom: { formula: 'H', priority: 4, atomZ: 'H (Z=1, Lowest Priority)' },
    left: { formula: 'CH3', priority: 3, atomZ: 'C (attached to H, H, H)' },
    right: { formula: 'Cl', priority: 1, atomZ: 'Cl (Z=17, Highest Priority)' },
    chiralCarbonLabel: 'C2*',
    explanationEn: 'Group 4 (H) is on a VERTICAL bottom rung. Path 1(Cl) -> 2(Et) -> 3(Me) is clockwise. Because 4 is on vertical, no reversal needed: Configuration is (R)!',
    explanationBn: 'গ্রুপ ৪ (H) উলম্ব বন্ধনে (নিচে) রয়েছে। ১(Cl) -> ২(Et) -> ৩(Me) ঘূর্ণন ঘড়ির কাঁটার দিকে। ৪ উলম্ব থাকায় উত্তর অপরিবর্তিত থাকবে: (R)!',
  },
  {
    id: 'glyceraldehyde-d',
    name: 'D-(R)-Glyceraldehyde',
    nameBn: 'D-(R)-গ্লিসারালডিহাইড',
    top: { formula: 'CHO', priority: 2, atomZ: 'C (attached to =O, -H)' },
    bottom: { formula: 'CH2OH', priority: 3, atomZ: 'C (attached to -O, -H, -H)' },
    left: { formula: 'H', priority: 4, atomZ: 'H (Z=1, Lowest Priority)' },
    right: { formula: 'OH', priority: 1, atomZ: 'O (Z=8, Highest Priority)' },
    chiralCarbonLabel: 'C2*',
    explanationEn: 'Priority order: -OH (1) > -CHO (2) > -CH2OH (3) > -H (4). Path 1 -> 2 -> 3 is counter-clockwise. Since H is horizontal, reversed to (R)!',
    explanationBn: 'অগ্রাধিকার ক্রম: -OH (১) > -CHO (২) > -CH2OH (৩) > -H (৪)। পথ ১ -> ২ -> ৩ ঘড়ির কাঁটার বিপরীতে। কিন্তু H অনুভূমিক হওয়ায় উল্টে (R)!',
  },
  {
    id: 'alanine-s',
    name: 'L-(S)-Alanine (Natural Amino Acid)',
    nameBn: 'L-(S)-অ্যালানিন (প্রাকৃতিক অ্যামিনো অ্যাসিড)',
    top: { formula: 'COOH', priority: 2, atomZ: 'C (attached to =O, -OH)' },
    bottom: { formula: 'CH3', priority: 3, atomZ: 'C (attached to H, H, H)' },
    left: { formula: 'NH2', priority: 1, atomZ: 'N (Z=7, Highest Priority)' },
    right: { formula: 'H', priority: 4, atomZ: 'H (Z=1, Lowest Priority)' },
    chiralCarbonLabel: 'Cα*',
    explanationEn: 'Path 1(NH2) -> 2(COOH) -> 3(CH3) is clockwise (apparent R). Group 4 (H) is horizontal, so REVERSE to (S). Natural L-amino acids are (S)!',
    explanationBn: '১(NH2) -> ২(COOH) -> ৩(CH3) ঘূর্ণন ঘড়ির কাঁটার দিকে। গ্রুপ ৪ অনুভূমিক হওয়ায় উল্টে (S)। সকল প্রাকৃতিক অ্যামিনো অ্যাসিডই (S)!',
  },
];

interface CIPProjection2DProps {
  initialMoleculeId?: string;
  step?: number;
}

export const CIPProjection2D: React.FC<CIPProjection2DProps> = ({
  initialMoleculeId = 'lactic-r',
  step = 4,
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialMoleculeId);
  const [showAtomNumbers, setShowAtomNumbers] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(step);

  const mol = PRESET_MOLECULES.find((m) => m.id === selectedId) || PRESET_MOLECULES[0];

  // Coordinates on 320x320 SVG canvas
  const cx = 160;
  const cy = 160;
  const topY = 45;
  const bottomY = 275;
  const leftX = 45;
  const rightX = 275;

  // Group coordinates
  const positions: Record<string, { x: number; y: number; group: { formula: string; priority: number; atomZ: string } }> = {
    top: { x: cx, y: topY, group: mol.top },
    bottom: { x: cx, y: bottomY, group: mol.bottom },
    left: { x: leftX, y: cy, group: mol.left },
    right: { x: rightX, y: cy, group: mol.right },
  };

  // Find where priority 1, 2, 3, 4 are
  const p1Pos = Object.entries(positions).find(([, p]) => p.group.priority === 1)![1];
  const p2Pos = Object.entries(positions).find(([, p]) => p.group.priority === 2)![1];
  const p3Pos = Object.entries(positions).find(([, p]) => p.group.priority === 3)![1];
  const p4Entry = Object.entries(positions).find(([, p]) => p.group.priority === 4)!;
  const p4Placement = p4Entry[0] === 'top' || p4Entry[0] === 'bottom' ? 'vertical' : 'horizontal';

  // Calculate apparent 2D angular direction of 1 -> 2 -> 3
  const angle1 = Math.atan2(p1Pos.y - cy, p1Pos.x - cx);
  const angle2 = Math.atan2(p2Pos.y - cy, p2Pos.x - cx);
  const angle3 = Math.atan2(p3Pos.y - cy, p3Pos.x - cx);

  // Normalize angles to 0..2PI
  const norm = (a: number) => (a < 0 ? a + 2 * Math.PI : a);
  const a1 = norm(angle1);
  const a2 = norm(angle2);
  const a3 = norm(angle3);

  // Signed cross product to check if 1 -> 2 -> 3 is clockwise in SVG coords (y down)
  const cross = (p2Pos.x - p1Pos.x) * (p3Pos.y - p2Pos.y) - (p2Pos.y - p1Pos.y) * (p3Pos.x - p2Pos.x);
  const isClockwiseApparent = cross > 0;

  // Golden Rule final configuration
  const finalConfig = p4Placement === 'vertical'
    ? (isClockwiseApparent ? 'R' : 'S')
    : (isClockwiseApparent ? 'S' : 'R');

  // Arc path for the arrow
  const arcRadius = 75;
  const startX = cx + arcRadius * Math.cos(angle1);
  const startY = cy + arcRadius * Math.sin(angle1);
  const midX = cx + arcRadius * Math.cos(angle2);
  const midY = cy + arcRadius * Math.sin(angle2);
  const endX = cx + arcRadius * Math.cos(angle3);
  const endY = cy + arcRadius * Math.sin(angle3);

  // Color helper for priorities
  const getPriorityColor = (p: number) => {
    switch (p) {
      case 1:
        return { badge: 'bg-rose-500 text-white', border: 'border-rose-400', fill: '#f43f5e' };
      case 2:
        return { badge: 'bg-amber-500 text-slate-950 font-black', border: 'border-amber-400', fill: '#f59e0b' };
      case 3:
        return { badge: 'bg-emerald-500 text-slate-950 font-black', border: 'border-emerald-400', fill: '#10b981' };
      case 4:
      default:
        return { badge: 'bg-slate-600 text-slate-100', border: 'border-slate-400', fill: '#94a3b8' };
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 sm:p-5 bg-gradient-to-b from-[#05111e] to-[#08182b] rounded-2xl border border-[rgba(70,227,255,0.18)] shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
              2D Fischer &amp; Hand-Rule
            </span>
            <span className="text-sm font-black text-white">Cahn-Ingold-Prelog (CIP) 2D System</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class 11/12 Exam Formula: Assign priorities 1 &gt; 2 &gt; 3 &gt; 4 by Atomic Number Z, then trace path 1 → 2 → 3.
          </p>
        </div>

        {/* Preset molecule selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="cip-mol-select" className="text-xs font-bold text-slate-400">
            Molecule:
          </label>
          <select
            id="cip-mol-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-bold text-cyan-200 outline-none cursor-pointer"
          >
            {PRESET_MOLECULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class 11/12 Golden Rule Banner */}
      <div className="p-3 rounded-xl border border-cyan-500/30 bg-slate-900/90 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Class 11/12 Golden Shortcut Rule for Fischer Projections:</span>
              <span className={`px-2 py-0.2 rounded font-mono text-[11px] font-bold ${
                p4Placement === 'vertical' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
              }`}>
                Group 4 is {p4Placement.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {p4Placement === 'vertical' ? (
                <>
                  <strong className="text-emerald-300">Vertical Rule:</strong> Group 4 (lowest priority) is on a <strong>vertical</strong> bond. What you see is what you get! Clockwise = <strong className="text-cyan-300">(R)</strong>, Counter-Clockwise = <strong className="text-purple-300">(S)</strong>.
                </>
              ) : (
                <>
                  <strong className="text-rose-300">Horizontal Rule (Reverse!):</strong> Group 4 (lowest priority) is on a <strong>horizontal</strong> bond pointing towards you. <strong>REVERSE</strong> the apparent result! Clockwise → <strong className="text-purple-300">(S)</strong>, Counter-Clockwise → <strong className="text-cyan-300">(R)</strong>!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Big Configuration Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-purple-400/40 shadow-lg">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-300 block uppercase">Final Answer</span>
            <span className="text-xs text-cyan-300 font-medium">
              {finalConfig === 'R' ? 'Rectus' : 'Sinister'}
            </span>
          </div>
          <span className="text-2xl font-black text-white font-mono px-2 py-0.5 rounded bg-black/40 border border-white/20">
            ({finalConfig})
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-center">
        {/* SVG Fischer Projection Stage */}
        <div className="relative flex items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800 min-h-[320px]">
          <svg viewBox="0 0 320 320" className="w-full max-w-[320px] h-auto select-none overflow-visible">
            <defs>
              <marker
                id="cip-arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M 1 1 L 7 4 L 1 7 Z" fill="#38bdf8" />
              </marker>
              <filter id="glow-cip" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* In-plane Fischer Cross Bonds */}
            {/* Vertical Bond (pointing into screen away from viewer) */}
            <line
              x1={cx}
              y1={topY + 20}
              x2={cx}
              y2={bottomY - 20}
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Horizontal Bond (pointing out towards viewer) */}
            <line
              x1={leftX + 24}
              y1={cy}
              x2={rightX - 24}
              y2={cy}
              stroke="#06b6d4"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Central Stereocenter Carbon */}
            <circle cx={cx} cy={cy} r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {mol.chiralCarbonLabel}
            </text>

            {/* 1 -> 2 -> 3 Circular Rotation Arc */}
            <path
              d={`M ${startX} ${startY} Q ${midX * 1.05} ${midY * 1.05} ${endX} ${endY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeDasharray="6 3"
              markerEnd="url(#cip-arrowhead)"
              filter="url(#glow-cip)"
            />

            {/* Central Apparent Rotation Direction Indicator */}
            <g transform={`translate(${cx}, ${cy + 34})`}>
              <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#091b2e" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                {isClockwiseApparent ? '↻ Clockwise' : '↺ Counter-CW'}
              </text>
            </g>

            {/* Top Substituent */}
            <g transform={`translate(${cx}, ${topY})`}>
              <rect x="-38" y="-16" width="76" height="32" rx="12" fill="#091b2e" stroke="#475569" strokeWidth="1.5" />
              <text x="-4" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {mol.top.formula}
              </text>
              {/* Priority badge */}
              <circle cx="26" cy="-10" r="10" fill={getPriorityColor(mol.top.priority).fill} />
              <text x="26" y="-6" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                {mol.top.priority}
              </text>
            </g>

            {/* Bottom Substituent */}
            <g transform={`translate(${cx}, ${bottomY})`}>
              <rect x="-38" y="-16" width="76" height="32" rx="12" fill="#091b2e" stroke="#475569" strokeWidth="1.5" />
              <text x="-4" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {mol.bottom.formula}
              </text>
              <circle cx="26" cy="-10" r="10" fill={getPriorityColor(mol.bottom.priority).fill} />
              <text x="26" y="-6" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                {mol.bottom.priority}
              </text>
            </g>

            {/* Left Substituent */}
            <g transform={`translate(${leftX}, ${cy})`}>
              <rect x="-38" y="-16" width="76" height="32" rx="12" fill="#091b2e" stroke="#0891b2" strokeWidth="1.5" />
              <text x="-4" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {mol.left.formula}
              </text>
              <circle cx="26" cy="-10" r="10" fill={getPriorityColor(mol.left.priority).fill} />
              <text x="26" y="-6" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                {mol.left.priority}
              </text>
            </g>

            {/* Right Substituent */}
            <g transform={`translate(${rightX}, ${cy})`}>
              <rect x="-38" y="-16" width="76" height="32" rx="12" fill="#091b2e" stroke="#0891b2" strokeWidth="1.5" />
              <text x="-4" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {mol.right.formula}
              </text>
              <circle cx="26" cy="-10" r="10" fill={getPriorityColor(mol.right.priority).fill} />
              <text x="26" y="-6" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">
                {mol.right.priority}
              </text>
            </g>
          </svg>

          {/* Wedge-Dash Explanatory Pill */}
          <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
            Horizontal bonds (Cyan) = <span className="text-cyan-300 font-bold">Wedges (Coming Out)</span> | Vertical bonds (Grey) = <span className="text-slate-300 font-bold">Dashes (Going Away)</span>
          </div>
        </div>

        {/* Right Info & Step-by-Step Breakdown */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
              Priority Ranking (Atomic Number Z)
            </span>
            <div className="flex flex-col gap-1.5 text-xs">
              {[mol.top, mol.bottom, mol.left, mol.right]
                .sort((a, b) => a.priority - b.priority)
                .map((item) => (
                  <div
                    key={item.priority}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        getPriorityColor(item.priority).badge
                      }`}>
                        {item.priority}
                      </span>
                      <span className="font-mono font-bold text-white">{item.formula}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{item.atomZ}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Stepper Logic Explanation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Step-by-Step Walkthrough</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {mol.explanationEn}
            </p>
            <p className="text-slate-400 font-bengali text-[10px] leading-snug border-t border-slate-800/80 pt-1.5">
              {mol.explanationBn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
