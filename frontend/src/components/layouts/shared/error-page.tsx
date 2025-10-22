import { ErrorIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="mx-auto flex size-full h-svh flex-1 flex-col items-center justify-center">
      <div className="mx-4 flex flex-col justify-items-center gap-6">
        <div className="flex flex-col gap-2">
          <ErrorIcon className="size-12" />
          <h3 className="text-2xl font-bold">
            Oops! an unexpected error occurred
          </h3>
        </div>
        <div className="text-muted-foreground max-w-lg text-sm">
          <span className="text-dark mb-1">Reason:</span>{' '}
          <pre className="font-mono break-words">
            {isRouteErrorResponse(error)
              ? `${error.status} - ${error.statusText}`
              : 'Something just happen, contact administrator for more information.'}
          </pre>
        </div>
        <div className="block">
          <Button variant="outline" className="mt-8" asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
