import { Profile } from '@/profile/types';

export type Movie = {
  id: string;
  originalId: string;
  sharedBy: Profile;
  url: string;
  likedBy: string[];
  dislikedBy: string[];
  title: string;
  description: string;
  embedHtml: string;
};
