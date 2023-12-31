import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { signUpPassword, verifyPassword } from '@/lib/validations/schema';

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
import { useToast } from '@/components/ui/use-toast';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';
import type { Toast } from '@/types';

const PasswordSchema = z.object({
  verifyPassword: verifyPassword,
  password: signUpPassword,
  confirmPassword: signUpPassword,
});

type PasswordFields = z.infer<typeof PasswordSchema>;

export function Authentication(): JSX.Element {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const { toast } = useToast();

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
          <Button
            className='mt-4'
            variant='outline'
          >
            Change Password
          </Button>
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
                <TextInput
                  name='verifyPassword'
                  type='password'
                  label='Old Password'
                  placeholder='oldpassword123'
                  control={form.control}
                />
                <TextInput
                  name='password'
                  type='password'
                  label='New Password'
                  placeholder='password123'
                  control={form.control}
                />
                <TextInput
                  name='confirmPassword'
                  type='password'
                  label='Confirm Password'
                  placeholder='password123'
                  control={form.control}
                />
              </div>
              <DialogFooter>
                <SubmitButton
                  isLoading={isLoading}
                  disabled={false}
                >
                  Save Changes
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
