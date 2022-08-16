import { HomeIcon } from '@/common/icons';
import { StringUtils } from '@/common/utils';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const MainLayoutHeader = () => {
  return (
    <div
      className={clsx(
        StringUtils.withProjectClassNamePrefix('main-layout-header'),
        'py-4 h-20',
        'border-b-2 border-primary text-primary',
        'flex items-center justify-between gap-4'
      )}>
      <Link className='flex items-center gap-4' to='/'>
        <HomeIcon size={50} />
        <p className='font-bold text-h1'>Funny Movies</p>
      </Link>
    </div>
  );
};
