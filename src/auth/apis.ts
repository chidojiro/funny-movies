import { CookiesUtils } from '@/common/utils';
import { COOKIE_ACCESS_TOKEN_KEY } from './constants';
import { AuthLocalService } from './localService';

const login = AuthLocalService.login;

const register = AuthLocalService.createUser;

const logout = async () => {
  const token = CookiesUtils.get(COOKIE_ACCESS_TOKEN_KEY);

  await AuthLocalService.logout(token);

  CookiesUtils.remove(COOKIE_ACCESS_TOKEN_KEY);
};

export const AuthApis = {
  login,
  register,
  logout,
};
