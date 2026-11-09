import React from 'react';
import { FlaskConical, Orbit, Layers, Sparkles, Flame, ShieldAlert, Compass } from 'lucide-react';
import { BilingualText } from '../components/BilingualText';
import { PageContainer, PageHeader, SectionHeader } from '../components/ui/LayoutPrimitives';
import { FullscreenInteractiveFrame } from '../components/ui/FullscreenInteractiveFrame';

// 6 Specialized 3D Labs
import { DihedralEnergyLab } from '../components/labs/DihedralEnergyLab';
import { CyclohexaneLab } from '../components/labs/CyclohexaneLab';
import { SymmetryScannerLab } from '../components/labs/SymmetryScannerLab';
import { EnantiomerCompareLab } from '../components/labs/EnantiomerCompareLab';
import { CIPPriorityLab } from '../components/labs/CIPPriorityLab';
import { PolarimeterLab } from '../components/labs/PolarimeterLab';

const labSections = [
  {
    id: 'dihedral-energy',
    title: <BilingualText en="Dihedral Angle & Potential Energy Curve Simulator" bn="ডাইহেড্রাল কোণ ও বিভব শক্তি লেখচিত্র সিমুলেটর" />,
    subtitle: <BilingualText en="Scrub the 0°-360° dihedral angle in real-time for Ethane, Propane, Butane, and Ethylene Glycol with synchronized Newman projection." bn="০°-৩৬০° ডাইহেড্রাল কোণ ঘুরিয়ে ইথেন, প্রোপেন, বিউটেন ও ইথিলিন গ্লাইকলের নিউম্যান প্রজেকশন ও শক্তি পরিবর্তন সরাসরি পর্যবেক্ষণ করুন।" />,
    icon: Compass,
    content: <DihedralEnergyLab />,
  },
  {
    id: 'cyclohexane-flip',
    title: <BilingualText en="Cyclohexane Chair-Flip & Conformation Simulator" bn="সাইক্লোহেক্সেন চেয়ার-ফ্লিপ ও কনফর্মেশন সিমুলেটর" />,
    subtitle: <BilingualText en="Animate the ring flip trajectory (Chair -> Half-Chair -> Twist-Boat -> Boat -> Chair) and test axial vs equatorial A-values." bn="রিং ফ্লিপের প্রতিটি ধাপ (চেয়ার -> হাফ-চেয়ার -> টুইস্ট-বোট -> বোট -> চেয়ার) অ্যানিমেট করুন এবং অক্ষীয় বনাম নিরক্ষীয় A-মান যাচাই করুন।" />,
    icon: Orbit,
    content: <CyclohexaneLab />,
  },
  {
    id: 'symmetry-scanner',
    title: <BilingualText en="3D Symmetry Element Scanner (POS & COS)" bn="৩ডি প্রতিসাম্য উপাদান স্ক্যানার (প্রতিসাম্য তল ও কেন্দ্র)" />,
    subtitle: <BilingualText en="Slice molecules with an interactive Plane of Symmetry (σ) or cast inversion rays through the Center of Inversion (i)." bn="ইন্টারেক্টিভ প্রতিসাম্য তল (σ) দিয়ে অণু দ্বিখণ্ডিত করুন অথবা কেন্দ্র (i) দিয়ে ইনভার্সন রশ্মি ফেলে কাইরালিটি পরীক্ষা করুন।" />,
    icon: Layers,
    content: <SymmetryScannerLab />,
  },
  {
    id: 'enantiomer-superimposition',
    title: <BilingualText en="Enantiomer & Diastereomer 3D Superimposition Chamber" bn="এন্যানশিওমার ও ডায়াস্টেরিওমার ৩ডি উপরিপাতন পরীক্ষাগার" />,
    subtitle: <BilingualText en="Reflect chiral molecules in 3D and test whether their mirror images can be superimposed in physical space." bn="কাইরাল অণুকে ৩ডিতে প্রতিফলিত করে পরীক্ষা করুন তার দর্পণ প্রতিবিম্বটি উপরিপাতযোগ্য নাকি অপটিক্যাল সক্রিয়।" />,
    icon: ShieldAlert,
    content: <EnantiomerCompareLab />,
  },
  {
    id: 'cip-solver',
    title: <BilingualText en="Step-by-Step CIP Priority Solver & (R)/(S) Navigator" bn="সিআইপি অগ্রাধিকার সমাধানকারী ও (R)/(S) নেভিগেটর" />,
    subtitle: <BilingualText en="Master the 4 Cahn-Ingold-Prelog priority rules and observe clockwise vs counter-clockwise stereocenters." bn="কান-ইনগোল্ড-প্রীলগের ৪টি অগ্রাধিকার নিয়ম আয়ত্ত করুন এবং ঘড়ির কাঁটার দিকে (R) ও বিপরীতে (S) ঘূর্ণন লক্ষ্য করুন।" />,
    icon: Sparkles,
    content: <CIPPriorityLab />,
  },
  {
    id: 'polarimeter-bench',
    title: <BilingualText en="Virtual Polarimeter & Optical Activity Bench" bn="ভার্চুয়াল পোলারিমিটার ও আলোক সক্রিয়তা বেঞ্চ" />,
    subtitle: <BilingualText en="Rotate the analyzer prism to measure observed rotation, specific rotation [α], and enantiomeric excess (ee)." bn="অ্যানালাইজার প্রিজম ঘুরিয়ে পরীক্ষিত ঘূর্ণন, আপেক্ষিক ঘূর্ণন [α] এবং এন্যানশিওমারিক এক্সেস (ee) পরিমাপ করুন।" />,
    icon: FlaskConical,
    content: <PolarimeterLab />,
  },
];

export const Lab: React.FC = () => {
  return (
    <div className="w-full">
      <PageContainer>
        <PageHeader
          eyebrow={<BilingualText en="Scientific 3D Workspace" bn="বৈজ্ঞানিক ৩ডি পরীক্ষাগার" />}
          icon={FlaskConical}
          title={<BilingualText en="PIECHEM Stereochemistry Laboratory" bn="PIECHEM স্টেরিওরসায়ন ল্যাবরেটরি" />}
          description={<BilingualText en="Experiment hands-on with dihedral rotation curves, chair-chair ring flips, symmetry slicing planes, 3D enantiomer superimposition, and virtual polarimetry." bn="ঘূর্ণন শক্তি লেখচিত্র, চেয়ার-চেয়ার রিং ফ্লিপ, প্রতিসাম্য তল, ৩ডি এন্যানশিওমার উপরিপাত এবং পোলারিমিটার সরাসরি পরীক্ষা করুন।" />}
        />

        <div className="mt-10 space-y-16 sm:mt-12 sm:space-y-20">
          {labSections.map((lab, index) => (
            <section key={lab.id} id={lab.id} className="scroll-mt-32">
              <SectionHeader
                title={
                  <span>
                    <span className="mr-2 text-slate-500 font-mono">{String(index + 1).padStart(2, '0')}</span>
                    {lab.title}
                  </span>
                }
                subtitle={lab.subtitle}
                icon={lab.icon}
                accent={index === 1 ? 'violet' : index === 2 ? 'teal' : index === 5 ? 'amber' : 'blue'}
                className="mb-6"
              />
              <FullscreenInteractiveFrame title={lab.title}>
                {lab.content}
              </FullscreenInteractiveFrame>
            </section>
          ))}
        </div>
      </PageContainer>
    </div>
  );
};

