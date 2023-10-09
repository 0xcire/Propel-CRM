import type { Request, Response, NextFunction } from "express";
import { findTaskByID } from "../db/queries/tasks";

export const isTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { id } = req.params;

  const method = req.method;

  const taskByID = await findTaskByID(+id);

  if (!taskByID) {
    return res.status(404).json({
      message: `Task by id: ${id} does not exist`,
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
