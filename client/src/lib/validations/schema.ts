import { z } from 'zod';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

export const username = z.string().min(3).max(24);

export const name = z
  .string()
  .refine(
    (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
    'Name can only contain letters'
  )
  .refine(
    (value) => /^[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)?$/.test(value),
    'Please enter your full name as First M Last.'
  );

export const mobilePhone = z
  .string()
  .refine(
    (value) => isMobilePhone(value, 'en-US'),
    'Be sure your number starts with a valid US area code. Ex. 617-555-5555'
  );

export const year = z.string().refine((value) => /[0-9]{4}/.test(value));

export const priceString = z
  .string()
  .min(6)
  .max(12)
  .refine((value) => /[0-9]+/.test(value));

export const verifyPassword = z.string().min(8).max(255);

export const signUpPassword = z
  .string()
  .min(8, {
    message: 'Must be greater than 8 characters',
  })
  .max(255, {
    message: 'Password must be between 8 and 255 characters.',
  })
  .refine(
    (value) => /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(value),
    'Password must contain one number and one special character.'
  );
