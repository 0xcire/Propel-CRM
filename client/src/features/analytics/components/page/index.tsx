import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useSalesVolume } from '../../hooks/useSalesVolume';
import { useAvgDaysOnMarket } from '../../hooks/useAvgDaysOnMarket';

import { useAnalyticsContext } from '../../context/AnalyticsContext';

import { Typography } from '@/components/ui/typography';

import { SalesVolumeChart } from '../SalesVolumeChart';
import { GCILineChart } from '../GCILineChart';

import { Spinner } from '@/components';
import { Select } from '@/components/Select';
import { YearSelection } from './YearSelection';

import { currency } from '@/utils/intl';
import { filterAnalyticsData } from '../../utils';

import type { SalesVolumes } from '../../types';

// try to replace dashboard layout with min-h-0

// replace @/components/dashboard as just grid<X>...

const quarters = ['YTD', 'Q1', 'Q2', 'Q3', 'Q4'] as const;
export type Quarters = (typeof quarters)[number];

export function AnalyticsPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUser();
  const { state: currentTimeFrame, setState: setCurrentTimeFrame } =
    useAnalyticsContext();

  const salesVolume = useSalesVolume(user.data?.id as number);
  const avgDays = useAvgDaysOnMarket(user.data?.id as number);

  const average = (): string => {
    if (avgDays.data) {
      const filteredAverageDaysData = filterAnalyticsData(
        avgDays.data,
        currentTimeFrame
      );
      return Math.floor(
        filteredAverageDaysData
          .map((data) => +(data.average.split(' ')[0] as string))
          .reduce((previous, current) => previous + current, 0) /
          filteredAverageDaysData.length
      ).toString();
    }
    return 'no data yet';
  };

  const handleSelectChange = (val: string): void => {
    setCurrentTimeFrame(val as Quarters);
  };

  const totalYTDSalesVolume = (): string => {
    const total = 0;

    const filteredSalesVolumeData = filterAnalyticsData(
      salesVolume.data as SalesVolumes,
      currentTimeFrame
    );

    const sum = filteredSalesVolumeData?.reduce(
      (acc, { volume: currentVolume }) => acc + +currentVolume,
      total
    );

    return currency.format(sum as number);
  };

  useEffect(() => {
    searchParams.set('year', new Date().getFullYear().toString());
    setSearchParams(searchParams, {
      replace: true,
    });

    //eslint-disable-next-line
  }, []);

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between p-4 pb-0'>
        <Typography
          variant='h4'
          className=''
        >
          Showing YTD Results
        </Typography>
        <div className='flex items-center gap-2'>
          <YearSelection />
          <Select
            placeholder='Filter by quarter'
            options={quarters}
            handleSelectChange={(val): void => handleSelectChange(val)}
            className='w-full'
          />
        </div>
      </div>

      <div className=' grid h-full min-h-0 flex-1 grid-cols-12 grid-rows-6 gap-4 p-4'>
        <div className='col-start-1 col-end-4 row-start-1 row-end-3 grid place-items-center rounded-md border shadow'>
          <div>
            <Typography
              variant='h4'
              className='text-base font-normal'
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
                {average() as string}
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
          <Typography
            variant='h4'
            className='p-2'
          >
            YTD Listing Sales
          </Typography>
          <Typography variant='p'>
            Listing ID, Listing Address, sold_to Contact Name. Link to Listing.
            Link to Contact
          </Typography>
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
