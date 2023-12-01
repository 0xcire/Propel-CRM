import { z } from 'zod';
import { priorityOptions } from '@/config/tasks';

export const taskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.union([z.string().max(255), z.undefined()]),
  notes: z.union([z.string().max(255), z.undefined()]),
  dueDate: z.union([z.date(), z.undefined()]),
  priority: z.union([z.enum(priorityOptions), z.undefined()]),
});

export const checkboxSchema = z.object({
  completed: z.boolean(),
});
