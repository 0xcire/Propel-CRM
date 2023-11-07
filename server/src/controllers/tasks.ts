import type { Request, Response } from "express";

import {
  deleteTaskByID,
  getUserTasks,
  getUserDashboardTasks,
  insertNewTask,
  updateTaskByID,
  getUsersListingTasks,
  getUsersContactTasks,
  searchForTasks,
} from "../db/queries/tasks";

import type { NewTask } from "../db/types";

export const getDashboardTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { completed } = req.query;

    const userDashboardTasks = await getUserDashboardTasks({
      userID: userID,
      completed: completed as "true" | "false",
    });

    return res.status(200).json({
      message: "",
      tasks: userDashboardTasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { completed, page, priority } = req.query;
    const { listingID, contactID } = req.params;

    const priorities = (priority as string)?.split(",");

    let userTasks;

    if (listingID && !contactID) {
      userTasks = await getUsersListingTasks({
        userID: userID,
        completed: completed as "true" | "false",
        page: +page!,
        priority: priorities,
        listingID: +listingID,
      });
    }

    if (contactID && !listingID) {
      userTasks = await getUsersContactTasks({
        userID: userID,
        completed: completed as "true" | "false",
        page: +page!,
        priority: priorities,
        contactID: +contactID,
      });
    }

    if (!listingID && !contactID) {
      userTasks = await getUserTasks({
        userID: userID,
        completed: completed as "true" | "false",
        page: +page!,
        priority: priorities,
      });
    }

    return res.status(200).json({
      message: "",
      tasks: userTasks ?? [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const searchUsersTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { title, completed } = req.query;

    if (!title) {
      return res.status(400).json({
        message: "Please enter a title to search your tasks.",
      });
    }

    let usersSearchedTasks;

    if (title && title === "") {
      usersSearchedTasks = [];
    }

    if (title) {
      usersSearchedTasks = await searchForTasks({
        userID: userID,
        completed: completed as "true" | "false",
        title: title as string,
      });
    }

    return res.status(200).json({
      tasks: usersSearchedTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskID } = req.params;

    if (!taskID) {
      return res.status(400).json({
        message: "Bad request.",
      });
    }

    return res.status(200).json({
      message: "",
      tasks: [req.task],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const authUserID = req.user.id;
    const { userID, title, description, notes, dueDate, completed, priority, listingID, contactID } = req.body;

    // TODO: ?
    if (userID !== authUserID) {
      return res.status(403).json({
        message: "hmm...",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Tasks require at least a title.",
      });
    }

    const task: NewTask = {
      userID: authUserID,
      title: title,
      description: description,
      notes: notes,
      dueDate: dueDate,
      // completed: completed,
      priority: priority,
      listingID: listingID ?? null,
      contactID: contactID ?? null,
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { taskID } = req.params;

    const { title, description, notes, dueDate, completed, priority } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Update fields.",
      });
    }

    const updatedTask = await updateTaskByID({ userID: userID, taskID: taskID, newData: req.body });

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
    const { taskID } = req.params;

    const deletedTask = await deleteTaskByID({ userID: userID, taskID: taskID });

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
