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
} from 'recharts';

import { Spinner } from '@/components';
import { CustomTooltip } from './CustomTooltip';

import { yAxisRange } from '@/utils/';
import { filterAnalyticsData, getMinMax } from '../utils';

import type { SalesVolumes } from '../types';

export function SalesVolumeChart(): JSX.Element {
  const { state: currentTimeFrame } = useAnalyticsContext();

  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);

  const minmax = getMinMax(() => {
    if (salesVolume.data) {
      return salesVolume.data?.map((data) => +data.volume);
    }
  });

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

  const filteredSalesVolumeData = filterAnalyticsData(
    salesVolume.data as SalesVolumes,
    currentTimeFrame
  );

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
