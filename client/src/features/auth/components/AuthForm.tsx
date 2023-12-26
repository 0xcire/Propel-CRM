import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { signInSchema, signUpSchema } from '@/lib/validations/auth';

import { Form } from '@/components/ui/form';

import { TextInput } from '@/components/form/TextInput';
import { SubmitButton } from '@/components/SubmitButton';

import { fieldsAreDirty } from '@/utils/form-data';

import type { DeepPartial } from 'react-hook-form';
import type { FormMode } from '@/types';

interface AuthFormProps extends FormMode {
  onSubmit: (values: SignIn | SignUpFields) => void;
  defaultValues: DeepPartial<SignInFields | SignUpFields>;
}

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
          disabled={!passwordFilledIn}
          isLoading={isLoading}
        >
          {isCreate ? 'Sign Up': 'Sign In'}
        </SubmitButton>
      </form>
    </Form>
  );
}
