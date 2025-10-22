import type { GeoJSON } from 'leaflet';
import type { LucideIcon } from 'lucide-react';
import type * as React from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

export interface PaginatedResponse<TData> {
  size: number;
  count: number;
  total_pages: number;
  current: number;
  next: string | null;
  previous: string | null;
  results: TData[];
}

export interface SingleResponse<TData> {
  status: string;
  data: TData;
}

export interface TripLogs {
  id: string;
  trip: string;
  log_date: string;
  off_duty_hrs: string | null;
  sleeper_berth_hrs: string | null;
  driving_hrs: string | null;
  on_duty_not_driving_hrs: string | null;
  notes: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Trip {
  id: string;
  trip_name: string;
  current_location: string;
  current_coordinates: string;
  pickup_location: string;
  pickup_coordinates: string;
  dropoff_location: string;
  dropoff_coordinates: string;
  current_cycle_used: string;
  total_trip_miles: string;
  total_driving_hrs: string;
  created_at: string;
}

export interface TripRoutes {
  id: string;
  trip: string;
  stop_order: number;
  stop_type: string;
  location_name: string;
  latitude: string;
  longitude: string;
  estimated_arrival: string;
  estimated_departure: string;
  notes: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TripList extends Trip {
  daily_logs: TripLogs[];
  trip_routes: TripRoutes[];
}

export interface TripTimeline {
  time: string;
  duty_hrs?: number;
  status: LogStatus;
  activity: string;
  duration_hrs?: number;
}

export interface TripSummary extends TripList {
  timeline: TripTimeline[];
  geojson: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

export interface LoginResponse {
  user: User;
  access?: string;
  refresh?: string;
}

export interface RegisterResponse {
  user: User;
  access?: string;
  refresh?: string;
}

export interface TokenVerifyResponse {
  detail?: string;
}

export type TileOptions = {
  id: string;
  label: string;
  url: string;
  preview: string;
  attribution?: string;
};

export type LogStatus =
  | 'OFF_DUTY'
  | 'BREAK'
  | 'SLEEPER_BERTH'
  | 'DRIVING'
  | 'ON_DUTY_NON_DRIVING'
  | 'ON_DUTY'
  | 'START';

export interface ChartPoint {
  time: number;
  status: number;
  label: string;
}

export interface TotalHrs {
  offDuty: number;
  sleeperBerth: number;
  driving: number;
  onDuty: number;
  total: number;
}
