import { useSearchParams } from 'react-router-dom';

import { DollarSignIcon, HomeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components';

export function StatusToggle(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Tooltip content='listing status'>
      <Button
        variant='outline'
        onClick={(): void => {
          const status = searchParams.get('status');
          searchParams.set('status', status === 'active' ? 'sold' : 'active');
          setSearchParams(searchParams);
        }}
      >
        {searchParams.get('status') === 'active' ? (
          <span className='flex items-center gap-1'>
            <HomeIcon size={16} />
            Active
          </span>
        ) : (
          <span className='flex items-center gap-1'>
            <DollarSignIcon size={16} /> Sold
          </span>
        )}
      </Button>
    </Tooltip>
  );
}
