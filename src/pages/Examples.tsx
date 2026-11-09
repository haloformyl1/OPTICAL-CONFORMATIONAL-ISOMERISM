import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/LayoutPrimitives';
import { BilingualText } from '../components/BilingualText';
import { ExamplesCatalogLab } from '../components/labs/ExamplesCatalogLab';
import { Layers } from 'lucide-react';

export const Examples: React.FC = () => {
  return (
    <div className="w-full">
      <PageContainer>
        <PageHeader
          eyebrow={<BilingualText en="Curated Chemical Database" bn="নির্বাচিত রাসায়নিক ডাটাবেস" />}
          icon={Layers}
          title={<BilingualText en="100+ Curated Molecular Examples" bn="১০০টিরও বেশি নির্বাচিত আণবিক উদাহরণ" />}
          description={
            <BilingualText
              en="Explore 52 Optical (Chiral centers, Meso, Enantiomers, Diastereomers) and 52 Conformational (Ethane, Butane, Cyclohexane chair/boat, Substituted rings) 3D molecular structures with full coordinates, stereodescriptors, and thermodynamic data."
              bn="পূর্ণ ত্রিমাত্রিক স্থানাঙ্ক, স্টেরিওডেস্ক্রিপ্টর এবং তাপগতিবিদ্যা উপাত্ত সহ ৫২টি আলোকীয় (কাইরাল কেন্দ্র, মেসো, এন্যানশিওমার, ডায়াস্টেরিওমার) এবং ৫২টি কনফর্মেশনাল (ইথেন, বিউটেন, সাইক্লোহেক্সেন চেয়ার/বোট, প্রতিস্থাপিত বলয়) ৩ডি আণবিক গঠন অন্বেষণ করুন।"
            />
          }
        />

        <div className="mt-8">
          <ExamplesCatalogLab />
        </div>
      </PageContainer>
    </div>
  );
};
