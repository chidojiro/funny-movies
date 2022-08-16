import { Button } from '@/common/components';
import { useDisclosure } from '@/common/hooks';
import { HomeIcon, PlusIcon } from '@/common/icons';
import { StringUtils } from '@/common/utils';
import { useProfile } from '@/profile/useProfile';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { CreateAccountModal } from './CreateAccountModal';
import { LoginForm } from './LoginForm';
import { ProfileSection } from './ProfileSection';

export const MainLayoutHeader = () => {
  const { profile } = useProfile();

  const createAccountModalDisclosure = useDisclosure();

  return (
    <div
      className={clsx(
        StringUtils.withProjectClassNamePrefix('main-layout-header'),
        'py-4 px-4 h-20',
        'border-b-2 border-primary text-primary',
        'flex items-center justify-between gap-4'
      )}>
      <Link className='flex items-center gap-4' to='/'>
        <HomeIcon size={50} />
        <p className='font-bold text-h1'>Funny Movies</p>
      </Link>
      {profile ? (
        <ProfileSection />
      ) : (
        <div className='flex items-center gap-2'>
          <CreateAccountModal open={createAccountModalDisclosure.isOpen} onClose={createAccountModalDisclosure.close} />
          <LoginForm />
          <Button iconRight={<PlusIcon />} variant='outline' onClick={createAccountModalDisclosure.open}>
            Register
          </Button>
        </div>
      )}
    </div>
  );
};
