import { LayoutError } from '@/components/layouts/layout-error';
import { Spinner } from '@/components/ui/spinner';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ScrollRestoration } from 'react-router';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

export function WithErrorBoundary({ children }: React.PropsWithChildren) {
  return (
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
            <AnimatePresence mode="wait" initial={true}>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                {children}
              </motion.div>
            </AnimatePresence>
            <ScrollRestoration />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
