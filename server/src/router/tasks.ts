import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { isTaskOwner } from "../middlewares/tasks";
import {
  cookieSchema,
  paramSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../db/validation-schema";

export default (router: Router) => {
  router.get("/tasks", validateRequest({ query: taskQuerySchema, cookies: cookieSchema }), isAuth, getTasks);

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
