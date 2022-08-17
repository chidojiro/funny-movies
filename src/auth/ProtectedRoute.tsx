import { DashboardRoutes } from '@/dashboard/routes';
import { MainLayout } from '@/layout/MainLayout';
import { useProfile } from '@/profile/useProfile';
import React from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';

export type ProtectedRouteProps = RouteProps;

export const ProtectedRoute = ({ ...restProps }: ProtectedRouteProps) => {
  const { profile, isInitializingProfile } = useProfile();
  const history = useHistory();

  if (isInitializingProfile) {
    return <MainLayout />;
  }

  if (!profile) {
    history.push(DashboardRoutes.Dashboard.path);
    return null;
  }

  return <Route {...restProps} />;
};
