import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks";
import { isAuth } from "../middlewares";
import { isTaskOwner } from "../middlewares/tasks";

export default (router: Router) => {
  router.get("/tasks", isAuth, getTasks);
  router.post("/tasks", isAuth, createTask);
  router.patch("/tasks/:id", isAuth, isTaskOwner, updateTask);
  router.delete("/tasks/:id", isAuth, isTaskOwner, deleteTask);
};
