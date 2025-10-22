import type { ChartPoint, TotalHrs } from '@/types';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface ELDChartProps {
  chartData: ChartPoint[];
  totals: TotalHrs;
}

export function ELDChart({ chartData, totals }: ELDChartProps) {
  const formatXAxis = (value: number): string => {
    const hour = Math.floor(value);
    if (hour === 0 || hour === 24) return 'MID';
    if (hour === 12) return 'NOON';
    if (hour > 12) return (hour - 12).toString();

    return hour.toString();
  };

  const formatYAxis = (value: number) => {
    const labels: { [key: number]: string } = {
      1: 'OFF DUTY',
      2: 'SLEEPER BERTH',
      3: 'DRIVING',
      4: 'ON DUTY',
    };
    return labels[value] || '';
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 0, right: 10, bottom: 0, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, 24]}
              ticks={[...Array(25).keys()]}
              tickFormatter={formatXAxis}
              axisLine={{ stroke: 'var(--chart-border)', strokeWidth: 2 }}
              tick={{
                fontSize: 11,
                fontWeight: 'bold',
                fill: 'var(--invert)',
              }}
            />
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, 24]}
              ticks={[...Array(25).keys()]}
              tickFormatter={formatXAxis}
              orientation="top"
              axisLine={{ stroke: 'var(--chart-border)', strokeWidth: 2 }}
              tick={{
                fontSize: 11,
                fontWeight: 'bold',
                fill: 'var(--invert)',
              }}
              xAxisId="top"
            />
            <YAxis
              dataKey="status"
              type="number"
              domain={[0.5, 4.5]}
              ticks={[1, 2, 3, 4]}
              tickFormatter={formatYAxis}
              axisLine={{ stroke: 'var(--chart-border)', strokeWidth: 2 }}
              tick={{
                fontSize: 12,
                fontWeight: 'bold',
                fill: 'var(--invert)',
              }}
            />
            <ReferenceLine y={1} stroke="var(--chart-grid)" strokeWidth={1.5} />
            <ReferenceLine y={2} stroke="var(--chart-grid)" strokeWidth={1.5} />
            <ReferenceLine y={3} stroke="var(--chart-grid)" strokeWidth={1.5} />
            <ReferenceLine y={4} stroke="var(--chart-grid)" strokeWidth={1.5} />
            <Line
              type="stepAfter"
              dataKey="status"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Totals Column */}
      <div className="flex flex-col justify-center border-l-2 border-neutral-900 pl-4 dark:border-neutral-600">
        <div className="mb-4 text-center">
          <div className="text-[10px] font-bold">TOTALS</div>
          <div className="text-[10px] font-bold">HOURS</div>
        </div>
        <div className="space-y-8">
          <div className="text-center text-xl font-bold">
            {totals.onDuty.toFixed(1)}
          </div>
          <div className="text-center text-xl font-bold">
            {totals.driving.toFixed(1)}
          </div>
          <div className="text-center text-xl font-bold">
            {totals.sleeperBerth.toFixed(1)}
          </div>
          <div className="text-center text-xl font-bold">
            {totals.offDuty.toFixed(1)}
          </div>
        </div>
        <div className="mt-4 border-t-2 border-neutral-900 pt-2 dark:border-neutral-600">
          <div className="text-center text-xl font-bold">
            {totals.total.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
