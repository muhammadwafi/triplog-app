import { LayoutLoader } from '@/components/layouts/layout-loader';
import MainLayout from '@/components/layouts/main/main-layout';
import { ErrorPage } from '@/components/layouts/shared/error-page';
import { NotFound } from '@/pages/not-found';
import { type RouteObject } from 'react-router';

export const webRoutes: RouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          let { Home } = await import('@/pages/home');
          return { Component: Home };
        },
        HydrateFallback: LayoutLoader,
      },
      {
        path: 'about',
        lazy: async () => {
          let { About } = await import('@/pages/about');
          return { Component: About };
        },
        HydrateFallback: LayoutLoader,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
  {
    path: '/trip',
    errorElement: <ErrorPage />,
    lazy: async () => {
      let { Trip } = await import('@/pages/trip');
      return { Component: Trip };
    },
    HydrateFallback: LayoutLoader,
  },
];
