import AuthLayout from '@/components/layouts/auth/auth-layout';
import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate replace to={`/auth/login`} />,
      },
      {
        path: '/auth/login',
        lazy: async () => {
          let { Login } = await import('@/pages/auth/login');
          return { Component: Login };
        },
      },
      {
        path: '/auth/register',
        lazy: async () => {
          let { Register } = await import('@/pages/auth/register');
          return { Component: Register };
        },
      },
    ],
  },
];
