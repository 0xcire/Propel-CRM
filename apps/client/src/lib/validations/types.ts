import { z } from 'zod';
import { passwordSchema } from './auth';

export type PasswordFields = z.infer<typeof passwordSchema>;
