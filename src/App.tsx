import React from 'react';
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { ConditionalWrapper } from './common/components';
import './global.css';
import { MainLayout } from './layout/MainLayout';
import { Routes } from './routing/routes';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-center' hideProgressBar autoClose={3000} />
      <React.Suspense fallback={<MainLayout />}>
        <MainLayout>
          <Switch>
            {Object.values(Routes).map(({ path, component, isProtected }) => (
              <ConditionalWrapper
                conditions={[
                  { condition: !!isProtected, component: (props: RouteProps) => <ProtectedRoute {...props} /> },
                  { component: (props: RouteProps) => <Route {...props} /> },
                ]}
                key={path}
                exact
                path={path}>
                {component}
              </ConditionalWrapper>
            ))}
          </Switch>
        </MainLayout>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
