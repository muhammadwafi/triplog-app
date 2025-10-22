import MapsLayout from '@/components/layouts/maps-layout';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/ui/frame';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTripList, useTripSummary } from '@/data/use-trip-data';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { ActivitiesView } from '@/pages/_components/activities-view';
import { TripForm } from '@/pages/_components/trip-form';
import { TripList } from '@/pages/_components/trip-list';
import { useTripStore } from '@/store/use-trip-store';
import * as React from 'react';

export function Trip() {
  useDocumentTitle('Trip');
  const trip = useTripList();
  const { tripId, setTripId, clearTripId } = useTripStore();

  const onSelectFirstTrip = React.useEffectEvent(() => {
    if (tripId) return;

    if (trip.data && trip.data.length > 0) {
      setTripId(trip.data[0].id);
    } else {
      clearTripId();
    }
  });

  React.useEffect(() => {
    if (!trip.isLoading && trip.data) {
      onSelectFirstTrip();
    }

    if (!trip.data) {
      clearTripId();
    }
  }, [tripId, trip.data, trip.isLoading]);

  const tripSummary = useTripSummary(tripId);

  return (
    <MapsLayout>
      <div className="mb-8 text-center text-4xl font-bold">Trip</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Frame className="relative h-full min-h-[400px] flex-1 flex-col lg:col-span-2">
          <FrameHeader className="py-2">
            <FrameTitle>Trip</FrameTitle>
          </FrameHeader>
          <FramePanel className="h-full not-has-[table]:p-1">
            <ScrollArea className="h-full max-h-96 p-2">
              <TripList
                trip={trip?.data}
                isLoading={trip.isLoading || trip.isPending}
              />
            </ScrollArea>
          </FramePanel>
        </Frame>
        <Frame className="w-full">
          <FrameHeader className="py-2">
            <FrameTitle>Make a new trip</FrameTitle>
          </FrameHeader>
          <FramePanel className="h-full">
            <TripForm />
          </FramePanel>
        </Frame>
      </div>
      <ActivitiesView
        title={tripSummary?.data?.trip_name || 'Activity'}
        logData={tripSummary?.data?.timeline}
        geojson={tripSummary?.data?.geojson}
        isLoading={tripSummary.isLoading}
      />
    </MapsLayout>
  );
}
