import { AppLogo } from '@/components/app-logo';
import { Footer } from '@/components/layouts/footer';
import { LayoutError } from '@/components/layouts/layout-error';
import { Spinner } from '@/components/ui/spinner';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <section className="flex items-center justify-center">
      <div className="mt-12 flex w-full flex-col items-center gap-2">
        <header className="mb-4 text-center text-lg font-bold">
          <Link to="/" className="flex items-center gap-1">
            <AppLogo className="text-primary size-5" />
            TripLog
          </Link>
        </header>
        <main className="mx-auto w-full max-w-md">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <LayoutError
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                  />
                )}
              >
                <Suspense
                  fallback={
                    <div className="flex min-h-[300px] w-full items-center">
                      <Spinner className="mx-auto" />
                    </div>
                  }
                >
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </main>
        <Footer />
      </div>
    </section>
  );
}
