// from: https://github.com/alan2207/react-query-auth/blob/master/src/index.tsx
// had issue preventing default onError cb from firing in queryConfig

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMe, signin, signup, signout } from '@/features/auth';

import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useQuery({
    queryKey: ['user'],
    queryFn: userFn,
    retry: false,
    staleTime: 30 * 60 * 1000, // 30 min
    onSuccess: (data) => {
      setUser(data);
    },
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
      navigate('/protected');
    },
    onError: () => undefined,
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
      navigate('/protected');
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
