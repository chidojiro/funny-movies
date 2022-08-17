import React from 'react';

export type RouteItem = {
  path: string;
  component: React.ReactNode;
  isProtected?: boolean;
};

export type Route = Record<string, RouteItem>;
