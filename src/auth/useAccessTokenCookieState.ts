import { useCookieState } from '@/common/hooks';
import { COOKIE_ACCESS_TOKEN_KEY } from './constants';

export const useAccessTokenCookieState = () => useCookieState(COOKIE_ACCESS_TOKEN_KEY, '');
