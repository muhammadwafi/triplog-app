import { LayoutError } from '@/components/layouts/layout-error';
import Routes from '@/routes/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { Suspense } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider } from '@/lib/auth-provider';
import { ThemeProvider } from '@/lib/theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

const LayoutQuery = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <LayoutQuery>
          <TooltipProvider>
            <ErrorBoundary FallbackComponent={LayoutError}>
              <Suspense
                fallback={
                  <div className="flex min-h-[300px] w-full items-center">
                    <Spinner className="mx-auto" />
                  </div>
                }
              >
                <Routes />
              </Suspense>
            </ErrorBoundary>
            <Toaster closeButton position="bottom-center" />
          </TooltipProvider>
        </LayoutQuery>
      </AuthProvider>
    </ThemeProvider>
  );
}
