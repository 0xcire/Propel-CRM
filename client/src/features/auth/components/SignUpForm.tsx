import { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { useRegister } from '@/lib/react-query-auth';
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

const signUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Must be greater than 8 characters',
  }),
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
  const formNotFilledIn = form.getValues().password === '';

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
            <FormField
              control={form.control}
              name='name'
              render={({ field }): ReactElement => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John Deere'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }): ReactElement => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='jdeere123'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              text='Sign Up'
              disabled={formNotFilledIn}
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