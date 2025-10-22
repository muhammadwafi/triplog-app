import '@/assets/leaflet.css';
import { MapsCenterToBoundButton } from '@/components/leaflet-map/maps-center-bound-button';
import { MapsFitPolygonBounds } from '@/components/leaflet-map/maps-fit-polygon-bound';
import { MapsFullscreenButton } from '@/components/leaflet-map/maps-fullscreen-button';
import { MapsTileSwitcher } from '@/components/leaflet-map/maps-tile-switcher';
import { MapsZoomButton } from '@/components/leaflet-map/maps-zoom-button';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MAP_CENTER,
  TILE_CONFIG,
  TILE_OPTIONS,
  defaultPathStyle,
} from '@/config/constants';
import { cn } from '@/lib/utils';
import type { TileOptions } from '@/types';
import type { Feature, FeatureCollection } from 'geojson';
import type { LatLngTuple, Map, PathOptions } from 'leaflet';
import * as L from 'leaflet';
import { EarthIcon } from 'lucide-react';
import * as React from 'react';
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  type MapContainerProps,
} from 'react-leaflet';
import { MapsCenterButton } from './maps-center-button';
import { MapsControl } from './maps-control';

interface SharedMapsProps {
  zoom?: number;
  center?: LatLngTuple;
  scrollWheelZoom?: boolean;
  pathStyle?: PathOptions;
  className?: string;
  withCenterButton?: boolean;
  tileSwitcherSize?: 'sm' | 'default';
  withFullScreenButton?: boolean;
  children?: React.ReactNode;
  onEachFeature?: (feature: Feature, layer: L.Path) => void;
}

type ExclusiveMapData =
  | {
      primaryData: FeatureCollection;
      geoJsonData?: never;
    }
  | {
      geoJsonData?: GeoJSON.LineString | null | undefined;
      primaryData?: never;
    };

type MapsViewProps = SharedMapsProps & ExclusiveMapData & MapContainerProps;

export function MapsView({
  geoJsonData,
  zoom,
  center,
  scrollWheelZoom,
  primaryData,
  pathStyle,
  className,
  withCenterButton = true,
  tileSwitcherSize = 'default',
  withFullScreenButton = true,
  children,
  onEachFeature,
  ...props
}: MapsViewProps) {
  const [tile, setTile] = React.useState<TileOptions>(TILE_OPTIONS[0]);
  const [isSwitcherOpen, setSwitcherOpen] = React.useState<boolean>(false);
  const mapWrapperRef = React.useRef<Map>(null);

  const geoJson = React.useMemo(
    () =>
      ({
        type: 'Feature',
        geometry: geoJsonData || null,
      }) as GeoJSON.Feature<GeoJSON.LineString>,
    [geoJsonData],
  );

  React.useEffect(() => {
    const storedId = localStorage.getItem(TILE_CONFIG);
    const savedTile = TILE_OPTIONS.find((t) => t.id === storedId);
    if (savedTile) {
      setTile(savedTile);
    } else {
      setTile(TILE_OPTIONS[0]);
    }
  }, []);

  return (
    <MapContainer
      center={center || MAP_CENTER}
      zoom={zoom || 12}
      minZoom={5}
      className={cn(
        'border-border relative z-10 h-[350px] w-full rounded-md border',
        className,
      )}
      zoomControl={false}
      ref={mapWrapperRef}
      scrollWheelZoom={scrollWheelZoom}
      zoomAnimation
      preferCanvas
      {...props}
    >
      <MapsControl
        position="right"
        className={cn(
          'top-2 right-2 z-[401] flex flex-col gap-1 transition-transform duration-300 ease-in-out',
          // {
          //   '-translate-y-37 lg:translate-y-0':
          //     isSwitcherOpen && tileSwitcherSize !== 'sm',
          //   '-translate-y-21 min-[480px]:translate-y-0':
          //     isSwitcherOpen && tileSwitcherSize === 'sm',
          // },
        )}
      >
        {withCenterButton &&
          (geoJsonData ? (
            <MapsCenterToBoundButton geoJson={geoJson} />
          ) : (
            <MapsCenterButton position={center || MAP_CENTER} />
          ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setSwitcherOpen(!isSwitcherOpen)}
              variant="outline"
              size="icon"
              type="button"
              className="bg-background dark:bg-background tile-switcher-button size-8 shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <EarthIcon className="size-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Map style</TooltipContent>
        </Tooltip>
        {withFullScreenButton && <MapsFullscreenButton />}
        <MapsZoomButton />
      </MapsControl>

      {/* default tile layer */}
      <TileLayer
        url={tile.url}
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        crossOrigin
      />
      {/* world boundary and places label for esri */}
      {tile.id === 'esri' && (
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png" />
      )}
      {primaryData && (
        <GeoJSON
          data={primaryData}
          onEachFeature={onEachFeature}
          style={pathStyle || defaultPathStyle}
        />
      )}
      {geoJsonData && (
        <>
          <GeoJSON
            data={geoJson as GeoJSON.GeoJsonObject}
            style={pathStyle || defaultPathStyle}
            onEachFeature={onEachFeature}
          />
          <MapsFitPolygonBounds geoJson={geoJson} />
        </>
      )}
      {/* map tilw switcher  */}
      <MapsTileSwitcher
        tileOptions={TILE_OPTIONS}
        activeTileUrl={tile.url}
        open={isSwitcherOpen}
        size={tileSwitcherSize}
        onOpenChange={setSwitcherOpen}
        onTileChange={(t: TileOptions) => setTile(t)}
        mapContainerRef={mapWrapperRef}
      />
      {children}
    </MapContainer>
  );
}
