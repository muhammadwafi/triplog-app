import { ErrorIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { FallbackProps } from 'react-error-boundary';
import { Link } from 'react-router';

export function LayoutError({
  error,
  resetErrorBoundary,
  ...props
}: FallbackProps & React.ComponentProps<'div'>) {
  return (
    <div className="mx-4 mt-30" {...props}>
      <div className="mx-auto flex max-w-lg flex-col justify-center gap-6">
        <div className="flex flex-col gap-2">
          <ErrorIcon className="size-12" />
          <h3 className="text-2xl font-bold">Something went wrong</h3>
        </div>
        <div className="text-muted-foreground max-w-lg text-sm">
          <span className="text-dark mb-1">Reason:</span>{' '}
          <pre className="font-mono break-words">
            {error?.response?.status === 404
              ? 'The content you are looking for is not available.'
              : error?.message ||
                'There was an error for this page, please try again'}
          </pre>
        </div>
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => resetErrorBoundary()}>
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
