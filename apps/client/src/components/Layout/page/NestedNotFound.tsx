import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useNavigate } from 'react-router-dom';

type NestedNotFoundProps = {
  context: string;
};
export function NestedNotFound({ context }: NestedNotFoundProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className='grid h-full w-full place-items-center'>
      <div>
        <Typography variant='h4'>404! We can't find that {context}.</Typography>
        <Button
          className='mt-2'
          onClick={(): void => navigate(-1)}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
