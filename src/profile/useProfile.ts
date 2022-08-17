import { useAccessTokenCookieState } from '@/auth/useAccessTokenCookieState';
import { useFetcher } from '@/common/hooks';
import React from 'react';
import { ProfileApis } from './apis';

export const useProfile = (id?: string) => {
  const [accessToken] = useAccessTokenCookieState();

  const fetcher = id ? ProfileApis.getProfile : ProfileApis.getMyProfile;

  const {
    data: profile,
    isInitializing,
    isValidating,
    isLagging,
    mutate,
  } = useFetcher((id ?? accessToken) && ['useProfile', id ?? accessToken], () => fetcher(id ?? accessToken), {
    onError: e => {
      return false;
    },
  });

  return React.useMemo(
    () => ({
      profile,
      isInitializingProfile: isInitializing,
      isValidatingProfile: isValidating,
      isLaggingProfile: isLagging,
      mutateProfile: mutate,
    }),
    [isInitializing, isLagging, isValidating, mutate, profile]
  );
};
