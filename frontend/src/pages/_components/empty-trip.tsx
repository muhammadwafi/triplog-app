import { TruckIcon } from '@/components/icons';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function EmptyTrip() {
  return (
    <Empty className="mt-15 h-full border-none">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <TruckIcon className="text-muted-foreground size-8" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No trip at the moment</EmptyTitle>
        <EmptyDescription className="max-w-xs text-xs">
          You haven't taken any trips yet. Get started by creating your first
          trip.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
