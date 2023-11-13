import { db } from "..";
import { and, asc, desc, eq, ilike, inArray, isNull } from "drizzle-orm";
import { tasks } from "../schema";

import type { Completed, Priority, PaginationParams } from "../../types";
import type { NewTask } from "../types";

interface GetUserTasksParams extends PaginationParams {
  userID: number;
  completed: Completed;
  priority?: Array<Priority>;
}

interface SearchForTasksParams extends PaginationParams {
  userID: number;
  completed: Completed;
  title: string;
}

interface GetUsersListingTasksParams extends GetUserTasksParams {
  listingID: number;
}
interface GetUsersContactTasksParams extends GetUserTasksParams {
  contactID: number;
}

type UpdateTaskByIDParams = {
  userID: number;
  taskID: string;
  newData: Partial<NewTask>;
};

type DeleteTaskByIDParams = {
  userID: number;
  taskID: string;
};

export const findTaskByID = async (id: number) => {
  const task = await db.select().from(tasks).where(eq(tasks.id, id));

  if (!task) {
    return undefined;
  }

  return task[0];
};

export const getUserDashboardTasks = async ({ userID, completed, page, limit }: GetUserTasksParams) => {
  const userTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userID, userID),
        eq(tasks.completed, JSON.parse(completed)),
        isNull(tasks.listingID),
        isNull(tasks.contactID)
      )
    )
    .orderBy(desc(tasks.createdAt))
    .limit(+limit)
    .offset((page - 1) * +limit);

  return userTasks;
};

export const getUserTasks = async ({ userID, completed, page, priority, limit }: GetUserTasksParams) => {
  const userTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userID, userID),
      eq(tasks.completed, JSON.parse(completed)),
      priority && inArray(tasks.priority, priority as Array<"low" | "medium" | "high">),
      isNull(tasks.listingID),
      isNull(tasks.contactID)
    ),
    orderBy: [desc(tasks.createdAt)],
    limit: +limit,
    ...(page && { offset: (page - 1) * +limit }),
  });

  return userTasks;
};

export const getUsersListingTasks = async ({
  userID,
  completed = "false",
  page = 1,
  priority,
  listingID,
}: GetUsersListingTasksParams) => {
  const userListingTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userID, userID),
      eq(tasks.completed, JSON.parse(completed)),
      priority && inArray(tasks.priority, priority as Array<Priority>),
      eq(tasks.listingID, listingID),
      isNull(tasks.contactID)
    ),
    orderBy: [desc(tasks.createdAt)],
    limit: 10,
    ...(page && { offset: (page - 1) * 10 }),
  });

  return userListingTasks;
};

export const getUsersContactTasks = async ({
  userID,
  completed = "false",
  page = 1,
  priority,
  contactID,
}: GetUsersContactTasksParams) => {
  const userContactTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userID, userID),
      eq(tasks.completed, JSON.parse(completed)),
      priority && inArray(tasks.priority, priority as Array<Priority>),
      isNull(tasks.listingID),
      eq(tasks.contactID, contactID)
    ),
    orderBy: [desc(tasks.createdAt)],
    limit: 10,
    ...(page && { offset: (page - 1) * 10 }),
  });

  return userContactTasks;
};

export const searchForTasks = async ({ userID, completed, title, page, limit }: SearchForTasksParams) => {
  const userTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userID, userID),
        eq(tasks.completed, JSON.parse(completed)),
        ilike(tasks.title, `%${title}%`)
        //
      )
    )
    .orderBy(desc(tasks.createdAt))
    .limit(+limit)
    .offset((page - 1) * +limit);

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

export const updateTaskByID = async ({ userID, taskID, newData }: UpdateTaskByIDParams) => {
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
    .where(and(eq(tasks.id, +taskID), eq(tasks.userID, userID)))
    .returning({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      notes: tasks.notes,
      dueDate: tasks.dueDate,
      completed: tasks.completed,
      priority: tasks.priority,
    });

  return updatedTask[0];
};

export const deleteTaskByID = async ({ userID, taskID }: DeleteTaskByIDParams) => {
  const deletedTask = await db
    .delete(tasks)
    .where(and(eq(tasks.id, +taskID), eq(tasks.userID, userID)))
    .returning({ id: tasks.id });

  if (deletedTask.length === 0) {
    return undefined;
  }

  return deletedTask[0];
};
