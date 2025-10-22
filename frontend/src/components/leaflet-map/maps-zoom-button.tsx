import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';
import { useMap } from 'react-leaflet';

export function MapsZoomButton({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const map = useMap();

  return (
    <div
      className={cn(
        'ring-ring flex flex-col -space-y-px rounded-md shadow-md',
        className,
      )}
      {...props}
    >
      <Button
        onClick={() => map.zoomIn()}
        variant="outline"
        size="icon"
        type="button"
        className="bg-background dark:bg-background size-8 rounded-none shadow-none first:rounded-t-sm last:rounded-b-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <PlusIcon />
      </Button>
      <div className="1-full bg-smoke-50 dark:bg-smoke-700 h-px" />
      <Button
        onClick={() => map.zoomOut()}
        variant="outline"
        size="icon"
        type="button"
        className="bg-background dark:bg-background size-8 rounded-none shadow-none first:rounded-t-sm last:rounded-b-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <MinusIcon />
      </Button>
    </div>
  );
}
