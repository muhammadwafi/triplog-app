import { create } from 'zustand';

interface TripStore {
  tripId: string | null;
  setTripId: (tripId: string | null) => void;
  clearTripId: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  tripId: null,
  setTripId: (tripId: string | null) => set({ tripId }),
  clearTripId: () => set({ tripId: null }),
}));
