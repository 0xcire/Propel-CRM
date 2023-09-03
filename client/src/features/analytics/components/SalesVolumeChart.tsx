import { useMemo } from 'react';

import { useSalesVolume } from '../hooks/useSalesVolume';

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
import { yAxisRange } from '@/utils/charts';

import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

export function SalesVolumeChart(): JSX.Element {
  const salesVolume = useSalesVolume();

  const minmax = useMemo(() => {
    if (salesVolume.isFetched) {
      const volumeArray = salesVolume.data?.map(
        (data) => data.volume
      ) as Array<number>;
      return [Math.min(...volumeArray), Math.max(...volumeArray)] as const;
    }
  }, [salesVolume]);

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
        data={salesVolume.data}
      >
        <XAxis dataKey={'month'} />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey='volume'
          fill='rgb(209, 213, 219)'
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
  if (active && payload && label && payload[0].value) {
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