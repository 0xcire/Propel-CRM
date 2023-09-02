import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSalesVolume } from '../hooks/useVolumeAnalytics';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { removeTimeZone } from '@/utils/date';

export function SalesVolumeChart(): JSX.Element {
  const salesVolume = useSalesVolume();
  // TODO: Extract
  const currency = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    []
  );
  console.log(salesVolume.data);
  console.log(
    'REMOVE TIME ZONE',
    new Date(removeTimeZone(salesVolume.data[0].month))
  );

  const formatData = useMemo(
    () =>
      salesVolume.data?.map((data) => ({
        month: format(new Date(removeTimeZone(data.month)), 'LLL', {
          locale: enUS,
        }),
        volume: data.monthVolume,
      })),
    [salesVolume.data]
  );

  console.log('POST FORMAT', formatData);

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
        data={formatData}
      >
        <XAxis dataKey={'month'} />
        <YAxis
          domain={[5000000, 70000000]}
          className='text-[10px]'
        />
        <Tooltip />
        <Bar
          dataKey='volume'
          fill='rgb(209, 213, 219)'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// function CustomTooltip(): JSX.Element {
//   return (
//     <div>
//       <div>
//         <p></p>
//       </div>
//     </div>
//   );
// }
