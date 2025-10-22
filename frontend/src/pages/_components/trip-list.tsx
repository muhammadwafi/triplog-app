import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatDate } from '@/lib/utils';
import { EmptyTrip } from '@/pages/_components/empty-trip';
import { TripDeleteModal } from '@/pages/_components/trip-delete-modal';
import { useTripStore } from '@/store/use-trip-store';
import type { Trip, TripList } from '@/types';
import { ChevronDownIcon, ScanEyeIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

export function TripList({
  trip,
  isLoading,
}: {
  trip: TripList[];
  isLoading: boolean;
}) {
  const [actionData, setActionData] = React.useState<Trip | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const { tripId, setTripId } = useTripStore();

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[...Array(3).keys()].map((item) => (
          <Skeleton key={item} className="h-36 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      {!trip.length && <EmptyTrip />}
      {trip?.map((item) => (
        <div
          key={item.id}
          className={cn('bg-card mb-3 grid rounded-lg border', {
            'border-primary': tripId === item.id,
          })}
        >
          <div className="flex items-center justify-between px-4 py-1">
            <div className="text-muted-foreground text-[10px]">
              {formatDate(item.created_at, { month: 'short' })}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="-mr-3 h-5 gap-1 rounded-sm text-[10px] has-[>svg]:px-1.5 has-[>svg]:pr-1"
                >
                  Options
                  <ChevronDownIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTripId(item.id)}>
                  <ScanEyeIcon />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:bg-red-500/10 focus:text-red-500 dark:hover:text-red-500 dark:focus:bg-red-500/10"
                  onClick={() => {
                    setActionData(item);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2Icon className="text-inherit" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-col items-start divide-y md:grid-cols-3 lg:flex-row lg:divide-x lg:divide-y-0">
            <div className="flex size-full min-w-1/3 flex-col items-start p-4 text-sm">
              <div className="text-muted-foreground font-mono text-xs font-medium">
                From
              </div>
              <p className="line-clamp-3">{item.current_location}</p>
            </div>
            <div className="flex size-full min-w-1/3 flex-col items-start p-4 text-sm">
              <div className="text-muted-foreground font-mono text-xs font-medium">
                Pickup
              </div>
              <p className="line-clamp-3">{item.pickup_location}</p>
            </div>
            <div className="flex size-full min-w-1/3 flex-col items-start p-4 text-sm">
              <div className="text-muted-foreground font-mono text-xs font-medium">
                Dropoff
              </div>
              <p className="line-clamp-3">{item.dropoff_location}</p>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="dark:bg-muted divide-border flex flex-col items-center justify-between divide-y rounded-b-lg bg-neutral-50 lg:flex-row lg:divide-x lg:divide-y-0">
            <div className="divide-border flex w-full flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0">
              <div className="flex flex-col space-x-2 px-4 py-2 text-sm tracking-tight lg:flex-row lg:items-center">
                <span className="text-muted-foreground font-mono text-xs font-medium">
                  Cycle
                </span>
                <div className="font-semibold">
                  {item.current_cycle_used} hrs
                </div>
              </div>
              <div className="flex flex-col space-x-2 px-4 py-2 text-sm tracking-tight lg:flex-row lg:items-center">
                <span className="text-muted-foreground font-mono text-xs font-medium">
                  Distance
                </span>
                <div className="font-semibold">{item.total_trip_miles} mil</div>
              </div>
              <div className="flex flex-col space-x-2 px-4 py-2 text-sm tracking-tight lg:flex-row lg:items-center">
                <span className="text-muted-foreground font-mono text-xs font-medium">
                  Hours taken
                </span>
                <div className="font-semibold">
                  {item.total_driving_hrs} hrs
                </div>
              </div>
            </div>
            <div className="px-4 py-0.5 lg:px-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-xs"
                onClick={() => setTripId(item.id)}
              >
                View details
              </Button>
            </div>
          </div>
        </div>
      ))}
      <TripDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        setActionData={setActionData}
        data={actionData}
      />
    </>
  );
}
