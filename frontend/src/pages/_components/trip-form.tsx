import { AlertDismissable } from '@/components/ui/alert-dismissable';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { useCreateTrip } from '@/data/use-trip-data';
import { useTripStore } from '@/store/use-trip-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PlaceSelector } from './place-selector';
import { tripInitSchema, tripSchema } from './trip-schema';

export function TripForm() {
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mCreateTrip = useCreateTrip();
  const { setTripId } = useTripStore();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: tripInitSchema,
  });

  const onSubmit = async (data: z.infer<typeof tripSchema>) => {
    const res = mCreateTrip.mutateAsync(data);

    toast.promise(res, {
      loading: 'Calculating your trip...',
      success: (res) => {
        // set newly created id
        if (res?.data?.id) {
          setTripId(res?.data?.id);
        }

        setShowAlert(false);
        form.reset();

        return 'Trip has been successfully calculated';
      },
      error: (error) => {
        if (error?.response?.status === 401) {
          return 'You need to login to continue';
        } else {
          const errorMessage = error?.response?.data?.detail;
          if (errorMessage) {
            setErrorMessage(errorMessage);
            setShowAlert(true);
          } else {
            setErrorMessage('Unable to calculate your trip');
          }
        }

        return 'Unable to calculate your trip';
      },
    });
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <AlertDismissable
          variant="error"
          open={showAlert}
          onOpenChange={setShowAlert}
          className="mb-0 items-start space-x-2"
        >
          <CircleAlertIcon size={16} className="mt-0.5 min-w-4" />
          <p>{errorMessage}</p>
        </AlertDismissable>

        <Controller
          name="current_location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="current_location">
                Current location
              </FieldLabel>
              <PlaceSelector
                {...field}
                id="current_location"
                value={field.value}
                onChange={(val) => {
                  form.setValue('current_location', val?.label ?? '');
                  form.setValue('current_coordinates', val?.coords ?? '');
                  form.trigger('current_location');
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="pickup_location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="pickup">Pickup location</FieldLabel>
              <PlaceSelector
                {...field}
                id="pickup"
                value={field.value}
                onChange={(val) => {
                  form.setValue('pickup_location', val?.label ?? '');
                  form.setValue('pickup_coordinates', val?.coords ?? '');
                  form.trigger('pickup_location');
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="dropoff_location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="dropoff">Dropoff location</FieldLabel>
              <PlaceSelector
                {...field}
                id="dropoff"
                value={field.value}
                onChange={(val) => {
                  form.setValue('dropoff_location', val?.label ?? '');
                  form.setValue('dropoff_coordinates', val?.coords ?? '');
                  form.trigger('dropoff_location');
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="current_cycle_used"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="mt-2 flex w-full flex-col gap-1.5">
              <Field data-invalid={fieldState.invalid} className="flex-row">
                <FieldLabel
                  htmlFor="current_cycle_used"
                  className="grid gap-0.5"
                >
                  <div>Cycle used</div>
                  <p className="text-muted-foreground text-xs">
                    Current cycle hours used
                  </p>
                </FieldLabel>
                <InputGroup className="max-w-28">
                  <InputGroupInput
                    {...field}
                    id="current_cycle_used"
                    aria-invalid={fieldState.invalid}
                    type="number"
                    min={0}
                    className="text-center"
                    {...form.register('current_cycle_used', {
                      valueAsNumber: true,
                    })}
                  />
                  <InputGroupAddon align="inline-end">hrs</InputGroupAddon>
                </InputGroup>
              </Field>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          )}
        />

        <Field className="mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="size-4" /> Calculating...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </Field>
      </form>
    </>
  );
}
