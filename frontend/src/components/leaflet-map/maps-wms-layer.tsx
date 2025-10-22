import { Spinner } from '@/components/ui/spinner';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import { toast } from 'sonner';
import { MapsPopupContent } from './maps-popup-content';

interface MapsWMSLayerProps {
  url: string;
  layers: string[];
  options?: L.WMSOptions;
}

export function MapsWMSLayer({ url, layers, options }: MapsWMSLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const layersParam = layers.join(',');
    const wmsLayer = L.tileLayer.wms(url, {
      layers: layersParam,
      format: 'image/png',
      transparent: true,
      ...options,
    });

    wmsLayer.addTo(map);

    const popup = L.popup({ closeOnClick: true });

    // store current highlight layer
    let highlightLayer: L.GeoJSON | null = null;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      if (!layers.length) return;

      try {
        // Remove previous highlight
        if (highlightLayer) {
          map.removeLayer(highlightLayer);
          highlightLayer = null;
        }

        // Show loading spinner popup immediately
        popup
          .setLatLng(e.latlng)
          .setContent(
            ReactDOMServer.renderToString(
              <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 text-sm text-zinc-400">
                <Spinner className="size-4 text-zinc-950" />
                <span>Loading...</span>
              </div>,
            ),
          )
          .openOn(map);

        const popupEl = document.querySelector(
          '.leaflet-popup',
        ) as HTMLElement | null;
        const closeBtn = popupEl?.querySelector(
          '.leaflet-popup-close-button',
        ) as HTMLElement | null;
        if (closeBtn) Object.assign(closeBtn.style, { visibility: 'hidden' });

        // Build GetFeatureInfo URL
        const bbox = map.getBounds().toBBoxString();
        const size = map.getSize();
        const params = new URLSearchParams({
          service: 'WMS',
          request: 'GetFeatureInfo',
          srs: 'EPSG:3857',
          styles: '',
          transparent: 'true',
          version: '1.1.1',
          format: 'image/png',
          tiled: 'true',
          bbox,
          height: size.y.toString(),
          width: size.x.toString(),
          layers: layersParam,
          query_layers: layersParam,
          info_format: 'application/json',
          crs: 'EPSG:4326',
          x: Math.round(e.containerPoint.x).toString(),
          y: Math.round(e.containerPoint.y).toString(),
        });

        const featureInfoUrl = `${url}?${params.toString()}`;
        const res = await fetch(featureInfoUrl);
        if (!res.ok) {
          toast.error('Oops, something happened :(');
          throw new Error(`WMS error: ${res.statusText}`);
        }

        const data = await res.json();

        if (
          !data ||
          typeof data !== 'object' ||
          data.type !== 'FeatureCollection' ||
          !Array.isArray(data.features) ||
          data.features.length === 0
        ) {
          popup
            .setContent(
              ReactDOMServer.renderToString(
                <MapsPopupContent properties={null} />,
              ),
            )
            .openOn(map);
          if (closeBtn) closeBtn.style.cssText = '';
          return;
        }

        // ✅ Get first feature
        const feature = (data as FeatureCollection).features[0];
        const props = feature?.properties ?? null;

        // ✅ Draw geometry highlight
        if (feature.geometry) {
          highlightLayer = L.geoJSON(feature, {
            style: {
              color: '#fe5a1d',
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.3,
            },
          }).addTo(map);

          // // zoom
          // try {
          //   const bounds = highlightLayer.getBounds();
          //   if (bounds.isValid()) map.fitBounds(bounds, { maxZoom: 16 });
          // } catch {
          //   // ignore invalid bounds
          // }
        }

        // Show popup content
        const popupContent = ReactDOMServer.renderToString(
          <MapsPopupContent properties={props} />,
        );
        popup.setContent(popupContent).openOn(map);

        if (closeBtn) closeBtn.style.cssText = '';
      } catch (err) {
        // On error, close popup & clear highlight
        map.closePopup();
        if (highlightLayer) {
          map.removeLayer(highlightLayer);
          highlightLayer = null;
        }
        console.error(err);
        toast.error(
          'Unable to get the data. Please try again or check your internet connection.',
        );
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.removeLayer(wmsLayer);
      if (highlightLayer) map.removeLayer(highlightLayer);
    };
  }, [layers, map, options, url]);

  return null;
}
