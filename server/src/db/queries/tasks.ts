import { db } from "..";
import { and, asc, eq } from "drizzle-orm";
import { tasks } from "../schema";

import { type NewTask } from "../types";

type FindUserTasksParams = {
  userID: number;
  completed: string;
  page?: number;
};

type UpdateTaskByIDParams = {
  userID: number;
  contactID: string;
  newData: Partial<NewTask>;
};

type DeleteTaskByIDParams = {
  userID: number;
  contactID: string;
};

export const findTaskByID = async (id: number) => {
  const task = await db.select().from(tasks).where(eq(tasks.id, id));

  if (!task) {
    return undefined;
  }

  return task[0];
};

export const getUserDashboardTasks = async ({ userID, completed }: FindUserTasksParams) => {
  const userTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userID, userID), eq(tasks.completed, JSON.parse(completed))))
    .orderBy(asc(tasks.createdAt))
    .limit(15);

  return userTasks;
};

export const findUserTasks = async ({ userID, completed, page }: FindUserTasksParams) => {
  const userTasks = await db.query.tasks.findMany({
    where: and(eq(tasks.userID, userID), eq(tasks.completed, JSON.parse(completed))),
    orderBy: [asc(tasks.createdAt)],
    limit: 10,
    ...(page && { offset: (page - 1) * 10 }),
  });

  return userTasks;
};

export const insertNewTask = async (task: NewTask) => {
  const newTask = await db.insert(tasks).values(task).returning({
    id: tasks.id,
    title: tasks.title,
    description: tasks.description,
    notes: tasks.notes,
    dueDate: tasks.dueDate,
    completed: tasks.completed,

    priority: tasks.priority,
  });

  return newTask[0];
};

export const updateTaskByID = async ({ userID, contactID, newData }: UpdateTaskByIDParams) => {
  const updatedTask = await db
    .update(tasks)
    .set({
      ...(newData.title
        ? {
            title: newData.title,
          }
        : {}),
      ...(newData.description
        ? {
            description: newData.description,
          }
        : {}),
      ...(newData.notes
        ? {
            notes: newData.notes,
          }
        : {}),
      ...(newData.dueDate
        ? {
            dueDate: newData.dueDate,
          }
        : {}),
      ...(newData.completed || newData.completed === false
        ? {
            completed: newData.completed,
          }
        : {}),
      ...(newData.priority
        ? {
            priority: newData.priority,
          }
        : {}),
    })
    .where(and(eq(tasks.id, +contactID), eq(tasks.userID, userID)))
    .returning({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      notes: tasks.notes,
      dueDate: tasks.dueDate,
      // status: tasks.status,
      // completed: tasks.completed,
      priority: tasks.priority,
    });

  return updatedTask[0];
};

export const deleteTaskByID = async ({ userID, contactID }: DeleteTaskByIDParams) => {
  const deletedTask = await db
    .delete(tasks)
    .where(and(eq(tasks.id, +contactID), eq(tasks.userID, userID)))
    .returning({ id: tasks.id });

  if (deletedTask.length === 0) {
    return undefined;
  }

  return deletedTask[0];
};
