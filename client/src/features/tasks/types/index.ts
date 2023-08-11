import { priorityOptions } from '@/config';
import type { BaseResponse } from '@/types';

export type Task = {
  id: number;
  createdAt: Date | undefined;
  userID: number | undefined;
  title: string;
  description: string | undefined;
  notes: string | undefined;
  dueDate: string | undefined;
  completed: boolean | undefined;
  status: 'completed' | 'in progress' | 'not started';
  priority: 'low' | 'medium' | 'high';
};

export type NewTask = Omit<Task, 'id' | 'createdAt'>;
export type Tasks = Array<Task>;

export interface TaskResponse extends BaseResponse {
  tasks: Tasks;
}

export type UpdateTaskParams = {
  id: number;
  data: Partial<NewTask>;
};

export type Priority = (typeof priorityOptions)[number];
