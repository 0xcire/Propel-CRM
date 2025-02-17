
import { Router } from "express";
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
} from "@propel/drizzle";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { isTaskOwner } from "./tasks.middleware";
import { isListingOwner } from "../listings/listings.middleware";
import { isContactOwner } from "../contacts/contacts.middleware";

export default (router: Router) => {
    const { validateRequest } = new ValidateRequestMiddleware();
    const { validateSession } = new ValidateSessionMiddleware();
    const { validateCsrf } = new ValidateCsrfMiddleware();
  const ctrl = new TasksController(new TasksService())
  router.get(
    "/dashboard/tasks",
    validateRequest({
      query: dashboardTaskQueryValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    ctrl['handleGetDashboardTasks']
  );

  router.get(
    "/tasks",
    validateRequest({
      query: taskQueryValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    ctrl['handleGetAllTasks']
  );

  router.get(
    "/tasks/search",
    validateRequest({
      cookies: authCookieValidator,
      query: taskQuerySearchValidator,
    }),
    validateSession,
    ctrl['handleSearchTasks']
  );

  router.get(
    "/tasks/:taskID",
    validateRequest({ params: taskIDValidator, cookies: authCookieValidator }),
    validateSession,
    isTaskOwner,
    ctrl['handleGetTaskById']
  );

  router.get(
    "/tasks/listings/:listingID",
    validateRequest({
      query: taskQueryValidator,
      params: listingIDValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    isListingOwner,
    ctrl['handleGetAllTasks']
  );

  router.get(
    "/tasks/contacts/:contactID",
    validateRequest({
      query: taskQueryValidator,
      params: contactIDValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    isContactOwner,
    ctrl['handleGetAllTasks']
  );

  router.post(
    "/tasks",
    validateRequest({
      body: createTaskValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    validateCsrf,
    ctrl['handleCreateTask']
  );

  router.patch(
    "/tasks/:taskID",
    validateRequest({
      body: updateTaskValidator,
      cookies: authCookieValidator,
      params: taskIDValidator,
    }),
    validateSession,
    validateCsrf,
    isTaskOwner,
    ctrl['handleUpdateTask']
  );

  router.delete(
    "/tasks/:taskID",
    validateRequest({ params: taskIDValidator, cookies: authCookieValidator }),
    validateSession,
    validateCsrf,
    isTaskOwner,
    ctrl['handleDeleteTask']
  );
};
