import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { LatLngTuple } from 'leaflet';
import { LocateFixedIcon } from 'lucide-react';
import type * as React from 'react';
import { useMap } from 'react-leaflet';

interface MapCenterButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  position: LatLngTuple;
}

export function MapsCenterButton({
  position,
  className,
  ...props
}: MapCenterButtonProps) {
  const map = useMap();

  const handleClick = () => {
    map.flyTo(position, 12, { animate: true });
  };

  return (
    <div className={className} {...props}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="outline"
            size="icon"
            type="button"
            className="bg-background dark:bg-background size-8 shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <LocateFixedIcon className="size-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Center map</TooltipContent>
      </Tooltip>
    </div>
  );
}
