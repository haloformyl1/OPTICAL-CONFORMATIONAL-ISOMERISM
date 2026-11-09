import React from 'react';
import { PracticeCenter } from '../components/practice/PracticeCenter';
import { PageContainer } from '../components/ui/LayoutPrimitives';

export const Practice: React.FC = () => {
  return (
    <div className="w-full">
      <PageContainer>
        <PracticeCenter />
      </PageContainer>
    </div>
  );
};

