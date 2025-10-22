import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';

const alertDisimissableVariants = cva(
  'relative mb-4 flex items-center rounded-md border p-2 pr-9 text-sm',
  {
    variants: {
      variant: {
        default: 'border-input text-muted-foreground dark:text-white',
        error:
          'border-red-500 text-red-500 bg-red-500/5 dark:bg-red-500/20 dark:text-red-200',
        success:
          'border-green-600 text-green-600 bg-green-500/5 dark:bg-green-500/20 dark:text-green-200',
        warning:
          'border-amber-600 text-amber-600 bg-amber-500/5 dark:bg-amber-500/20 dark:text-amber-200',
        info: 'border-blue-600 text-blue-500 bg-blue-500/5 dark:bg-blue-500/20 dark:text-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface AlertDismissableProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function AlertDismissable({
  className,
  variant,
  open,
  onOpenChange,
  children,
  ...props
}: AlertDismissableProps &
  React.ComponentProps<'div'> &
  VariantProps<typeof alertDisimissableVariants>) {
  const toggleAlert = () => {
    onOpenChange((prevOpen: boolean) => !prevOpen);
  };

  return (
    open && (
      <div
        className={cn(alertDisimissableVariants({ variant }), className)}
        {...props}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/20 absolute right-1 h-6 w-6"
          onClick={toggleAlert}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  );
}

export { alertDisimissableVariants, AlertDismissable };
