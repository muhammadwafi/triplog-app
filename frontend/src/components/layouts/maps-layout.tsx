import { Header } from '@/components/layouts/main/header';
import { WithErrorBoundary } from '@/components/layouts/shared/with-error-boundary';
import * as React from 'react';
import { Footer } from './footer';

export default function MapsLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="mx-auto mt-22 flex h-full min-h-svh max-w-6xl flex-col px-4 pb-20">
        <WithErrorBoundary>{children}</WithErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
