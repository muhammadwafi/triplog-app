import { authRoutes } from '@/routes/auth-routes';
import { webRoutes } from '@/routes/web-routes';
import { createBrowserRouter, RouterProvider } from 'react-router';

export default function Routes() {
  const router = createBrowserRouter([...authRoutes, ...webRoutes]);
  return <RouterProvider router={router} />;
}
