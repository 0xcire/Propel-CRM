import type { Request, Response } from "express";
import { findUsersByID } from "../db/queries/user";
import { db } from "../db";
import { tasks, users } from "../db/schema";
import type { NewTask } from "../db/types";
import { eq } from "drizzle-orm";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const userTasks = await db.query.users.findMany({
      where: eq(users.id, userID),
      columns: { id: true, name: true, username: true },
      with: {
        tasks: true,
      },
    });

    // const userTasks = await db.query.tasks.findMany({
    //   where: eq(tasks.userID, userID),
    // });

    return res.status(200).json({
      message: "",
      tasks: userTasks[0].tasks,
    });
  } catch (error) {
    res.status(500).json({});
    console.log(error);
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { title, description, notes, dueDate, completed, status, priority } = req.body;

    // TODO: along with auth, contacts, user, need to validate inputs against zod schema

    if (!title) {
      return res.status(400).json({
        message: "Tasks require at least a title.",
      });
    }

    const user = findUsersByID({ id: userID });

    const task: NewTask = {
      userID: userID,
      // ...req.body,
      title: title,
      description: description,
      notes: notes,
      dueDate: dueDate,
      completed: completed,
      status: status,
      priority: priority,
    };

    console.log(task);

    const newTask = await db.insert(tasks).values(task).returning({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      notes: tasks.notes,
      dueDate: tasks.dueDate,
      completed: tasks.completed,
      status: tasks.status,
      priority: tasks.priority,
    });

    return res.status(201).json({
      message: "",
      task: newTask[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
  }
};

// getOneTask
// deleteAllTasks
