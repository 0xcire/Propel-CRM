import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask, getDashboardTasks, getTask } from "../controllers/tasks";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { isTaskOwner } from "../middlewares/tasks";
import {
  cookieSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  dashboardTaskQuerySchema,
  listingIDParamSchema,
  contactIDParamSchema,
  taskIDParamSchema,
} from "../db/validation-schema";
import { isListingOwner } from "../middlewares/listings";
import { isContactOwner } from "../middlewares/contacts";

export default (router: Router) => {
  router.get(
    "/dashboard/tasks",
    validateRequest({ query: dashboardTaskQuerySchema, cookies: cookieSchema }),
    isAuth,
    getDashboardTasks
  );

  router.get(
    "/tasks/:taskID",
    validateRequest({ params: taskIDParamSchema, cookies: cookieSchema }),
    isAuth,
    isTaskOwner,
    getTask
  );

  router.get(
    "/tasks",
    validateRequest({ query: taskQuerySchema, params: taskIDParamSchema, cookies: cookieSchema }),
    isAuth,
    getTasks
  );

  // TODO: listingOwner middleware should expect a listingID, id too generic
  router.get(
    "/tasks/listings/:listingID",
    validateRequest({ query: taskQuerySchema, params: listingIDParamSchema, cookies: cookieSchema }),
    isAuth,
    isListingOwner,
    getTasks
  );

  router.get(
    "/tasks/contacts/:contactID",
    validateRequest({ query: taskQuerySchema, params: contactIDParamSchema, cookies: cookieSchema }),
    isAuth,
    isContactOwner,
    getTasks
  );

  router.post("/tasks", validateRequest({ body: createTaskSchema, cookies: cookieSchema }), isAuth, createTask);

  router.patch(
    "/tasks/:taskID",
    validateRequest({ body: updateTaskSchema, cookies: cookieSchema, params: taskIDParamSchema }),
    isAuth,
    isTaskOwner,
    updateTask
  );

  router.delete(
    "/tasks/:taskID",
    validateRequest({ params: taskIDParamSchema, cookies: cookieSchema }),
    isAuth,
    isTaskOwner,
    deleteTask
  );
};
