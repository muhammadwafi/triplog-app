// https://github.com/chris-m92/react-leaflet-custom-control

import { cn } from '@/lib/utils';
import L from 'leaflet';
import React from 'react';
import { useMap } from 'react-leaflet';

interface MapsControlProps {
  position?: keyof typeof POSITION_CLASSES;
  prepend?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Example position class map
const POSITION_CLASSES = {
  top: 'top-1 left-1 right-1',
  bottom: 'bottom-1 left-1 right-1',
  left: 'top-1 bottom-1 left-1',
  right: 'top-1 bottom-1 right-1',
};

export function MapsControl({
  position = 'left',
  prepend = false,
  className,
  children,
  ...props
}: MapsControlProps & React.ComponentProps<'div'>) {
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);
  const controlContainerRef = React.useRef<HTMLDivElement | null>(null);
  const map = useMap();

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.left;

  // Disable event propagation
  React.useEffect(() => {
    const el = controlContainerRef.current;
    if (el) {
      L.DomEvent.disableClickPropagation(el);
      L.DomEvent.disableScrollPropagation(el);
    }
  }, []);

  // Find the map container position div
  React.useEffect(() => {
    const mapContainer = map.getContainer();
    setPortalRoot(mapContainer);
  }, [map]);

  // Append/prepend control container to portal root
  React.useEffect(() => {
    const controlEl = controlContainerRef.current;
    if (portalRoot && controlEl) {
      if (prepend) {
        portalRoot.prepend(controlEl);
      } else {
        portalRoot.append(controlEl);
      }
    }
  }, [portalRoot, prepend]);

  return (
    <div
      {...props}
      ref={controlContainerRef}
      className={cn('absolute z-[1000] h-auto', positionClass, className)}
    >
      {children}
    </div>
  );
}
