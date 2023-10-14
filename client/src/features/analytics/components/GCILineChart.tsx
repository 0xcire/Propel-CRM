import { useMemo } from 'react';

import { useUser } from '@/lib/react-query-auth';
import { useSalesVolume } from '../hooks/useSalesVolume';

import { useAnalyticsContext } from '../context/AnalyticsContext';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

import { Spinner } from '@/components';

import { yAxisRange } from '@/utils';
import { currency } from '@/utils/intl';
import { filterAnalyticsData } from '../utils';

import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { SalesVolumes } from '../types';

// extend when implementing teams
// admin can set rates for their team members for example...
const COMMISSION_RATE = 0.15;

export function GCILineChart(): JSX.Element {
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);
  const { state: currentTimeFrame } = useAnalyticsContext();

  // repeated
  const filteredSalesVolumeData = filterAnalyticsData(
    salesVolume.data as SalesVolumes,
    currentTimeFrame
  );

  const salesVolumeToGCI = filteredSalesVolumeData?.map((data) => ({
    month: data.month,
    gci: (+data.volume * COMMISSION_RATE).toString(),
  }));

  // clean up, repeated with SalesVolumeChart
  const minmax = useMemo(() => {
    if (salesVolumeToGCI) {
      const gciArray = salesVolumeToGCI.map((data) => +data.gci);
      return [Math.min(...gciArray), Math.max(...gciArray)] as const;
    }
  }, [salesVolumeToGCI]);

  if (salesVolume.isInitialLoading) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width='100%'
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
        data={salesVolumeToGCI}
      >
        <XAxis
          dataKey='month'
          fontSize={12}
          stroke='#010101'
          tickLine={false}
        />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
          stroke='#010101'
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type='monotone'
          dataKey='gci'
          stroke='#010101'
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// clean up, repeated in salesvolumechart
function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>): JSX.Element {
  if (active && payload && payload[0] && label && payload[0].value) {
    return (
      <div className='rounded-md border-2 border-slate-800 bg-gray-300 p-4'>
        <div>
          <p className='font-bold'>{label}</p>
          <p>Volume: {currency.format(+payload[0].value)}</p>
        </div>
      </div>
    );
  }
  return <></>;
}
