import { useMemo } from 'react';

import { useUser } from '@/lib/react-query-auth';
import { useSalesVolume } from '../hooks/useSalesVolume';

import { useAnalyticsContext } from '../context/AnalyticsContext';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Spinner } from '@/components/Spinner';
import { CustomTooltip } from './CustomTooltip';

import { yAxisRange } from '@/utils';
import {
  filterAnalyticsData,
  getMinMax,
  hslValueFromComputedProperty,
} from '../utils';

// extend when implementing teams
// admin can set rates for their team members for example...
const COMMISSION_RATE = 0.15;

export function GCILineChart(): JSX.Element {
  const { state: currentTimeFrame } = useAnalyticsContext();
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);

  const primaryHsl = hslValueFromComputedProperty('--primary');
  const mutedForegroundHsl = hslValueFromComputedProperty('--muted-foreground');

  const salesVolumeToGCI = useMemo(() => {
    return salesVolume.data?.map((data) => ({
      month: data.month,
      gci: Math.round(+data.value * COMMISSION_RATE).toString(),
    }));
  }, [salesVolume.data]);

  if (salesVolume.isInitialLoading) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  const filteredGCIData = filterAnalyticsData(
    salesVolumeToGCI as { month: string; gci: string }[],
    currentTimeFrame
  );

  const minmax = getMinMax(() => {
    if (salesVolumeToGCI) {
      return salesVolumeToGCI.map((data) => +data.gci);
    }
  });

  if (salesVolume.data?.length === 0) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <p className='text-slate-500'>Nothing to chart, yet!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width='99%'
      height='99%'
      className='flex-1'
    >
      <LineChart
        width={150}
        height={40}
        margin={{
          top: 10,
          right: 15,
          left: 5,
          bottom: 5,
        }}
        data={filteredGCIData}
      >
        <XAxis
          dataKey='month'
          fontSize={12}
          stroke={mutedForegroundHsl}
          tickLine={false}
        />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
          stroke={mutedForegroundHsl}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type='monotone'
          dataKey='gci'
          stroke={primaryHsl}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
