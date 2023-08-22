import { type DeepPartial, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { name, signUpPassword, username, verifyPassword } from '@/config';
import { fieldsAreDirty } from '@/utils/form-data';
import { type FormMode } from '@/types';

interface AuthFormProps extends FormMode {
  isLoading: boolean;
  onSubmit: (values: SignIn | SignUpFields) => void;
  defaultValues: DeepPartial<SignInFields | SignUpFields>;
}

const signInSchema = z.object({
  email: z.string().email(),
  password: verifyPassword,
});

const signUpSchema = z.object({
  name: name,
  username: username,
  email: z.string().email(),
  password: signUpPassword,
});

export type SignInFields = z.infer<typeof signInSchema>;
type SignIn = {
  name: never;
  username: never;
} & SignInFields;
export type SignUpFields = z.infer<typeof signUpSchema>;

export function AuthForm({
  isCreate,
  isLoading,
  onSubmit,
  defaultValues,
}: AuthFormProps): JSX.Element {
  const form = useForm<SignIn | SignUpFields>({
    resolver: !isCreate ? zodResolver(signInSchema) : zodResolver(signUpSchema),
    defaultValues: defaultValues,
  });

  const passwordFilledIn = fieldsAreDirty<SignIn | SignUpFields>(
    form,
    'password'
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-6 space-y-3'
      >
        {isCreate && (
          <>
            <TextInput
              name='name'
              placeholder='First M Last'
              control={form.control}
            />
            <TextInput
              name='username'
              placeholder='jdeere123'
              control={form.control}
            />
          </>
        )}
        <TextInput
          name='email'
          placeholder='email@email.com'
          control={form.control}
        />
        <TextInput
          name='password'
          label='password'
          type='password'
          placeholder='password123'
          control={form.control}
        />
        <SubmitButton
          text={'Sign In'}
          disabled={!passwordFilledIn}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
