import L, { type LatLngBounds } from 'leaflet';
import * as React from 'react';
import { useMap } from 'react-leaflet';

interface MapsFitPolygonBoundsProps {
  geoJson: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString
  >;
}

export function MapsFitPolygonBounds({ geoJson }: MapsFitPolygonBoundsProps) {
  const map = useMap();

  React.useEffect(() => {
    if (!geoJson) return;

    const layer = L.geoJSON(geoJson);
    const bounds: LatLngBounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJson, map]);

  return null;
}
