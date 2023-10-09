// from: https://github.com/alan2207/react-query-auth/blob/master/src/index.tsx
// had issue preventing default onError cb from firing in queryConfig

import { useNavigate } from 'react-router-dom';

import { getMe, signin, signup, signout } from '@/features/auth';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type {
  SignInFields,
  SignUpFields,
} from '@/features/auth/components/AuthForm';
import type { User } from '@/types';

const userFn = async (): Promise<User | undefined> => {
  const { user } = await getMe();
  return user;
};

const loginFn = async (
  credentials: SignInFields
): Promise<User | undefined> => {
  const { user } = await signin(credentials);
  return user;
};

const registerFn = async (
  credentials: SignUpFields
): Promise<User | undefined> => {
  const { user } = await signup(credentials);
  return user;
};

const logoutFn = async (): Promise<void> => {
  await signout();
};

export const useUser = (): UseQueryResult<User | undefined, unknown> => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userFn,
    retry: 0,
    staleTime: 30 * 60 * 1000, // 30 min

    onSuccess: () => undefined,
    onError: () => undefined,
  });
};

export const useLogin = (): UseMutationResult<
  User | undefined,
  unknown,
  SignInFields,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      navigate('/dashboard');
    },
  });
};

export const useRegister = (): UseMutationResult<
  User | undefined,
  unknown,
  SignUpFields,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerFn,
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      navigate('/dashboard');
    },
  });
};

export const useLogout = (): UseMutationResult<
  void,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      queryClient.clear();
      navigate('/auth/signin');
    },
  });
};
