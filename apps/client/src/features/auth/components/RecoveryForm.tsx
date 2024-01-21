import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRecoverPassword } from '../hooks/useRecoverPassword';

import { recoverySchema } from '@/lib/validations/auth';

import { Form } from '@/components/ui/form';
import { Typography } from '@/components/ui/typography';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';

export type RecoveryFields = z.infer<typeof recoverySchema>;

export function RecoveryForm(): JSX.Element {
  const recoverPassword = useRecoverPassword();

  const form = useForm<RecoveryFields>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: RecoveryFields): void => {
    recoverPassword.mutate(values);
  };

  return (
    <div className='px-4'>
      <Typography variant='h1'>Account Recovery</Typography>
      <Typography
        variant='p'
        className='mt-1 text-sm'
      >
        Enter your email to start the password reset process.
      </Typography>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-6 space-y-3'
        >
          <TextInput
            control={form.control}
            name='email'
            placeholder='example@email.com'
          />
          <SubmitButton
            disabled={!form.formState.isDirty}
            isLoading={false}
          >
            Next
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
