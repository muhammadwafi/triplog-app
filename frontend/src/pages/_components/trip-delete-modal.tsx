import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteTrip } from '@/data/use-trip-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTripStore } from '@/store/use-trip-store';
import type { Trip } from '@/types';
import * as React from 'react';
import { toast } from 'sonner';

interface DeleteTripModalProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  data: Trip | null;
  setActionData: React.Dispatch<React.SetStateAction<Trip | null>>;
}

export function TripDeleteModal({
  data,
  setActionData,
  ...props
}: DeleteTripModalProps) {
  const [isPending, startTransition] = React.useTransition();
  const isMobile = useIsMobile();
  const mDeleteTrip = useDeleteTrip();
  const { tripId, clearTripId } = useTripStore();

  if (!data) return;

  const onConfirmClicked = () => {
    startTransition(() => {
      const res = mDeleteTrip.mutateAsync(data.id);
      toast.promise(res, {
        loading: 'Deleting trip...',
        success: `Trip from ${data.trip_name} has been deleted`,
        error: (error) => {
          if (error?.response?.status === 401) {
            return 'You need to login to continue';
          }

          const errorMessage = error?.response?.data?.detail;
          if (errorMessage) {
            return errorMessage;
          }

          return 'Unable to delete trip';
        },
        finally: () => {
          if (tripId && tripId === data.id) {
            clearTripId();
          }

          props.onOpenChange?.(false);
          setActionData(null);
        },
      });
    });
  };

  if (!isMobile) {
    return (
      <Dialog {...props}>
        <DialogContent className="shadow-highlight w-full gap-8 rounded-lg border-none sm:max-w-sm">
          <DialogHeader className="gap-1">
            <div className="flex flex-col">
              <DialogTitle className="text-base">Delete trip</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure to remove this trip?
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="space-y-1">
            <div className="font-medium">{data.trip_name}</div>
            <Separator className="my-2" />
            <p className="text-muted-foreground text-xs leading-tight">
              You are about to remove this trip, please be careful cause this
              action cannot be undone.
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isPending}
              onClick={onConfirmClicked}
              variant="destructive"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Deleting trip</span>
                </>
              ) : (
                'Yes, Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent className="gap-4">
        <DrawerHeader>
          <div className="flex flex-col">
            <DrawerTitle className="text-base">Delete trip</DrawerTitle>
            <DrawerDescription className="text-sm">
              Are you sure to remove this trip?
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="space-y-1 px-4 py-2">
          <div className="font-medium">{data.trip_name}</div>
          <Separator className="my-2" />
          <p className="text-muted-foreground text-xs leading-tight">
            You are about to remove this trip, please be careful cause this
            action cannot be undone.
          </p>
        </div>
        <DrawerFooter className="pt-2">
          <Button
            disabled={isPending}
            onClick={onConfirmClicked}
            variant="destructive"
          >
            {isPending ? (
              <>
                <Spinner className="size-4" />
                <span>Deleting data</span>
              </>
            ) : (
              'Yes, Delete data'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
