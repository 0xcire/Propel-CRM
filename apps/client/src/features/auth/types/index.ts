import { z } from 'zod';
import { recoverySchema } from '@/lib/validations/auth';

export type { SignInFields, SignUpFields } from '../components/AuthForm';
export type RecoveryFields = z.infer<typeof recoverySchema>;
export type UpdateAccountFromRecoveryParams = {
  id: string;
  data: {
    password: string;
  };
};
