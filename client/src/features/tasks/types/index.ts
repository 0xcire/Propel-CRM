import type { BaseResponse } from '@/types';

type Task = {
  id: number;
  createdAt: Date | null;
  userID: number | null;
  title: string;
  description: string | null;
  notes: string | null;
  dueDate: Date | null;
  completed: boolean | null;
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
