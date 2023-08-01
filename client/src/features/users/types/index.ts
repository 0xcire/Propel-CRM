type UpdateFields = {
  verifyPassword?: string;
  username?: string;
  email?: string;
  password?: string;
};

export type UpdateAccountOptions = {
  id: number;
  data: UpdateFields;
};
