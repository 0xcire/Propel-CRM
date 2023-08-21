import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { useLogin } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import { verifyPassword } from '@/config';

import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form';

import { useToast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';

import { SubmitButton } from '@/components';
import { isAPIError } from '@/utils/error';
import { fieldsAreDirty } from '@/utils/form-data';

const signInSchema = z.object({
  email: z.string().email(),
  password: verifyPassword,
});

export type SignInFields = z.infer<typeof signInSchema>;

export function SignInForm(): JSX.Element {
  const { toast } = useToast();
  const navigate = useNavigate();
  const login = useLogin({
    onSuccess: () => {
      queryClient.invalidateQueries(['authenticated-user']);
      navigate('/protected');
    },
    onError: (error) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
    },
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  });

  const form = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordIsDirty = fieldsAreDirty<SignInFields>(form, 'password');

  const onSubmit: SubmitHandler<SignInFields> = (values: SignInFields) => {
    login.mutate(values);
  };

  return (
    <>
      <div className='mx-auto w-3/4 max-w-[500px]'>
        <Typography variant='h1'>Sign In</Typography>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-6 space-y-3'
          >
            <TextInput
              name='email'
              placeholder='email@email.com'
              control={form.control}
            />
            <TextInput
              name='password'
              type='password'
              placeholder='password123'
              control={form.control}
            />
            <SubmitButton
              text={'Sign In'}
              disabled={!passwordIsDirty}
              isLoading={login.isLoading}
            />
          </form>
        </Form>
        <Link
          to='/auth/signup'
          className='text-sm text-slate-900'
        >
          No account yet? Sign up here.
        </Link>
      </div>
    </>
  );
}
