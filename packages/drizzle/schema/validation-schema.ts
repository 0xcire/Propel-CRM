import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";
import { users, contacts, tasks, listings } from "../schema";

import isEmail from "validator/lib/isEmail";

const password = z.object({ password: z.string().max(255) });

const verifyPassword = z.object({
  verifyPassword: z.string().max(255),
});

const authCookieSchema = z.object({
  "idle-propel-session": z.union([z.string().min(1), z.undefined()]),
  "absolute-propel-session": z.union([z.string().min(1), z.undefined()]),
});

export const authCookieValidator = authCookieSchema.transform((schema) => ({
  "idle-propel-session": schema["idle-propel-session"]?.trim(),
  "absolute-propel-session": schema["absolute-propel-session"]?.trim(),
}));

export const paramSchema = z
  .object({
    id: z.string(),
  })
  .transform((param) => ({
    id: param.id.trim(),
  }));

export const paginationSchema = z.object({
  limit: z.enum(["10", "20", "30", "40", "50"]),
  page: z.string(),
});

const listingIDSchema = z.object({
  listingID: z.string(),
});

const contactIDSchema = z.object({
  contactID: z.string(),
});

const taskIDSchema = z.object({
  taskID: z.string(),
});

export const listingIDValidator = listingIDSchema.transform((schema) => ({
  listingID: schema.listingID.trim(),
}));

export const contactIDValidator = contactIDSchema.transform((schema) => ({
  contactID: schema.contactID.trim(),
}));

export const taskIDValidator = taskIDSchema.transform((schema) => ({
  taskID: schema.taskID.trim(),
}));

export const listingAndContactIDValidator = listingIDSchema.merge(contactIDSchema).transform((schema) => ({
  listingID: schema.listingID.trim(),
  contactID: schema.contactID.trim(),
}));

export const accountRecoveryValidator = z
  .object({
    email: z.string().email(),
  })
  .transform((schema) => ({
    email: schema.email.trim(),
  }));

export const signupValidator = createInsertSchema(users)
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
    passwrd: user.password.trim(),
  }));

export const updateUserValidator = createInsertSchema(users)
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

export const signinValidator = createInsertSchema(users)
  .pick({
    email: true,
  })
  .merge(password)
  .refine(({ email }) => isEmail(email))
  .transform((user) => ({
    email: user.email.trim(),
    password: user.password.trim(),
  }));

const contactQuerySchema = paginationSchema;

export const contactSearchQuerySchema = contactQuerySchema.partial().merge(
  z.object({
    name: z.string(),
  })
);

export const contactQueryValidator = contactQuerySchema.transform((schema) => ({
  page: schema.page.trim(),
  limit: schema.limit.trim(),
}));

export const contactSearchQueryValidator = contactSearchQuerySchema.transform((schema) => ({
  page: schema.page?.trim(),
  limit: schema.limit?.trim(),
  name: schema.name.trim(),
}));

export const createContactValidator = createInsertSchema(contacts, {
  name: (schema) => schema.name.trim(),
  email: (schema) => schema.email.trim(),
  phoneNumber: (schema) => schema.phoneNumber.trim(),
  address: (schema) => schema.address.trim(),
}).omit({
  id: true,
  createdAt: true,
});

export const updateContactValidator = createInsertSchema(contacts, {
  name: (schema) => schema.name.trim(),
  email: (schema) => schema.email.trim(),
  phoneNumber: (schema) => schema.phoneNumber.trim(),
  address: (schema) => schema.address.trim(),
})
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

const taskQuerySchema = z
  .object({
    completed: z.enum(["true", "false"]),
    priority: z.union([z.string(), z.undefined()]),
  })
  .merge(paginationSchema);

export const dashboardTaskQueryValidator = taskQuerySchema
  .pick({
    completed: true,
  })
  .transform((schema) => ({
    completed: schema.completed.trim(),
  }));

const taskQuerySearchSchema = taskQuerySchema.merge(
  z.object({
    title: z.string(),
  })
);

export const taskQueryValidator = taskQuerySchema.transform((schema) => ({
  completed: schema.completed.trim(),
  priority: schema.priority?.trim(),
  page: schema.page.trim(),
  limit: schema.limit.trim(),
}));

export const taskQuerySearchValidator = taskQuerySearchSchema.transform((schema) => ({
  completed: schema.completed.trim(),
  priority: schema.priority?.trim(),
  page: schema.page.trim(),
  limit: schema.limit.trim(),
  title: schema.title.trim(),
}));

const createTaskSchema = createInsertSchema(tasks);

export const createTaskValidator = createTaskSchema
  .omit({ id: true, userID: true, completed: true, createdAt: true })
  .partial()
  .refine(({ title }) => title && title.length > 0)
  .transform((schema) => ({
    title: schema.title?.trim(),
    description: schema.description?.trim(),
    notes: schema.notes?.trim(),
    dueDate: schema.dueDate?.trim(),
    priority: schema.priority?.trim(),
  }));

export const updateTaskValidator = createTaskSchema
  .omit({ id: true, userID: true, createdAt: true })
  .partial()
  .transform((schema) => ({
    title: schema.title?.trim(),
    description: schema.description?.trim(),
    notes: schema.notes?.trim(),
    dueDate: schema.dueDate?.trim(),
    completed: schema.completed?.valueOf(),
    priority: schema.priority?.trim(),
  }));

export const createListingSchema = createInsertSchema(listings, {
  address: (listings) => listings.address.trim(),
  description: (listings) => listings.description.trim(),
  propertyType: (listings) => listings.propertyType.trim(),
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
  price: (listings) => listings?.price.trim(),
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

export const listingQuerySchema = z
  .object({
    status: z.enum(["active", "sold"]),
  })
  .merge(paginationSchema);

export const listingSearchQuerySchema = listingQuerySchema.merge(
  z.object({
    address: z.string(),
  })
);

export const listingQueryValidator = listingQuerySchema.transform((schema) => ({
  page: schema.page.trim(),
  limit: schema.limit.trim(),
  status: schema.status.trim(),
}));

export const listingSearchQueryValidator = listingSearchQuerySchema.transform((schema) => ({
  page: schema.page.trim(),
  limit: schema.limit.trim(),
  status: schema.status.trim(),
  address: schema.address.trim(),
}));

export const analyticsQuerySchema = z
  .object({
    year: z.string(),
  })
  .transform((analytics) => ({
    year: analytics.year.trim(),
  }));
