import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { useRegister } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import { name, signUpPassword, username } from '@/config';

import { Form } from '@/components/ui/form';
import { FormTextInput } from '@/components/FormTextInput';
import { useToast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';

import { SubmitButton } from '@/components';
import { isAPIError } from '@/utils/error';
import { fieldsAreDirty } from '@/utils/form-data';

const signUpSchema = z.object({
  name: name,
  username: username,
  email: z.string().email(),
  password: signUpPassword,
});

export type SignUpFields = z.infer<typeof signUpSchema>;

export function SignUpForm(): JSX.Element {
  const { toast } = useToast();
  const navigate = useNavigate();
  const register = useRegister({
    onSuccess: () => {
      queryClient.invalidateQueries(['authenticated-user']);
      navigate('/protected');
    },
    onError: (error) => {
      if (isAPIError(error)) {
        return toast({
          description: error.message,
        });
      }
    },
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  });

  const form = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const passwordIsDirty = fieldsAreDirty<SignUpFields>(form, 'password');

  const onSubmit: SubmitHandler<SignUpFields> = (values: SignUpFields) => {
    register.mutate(values);
  };

  return (
    <>
      <div className='mx-auto w-3/4 max-w-[500px]'>
        <Typography variant='h1'>Sign Up</Typography>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-6 space-y-3'
          >
            <FormTextInput<SignUpFields>
              name='name'
              placeholder='First M Last'
              control={form.control}
            />
            <FormTextInput<SignUpFields>
              name='username'
              placeholder='jdeere123'
              control={form.control}
            />
            <FormTextInput<SignUpFields>
              name='email'
              placeholder='email@email.com'
              control={form.control}
            />
            <FormTextInput<SignUpFields>
              name='password'
              placeholder='password123'
              type='password'
              control={form.control}
            />

            <SubmitButton
              text='Sign Up'
              disabled={!passwordIsDirty}
              isLoading={register.isLoading}
            />
          </form>
        </Form>
        <Link
          to='/auth/signin'
          className='text-sm text-slate-900'
        >
          Already have an account? Sign in here.
        </Link>
      </div>
    </>
  );
}
