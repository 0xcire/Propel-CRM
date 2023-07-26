import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const PasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

type PasswordFields = z.infer<typeof PasswordSchema>;

export function Authentication(): JSX.Element {
  const passwordForm = useForm<PasswordFields>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: PasswordFields): void {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <>
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
    </>
  );
}
