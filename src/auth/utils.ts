import { LocalStorageUtils } from '@/common/utils';
import { Profile } from '@/profile/types';
import { v4 as UUID } from 'uuid';
import { User } from './types';

const USERS_KEY = 'users';
const ACCESS_TOKENS_KEY = 'accessTokens';

const extractProfileFromUser = (user: User) => {
  const { password: _, ...profile } = user;

  return profile as Profile;
};

const getUsers = () => {
  return LocalStorageUtils.get<Record<string, User>>(USERS_KEY) || {};
};

const getUser = (id: string) => {
  const user = getUsers()[id];

  if (!user) {
    throw new Error();
  }

  return user;
};

const createUser = (payload: Omit<User, 'id' | 'accessTokens'>) => {
  const id = UUID();

  const users = getUsers();

  const newUser: User = { id, ...payload };

  LocalStorageUtils.set(USERS_KEY, { ...users, [id]: newUser });

  const { password: _, ...profile } = newUser;

  return profile as Profile;
};

const getAccessTokens = () => LocalStorageUtils.get<Record<string, string>>(ACCESS_TOKENS_KEY) ?? {};

const createAccessToken = (userId: string) => {
  const accessTokens = getAccessTokens();

  const newAccessToken = UUID();

  LocalStorageUtils.set(ACCESS_TOKENS_KEY, { ...accessTokens, newAccessToken: userId });

  return newAccessToken;
};

const getUserIdByToken = (token: string) => getAccessTokens()[token];
