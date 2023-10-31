import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Typography } from '@/components/ui/typography';

import { AnalyticsPageHeader } from './Header';
import { SalesVolumeChart } from '../SalesVolumeChart';
import { GCILineChart } from '../GCILineChart';
import {
  DaysOnMarketCard,
  ListToSaleRatioCard,
  TimeToCloseCard,
  TotalVolumeCard,
} from './Cards';

import { getCurrentYear } from '@/utils';

// try to replace dashboard layout with min-h-0

// replace @/components/dashboard as just grid<X>...

export function AnalyticsPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.set('year', getCurrentYear().toString());
    setSearchParams(searchParams, {
      replace: true,
    });

    //eslint-disable-next-line
  }, []);

  return (
    <div className='flex h-full flex-col'>
      <AnalyticsPageHeader className='flex items-center justify-between pb-0 pt-4' />

      <div className=' grid h-full min-h-0 flex-1 grid-cols-12 grid-rows-6 gap-4 py-4 pb-0'>
        <TotalVolumeCard className='col-start-1 col-end-4 row-start-1 row-end-3 grid place-items-center rounded-md border shadow' />

        <DaysOnMarketCard className='col-start-4 col-end-7 row-start-1 row-end-3 grid place-items-center rounded-md border shadow' />

        <div className='col-start-7 col-end-13 row-start-1 row-end-3 flex min-h-0 flex-col rounded-md border shadow'>
          <Typography
            variant='h4'
            className='p-2 pr-3 font-normal'
          >
            GCI
          </Typography>

          <GCILineChart />
        </div>

        <div className='col-start-1 col-end-10 row-start-3 row-end-7 flex min-h-0 flex-col rounded-md border shadow'>
          <Typography
            variant='h4'
            className='p-2 pl-4 font-normal'
          >
            Sales Volume
          </Typography>
          <SalesVolumeChart />
        </div>

        <ListToSaleRatioCard className='col-start-10 col-end-13 row-start-3 row-end-5 grid place-items-center rounded-md border shadow' />

        <TimeToCloseCard className='col-start-10 col-end-13 row-start-5 row-end-7 grid place-items-center rounded-md border shadow' />
      </div>
    </div>
  );
}
