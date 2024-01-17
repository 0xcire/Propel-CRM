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
    if (!searchParams.get('year')) {
      searchParams.set('year', getCurrentYear().toString());
      setSearchParams(searchParams, {
        replace: true,
      });
    }

    //eslint-disable-next-line
  }, []);

  return (
    <div className='flex h-full flex-col'>
      <AnalyticsPageHeader className='pb-0 pt-4' />

      <div className='grid h-full min-h-0 flex-1 grid-cols-2 grid-rows-12 gap-4 py-4 pb-0 lg:grid-cols-12 lg:grid-rows-6'>
        <TotalVolumeCard className='row-start-1 row-end-3 grid place-items-center rounded-md border border-border shadow lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-3' />

        <DaysOnMarketCard className='row-start-1 row-end-3 grid place-items-center rounded-md border border-border shadow lg:col-start-4 lg:col-end-7 lg:row-start-1 lg:row-end-3' />

        <div className='col-start-1 col-end-3 row-start-3 row-end-7 flex min-h-0 flex-col rounded-md border border-border shadow lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:row-end-3'>
          <Typography
            variant='h4'
            className='p-2 pr-3 text-base font-normal lg:text-xl'
          >
            GCI
          </Typography>

          <div className='h-full w-full'>
            <GCILineChart />
          </div>
        </div>

        <div className='col-start-1 col-end-3 row-start-7 row-end-11 flex min-h-0 flex-col rounded-md border border-border shadow lg:col-start-1 lg:col-end-10 lg:row-start-3 lg:row-end-7'>
          <Typography
            variant='h4'
            className='p-2 pl-4 text-base font-normal lg:text-xl'
          >
            Sales Volume
          </Typography>
          <div className='h-full w-full'>
            <SalesVolumeChart />
          </div>
        </div>

        <ListToSaleRatioCard className='row-start-11 row-end-13 grid place-items-center rounded-md border border-border shadow lg:col-start-10 lg:col-end-13 lg:row-start-3 lg:row-end-5' />

        <TimeToCloseCard className='row-start-11 row-end-13 grid place-items-center rounded-md border border-border shadow lg:col-start-10 lg:col-end-13 lg:row-start-5 lg:row-end-7' />
      </div>
    </div>
  );
}
