import { findTaskByID } from "@propel/drizzle";

import { PropelHTTPError } from "../lib/http-error";
import { handleError } from "../utils/handle-error";

import type { Request, Response, NextFunction } from "express";

export const isTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user.id;
    const { taskID } = req.params;
    const method = req.method;

    if (!taskID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Task ID required.",
      });
    }

    const taskByID = await findTaskByID(+taskID);

    if (!taskByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: `Task by id: ${taskID} does not exist`,
      });
    }

    if (taskByID.userID !== userID) {
      throw new PropelHTTPError({
        code: "FORBIDDEN",
        message: "Cannot perform operations on this task.",
      });
    }

    // only applies to get('/tasks/:id')
    if (method === "GET") {
      req.task = taskByID;
    }

    return next();
  } catch (error) {
    return handleError(error, res);
  }
};
