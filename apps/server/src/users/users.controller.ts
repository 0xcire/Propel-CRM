import { ABSOLUTE_SESSION_COOKIE } from "../common/config"
import { handleError } from "../common/utils"
import { PropelHTTPError } from "../lib/http-error"
import { PropelResponse } from "../lib/response"
import { UsersService } from "./users.service"

import type { Request, Response } from 'express'

export class UsersController {
    private usersService: UsersService

    constructor(usersService: UsersService) {
        this.usersService = usersService
    }

    handleGetCurrentUserInfo = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;

            const user = await this.usersService.getCurrentUserInfo(userId)

            if (!user) {
                throw new PropelHTTPError({
                    code: "NOT_FOUND",
                    message: "Can't find user.",
                });
            }

            return PropelResponse(res, 200, {
                message: 'Found user',
                user
            })
        } catch (error) {
            return handleError(error, res)
        }
    }

    handleUpdateUser = async (req: Request, res: Response)  => {
        try {
            const { userId } = req.params;
            // const { username, email, verifyPassword, password } = req.body;

            if (!userId) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "User ID required.",
                });
            }

            const user = await this.usersService.updateUser(+userId, req.body)

            return PropelResponse(res, 200, {
                message: "Updated successfully.",
                user
            })
        } catch (error) {
            return handleError(error, res)
        }
    }


    handleDeleteUser = async (req: Request, res: Response)  => {
        try {
            const { id: userId } = req.params;
            const sessionId = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

            if (!userId) {
                throw new PropelHTTPError({
                  code: "BAD_REQUEST",
                  message: "User ID required.",
                });
            }

            const user = await this.usersService.deleteUser(+userId, sessionId, { req, res })

            return PropelResponse(res, 200, {
                message: "successfully deleted.",
                user
            })
        } catch (error) {
            return handleError(error, res)
        }
    }
}