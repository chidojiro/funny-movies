import { DashboardRoutes } from '@/dashboard/routes';
import { MainLayout } from '@/layout/MainLayout';
import { useProfile } from '@/profile/useProfile';
import React from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

export type ProtectedRouteProps = RouteProps;

export const ProtectedRoute = ({ path, component }: ProtectedRouteProps) => {
  const { profile, isInitializingProfile } = useProfile();
  const history = useHistory();

  if (isInitializingProfile) {
    return <MainLayout />;
  }

  if (!profile) {
    history.push(DashboardRoutes.Dashboard.path);
    return null;
  }

  return (
    <React.Suspense fallback={<MainLayout />}>
      <Route path={path} component={component} exact />
    </React.Suspense>
  );
};
