import { Get, Post, handleAPIResponse } from '@/lib/fetch';

import type { BaseResponse, UserResponse } from '@/types';
import type {
  RecoveryFields,
  SignInFields,
  SignUpFields,
} from '@/features/auth/types';

export const refreshSession = (): Promise<Response> => {
  return Get({ endpoint: 'user/refresh' });
};

export const getMe = async (): Promise<UserResponse> => {
  return Get({ endpoint: 'user/me' }).then(handleAPIResponse<UserResponse>);
};

export const signin = async (
  credentials: SignInFields
): Promise<UserResponse> => {
  return Post({
    endpoint: 'auth/signin',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse<UserResponse>);
};

export const signup = async (
  credentials: SignUpFields
): Promise<UserResponse> => {
  return Post({
    endpoint: 'auth/signup',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse<UserResponse>);
};

export const signout = async (): Promise<Response> => {
  const response = await Post({
    endpoint: 'auth/signout',
    body: undefined,
  });
  return response;
};

export const recoverPassword = async (
  email: RecoveryFields
): Promise<BaseResponse> => {
  return Post({
    endpoint: 'auth/recovery',
    body: JSON.stringify(email),
  }).then(handleAPIResponse<BaseResponse>);
};
