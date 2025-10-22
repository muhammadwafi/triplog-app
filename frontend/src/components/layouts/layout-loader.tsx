import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import * as React from 'react';

export function LayoutLoader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto flex size-full min-h-svh flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      <Spinner className="size-8" />
    </div>
  );
}
