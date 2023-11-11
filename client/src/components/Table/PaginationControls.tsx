import { useSearchParams } from 'react-router-dom';

import { Typography } from '../ui/typography';
import { Button } from '../ui/button';

import type { TableFooterProps } from './types';

export function PaginationControls({
  isLastPage,
}: TableFooterProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage: string = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '10';

  return (
    <div className='flex items-center gap-2'>
      <Typography
        variant='p'
        className='text-sm'
      >
        Page: {currentPage}
      </Typography>
      <Typography
        variant='p'
        className='text-sm'
      >
        {`${+currentPage * +limit - +limit + 1} - ${+currentPage * +limit}`}
      </Typography>
      <Button
        variant='outline'
        size='sm'
        onClick={(): void => {
          searchParams.set('page', (+currentPage - 1).toString());
          setSearchParams(searchParams);
        }}
        disabled={searchParams.get('page') === '1'}
      >
        Previous
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={(): void => {
          searchParams.set('page', (+currentPage + 1).toString());
          setSearchParams(searchParams);
        }}
        disabled={isLastPage}
      >
        Next
      </Button>
    </div>
  );
}
