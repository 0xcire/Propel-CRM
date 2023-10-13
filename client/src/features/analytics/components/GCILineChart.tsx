import { useUser } from '@/lib/react-query-auth';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { AnalyticsDataResponse } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { yAxisRange } from '@/utils';
import { useMemo } from 'react';

import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { currency } from '@/utils/intl';
import { useSalesVolume } from '../hooks/useSalesVolume';
import { Spinner } from '@/components';

// extend when implementing teams
// admin can set rates for their team members for example...
const COMMISSION_RATE = 0.15;

export function GCILineChart(): JSX.Element {
  const user = useUser();
  const queryClient = useQueryClient();

  // improve this
  const salesVolume = useSalesVolume(user.data?.id as number);
  // const salesVolumeToGCI = queryClient
  //   .getQueryData<AnalyticsDataResponse>([
  //     'sales-volume',
  //     { userID: user.data?.id as number },
  //   ])
  //   ?.analytics.map((data) => ({
  //     month: data.month,
  //     gci: (+data.volume * COMMISSION_RATE).toString(),
  //   }));

  const salesVolumeToGCI = salesVolume.data?.map((data) => ({
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
      // height='100%'
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
        />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type='monotone'
          dataKey='gci'
          stroke='#888888'
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
