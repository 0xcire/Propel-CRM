import type { BaseResponse } from '@/types';

export type Task = {
  id: number;
  createdAt: Date | undefined;
  userID: number | undefined;
  listingID?: number | undefined;
  contactID?: number | undefined;
  title: string;
  description: string | undefined;
  notes: string | undefined;
  dueDate: string | undefined;
  completed?: boolean | undefined;
  priority: 'low' | 'medium' | 'high' | undefined;
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

export type TaskContext = {
  previousTasks: Tasks | undefined;
};
