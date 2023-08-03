import { Tooltip } from '@/components/Tooltip';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export function AddContact(): JSX.Element {
  return (
    <Tooltip content='Add new contact'>
      <Button>
        <UserPlus size={22} />
      </Button>
    </Tooltip>
  );
}
