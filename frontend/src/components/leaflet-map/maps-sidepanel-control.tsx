import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import * as React from 'react';
import { MapsControl } from './maps-control';

export function MapsSidepanelControl() {
  const panelWidth: string = '256px';
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <>
      <MapsControl
        position="left"
        className={cn(
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%_+_4px)]',
        )}
        style={
          {
            '--panel-width': panelWidth,
          } as React.CSSProperties
        }
      >
        <div className="absolute top-0 -right-9">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            size="icon"
            type="button"
            className="bg-background dark:bg-background relative size-8 shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {isOpen ? (
              <PanelLeftCloseIcon className="size-4.5" />
            ) : (
              <PanelLeftOpenIcon className="size-4.5" />
            )}
          </Button>
        </div>
        <div className="bg-background h-full w-(--panel-width) cursor-auto overflow-y-auto rounded-md p-4">
          <div className="text-sm">Map control</div>
        </div>
      </MapsControl>
    </>
  );
}
