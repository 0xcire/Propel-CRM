import { useSearchParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useSalesYears } from '../../hooks/useSalesYears';

import { Select, Spinner } from '@/components';

import { getCurrentYear } from '@/utils';

export function YearSelection(): JSX.Element | null {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUser();
  const years = useSalesYears(user.data?.id as number);

  const yearsAvailable = !!(years.data?.length && years.data?.length > 0);

  const onSelectChange = (val: string): void => {
    searchParams.set('year', val);
    setSearchParams(searchParams);
  };

  if (years.isInitialLoading) {
    return <Spinner variant='md' />;
  }

  return (
    <Select
      handleSelectChange={
        yearsAvailable ? (val): void => onSelectChange(val) : undefined
      }
      options={
        yearsAvailable
          ? (years.data as ReadonlyArray<string>)
          : ['No available data.']
      }
      defaultValue={getCurrentYear().toString()}
    />
  );
}
