import type { Request, Response } from "express";
import { findUsersByID } from "../db/queries/user";
import { deleteTaskByID, findUserTasks, insertNewTask, updateTaskByID } from "../db/queries/tasks";

import type { NewTask } from "../db/types";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { completed } = req.query;

    const userTasks = await findUserTasks({ userID: userID, completed: completed as string });

    return res.status(200).json({
      message: "",
      tasks: userTasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const authUserID = req.user.id;
    const { userID, title, description, notes, dueDate, completed, priority } = req.body;

    // TODO: along with auth, contacts, user, need to validate inputs against zod schema

    if (!title) {
      return res.status(400).json({
        message: "Tasks require at least a title.",
      });
    }

    // TODO: necessary?
    // if (authUserID !== userID) {
    //   return res.status(409).json({
    //     message: "Cannot complete this operation.",
    //   });
    // }

    const user = findUsersByID({ id: userID });

    const task: NewTask = {
      userID: authUserID,
      title: title,
      description: description,
      notes: notes,
      dueDate: dueDate,
      completed: completed,
      priority: priority,
    };

    const newTask = await insertNewTask(task);

    return res.status(201).json({
      message: `Added new task.`,
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

// TODO: along with auth, contacts, user, need to validate inputs against zod schema
// sanitize data (express-validator maybe just zod?)
// error handling
export const updateTask = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;

    const { title, description, notes, dueDate, completed, priority } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Update fields.",
      });
    }

    const updatedTask = await updateTaskByID({ userID: userID, contactID: id, newData: req.body });

    return res.status(200).json({
      message: "Updated task.",
      updatedTask: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;

    const deletedTask = await deleteTaskByID({ userID: userID, contactID: id });

    return res.status(200).json({
      message: "Deleted task",
      task: deletedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

// getOneTask
// deleteAllTasks
