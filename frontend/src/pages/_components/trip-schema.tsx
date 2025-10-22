import { z } from 'zod';

export const tripInitSchema = {
  current_location: '',
  current_coordinates: '',
  pickup_location: '',
  pickup_coordinates: '',
  dropoff_location: '',
  dropoff_coordinates: '',
  current_cycle_used: 0,
};

export const tripSchema = z.object({
  current_location: z
    .string()
    .min(1, { message: 'Insert your current location' }),
  current_coordinates: z
    .string()
    .min(1, { message: 'Try to select current location again' }),
  pickup_location: z.string().min(1, { message: 'Add your pickup location' }),
  pickup_coordinates: z
    .string()
    .min(1, { message: 'Try to select pickup location again' }),
  dropoff_location: z.string().min(1, { message: 'Add your dropoff location' }),
  dropoff_coordinates: z
    .string()
    .min(1, { message: 'Try to select dropoff location again' }),
  current_cycle_used: z
    .number({ message: 'This field is required' })
    .min(0, { message: 'Minimum value is 0' }),
});
