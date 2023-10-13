// import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/lib/react-query-auth';

import { Typography } from '@/components/ui/typography';

import { SalesVolumeChart } from '../SalesVolumeChart';

import { currency } from '@/utils/intl';

import { AnalyticsDataResponse } from '../../types';
import { useAvgDaysOnMarket } from '../../hooks/useAvgDaysOnMarket';
import { GCILineChart } from '../GCILineChart';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { Spinner } from '@/components';

export function AnalyticsPage(): JSX.Element {
  // try to replace dashboard layout with min-h-0

  // replace @/components/dashboard as just grid<X>...

  // const queryClient = useQueryClient();
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);
  const avgDays = useAvgDaysOnMarket(user.data?.id as number);

  // const totalTotalTotal = useMemo(() => {
  //   const total = 0;

  //   const salesVolumeQueryData =
  //     queryClient.getQueryData<AnalyticsDataResponse>([
  //       'sales-volume',
  //       { userID: user.data?.id as number },
  //     ])?.analytics;

  //   const sum = salesVolumeQueryData?.reduce(
  //     (acc, { volume: currentVolume }) => acc + +currentVolume,
  //     total
  //   );

  //   return currency.format(sum as number);
  // }, [queryClient, user.data?.id]);

  const totalYTDSalesVolume = (): string => {
    const total = 0;

    // const salesVolumeQueryData =
    //   queryClient.getQueryData<AnalyticsDataResponse>([
    //     'sales-volume',
    //     { userID: user.data?.id as number },
    //   ])?.analytics;

    const sum = salesVolume.data?.reduce(
      (acc, { volume: currentVolume }) => acc + +currentVolume,
      total
    );

    return currency.format(sum as number);
  };

  return (
    <div className='flex h-full flex-col'>
      <h1 className='p-4 pb-0'>hey</h1>
      <div className=' grid h-full min-h-0 flex-1 grid-cols-12 grid-rows-6 gap-4 p-4'>
        <div className='col-start-1 col-end-4 row-start-1 row-end-3 grid place-items-center rounded-md border shadow'>
          <div>
            <Typography
              variant='h4'
              className='font-normal'
            >
              Total Volume
            </Typography>
            {salesVolume.isInitialLoading ? (
              <div className='grid h-full w-full place-items-center'>
                <Spinner
                  className='mx-auto'
                  variant='md'
                />
              </div>
            ) : (
              <Typography
                variant='p'
                className='text-2xl font-black'
              >
                {totalYTDSalesVolume()}
              </Typography>
            )}

            <Typography
              variant='p'
              className='text-sm text-gray-600'
            >
              up 50% from last month
            </Typography>
          </div>
        </div>
        <div className='col-start-4 col-end-7 row-start-1 row-end-3 grid place-items-center rounded-md border shadow'>
          <div className=''>
            <Typography
              variant='h4'
              className='text-base font-normal'
            >
              AVG Days on Market
            </Typography>
            {avgDays.isInitialLoading ? (
              <div className='grid h-full w-full place-items-center'>
                <Spinner
                  className='mx-auto'
                  variant='md'
                />
              </div>
            ) : (
              <Typography
                variant='p'
                className='text-2xl font-black'
              >
                {avgDays.data?.split('days')[0] as string}
              </Typography>
            )}

            <Typography
              variant='p'
              className='text-sm text-gray-600'
            >
              wow!
            </Typography>
          </div>
        </div>
        <div className='col-start-7 col-end-13 row-start-1 row-end-3 flex min-h-0 flex-col rounded-md border shadow'>
          <Typography
            variant='h4'
            className='p-2'
          >
            YTD GCI
          </Typography>
          <GCILineChart />
        </div>

        <div className='col-start-1 col-end-8 row-start-3 row-end-7 flex min-h-0 flex-col rounded-md border shadow'>
          <Typography
            variant='h4'
            className='p-2'
          >
            YTD Sales Volume
          </Typography>
          <SalesVolumeChart />
        </div>

        <div className='col-start-8 col-end-13 row-start-3 row-end-7 rounded-md border shadow'>
          Recent Listing Sales
        </div>
      </div>
    </div>
  );
}

// dashboard -> YTD Performance
// page
// YTD Performance
// Sales Volume
// GCI
// Avg Days on Market
