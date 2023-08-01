import { configureAuth } from 'react-query-auth';

import { getMe, signin, signup, signout } from '@/features/auth';

import type { SignInFields as LoginCredentials } from '@/features/auth/components/SignInForm';
import type { SignUpFields as SignUpCredentials } from '@/features/auth/components/SignUpForm';
import type { User } from '@/types';

const userFn = async (): Promise<User | undefined> => {
  const { user } = await getMe();
  return user;
};

const loginFn = async (
  credentials: LoginCredentials
): Promise<User | undefined> => {
  const { user } = await signin(credentials);
  return user;
};

const registerFn = async (
  credentials: SignUpCredentials
): Promise<User | undefined> => {
  const { user } = await signup(credentials);
  return user;
};

const logoutFn = async (): Promise<void> => {
  await signout();
};

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth({
    userFn,
    loginFn,
    registerFn,
    logoutFn,
  });
