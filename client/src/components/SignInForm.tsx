import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { SubmitHandler } from 'react-hook-form';
// import { useEffect } from 'react';

const signInSchema = z.object({
  Email: z.string().email(),
  Password: z.string(),
});

type SignInFields = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { toast } = useToast();

  const form = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      Email: '',
      Password: '',
    },
  });
  const formNotFilledIn = form.getValues().Password === '';

  const onSubmit: SubmitHandler<SignInFields> = (values: SignInFields) => {
    console.log(values);
    // based off api call
    const success = false;
    if (success) {
      // handle redirect to app here
      form.reset();
      return;
    } else {
      toast({
        description: 'Invalid Email or Password',
      });
    }
  };

  //   useEffect(() => {
  //     form.formState.isSubmitSuccessful && form.reset();
  //   }, [form]);

  return (
    <>
      <div className='mx-auto w-1/4'>
        <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
          Sign In
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-6 space-y-3'
          >
            <FormField
              control={form.control}
              name='Email'
              render={({ field }) => (
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
              name='Password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='password123'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='pointer-events-none' />
                </FormItem>
              )}
            />
            <Button
              disabled={formNotFilledIn}
              aria-disabled={formNotFilledIn}
              type='submit'
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
