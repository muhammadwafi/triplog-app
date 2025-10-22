import { tripSchema } from '@/pages/_components/trip-schema';
import apiClient from '@/services/api-client';
import type {
  PaginatedResponse,
  SingleResponse,
  TripList,
  TripSummary,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export type TripInput = z.infer<typeof tripSchema>;

const tripKeys = {
  all: ['trip'],
  summary: (id: string) => [...tripKeys.all, 'summary', id],
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TripInput) =>
      await apiClient.post('trips/calculate', data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      await apiClient.delete(`trips/${tripId}/`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });
    },
  });
};

export const useTripList = () => {
  const query = useQuery<PaginatedResponse<TripList>>({
    queryKey: tripKeys.all,
    queryFn: async () =>
      await apiClient.get('trips/?size=100').then((res) => res.data),
  });

  return {
    ...query,
    data: query.data?.results ?? [],
  };
};

export const useTripSummary = (tripId: string | null) => {
  const query = useQuery<SingleResponse<TripSummary>>({
    queryKey: tripKeys.summary(tripId ?? ''),
    queryFn: async () =>
      await apiClient.get(`trips/${tripId}/summary/`).then((res) => res.data),
    enabled: !!tripId,
    retry: false,
  });

  return {
    ...query,
    data: query.data?.data,
  };
};
