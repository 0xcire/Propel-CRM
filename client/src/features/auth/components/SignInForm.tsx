import { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { useLogin } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';

import { SubmitButton } from '@/components';
import { isAPIError } from '@/utils/error';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
  const formNotFilledIn = form.getValues().password === '';

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
            <FormField
              control={form.control}
              name='email'
              render={({ field }): ReactElement => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='email@email.domain'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }): ReactElement => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='password123'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='pointer-events-none' />
                </FormItem>
              )}
            />
            <SubmitButton
              text={'Sign In'}
              disabled={formNotFilledIn}
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
