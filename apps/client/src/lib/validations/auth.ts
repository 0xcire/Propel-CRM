import { z } from 'zod';
import { name, signUpPassword, username, verifyPassword } from './schema';

export const signUpSchema = z.object({
  name: name,
  username: username,
  email: z.string().email(),
  password: signUpPassword,
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: verifyPassword,
});

export const recoverySchema = z.object({
  email: z.string().email(),
});

export const passwordSchema = z.object({
  verifyPassword: verifyPassword,
  password: signUpPassword,
  confirmPassword: signUpPassword,
});
