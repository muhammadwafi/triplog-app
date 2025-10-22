import { TILE_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { TileOptions } from '@/types';
import L, { type Map } from 'leaflet';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';
import { MapsControl } from './maps-control';

type MapsTileSwitcherProps = {
  tileOptions: TileOptions[];
  activeTileUrl: string;
  size?: 'default' | 'sm';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTileChange: (tile: TileOptions) => void;
  mapContainerRef: React.RefObject<HTMLDivElement | Map | null>;
};

export function MapsTileSwitcher({
  tileOptions,
  activeTileUrl,
  onTileChange,
  size = 'default',
  open,
  onOpenChange,
  mapContainerRef,
}: MapsTileSwitcherProps) {
  const [selectedType, setSelectedType] = React.useState(activeTileUrl);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleChange = (typeId: string) => {
    const tile = tileOptions.find((opt) => opt.id === typeId);
    if (tile) {
      setSelectedType(tile.id);
      localStorage.setItem(TILE_CONFIG, tile.id);
      onTileChange(tile);
    }
  };

  React.useEffect(() => {
    const savedId = localStorage.getItem(TILE_CONFIG);
    const found = tileOptions.find((opt) => opt.id === savedId);
    if (found) {
      setSelectedType(found.id);
      onTileChange(found);
    } else {
      // fallback to default (first tile)
      setSelectedType(tileOptions[0].id);
      onTileChange(tileOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (el) {
      L.DomEvent.disableClickPropagation(el);
      L.DomEvent.disableScrollPropagation(el);
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        mapContainerRef.current &&
        !event.composedPath().some((el) => {
          const element = el as HTMLElement;
          return (
            element.classList?.contains('tile-switcher') ||
            element.classList?.contains('tile-switcher-button')
          );
        })
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <MapsControl
      position="bottom"
      className={cn(
        'tile-switcher bg-background z-[1000] mx-auto max-w-2xl transform cursor-auto rounded-lg border border-white/20 shadow-[0_0_8px_0_hsla(0deg,_0%,_0%,_0.25)] transition-transform duration-300 ease-in-out',
        'translate-y-[calc(100%+4px+24px)]',
        {
          'max-w-sm': size === 'sm',
          'translate-y-0': open,
        },
      )}
      ref={containerRef}
    >
      <div
        className={cn(
          'relative flex h-36 w-full flex-col overflow-x-auto overflow-y-hidden',
          {
            'h-20 sm:max-w-sm': size === 'sm',
          },
        )}
      >
        <div
          className={cn(
            'relative mx-auto flex w-full max-w-2xl items-center justify-between p-2',
            {
              'sm:max-w-sm': size === 'sm',
            },
          )}
        >
          <div
            className={cn(
              'grid w-full auto-cols-[124px] grid-flow-col grid-rows-1 items-center gap-2',
              {
                'auto-cols-[70px] gap-1': size === 'sm',
              },
            )}
          >
            {tileOptions.map((tile) => (
              <button
                key={tile.id}
                className={cn(
                  'group flex cursor-pointer flex-col items-center rounded-md px-2 pt-4 pb-3 transition-colors hover:bg-zinc-950/20 dark:hover:bg-white/20',
                  {
                    'bg-primary/10': selectedType === tile.id,
                    'pt-2 pb-2': size === 'sm',
                  },
                )}
                type="button"
                onClick={() => handleChange(tile.id)}
              >
                <div
                  className={cn(
                    'border-ring relative mb-2 size-18 overflow-hidden rounded-md border',
                    'group-hover:border-primary group-hover:ring-primary group-hover:ring-1',
                    {
                      'border-primary ring-primary ring-1':
                        selectedType === tile.id,
                      'mb-0.5 size-12': size === 'sm',
                    },
                  )}
                >
                  <img
                    src={tile.preview || '/placeholder.svg'}
                    alt={`${tile.label} map preview`}
                    className="h-full w-full object-cover"
                  />
                  {selectedType === tile.id && (
                    <div className="bg-primary absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full text-white">
                      <CheckIcon className="size-3" />
                    </div>
                  )}
                </div>
                <span
                  className={cn('text-xs font-medium', {
                    hidden: size === 'sm',
                  })}
                >
                  {tile.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MapsControl>
  );
}
