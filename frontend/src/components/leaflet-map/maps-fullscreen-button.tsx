import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MaximizeIcon, MinimizeIcon } from 'lucide-react';
import * as React from 'react';
import { useMap } from 'react-leaflet';

export function MapsFullscreenButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = React.useCallback(() => {
    const container = map.getContainer();
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [map]);

  React.useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <div className={className} {...props}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="icon"
            type="button"
            className="bg-background dark:bg-background size-8 shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {isFullscreen ? (
              <MinimizeIcon className="size-4.5" />
            ) : (
              <MaximizeIcon className="size-4.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
