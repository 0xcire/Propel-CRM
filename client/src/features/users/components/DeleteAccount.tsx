import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { useUser } from '@/lib/react-query-auth';
import { SubmitButton } from '@/components';

export function DeleteAccount(): JSX.Element {
  const user = useUser();
  const { mutate, isLoading } = useDeleteAccount();
  return (
    <>
      <Typography variant='h3'>Account Removal</Typography>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <SubmitButton
                text='Continue'
                isLoading={isLoading}
                onClick={(): void => mutate(user.data?.id as number)}
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
