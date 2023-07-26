import { useCallback } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/lib/react-query-auth';

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

import { Typography } from '@/components/ui/typography';
import { SubmitButton } from '@/components';
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

// TODO: create user/email form component
// TODO: create password form component

const UserInfoSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  verifyPassword: z.string(),
});

// TODO: add password valiation schema that can be shared across
const PasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

type UserInfoFields = z.infer<typeof UserInfoSchema>;
type PasswordFields = z.infer<typeof PasswordSchema>;

export function Profile(): JSX.Element {
  const user = useUser();
  const infoForm = useForm<UserInfoFields>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      username: user.data?.username,
      email: user.data?.email,
      verifyPassword: '',
    },
  });
  const passwordForm = useForm<PasswordFields>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
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

  function onSubmit(values: UserInfoFields | PasswordFields): void {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      {/* <ProfileContentWrapper>
        <UserInfo />
      </ProfileContentWrapper>
      <ProfileContentWrapper>
        <Password />
      </ProfileContentWrapper>
      <ProfileContentWrapper>
        <DeleteAccount />
      </ProfileContentWrapper> */}
      <div className='grid h-full w-full place-items-center xl:flex-1'>
        <div className='w-5/6 max-w-[500px] xl:w-5/12'>
          <Typography variant='h3'>My Account</Typography>
          <Form {...infoForm}>
            <form
              id='user-info'
              onSubmit={infoForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={infoForm.control}
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
                control={infoForm.control}
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
                      control={infoForm.control}
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
        </div>

        <div className='w-5/6 max-w-[500px] xl:w-5/12'>
          <Typography variant='h3'>Password and Authentication</Typography>

          {/* TODO: verify old password with stored. new and confirm need to match to enable submit btn */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>Change Password</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and your new password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <FormField
                      control={passwordForm.control}
                      name='oldPassword'
                      render={({ field }): JSX.Element => (
                        <FormItem>
                          <FormLabel>Old Password</FormLabel>
                          <FormControl>
                            <>
                              <Input
                                placeholder='password123'
                                {...field}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name='newPassword'
                      render={({ field }): JSX.Element => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <>
                              <Input
                                placeholder='password123'
                                {...field}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name='confirmPassword'
                      render={({ field }): JSX.Element => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <>
                              <Input
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
                    {/* TODO: change disabled if new and confirm are matching */}
                    <SubmitButton
                      isLoading={false}
                      disabled={false}
                      text='Save Changes'
                    />
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='w-5/6 max-w-[500px] xl:w-5/12'>
          <Typography variant='h3'>Account Removal</Typography>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* TODO: call mutation below */}
                <AlertDialogAction
                  onClick={(): void => console.log('youve been deleted')}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
