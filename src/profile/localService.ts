import { AuthLocalService } from '@/auth/localService';

const getProfile = async (id: string) => {
  const user = AuthLocalService.getUser(id);

  return AuthLocalService.extractProfileFromUser(user);
};

const getProfileByToken = async (token: string) => {
  const user = AuthLocalService.getUserByToken(token);

  return AuthLocalService.extractProfileFromUser(user);
};

export const ProfileLocalService = {
  getProfile,
  getProfileByToken,
};
