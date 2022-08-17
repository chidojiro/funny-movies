import { DashboardRoutes } from '@/dashboard/routes';
import { ShareMovieRoutes } from '@/share-movie/routes';
import { Route } from './types';

export const Routes: Route = {
  ...DashboardRoutes,
  ...ShareMovieRoutes,
};
