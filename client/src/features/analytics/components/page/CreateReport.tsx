import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreateReport(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Report</DialogTitle>
          <DialogDescription>Coming Soon!</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
