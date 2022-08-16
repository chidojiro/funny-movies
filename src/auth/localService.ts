import { LocalStorageUtils, PromiseUtils } from '@/common/utils';
import { Profile } from '@/profile/types';
import { cloneDeep, isEqual } from 'lodash-es';
import { v4 as UUID } from 'uuid';
import { LoginPayload, User, ApiErrors } from './types';

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

const createUser = async (payload: Omit<User, 'id'>) => {
  await PromiseUtils.sleep(1000);

  const id = UUID();

  const users = getUsers();

  const newUser: User = { id, ...payload };

  LocalStorageUtils.set(USERS_KEY, { ...users, [id]: newUser });

  const newAccessToken = createAccessToken(newUser.id);

  return { accessToken: newAccessToken, profile: extractProfileFromUser(newUser) };
};

const getAccessTokens = () => LocalStorageUtils.get<Record<string, string>>(ACCESS_TOKENS_KEY) ?? {};

const createAccessToken = (userId: string) => {
  const accessTokens = getAccessTokens();

  const newAccessToken = UUID();

  LocalStorageUtils.set(ACCESS_TOKENS_KEY, { ...accessTokens, [newAccessToken]: userId });

  return newAccessToken;
};

const getUserByToken = (token: string) => {
  const userId = getAccessTokens()[token];

  return getUser(userId);
};

const getUserByEmail = (email: string) => {
  const users = getUsers();

  const user = Object.values(users).find(user => user.email === email);

  if (!user) throw new Error(ApiErrors.INVALID);

  return user;
};

const login = async (payload: LoginPayload) => {
  await PromiseUtils.sleep(1000);

  const existingUser = getUserByEmail(payload.email);

  if (!existingUser || !isEqual(payload, { email: existingUser.email, password: existingUser.password }))
    throw new Error(ApiErrors.INVALID);

  return { accessToken: createAccessToken(existingUser.id), profile: extractProfileFromUser(existingUser) };
};

const logout = async (token: string) => {
  await PromiseUtils.sleep(500);

  const accessTokens = getAccessTokens();

  const clonedAccessTokens = cloneDeep(accessTokens);

  delete clonedAccessTokens[token];

  LocalStorageUtils.set(ACCESS_TOKENS_KEY, clonedAccessTokens);
};

export const AuthLocalService = {
  getUsers,
  getUser,
  createUser,
  getUserByToken,
  login,
  logout,
  getUserByEmail,
  extractProfileFromUser,
};
