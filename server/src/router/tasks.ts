import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks";
import { isAuth, validateRequest } from "../middlewares";
import { isTaskOwner } from "../middlewares/tasks";
import { cookieSchema, paramSchema, createTaskSchema, updateTaskSchema } from "../db/drizzle-zod";

export default (router: Router) => {
  router.get("/tasks", validateRequest({ cookies: cookieSchema }), isAuth, getTasks);

  router.post("/tasks", validateRequest({ body: createTaskSchema, cookies: cookieSchema }), isAuth, createTask);

  router.patch(
    "/tasks/:id",
    validateRequest({ body: updateTaskSchema, cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isTaskOwner,
    updateTask
  );

  router.delete(
    "/tasks/:id",
    validateRequest({ params: paramSchema, cookies: cookieSchema }),
    isAuth,
    isTaskOwner,
    deleteTask
  );
};
