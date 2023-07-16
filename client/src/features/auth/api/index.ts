import { API_URL } from '@/config';
import type { SignInFields as LoginCredentials } from '@/components/SignInForm';
import { SignUpFields } from '@/components/SignUpForm';

export type APIResponse = {
  message: string | undefined;
  user?: User;
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
): Promise<APIResponse> => {
  const data: APIResponse = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
};

export const getMe = async (): Promise<APIResponse> => {
  return fetch(`${API_URL}/user/me`).then(handleAPIResponse);
};

export const signin = async (
  credentials: LoginCredentials
): Promise<APIResponse> => {
  return fetch(`${API_URL}/auth/signin`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse);
};

export const signup = async (
  credentials: SignUpFields
): Promise<APIResponse> => {
  return fetch(`${API_URL}/auth/signup`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(credentials),
  }).then(handleAPIResponse);
};

export const signout = async (): Promise<Response> => {
  const response = await fetch(`${API_URL}/auth/signout`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: undefined,
  });
  return response;
};
