import type { Request, Response, NextFunction } from "express";
import { findTaskByID } from "../db/queries/tasks";

export const isTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { taskID } = req.params;

  const method = req.method;

  const taskByID = await findTaskByID(+taskID);

  if (!taskByID) {
    return res.status(404).json({
      message: `Task by id: ${taskID} does not exist`,
    });
  }

  if (taskByID.userID !== userID) {
    return res.status(403).json({
      message: "Cannot perform operations on this task.",
    });
  }

  // only applies to get('/tasks/:id')
  if (method === "GET") {
    req.task = taskByID;
  }

  return next();
};
