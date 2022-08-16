import { AuthLocalService } from '@/auth/localService';

const getProfile = async (token: string) => {
  const user = AuthLocalService.getUserByToken(token);

  return AuthLocalService.extractProfileFromUser(user);
};

export const ProfileLocalService = {
  getProfile,
};
