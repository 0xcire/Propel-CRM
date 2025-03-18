import { Router } from "express";

import analyticsRouter from "../../analytics/analytics.router";
import { AuthRouter } from "../../auth/auth.router";
import contactsRouter from "../../contacts/contacts.router";
import listingsRouter from "../../listings/listings.router";
import tasksRouter from "../../tasks/tasks.router";
import usersRouter from "../../users/users.router";

const router = Router();
// console.log("ROUTER DEFINITION:", router)

export default () => {
    // const router = Router();
    analyticsRouter(router)
    AuthRouter(router)
    contactsRouter(router)
    listingsRouter(router)
    tasksRouter(router)
    usersRouter(router)

    return router;
}