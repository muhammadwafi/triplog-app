import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden',
        'from-muted/50 to-muted/50 bg-linear-to-r via-neutral-900/10 dark:via-white/10',
        'bg-[length:200%_100%]',
        'animate-shimmer rounded-md',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
