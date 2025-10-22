import type { TileOptions } from '@/types';
import type { LatLngTuple, PathOptions } from 'leaflet';

export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
  DEMO_ACCOUNT_USERNAME: import.meta.env.VITE_DEMO_ACCOUNT_USERNAME || 'demo',
  DEMO_ACCOUNT_PASSWORD: import.meta.env.VITE_DEMO_ACCOUNT_PASSWORD || 'demo',
};

export const TILE_CONFIG = 'tile';
export const MAP_CENTER: LatLngTuple = [-7.9786453, 112.631783];

export const defaultPathStyle: PathOptions = {
  color: '#ff4801',
  fillColor: '#ff4801',
  fillOpacity: 0.3,
  weight: 2,
};

export const TILE_OPTIONS: TileOptions[] = [
  {
    id: 'osm',
    label: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    preview: '/images/osm-tile.jpg',
    attribution:
      '&copy; <a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: 'google',
    label: 'Google',
    url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    preview: '/images/google-tile.jpg',
    attribution: 'Tiles &copy; Google',
  },
  {
    id: 'esri',
    label: 'Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    preview: '/images/esri-tile.jpg',
    attribution: 'Tiles &copy; Esri',
  },
  {
    id: 'cartoLight',
    label: 'CartoDB Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    preview: '/images/stadia-light-tile.jpg',
    attribution:
      'Tiles &copy; <a target="_blank" rel="noopener noreferrer" href="https://carto.com/attributions">Carto</a>',
  },
  {
    id: 'cartoDark',
    label: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    preview: '/images/carto-dark-tile.jpg',
    attribution:
      'Tiles &copy; <a target="_blank" rel="noopener noreferrer" href="https://carto.com/attributions">Carto</a>',
  },
];
