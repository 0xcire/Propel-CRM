import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { lazyImport } from '@/utils/lazyImport';

import { useIdleTimeout } from '@/hooks/useIdleTimeout';

import { Typography } from '@/components/ui/typography';

import { AnalyticsPageHeader } from './Header';

const { SalesVolumeChart } = lazyImport(
  () => import('../SalesVolumeChart'),
  'SalesVolumeChart'
);

const { GCILineChart } = lazyImport(
  () => import('../GCILineChart'),
  'GCILineChart'
);
import { DaysOnMarketCard } from './Cards/DaysOnMarket';
import { ListToSaleRatioCard } from './Cards/ListToSaleRatio';
import { TimeToCloseCard } from './Cards/TimeToClose';
import { TotalVolumeCard } from './Cards/TotalVolume';

import { getCurrentYear } from '@/utils';

// try to replace dashboard layout with min-h-0

// replace @/components/dashboard as just grid<X>...

export function AnalyticsPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  useIdleTimeout();

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
        <TotalVolumeCard className='col-start-1 col-end-4 row-start-1 row-end-3 grid place-items-center rounded-md border border-border shadow' />

        <DaysOnMarketCard className='col-start-4 col-end-7 row-start-1 row-end-3 grid place-items-center rounded-md border border-border shadow' />

        <div className='col-start-7 col-end-13 row-start-1 row-end-3 flex min-h-0 flex-col rounded-md border border-border shadow'>
          <Typography
            variant='h4'
            className='p-2 pr-3 font-normal'
          >
            GCI
          </Typography>

          <GCILineChart />
        </div>

        <div className='col-start-1 col-end-10 row-start-3 row-end-7 flex min-h-0 flex-col rounded-md border border-border shadow'>
          <Typography
            variant='h4'
            className='p-2 pl-4 font-normal'
          >
            Sales Volume
          </Typography>
          <SalesVolumeChart />
        </div>

        <ListToSaleRatioCard className='col-start-10 col-end-13 row-start-3 row-end-5 grid place-items-center rounded-md border border-border shadow' />

        <TimeToCloseCard className='col-start-10 col-end-13 row-start-5 row-end-7 grid place-items-center rounded-md border border-border shadow' />
      </div>
    </div>
  );
}
