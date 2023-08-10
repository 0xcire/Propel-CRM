import { Get, Post, Patch, Delete, handleAPIResponse } from '@/lib/fetch';
import type { NewTask, TaskResponse, UpdateTaskParams } from '../types';

export const getTasks = (): Promise<TaskResponse> => {
  return Get({ endpoint: 'tasks' }).then(handleAPIResponse<TaskResponse>);
};

export const createTask = (data: Partial<NewTask>): Promise<TaskResponse> => {
  return Post({ endpoint: 'tasks', body: JSON.stringify(data) }).then(
    handleAPIResponse<TaskResponse>
  );
};

export const updateTask = ({
  id,
  data,
}: UpdateTaskParams): Promise<TaskResponse> => {
  return Patch({ endpoint: `tasks/${id}`, body: JSON.stringify(data) }).then(
    handleAPIResponse<TaskResponse>
  );
};

export const deleteTask = (id: number): Promise<TaskResponse> => {
  return Delete({ endpoint: `tasks/${id}` }).then(
    handleAPIResponse<TaskResponse>
  );
};