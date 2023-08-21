import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/lib/react-query-auth';
import { useUpdateAccount } from '../hooks/useUpdateAccount';

import { username, verifyPassword } from '@/config';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubmitButton } from '@/components';
import { fieldsAreDirty, filterEqualFields } from '@/utils/form-data';

const UserInfoSchema = z.object({
  username: username,
  email: z.string().email(),
  verifyPassword: verifyPassword,
});
type UserInfoFields = z.infer<typeof UserInfoSchema>;

export function UserInfo(): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();

  const { mutate, isLoading } = useUpdateAccount();
  const form = useForm<UserInfoFields>({
    resolver: zodResolver(UserInfoSchema),
  });

  const userFieldsAreEmpty = fieldsAreDirty<UserInfoFields>(form, [
    'username',
    'email',
  ]);

  const handleEditToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const previousEl = e.currentTarget.previousElementSibling
        ?.children[1] as HTMLInputElement;
      const isDisabled = previousEl?.disabled;

      previousEl.disabled = !isDisabled;
    },
    []
  );

  useEffect(() => {
    form.setValue('username', user.data?.username as string);
    form.setValue('email', user.data?.email as string);
  }, [form, user.data]);

  function onSubmit(values: UserInfoFields): void {
    let data;
    if (user.data) {
      data = filterEqualFields({ newData: values, originalData: user.data });
    }

    // TODO: fix this Record<string, string> type
    mutate(
      { id: user.data?.id as number, data: data as Record<string, string> },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          form.setValue('verifyPassword', '');
        },
      }
    );
  }
  return (
    <>
      <Typography variant='h3'>My Account</Typography>
      <Form {...form}>
        <form
          id='user-info'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='input-wrap flex items-end justify-between gap-8'>
            <TextInput
              name='username'
              disabled={true}
              control={form.control}
            />
            <Button onClick={(e): void => handleEditToggle(e)}>Edit</Button>
          </div>

          <div className='input-wrap flex items-end justify-between gap-8'>
            <TextInput
              name='email'
              disabled={true}
              control={form.control}
            />
            <Button onClick={(e): void => handleEditToggle(e)}>Edit</Button>
          </div>

          <Dialog
            open={open}
            onOpenChange={setOpen}
          >
            <DialogTrigger asChild>
              <Button variant='outline'>Save Changes</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Verify Password</DialogTitle>
                <DialogDescription>
                  Enter your current password to save changes.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <TextInput
                  placeholder='password123'
                  label='Verify Password'
                  type='password'
                  name='verifyPassword'
                  control={form.control}
                />
              </div>
              <DialogFooter>
                <SubmitButton
                  form='user-info'
                  isLoading={isLoading}
                  disabled={!userFieldsAreEmpty}
                  text='Save Changes'
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
}
