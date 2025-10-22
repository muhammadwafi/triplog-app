import { Button } from '@/components/ui/button';
import { Frame, FrameHeader, FramePanel } from '@/components/ui/frame';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import type { TripTimeline } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DailyLogsView } from './daily-logs-view';
import { EmptyLog } from './empty-log';

interface DailyLogData {
  [dateKey: string]: TripTimeline[];
}

interface ActivitiesViewProps {
  title: string;
  logData: TripTimeline[] | undefined;
  geojson: string | undefined;
  isLoading: boolean;
}

const groupLogDataByDay = (data: TripTimeline[]): DailyLogData => {
  const grouped: DailyLogData = {};

  data.forEach((entry) => {
    const dateKey = entry.time.substring(0, 10);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  });

  return grouped;
};

function ActivitiesLoading() {
  return (
    <Frame className="mt-4 w-full">
      <FrameHeader className="flex-row overflow-x-auto px-0 py-0">
        <Skeleton className="mx-auto my-4 h-2 w-20" />
      </FrameHeader>
      <FramePanel className="flex h-full min-h-64 flex-col items-center justify-center gap-4 p-4">
        <Spinner />
        <span className="text-muted-foreground text-sm">
          Preparing your data...
        </span>
      </FramePanel>
    </Frame>
  );
}

export function ActivitiesView({
  title,
  logData,
  geojson,
  isLoading,
}: ActivitiesViewProps) {
  const dailyLogs = groupLogDataByDay(logData || []);
  const dateKeys = Object.keys(dailyLogs).sort();

  const [startIndex, setStartIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(dateKeys[0] || '');
  const isMobile = useIsMobile();
  const visibleCount = isMobile ? 3 : 5;

  React.useEffect(() => {
    if (dateKeys.length === 0) {
      setActiveTab('');
      return;
    }

    // Keep activeTab if it's still in the new dateKeys
    setActiveTab((prevActiveTab) => {
      if (prevActiveTab && dateKeys.includes(prevActiveTab)) {
        return prevActiveTab;
      }

      return dateKeys[0];
    });
  }, [dateKeys]);

  if (isLoading) {
    return <ActivitiesLoading />;
  }

  // After loading, if no data, show empty state
  if (!logData || logData?.length === 0) {
    return <EmptyLog />;
  }

  const currentIndex = dateKeys.indexOf(activeTab ?? '');

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newActive = dateKeys[currentIndex - 1];
      setActiveTab(newActive);
      if (currentIndex - 1 < startIndex) {
        setStartIndex((prev) => Math.max(prev - visibleCount, 0));
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < dateKeys.length - 1) {
      const newActive = dateKeys[currentIndex + 1];
      setActiveTab(newActive);
      if (currentIndex + 1 >= startIndex + visibleCount) {
        setStartIndex((prev) =>
          Math.min(
            prev + visibleCount,
            Math.max(dateKeys.length - visibleCount, 0),
          ),
        );
      }
    }
  };

  const visibleDates = dateKeys.slice(startIndex, startIndex + visibleCount);

  return (
    <Frame className="mt-4 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-1">
        <FrameHeader className="flex-row overflow-x-auto px-0 py-0">
          <TabsList className="mx-auto h-11 gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-background text-foreground dark:hover:text-foreground hover:text-primary hover:bg-background shrink-0 rounded-md border-none not-disabled:shadow-sm disabled:bg-transparent dark:bg-transparent dark:not-disabled:hover:bg-neutral-600 dark:disabled:bg-transparent"
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            {visibleDates.map((dateKey) => {
              const date = new Date(dateKey);
              const day = String(date.getDate()).padStart(2, '0');
              const month = date
                .toLocaleDateString('en-US', { month: 'short' })
                .toUpperCase();
              const year = date.getFullYear();

              return (
                <TabsTrigger
                  key={dateKey}
                  value={dateKey}
                  className="data-[state=inactive]:text-muted-foreground data-[state=active]:text-primary data-[state=inactive]:hover:text-foreground flex gap-1 px-3 dark:data-[state=active]:bg-neutral-600"
                >
                  <div className="text-2xl leading-[1] font-bold">{day}</div>
                  <div className="grid gap-0 text-left text-[10px] leading-[1] font-bold">
                    <span>{month}</span>
                    <span>{year}</span>
                  </div>
                </TabsTrigger>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === dateKeys.length - 1}
              className="bg-background text-foreground dark:hover:text-foreground hover:text-primary hover:bg-background shrink-0 rounded-md border-none not-disabled:shadow-sm disabled:bg-transparent dark:bg-transparent dark:not-disabled:hover:bg-neutral-600 dark:disabled:bg-transparent"
            >
              <ChevronRightIcon className="size-5" />
            </Button>
          </TabsList>
        </FrameHeader>
        <FramePanel className="h-full not-has-[table]:p-4">
          {dateKeys.map((dateKey) => (
            <DailyLogsView
              title={title}
              key={dateKey}
              logData={dailyLogs[dateKey]}
              dateKey={dateKey}
              geojson={geojson}
            />
          ))}
        </FramePanel>
      </Tabs>
    </Frame>
  );
}
