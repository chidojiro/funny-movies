import { StringUtils } from '@/common/utils/string';
import clsx from 'clsx';
import React from 'react';
import { MainLayoutHeader } from './MainLayoutHeader';

export const MainLayout = () => {
  return (
    <div className={clsx(StringUtils.withProjectClassNamePrefix('main-layout'), 'max-w-[1600px] mx-auto')}>
      <MainLayoutHeader />
    </div>
  );
};
