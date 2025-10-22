import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import L from 'leaflet';
import { MapPinnedIcon } from 'lucide-react';
import type * as React from 'react';
import { useMap } from 'react-leaflet';

interface MapCenterButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  geoJson: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString
  >;
}

export function MapsCenterToBoundButton({
  geoJson,
  className,
  ...props
}: MapCenterButtonProps) {
  const map = useMap();

  const handleClick = () => {
    const layer = L.geoJSON(geoJson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
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
            <MapPinnedIcon className="size-4.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Center map</TooltipContent>
      </Tooltip>
    </div>
  );
}
