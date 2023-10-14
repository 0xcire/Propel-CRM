import { useMemo } from 'react';

import { useUser } from '@/lib/react-query-auth';
import { useSalesVolume } from '../hooks/useSalesVolume';

import { useAnalyticsContext } from '../context/AnalyticsContext';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

import { Spinner } from '@/components';

import { currency } from '@/utils/intl';
import { yAxisRange } from '@/utils/';
import { filterAnalyticsData } from '../utils';

import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { SalesVolumes } from '../types';

export function SalesVolumeChart(): JSX.Element {
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);

  const { state: currentTimeFrame } = useAnalyticsContext();

  const minmax = useMemo(() => {
    if (salesVolume.data) {
      const volumeArray = salesVolume.data?.map((data) => +data.volume);
      return [Math.min(...volumeArray), Math.max(...volumeArray)] as const;
    }
  }, [salesVolume.data]);

  const filteredSalesVolumeData = filterAnalyticsData(
    salesVolume.data as SalesVolumes,
    currentTimeFrame
  );

  if (salesVolume.isLoading) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  if (salesVolume.data?.length === 0) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <p className='text-slate-500'>Go out and close some deals!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <BarChart
        width={150}
        height={40}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        data={filteredSalesVolumeData}
      >
        <XAxis
          dataKey={'month'}
          tickLine={false}
          stroke='#010101'
        />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
          tickLine={false}
          stroke='#010101'
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey='volume'
          fill='#010101'
          radius={3}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

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
