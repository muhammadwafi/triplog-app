import { MapsView } from '@/components/leaflet-map/maps-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { ELDChart } from '@/pages/_components/eld-chart';
import type { ChartPoint, LogStatus, TripTimeline } from '@/types';
import { ChartBarBigIcon, MapIcon } from 'lucide-react';

const statusToNumber = (status: LogStatus): number => {
  switch (status) {
    case 'OFF_DUTY':
    case 'BREAK':
      return 1;
    case 'SLEEPER_BERTH':
      return 2;
    case 'DRIVING':
      return 3;
    case 'ON_DUTY_NON_DRIVING':
    case 'ON_DUTY':
    case 'START':
      return 4;
    default:
      return 4;
  }
};

const generateChartData = (logData: TripTimeline[]): ChartPoint[] => {
  if (logData.length === 0) return [];

  const data: ChartPoint[] = [];
  const firstEntryTime = new Date(logData[0].time);

  // Determine the start of the 24-hour log period (midnight UTC)
  const dayStartUTC = new Date(firstEntryTime.getTime());
  dayStartUTC.setUTCHours(0, 0, 0, 0);

  for (let i = 0; i < logData.length; i++) {
    const entry = logData[i];
    const entryDate = new Date(entry.time);
    const statusNum = statusToNumber(entry.status as LogStatus);

    // Calculate hours since midnight
    const timeDifferenceMs = entryDate.getTime() - dayStartUTC.getTime();
    let hoursSinceMidnight = timeDifferenceMs / (1000 * 60 * 60);

    data.push({
      time: hoursSinceMidnight,
      status: statusNum,
      label: entry.activity,
    });
  }

  // Ensure chart spans 24 hours and initial status from 00:00 is set
  if (data.length > 0) {
    if (data[0].time > 0) {
      // Add initial OFF_DUTY point at 0.0 if the first event is later
      data.unshift({
        time: 0.0,
        status: statusToNumber('OFF_DUTY'),
        label: 'Initial OFF_DUTY (00:00)',
      });
    }

    const lastPoint = data[data.length - 1];
    if (lastPoint && lastPoint.time < 24) {
      data.push({
        time: 24.0,
        status: lastPoint.status,
        label: 'Day End',
      });
    }
  }

  return data.sort((a, b) => a.time - b.time);
};

const calculateTotals = (logData: TripTimeline[]) => {
  const totals = {
    offDuty: 0,
    sleeperBerth: 0,
    driving: 0,
    onDuty: 0,
    total: 0,
  };

  logData.forEach((entry) => {
    const duration = entry.duration_hrs || 0;
    switch (entry.status as LogStatus) {
      case 'OFF_DUTY':
      case 'BREAK':
        totals.offDuty += duration;
        break;
      case 'SLEEPER_BERTH':
        totals.sleeperBerth += duration;
        break;
      case 'DRIVING':
        totals.driving += duration;
        break;
      case 'ON_DUTY_NON_DRIVING':
      case 'ON_DUTY':
      case 'START':
        totals.onDuty += duration;
        break;
    }
  });

  totals.total =
    totals.offDuty + totals.sleeperBerth + totals.driving + totals.onDuty;
  return totals;
};

// Helper to format UTC time for the activity log
const formatTimeForLog = (isoTime: string) => {
  return new Date(isoTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
};

const viewModes = [
  {
    type: 'chart',
    icon: ChartBarBigIcon,
  },
  {
    type: 'maps',
    icon: MapIcon,
  },
];

interface DailyLogsViewProps {
  title: string;
  logData: TripTimeline[];
  geojson: string | undefined;
  dateKey: string;
}

export const DailyLogsView = ({
  title,
  logData,
  geojson,
  dateKey,
}: DailyLogsViewProps) => {
  const chartData = generateChartData(logData);
  const totals = calculateTotals(logData);
  const formattedDate = formatDate(logData[0].time, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  let geojsonData = {
    type: 'LineString',
    coordinates: [],
  } as GeoJSON.LineString;

  if (geojson) {
    geojsonData = JSON.parse(geojson);
  }

  const summaryContents = [
    {
      title: 'Off Duty',
      value: totals.offDuty.toFixed(1),
    },
    {
      title: 'Sleeper Berth',
      value: totals.sleeperBerth.toFixed(1),
    },
    {
      title: 'Driving',
      value: totals.driving.toFixed(1),
    },
    {
      title: 'On Duty',
      value: totals.onDuty.toFixed(1),
    },
  ];

  return (
    <TabsContent value={dateKey}>
      <div>
        <Tabs defaultValue="chart" className="grid gap-4">
          <div className="border-b pb-4 text-center">
            <h2 className="font-bold">{title}</h2>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="">
              <h2 className="font-bold">Hours of Services</h2>
              <p className="text-muted-foreground text-xs">{formattedDate}</p>
            </div>
            <TabsList>
              {viewModes.map((item) => (
                <TabsTrigger
                  key={item.type}
                  value={item.type}
                  className="data-[state=inactive]:text-muted-foreground data-[state=active]:text-primary data-[state=inactive]:hover:text-foreground dark:data-[state=active]:bg-neutral-600"
                >
                  <item.icon />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="chart">
            <ELDChart chartData={chartData} totals={totals} />
          </TabsContent>
          <TabsContent value="maps">
            <MapsView
              className="h-[350px] rounded-lg border-0 focus-visible:ring-0 focus-visible:outline-none"
              scrollWheelZoom
              withFullScreenButton={false}
              tileSwitcherSize="sm"
              geoJsonData={geojsonData}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6 grid gap-6">
          {/* Summary Cards */}
          <div className="grid grow grid-cols-2 gap-2 lg:grid-cols-4">
            {summaryContents.map((item) => (
              <div
                key={item.title}
                className="border-input rounded-lg border p-4"
              >
                <div className="text-muted-foreground text-sm font-semibold">
                  {item.title}
                </div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {item.value}hrs
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log Table */}
          <div>
            <h3 className="mb-3 font-semibold">Activities</h3>
            <div className="space-y-2">
              {logData.map((entry, index) => (
                <div
                  key={index}
                  className="bg-muted flex flex-col gap-1 rounded-md px-4 py-4 text-sm md:flex-row md:items-start md:gap-4 md:py-2"
                >
                  <div className="font-mono">
                    {formatTimeForLog(entry.time)}
                  </div>
                  <div className="font-semibold">
                    {entry.status.replace(/_/g, ' ')}
                  </div>
                  <div className="text-muted-foreground">{entry.activity}</div>
                  {entry.duration_hrs !== undefined &&
                    entry.duration_hrs !== null && (
                      <div className="text-muted-foreground ml-auto">
                        {entry.duration_hrs.toFixed(1)}h
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
