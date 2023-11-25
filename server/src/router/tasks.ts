import { Router } from "express";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardTasks,
  getTask,
  searchUsersTasks,
} from "../controllers/tasks";

import { validateRequest } from "../middlewares/validate-input";
import { validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";
import { isTaskOwner } from "../middlewares/tasks";
import { isListingOwner } from "../middlewares/listings";
import { isContactOwner } from "../middlewares/contacts";

import {
  authCookieValidator,
  createTaskValidator,
  updateTaskValidator,
  dashboardTaskQueryValidator,
  listingIDValidator,
  contactIDValidator,
  taskIDValidator,
  taskQueryValidator,
  taskQuerySearchValidator,
} from "../db/validation-schema";

export default (router: Router) => {
  router.get(
    "/dashboard/tasks",
    validateRequest({ query: dashboardTaskQueryValidator, cookies: authCookieValidator }),
    validateSession,
    getDashboardTasks
  );

  router.get(
    "/tasks",
    validateRequest({ query: taskQueryValidator, cookies: authCookieValidator }),
    validateSession,
    getTasks
  );

  router.get(
    "/tasks/search",
    validateRequest({ cookies: authCookieValidator, query: taskQuerySearchValidator }),
    validateSession,
    searchUsersTasks
  );

  router.get(
    "/tasks/:taskID",
    validateRequest({ params: taskIDValidator, cookies: authCookieValidator }),
    validateSession,
    isTaskOwner,
    getTask
  );

  router.get(
    "/tasks/listings/:listingID",
    validateRequest({ query: taskQueryValidator, params: listingIDValidator, cookies: authCookieValidator }),
    validateSession,
    isListingOwner,
    getTasks
  );

  router.get(
    "/tasks/contacts/:contactID",
    validateRequest({ query: taskQueryValidator, params: contactIDValidator, cookies: authCookieValidator }),
    validateSession,
    isContactOwner,
    getTasks
  );

  router.post(
    "/tasks",
    validateRequest({ body: createTaskValidator, cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    createTask
  );

  router.patch(
    "/tasks/:taskID",
    validateRequest({ body: updateTaskValidator, cookies: authCookieValidator, params: taskIDValidator }),
    validateSession,
    validateCSRF,
    isTaskOwner,
    updateTask
  );

  router.delete(
    "/tasks/:taskID",
    validateRequest({ params: taskIDValidator, cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    isTaskOwner,
    deleteTask
  );
};
