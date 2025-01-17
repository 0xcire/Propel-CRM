import type { NewTask, Task } from "@propel/drizzle";
import type { IdParams, TaskSearchQuery, UpdatedTask } from "./types";

export interface ITasksService {
  getDashboardTasks(userId: number, query: Omit<TaskSearchQuery, 'title' | 'priority'>): Promise<Task[]>
  searchTasks(userId: number, query: Omit<TaskSearchQuery, 'priority'>): Promise<Task[]>
  getAllTasks(userId: number, query: TaskSearchQuery, ids: IdParams): Promise<Task[]> // TODO: again, these first three can really be one }
  createTask(task: NewTask): Promise<Partial<Task> | undefined>;
  updateTask(userId: number, taskId: number, task: Partial<Task>): Promise<UpdatedTask | undefined>
  deleteTask(userId: number, taskId: number): Promise<{ id: number } | undefined>
}
