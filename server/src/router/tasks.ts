import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks";
import { isAuth } from "../middlewares";

export default (router: Router) => {
  router.get("/tasks", isAuth, getTasks);
  router.post("/tasks", isAuth, createTask);
  router.patch("/tasks/:id", isAuth, updateTask);
  router.delete("/user/:id", isAuth, deleteTask);
};
