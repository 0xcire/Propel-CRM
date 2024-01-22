import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { passwordSchema } from '@/lib/validations/auth';

import { Form } from '@/components/ui/form';
import { Typography } from '@/components/ui/typography';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';
import { BackButton } from '@/components/BackButton';

const resetPasswordSchema = passwordSchema.omit({
  verifyPassword: true,
});

type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
export function ResetPasswordForm(): JSX.Element {
  const { id } = useParams();
  console.log('reset request id', id);

  const validRequest = true;

  const form = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFields): void => {
    console.log(values);
  };

  // const resetRequest = useResetRequest(id)
  return (
    <div className='w-11/12 space-y-3 sm:w-3/4 lg:w-2/5 3xl:w-3/12'>
      <Typography variant='h1'>Password Reset</Typography>
      {/* thank you cal.com/auth/forgot-password/random-id */}
      <>
        {validRequest ? (
          <Form {...form}>
            <form
              className='space-y-3'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <TextInput
                name='password'
                control={form.control}
                placeholder='newpassword'
              />
              <TextInput
                label='confirm password'
                name='confirmPassword'
                control={form.control}
                placeholder='newpassword'
              />
              <div className='flex items-center gap-2'>
                <BackButton />
                <SubmitButton
                  size='sm'
                  isLoading={false}
                >
                  Save
                </SubmitButton>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <p>
              Looks like that request expired. Go back and enter the email
              associated with your account and we will send you another link to
              reset your password.{' '}
            </p>
            <BackButton />
          </>
        )}
      </>
    </div>
  );
}
