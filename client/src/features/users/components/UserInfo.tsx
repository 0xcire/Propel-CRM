import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { username, verifyPassword } from '@/lib/validations/schema';

import { useUser } from '@/lib/react-query-auth';
import { useUpdateAccount } from '../hooks/useUpdateAccount';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { fieldsAreDirty, filterEqualFields } from '@/utils/form-data';

import type { User } from '@/types';
import type { UpdateFields } from '../types';

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
    defaultValues: {
      email: user.data?.email ?? '',
      username: user.data?.username ?? '',
      verifyPassword: '',
    },
  });

  const userFieldsAreEmpty = fieldsAreDirty<UserInfoFields>(form, [
    'username',
    'email',
  ]);

  const handleEditToggle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    const previousEl = e.currentTarget.previousElementSibling
      ?.children[1] as HTMLInputElement;
    const isDisabled = previousEl?.disabled;

    previousEl.disabled = !isDisabled;
  };

  function onSubmit(values: UserInfoFields): void {
    const data: UpdateFields = filterEqualFields({
      newData: values,
      originalData: user.data as User,
    });

    mutate(
      { id: user.data?.id as number, data: data },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
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
          <div className='input-wrap flex items-end justify-between gap-4'>
            <TextInput
              name='username'
              disabled={true}
              control={form.control}
            />
            <Button onClick={(e): void => handleEditToggle(e)}>Edit</Button>
          </div>

          <div className='input-wrap flex items-end justify-between gap-4'>
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
              <Button
                className='mt-4'
                variant='outline'
              >
                Save Changes
              </Button>
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
                >
                  Save Changes
                </SubmitButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
}
