// import { configureAuth } from 'react-query-auth';

import { getMe, signin, signup, signout } from '@/features/auth';

import type {
  SignInFields,
  SignUpFields,
} from '@/features/auth/components/AuthForm';
import type { User } from '@/types';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: just implement this myself, overwrite default onError to not display toast
// currently on initial page load toast displaying with: Session does not exist
// bad UX

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

// export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
//   configureAuth({
//     userFn,
//     loginFn,
//     registerFn,
//     logoutFn,
//   });

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
    // staleTime:
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

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: loginFn,
    onSuccess: async (data) => {
      //   setUser(data.user);
      queryClient.invalidateQueries(['user']);
      navigate('/protected');
      //   return queryClient.invalidateQueries(['user']);
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

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      setUser(data);
      //   queryClient.invalidateQueries(['user']);
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

  const setUser = useCallback(
    (data: User | undefined) => {
      queryClient.setQueryData(['user'], data);
    },
    [queryClient]
  );

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      // setUser(undefined);
      queryClient.clear();
      //   queryClient.invalidateQueries(['user']);
    },
  });
};
