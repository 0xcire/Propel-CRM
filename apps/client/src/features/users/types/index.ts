export type UpdateFields = {
  verifyPassword?: string;
  username?: string;
  email?: string;
  password?: string;
};

export type UpdateAccountParams = {
  id: number;
  data: UpdateFields;
};
