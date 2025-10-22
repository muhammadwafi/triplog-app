import { Footer } from '@/components/layouts/footer';
import { WithErrorBoundary } from '@/components/layouts/shared/with-error-boundary';
import { Outlet } from 'react-router';
import { Header } from './header';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto my-20 w-full">
        <WithErrorBoundary>
          <Outlet />
        </WithErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
