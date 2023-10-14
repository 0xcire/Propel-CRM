import { useSearchParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useSalesYears } from '../../hooks/useSalesYears';

import { Select } from '@/components/Select';

import { Spinner } from '@/components';

export function YearSelection(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUser();
  const years = useSalesYears(user.data?.id as number);

  const onSelectChange = (val: string): void => {
    searchParams.set('year', val);
    setSearchParams(searchParams);
  };

  if (years.isInitialLoading) {
    return <Spinner variant='md' />;
  }
  return (
    <Select
      handleSelectChange={(val): void => onSelectChange(val)}
      options={(years.data as ReadonlyArray<string>) ?? ['No available data.']}
      placeholder='Select year'
    />
  );
}
