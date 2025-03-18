import { deleteTaskByID, getUserDashboardTasks, getUsersContactTasks, getUsersListingTasks, getUserTasks, insertNewTask, NewTask, searchForTasks, Task, updateTaskByID } from "@propel/drizzle";

import type { Priority } from "@propel/types";
import type { ITasksService } from "./tasks.interface";
import type { IdParams, TaskSearchQuery, UpdatedTask } from "./types";

export class TasksService implements ITasksService {
    async getDashboardTasks(userId: number, query: Omit<TaskSearchQuery, "title" | "priority">): Promise<Task[]> {
        return await getUserDashboardTasks({
            ...query,
            userID: userId,
        });
    }

    async searchTasks(userId: number, { title, completed, page, limit }: Omit<TaskSearchQuery, "priority">): Promise<Task[]> {
        if (title && title === "") {
          return [];
        }
    
        if (title) {
          return await searchForTasks({
            userID: userId,
            completed: completed,
            title: title as string,
            limit: limit,
            page: +(page ?? "1"),
          });
        }

        return [];
    }

    async getAllTasks(userId: number, { completed, priority, page, limit}: TaskSearchQuery, { listingID, contactID }: IdParams): Promise<Task[]> {
        const priorities = (priority as string)?.split(",") as Array<Priority>;

        const baseOpts = {
            userID: userId,
            page: +(page ?? "1"),
            priority: priorities,
            completed,
            limit
        }

        const { LISTINGS_TASKS, CONTACTS_TASKS, TASKS } = this.getTaskQueryType(listingID, contactID);

        switch (true) {
            case LISTINGS_TASKS:
                return await getUsersListingTasks({ ...baseOpts, listingID })
            case CONTACTS_TASKS:
                return await getUsersContactTasks({ ...baseOpts, contactID })
            case TASKS:
                return await getUserTasks(baseOpts);
            default: 
                return []
        }
    }

    async createTask(task: NewTask): Promise<Partial<Task> | undefined> {
        return await insertNewTask(task);
    }

    async updateTask(userId: number, taskId: number, task: Partial<Task>): Promise<UpdatedTask | undefined> {
        return await updateTaskByID({ userID: userId, taskID: taskId, newData: task });
    }

    async deleteTask(userId: number, taskId: number): Promise<{ id: number } | undefined> {
        return await deleteTaskByID({ userID: userId, taskID: taskId });
    }

    private getTaskQueryType(listingID: number, contactID: number) {
        return {
            'LISTINGS_TASKS': listingID && !contactID,
            'CONTACTS_TASKS': contactID && !listingID,
            'TASKS': !listingID && !contactID
        }
    }
}