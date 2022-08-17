import { RouteItem } from '@/routing/types';
import React from 'react';

const ShareMoviePage = React.lazy(() =>
  import('./ShareMoviePage').then(({ ShareMoviePage }) => ({
    default: ShareMoviePage,
  }))
);

export const ShareMovieRoutes: Record<string, RouteItem> = {
  ShareMovie: {
    path: '/movies/share',
    component: <ShareMoviePage />,
    isProtected: true,
  },
};
