import { SidebarProvider } from '@/components/ui/sidebar';
import * as React from 'react';

export function MapsLayout({ children, ...props }: React.PropsWithChildren) {
  const [open, setIsOpen] = React.useState<boolean>(true);
  return (
    <SidebarProvider
      open={open}
      onOpenChange={(open) => setIsOpen(!!open)}
      style={
        {
          '--sidebar-width': '16rem',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </SidebarProvider>
  );
}
