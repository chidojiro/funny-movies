import { AuthApis } from '@/auth/apis';
import { useAccessTokenCookieState } from '@/auth/useAccessTokenCookieState';
import { Button } from '@/common/components';
import { useHandler } from '@/common/hooks';
import { SignOutIcon } from '@/common/icons';
import { useProfile } from '@/profile/useProfile';

export const ProfileSection = () => {
  const [, setAccessToken] = useAccessTokenCookieState();

  const { profile, mutateProfile } = useProfile();

  const { handle: handleLogout, isLoading } = useHandler(async () => {
    await AuthApis.logout();
    setAccessToken('');
    mutateProfile();
  });

  if (!profile) return null;

  const { email } = profile;

  return (
    <div className='flex items-center gap-6'>
      <p>{email}</p>
      <Button variant='solid'>Share a movie</Button>
      <Button variant='outline' onClick={handleLogout} iconRight={<SignOutIcon />} loading={isLoading}>
        Logout
      </Button>
    </div>
  );
};
