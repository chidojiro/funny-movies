import { ProfileLocalService } from './localService';

const getProfile = ProfileLocalService.getProfile;

const getMyProfile = ProfileLocalService.getProfileByToken;

export const ProfileApis = {
  getProfile,
  getMyProfile,
};
