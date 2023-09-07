// reimplementing https://github.com/alan2207/react-query-auth actions
// need some control over error behavior with useUser query

import { useCallback } from 'react';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getMe, signin, signout, signup } from '@/features/auth';
import type { User } from '@/types';
import { useNavigate } from 'react-router-dom';

import type { SignInFields, SignUpFields } from '@/features/auth/';

const userFn = async (): Promise<User | undefined> => {
  const { user } = await getMe();
  return user;
};

const signinFn = async (
  credentials: SignInFields
): Promise<User | undefined> => {
  const { user } = await signin(credentials);
  return user;
};

const signupFn = async (
  credentials: SignUpFields
): Promise<User | undefined> => {
  const { user } = await signup(credentials);
  return user;
};

const signoutFn = async (): Promise<void> => {
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
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => '',
  });
};

export const useSignIn = (): UseMutationResult<
  User | undefined,
  unknown,
  SignInFields,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: signinFn,
    onSuccess: async (data) => {
      //   setUser(data.user);
      queryClient.invalidateQueries(['user']);
      navigate('/protected');
      //   return queryClient.invalidateQueries(['user']);
    },
    onError: () => undefined,
  });
};

export const useSignUp = (): UseMutationResult<
  User | undefined,
  unknown,
  SignUpFields,
  unknown
> => {
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: signupFn,
    onSuccess: (data) => {
      setUser(data);
      //   queryClient.invalidateQueries(['user']);
    },
  });
};

export const useSignOut = (): UseMutationResult<
  void,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: signoutFn,
    onSuccess: () => {
      setUser(undefined);
      //   queryClient.invalidateQueries(['user']);
    },
  });
};
