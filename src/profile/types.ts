import { User } from '@/auth/types';

export type Profile = Omit<User, 'password'>;
