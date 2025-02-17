import { Completed } from "@propel/types"
import { handleError } from "../common/utils"
import { TasksService } from "./tasks.service"

import type { Request, Response } from 'express'
import { PropelResponse } from "../lib/response"
import { PropelHTTPError } from "../lib/http-error"
import { IdParams, TaskSearchQuery } from "./types"
import { NewTask } from "@propel/drizzle"

export class TasksController {
    private tasksService: TasksService

    constructor(tasksService: TasksService) {
        this.tasksService = tasksService
    }

    handleGetDashboardTasks = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { completed } = <{ completed: Completed }>req.query;

            const tasks = await this.tasksService.getDashboardTasks(userID, { completed, limit: '20', page: 1 })

            return PropelResponse(res, 200, {
                message: '',
                tasks
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleSearchTasks = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { title } = req.query;

            if (!title) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "Please enter a title to search your tasks.",
                });
            }

            const tasks = await this.tasksService.searchTasks(userID, req.query as unknown as Omit<TaskSearchQuery, "priority">)

            return PropelResponse(res, 200, {
                message: '',
                tasks
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetAllTasks = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const query = req.query as unknown as TaskSearchQuery
            const params = req.params as unknown as IdParams

            const tasks = await this.tasksService.getAllTasks(userID, query, params)

            return PropelResponse(res, 200, {
                message: '',
                tasks
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleGetTaskById = async (req: Request, res: Response) => {
        try {
            const { taskID } = req.params;

            if (!taskID) {
              throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "Task ID required.",
              });
            }
        
            return PropelResponse(res, 200, {
              message: "",
              tasks: [req.task],
            });
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleCreateTask = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { title, description, notes, dueDate, completed, priority, listingID, contactID } = req.body;

            if (!title) {
              throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "Tasks require at least a title.",
              });
            }

            const newTask: NewTask = {
                userID,
                title: title,
                description: description,
                notes: notes,
                dueDate: dueDate,
                completed: completed ?? false,
                priority: priority,
                listingID: listingID ?? null,
                contactID: contactID ?? null,
            };

            const task = await this.tasksService.createTask(newTask)

            return PropelResponse(res, 201, {
                message: 'Added new task',
                task
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleUpdateTask = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { taskID } = req.params;

            if (Object.keys(req.body).length === 0) {
              throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "Changes required.",
              });
            }

            // something that has been taken care of w/ validateRequest middleware
            // however, not sure how to bring that type safety down deeper into the appliction
            if (!taskID) {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Task ID required"
                })
            }

            const updatedTask = await this.tasksService.updateTask(userID, +taskID, req.body)

            return PropelResponse(res, 200, {
                message: 'Updated task',
                updatedTask
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleDeleteTask = async (req: Request, res: Response) => {
        try {
            const userID = req.user.id;
            const { taskID } = req.params;

            if (!taskID) {
                throw new PropelHTTPError({
                    code: "BAD_REQUEST",
                    message: "Task ID required"
                })
            }

            const task = await this.tasksService.deleteTask(userID, +taskID)

            return PropelResponse(res, 200, {
                message: "Deleted task",
                task
            })
        } catch (error) {
            return handleError(error, res)
        }
    }
}