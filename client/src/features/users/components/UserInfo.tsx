import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/lib/react-query-auth';
import { useUpdateAccount } from '../hooks/useUpdateAccount';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { filterFields } from '@/utils/form-data';

const UserInfoSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  verifyPassword: z.string(),
});
type UserInfoFields = z.infer<typeof UserInfoSchema>;

export function UserInfo(): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();

  const { mutate, isLoading } = useUpdateAccount();
  const form = useForm<UserInfoFields>({
    resolver: zodResolver(UserInfoSchema),
  });

  const userHasChangedInfo = Object.keys(form.formState.dirtyFields).some(
    (field) => field === 'username' || field === 'email'
  );

  const handleEditToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const previousInput = e.currentTarget
        .previousElementSibling as HTMLInputElement;
      const isDisabled = previousInput?.disabled;

      previousInput.disabled = !isDisabled;
    },
    []
  );

  useEffect(() => {
    form.setValue('username', user.data?.username as string);
    form.setValue('email', user.data?.email as string);
  }, []);

  function onSubmit(values: UserInfoFields): void {
    // const data = Object.fromEntries(
    //   Object.entries(values).filter(([key, value]) => {
    //     if (user.data) {
    //       return value !== user.data[key as keyof typeof user.data];
    //     }
    //   })
    // );

    let data;
    if (user.data) {
      data = filterFields({ newData: values, originalData: user.data });
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
          <FormField
            control={form.control}
            name='username'
            render={({ field }): JSX.Element => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-8'>
                    <Input
                      disabled={true}
                      {...field}
                      value={field.value ?? user.data?.username}
                    />
                    <Button
                      variant='default'
                      onClick={(e): void => handleEditToggle(e)}
                    >
                      Edit
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }): JSX.Element => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-8'>
                    <Input
                      disabled={true}
                      {...field}
                      value={field.value ?? user.data?.email}
                    />
                    <Button
                      variant='default'
                      onClick={(e): void => handleEditToggle(e)}
                    >
                      Edit
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormField
                  control={form.control}
                  name='verifyPassword'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type='password'
                            placeholder='password123'
                            {...field}
                            value={field.value ?? ''}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <SubmitButton
                  form='user-info'
                  isLoading={isLoading}
                  disabled={!userHasChangedInfo}
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
