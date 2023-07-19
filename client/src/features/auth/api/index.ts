import type { SigninCredentials, SignupCredentials } from '@/features/auth';
import { Get, Post } from '@/lib/fetch';

export type APIResponse = {
  message: string | undefined;
  user?: User;
};

export type APIError = {
  message: string;
  status: number;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  lastLogin?: Date | null;
};

export const handleAPIResponse = async (
  response: Response
): Promise<APIResponse | APIError> => {
  const data: APIResponse = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw {
      message: data.message,
      status: response.status,
    };
  }
};

export const getMe = async (): Promise<APIResponse> => {
  return Get({ endpoint: 'user/me' }).then(handleAPIResponse);
};

export const signin = async (
  credentials: SigninCredentials
): Promise<APIResponse> => {
  return Post({
    endpoint: 'auth/signin',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse);
};

export const signup = async (
  credentials: SignupCredentials
): Promise<APIResponse> => {
  return Post({
    endpoint: 'auth/signup',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse);
};

export const signout = async (): Promise<Response> => {
  const response = await Post({
    endpoint: 'auth/signout',
    body: undefined,
  });
  return response;
};
