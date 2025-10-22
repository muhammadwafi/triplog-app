import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { Spinner } from './spinner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-sky-500" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-rose-600" />,
        loading: <Spinner className="size-4" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:!bg-zinc-900 group-[.toaster]:!text-white group-[.toaster]:!border-transparent !py-3 !pl-4 !pr-9 !items-start group-[.toaster]:!w-[356px] group-[.toaster]:!flex group-[.toaster]:!items-center group-[.toaster]:!text-sm group-[.toaster]:!shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08),0px_1px_1px_0px_rgba(255,252,240,0.15)_inset]',
          description: 'group-[.toast]:!text-muted-foreground',
          actionButton:
            'group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground',
          cancelButton:
            'group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground',
          closeButton:
            'group-[.toast]:!bg-transparent group-[.toast]:!size-6 hover:group-[.toast]:!bg-white/10 group-[.toast]:!-right-0.5 group-[.toast]:!border-none group-[.toast]:!top-[19px] group-[.toast]:!left-[unset] [&>svg]:!size-4 [&>svg]:!text-white/70 hover:[&>svg]:!text-white',
          // icon: '!mt-0.5',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
