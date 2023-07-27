// import { APIResponse } from '@/features/auth';
import type { User } from '@/features/auth';
import { Patch, Delete, handleAPIResponse, APIError } from '@/lib/fetch';

type UpdateFields = {
  verifyPassword?: string;
  username?: string;
  email?: string;
  password?: string;
};

export type UserResponse = {
  message: string;
  user: User;
};

export type UpdateAccountOptions = {
  id: number;
  data: UpdateFields;
};

export const updateAccount = ({
  id,
  data,
}: UpdateAccountOptions): Promise<UserResponse | APIError> => {
  return Patch({
    endpoint: `user/${id}`,
    body: JSON.stringify(data),
  }).then(handleAPIResponse<UserResponse>);
};

// TODO: may be issues here reading response.json
export const deleteAccount = (id: number): Promise<Response> => {
  return Delete({ endpoint: `user/${id}` });
};
