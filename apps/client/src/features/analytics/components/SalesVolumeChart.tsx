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

import { ListEmpty } from '@/components/ListEmpty';
import { Spinner } from '@/components/Spinner';
import { CustomTooltip } from './CustomTooltip';

import { yAxisRange } from '@/utils/';
import {
  filterAnalyticsData,
  getMinMax,
  hslValueFromComputedProperty,
} from '../utils';

import type { SalesVolumes } from '../types';

export function SalesVolumeChart(): JSX.Element {
  const { state: currentTimeFrame } = useAnalyticsContext();
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);

  const mutedForegroundHsl = hslValueFromComputedProperty('--muted-foreground');

  const minmax = getMinMax(() => {
    if (salesVolume.data) {
      return salesVolume.data?.map((data) => +data.value);
    }
  });

  if (salesVolume.isLoading) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  const filteredSalesVolumeData = filterAnalyticsData(
    salesVolume.data as SalesVolumes,
    currentTimeFrame
  );

  if (salesVolume.data?.length === 0) {
    return <ListEmpty>Go out and close some deals!</ListEmpty>;
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
          stroke={mutedForegroundHsl}
          className='stroke-foreground'
        />
        <YAxis
          domain={yAxisRange(minmax as [number, number])}
          fontSize={10}
          tickLine={false}
          stroke={mutedForegroundHsl}
          className='stroke-black'
        />
        <Tooltip
          cursor={false}
          content={<CustomTooltip />}
        />
        <Bar
          dataKey='value'
          className='fill-primary'
          radius={3}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
