import { useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';

import type { Toast } from '@/types';

const PasswordSchema = z.object({
  verifyPassword: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

type PasswordFields = z.infer<typeof PasswordSchema>;

export function Authentication(): JSX.Element {
  const [open, setOpen] = useState(false);
  const user = useUser();

  const { mutate, isLoading } = useUpdateAccount();

  const form = useForm<PasswordFields>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      verifyPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordIsConfirmed = (): boolean => {
    return form.getValues().password === form.getValues().confirmPassword;
  };

  function onSubmit(values: PasswordFields): Toast | void {
    if (!passwordIsConfirmed()) {
      return toast({
        description: 'Please confirm your new password correctly.',
      });
    }
    const data = {
      verifyPassword: values.verifyPassword,
      password: values.password,
    };
    mutate(
      { id: user.data?.id as number, data: data },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }
  return (
    <>
      <Typography variant='h3'>Password and Authentication</Typography>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button variant='outline'>Change Password</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and your new password.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <FormField
                  control={form.control}
                  name='verifyPassword'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }): JSX.Element => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                  isLoading={isLoading}
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
