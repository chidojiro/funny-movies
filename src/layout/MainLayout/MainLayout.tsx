import { Children } from '@/common/types';
import { StringUtils } from '@/common/utils/string';
import clsx from 'clsx';
import React from 'react';
import { MainLayoutHeader } from './MainLayoutHeader';

type MainLayoutProps = Children;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={clsx(StringUtils.withProjectClassNamePrefix('main-layout'), 'max-w-[1600px] mx-auto')}>
      <MainLayoutHeader />
      <div className='max-w-[1280px] py-10 mx-auto px-4'>{children}</div>
    </div>
  );
};
