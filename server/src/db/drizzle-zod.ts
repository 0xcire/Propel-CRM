import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, contacts, tasks } from "../db/schema";
import { AnyZodObject, ZodEffects, z } from "zod";

// remove certain fields from createInserSchema(users)
// also extend because password is needed in req.body but not in user table

export const signupSchema = z
  .object({
    name: z.string().max(256),
    username: z.string().max(256),
    email: z.string().max(256),
    password: z.string().max(256),
  })
  .transform((user) => ({
    name: user.name.trim(),
    username: user.username.trim(),
    email: user.email.trim(),
    password: user.password.trim(),
  }));

const insert = createInsertSchema(users, {});

export const signinSchema = z
  .object({
    email: z.string().max(256),
    password: z.string().max(256),
  })
  .transform((user) => ({
    email: user.email.trim(),
    password: user.password.trim(),
  }));

// move this
// or just move entire file in middleware dir, makes more sense
export const cookieSchema = z
  .object({
    "propel-session": z.string().min(1),
  })
  .transform((cookie) => ({
    "propel-session": cookie["propel-session"].trim(),
  }));

export const schema = {
  body: signupSchema,
  cookies: cookieSchema,
};
