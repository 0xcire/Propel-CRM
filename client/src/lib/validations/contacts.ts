import { z } from 'zod';
import { mobilePhone, name, verifyPassword } from './schema';

export const contactSchema = z.object({
  name: name,
  email: z.string().email(),
  phoneNumber: mobilePhone,
  address: z.string().min(12).max(255),
  verifyPassword: verifyPassword,
});
