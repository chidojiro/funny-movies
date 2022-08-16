import { useCookieState } from '@/common/hooks';

export const useAccessTokenCookieState = () => useCookieState('useAccessTokenCookieState', '123123123');
