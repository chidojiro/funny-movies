import { RouteItem } from '@/routing/types';
import React from 'react';

const DashboardPage = React.lazy(() =>
  import('./DashboardPage').then(({ DashboardPage }) => ({
    default: DashboardPage,
  }))
);

export const DashboardRoutes: Record<string, RouteItem> = {
  Dashboard: {
    path: '/',
    component: <DashboardPage />,
  },
};
