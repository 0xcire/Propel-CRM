import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/lib/react-query-auth';

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

const UserInfoSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  verifyPassword: z.string(),
});
type UserInfoFields = z.infer<typeof UserInfoSchema>;

export function UserInfo(): JSX.Element {
  const user = useUser();
  const form = useForm<UserInfoFields>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      username: user.data?.username,
      email: user.data?.email,
      verifyPassword: '',
    },
  });

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

  function onSubmit(values: UserInfoFields): void {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                      // id='username'
                      className='username-input'
                      disabled={true}
                      placeholder={user.data?.username}
                      {...field}
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
                      placeholder={user.data?.email}
                      disabled={true}
                      {...field}
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
          {/* TODO: change disabled based on either username or email changing */}
          <Dialog>
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
                  isLoading={false}
                  disabled={false}
                  text='Save Changes'
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <SubmitButton
              isLoading={false}
              disabled={true}
              text='Save Changes'
            /> */}
        </form>
      </Form>
    </>
  );
}
