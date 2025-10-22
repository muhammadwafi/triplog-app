import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Frame, FrameHeader, FramePanel } from '@/components/ui/frame';
import { FileClockIcon } from 'lucide-react';

export function EmptyLog() {
  return (
    <Frame className="mt-4 w-full">
      <FrameHeader className="flex-row overflow-x-auto px-0 py-0">
        <div className="bg-invert/5 mx-auto my-4 h-2 w-20 rounded-full" />
      </FrameHeader>
      <FramePanel className="min-h-64">
        <Empty className="mt-6 size-full md:mt-0">
          <EmptyHeader>
            <EmptyMedia variant="default">
              <FileClockIcon className="text-muted-foreground size-8" />
            </EmptyMedia>
            <EmptyTitle className="text-base">No data selected</EmptyTitle>
            <EmptyDescription className="max-w-xs text-xs">
              No trip data selected. Get started by select a trip or create a
              new one.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </FramePanel>
    </Frame>
  );
}
