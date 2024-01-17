import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

export function CompletedToggle(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const completed = searchParams.get('completed');

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={(): void => {
        searchParams.set('page', '1');
        searchParams.set('completed', completed === 'true' ? 'false' : 'true');
        setSearchParams(searchParams);
      }}
    >
      {completed === 'true' ? 'Hide Completed' : 'Show Completed'}
    </Button>
  );
}
