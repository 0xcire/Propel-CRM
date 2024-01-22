import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateAccountFromRecovery } from '../hooks/useUpdateAccountFromRecovery';
import { useValidateRequestID } from '../hooks/useValidateRequestID';

import { passwordSchema } from '@/lib/validations/auth';

import { Form } from '@/components/ui/form';
import { Typography } from '@/components/ui/typography';
import { useToast } from '@/components/ui/use-toast';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';
import { BackButton } from '@/components/BackButton';

import { fieldsAreEqual } from '@/utils/form-data';

const resetPasswordSchema = passwordSchema.omit({
  verifyPassword: true,
});

type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
export function ResetPasswordForm(): JSX.Element {
  const { id } = useParams();
  const { mutate, isLoading } = useUpdateAccountFromRecovery();
  const { requestIDIsValid } = useValidateRequestID(id as string);

  const { toast } = useToast();

  const form = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFields): void => {
    if (
      !fieldsAreEqual(
        form.getValues().password,
        form.getValues().confirmPassword
      )
    ) {
      toast({
        title: 'Validation Error',
        description: "Make sure you've confirmed your new password correctly.",
      });
      return;
    }
    mutate({
      id: id as string,
      data: {
        password: values.password,
      },
    });
  };

  return (
    <div className='w-11/12 space-y-3 sm:w-3/4 lg:w-2/5 3xl:w-3/12'>
      <Typography variant='h1'>Password Reset</Typography>
      {/* thank you cal.com/auth/forgot-password/random-id */}
      <>
        {requestIDIsValid ? (
          <Form {...form}>
            <form
              className='space-y-3'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <TextInput
                name='password'
                type='password'
                control={form.control}
                placeholder='newpassword'
              />
              <TextInput
                label='confirm password'
                type='password'
                name='confirmPassword'
                control={form.control}
                placeholder='newpassword'
              />
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <BackButton />
                  <SubmitButton
                    size='sm'
                    isLoading={isLoading}
                  >
                    Save
                  </SubmitButton>
                </div>
                <Link
                  className='text-sm hover:underline'
                  to='/auth/signin'
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <p className='text-sm'>
              Looks like that request expired. Go back and enter the email
              associated with your account and we will send you another link to
              reset your password.{' '}
            </p>
            <div className='flex items-center gap-4'>
              <BackButton />
              <Link
                className='text-sm hover:underline'
                to='/auth/signin'
              >
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
