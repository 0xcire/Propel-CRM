import { Typography } from '@/components/ui/typography';
import { SalesVolumeChart } from '../SalesVolumeChart';

export function AnalyticsPage(): JSX.Element {
  // try to replace dashboard layout with min-h-0

  return (
    <div className='flex h-full flex-col'>
      <h1 className='p-4 pb-0'>hey</h1>
      <div className=' grid h-full min-h-0 flex-1 grid-cols-12 grid-rows-6 gap-4 p-4'>
        <div className='col-start-1 col-end-4 row-start-1 row-end-3 rounded-md border shadow'>
          <Typography
            variant='h4'
            className='font-normal'
          >
            Total Volume
          </Typography>
          <Typography
            variant='p'
            className='text-2xl font-black'
          >
            $50,000,000
          </Typography>
          <Typography
            variant='p'
            className='text-sm'
          >
            up 50% from last month
          </Typography>
        </div>
        <div className='col-start-4 col-end-7 row-start-1 row-end-3 rounded-md border shadow'>
          AVG Days on Market
        </div>
        <div className='col-start-7 col-end-13 row-start-1 row-end-3 rounded-md border shadow'>
          GCI Graph
        </div>

        <div className='col-start-1 col-end-8 row-start-3 row-end-7 rounded-md border shadow'>
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
