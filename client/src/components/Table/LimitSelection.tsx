import { useSearchParams } from 'react-router-dom';

import { Typography } from '../ui/typography';
import { Select } from '../Select';

export function LimitSelection({
  className,
}: {
  className: string;
}): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className={className}>
      <Typography
        variant='p'
        className='text-sm'
      >
        Rows per page:
      </Typography>
      <Select
        className='mr-auto h-9 w-[70px]'
        defaultValue={searchParams.get('limit') ?? '10'}
        options={['10', '20', '30', '40', '50']}
        handleSelectChange={(val): void => {
          searchParams.set('limit', val);
          setSearchParams(searchParams);
        }}
      />
    </div>
  );
}
