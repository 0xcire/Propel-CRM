import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export const isTaskOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { id } = req.params;

  const taskByID = await db.select({ userID: tasks.userID }).from(tasks).where(eq(tasks.id, +id));

  if (taskByID[0].userID !== userID) {
    return res.status(403).json({
      message: "Can not perform operations on this task.",
    });
  }

  if (taskByID.length === 0) {
    return res.status(400).json({
      message: "Could not find task to update.",
    });
  }

  return next();
};
