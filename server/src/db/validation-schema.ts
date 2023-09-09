import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, contacts, tasks, listings } from "./schema";
import { z } from "zod";
import isEmail from "validator/lib/isEmail.js";

// TODO:
// user-validation
// task-validation
// contact-validation
// listing-validation
// analytics-validation

const password = z.object({ password: z.string().max(255) });

const verifyPassword = z.object({
  verifyPassword: z.string().max(255),
});

// TODO: cookie and param schema may become more specific in future but for now can stay here
export const cookieSchema = z
  .object({
    "propel-session": z.string().min(1).endsWith("=="),
  })
  .transform((cookie) => ({
    "propel-session": cookie["propel-session"].trim(),
  }));

export const paramSchema = z
  .object({
    id: z.string(),
  })
  .transform((param) => ({
    id: param.id.trim(),
  }));

export const signupSchema = createInsertSchema(users)
  .pick({
    name: true,
    username: true,
    email: true,
  })
  .merge(password)
  .refine(({ email }) => isEmail(email))
  .transform((user) => ({
    name: user.name.trim(),
    username: user.username.trim(),
    email: user.email.trim(),
    password: user.password.trim(),
  }));

export const updateUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
  })
  .merge(password)
  .partial()
  .merge(verifyPassword)
  .refine(({ email }) => (email ? isEmail(email) : true))
  .transform((user) => ({
    username: user.username?.trim(),
    email: user.email?.trim(),
    password: user.password?.trim(),
    verifyPassword: user.verifyPassword.trim(),
  }));

export const signinSchema = createInsertSchema(users)
  // .strict()
  .pick({
    email: true,
  })
  .merge(password)
  .refine(({ email }) => isEmail(email))
  .transform((user) => ({
    email: user.email.trim(),
    password: user.password.trim(),
  }));

export const createContactSchema = createInsertSchema(contacts)
  .omit({
    id: true,
    createdAt: true,
  })
  .transform((contact) => ({
    name: contact.name.trim(),
    email: contact.email.trim(),
    phoneNumber: contact.phoneNumber.trim(),
    address: contact.address.trim(),
  }));

export const updateContactSchema = createInsertSchema(contacts)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial()
  .transform((contact) => ({
    name: contact.name?.trim(),
    email: contact.email?.trim(),
    phoneNumber: contact.phoneNumber?.trim(),
    address: contact.address?.trim(),
  }));

export const taskQuerySchema = z
  .object({
    completed: z.enum(["true", "false"]),
  })
  .transform((task) => ({
    completed: task.completed.trim(),
  }));

export const createTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, userID: true, completed: true, createdAt: true })
  .partial()
  .refine(({ title }) => title && title?.length > 0)
  .transform((task) => ({
    title: task.title?.trim(),
    description: task.description?.trim(),
    notes: task.notes?.trim(),
    dueDate: task.dueDate?.trim(),
    priority: task.priority,
  }));

export const updateTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, userID: true, createdAt: true })
  .partial()
  // .refine(({ completed }) => (completed ? completed instanceof Boolean : true))
  .transform((task) => ({
    title: task.title?.trim(),
    description: task.description?.trim(),
    notes: task.notes?.trim(),
    dueDate: task.dueDate?.trim(),
    completed: task.completed,
    priority: task.priority?.trim(),
  }));

// TODO: unknowingly created schemas based on old package, go back and rewrite to match below
export const createListingSchema = createInsertSchema(listings, {
  address: (listings) => listings.address.trim(),
  description: (listings) => listings.description.trim(),
  propertyType: (listings) => listings.propertyType.trim(),
  // price: (listings) => listings.price.transform((v) => +v),
  // TODO: address price
  price: (listings) => listings.price.trim(),
  bedrooms: (listings) => listings.bedrooms.nonnegative().int().finite(),
  baths: (listings) => listings.baths.positive(),
  squareFeet: (listings) => listings.squareFeet.positive().int().finite(),
}).omit({
  id: true,
  userID: true,
  createdAt: true,
});

export const updateListingSchema = createInsertSchema(listings, {
  address: (listings) => listings?.address.trim(),
  description: (listings) => listings?.description.trim(),
  propertyType: (listings) => listings?.propertyType.trim(),
  // price: (listings) => listings.price.transform((v) => +v),
  // TODO: address price
  price: (listings) => listings?.price,
  bedrooms: (listings) => listings?.bedrooms.nonnegative().int().finite(),
  baths: (listings) => listings?.baths.positive(),
  squareFeet: (listings) => listings?.squareFeet.positive().int().finite(),
})
  .omit({
    id: true,
    createdAt: true,
    userID: true,
  })
  .partial()
  .strict();
