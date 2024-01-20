import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast';

import { Form } from '@/components/ui/form';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';
import { Typography } from '@/components/ui/typography';

const recoverySchema = z.object({
  email: z.string().email(),
});

type RecoveryFields = z.infer<typeof recoverySchema>;

export function RecoveryForm(): JSX.Element {
  const { toast } = useToast();

  const form = useForm<RecoveryFields>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: RecoveryFields): void => {
    console.log(values);
    // this should extracted to hook - useRecoverPassword or whatever
    // and the toast.description should be returned in res for all non error responses
    toast({
      title: 'Account Recovery',
      description: 'Incoming! Password reset email heading your way.',
    });
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
