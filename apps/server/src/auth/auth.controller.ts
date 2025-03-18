import { AuthService } from './auth.service'
import { PropelResponse } from '../lib/response'
import { PropelHTTPError } from '../lib/http-error'
import { handleError } from '../common/utils'

import type { Request, Response } from 'express'
import type { UserInput } from './types'

export class AuthController {
  private authService: AuthService

  constructor(
    authService: AuthService,
  ) {
    this.authService = authService
  }

  handleSignUp = async (req: Request, res: Response) => {
    try {
      const userDto: UserInput = req.body;

      const user = await this.authService.signUp(userDto, { req, res })

      return PropelResponse(res, 201, {
        message: 'Signing up',
        user: user
      })
    } catch (error) {
      return handleError(error, res)
    }
  }

  handleSignIn = async (req: Request, res: Response) => {
    try {
      const { email, password }: UserInput = req.body;

      if (!email || !password) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Please fill in all fields.",
        });
      }

      const userByEmail = await this.authService.signIn(email, password, { req, res })

      return PropelResponse(res, 200, {
        message: "Signing in",
        user: userByEmail
      })
    } catch (error) {
      return handleError(error, res)
    }
  }

  handleSignOut = async (req: Request, res: Response) => {
    try {
      await this.authService.signOut({ req, res })

      return PropelResponse(res, 200, {
        message: "Signing out"
      })
    } catch (error) {
      return handleError(error, res)
    }
  }

  handleVerifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.query;

      if (typeof token !== "string") {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }

      if (!token) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Request token required",
        });
      }

      await this.authService.verifyEmail(token)

      return PropelResponse(res, 200, {
        message: "Email verified"
      })
    } catch (error) {
      handleError(error, res)
    }
  }

  handleInitNewEmailVerification = async (req: Request, res: Response) => {
    try {
      const { id: userID, email } = req.user;

      if (!email) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "There was a problem processing your request. Please try again.",
        });
      }

      await this.authService.initNewEmailVerification(userID, email)

      return PropelResponse(res, 200, {
        message: "New verification email is on it's way",
      })
    } catch (error) {
      handleError(error, res)
    }
  }

  handleInitAccountRecovery = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await this.authService.initAccountRecovery(email)

      return PropelResponse(res, 200, {
        message: "Incoming! Password reset email heading your way."
      })
    } catch (error) {
      return handleError(error, res)
    }
  }

  handleValidateTempRecoverySession = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Recovery request ID required.",
        });
      }

      await this.authService.validateTempRecoverySession(id)

      res.setHeader("Referrer-Policy", "no-referrer");
      return PropelResponse(res, 200, {})
    } catch (error) {
      return handleError(error, res)
    }
  }

  handleUpdateUserFromAccountRecovery = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!id) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Request ID required.",
        });
      }

      await this.authService.updateUserFromAccountRecovery(id, password)

      return PropelResponse(res, 200, {
        message: "Password updated successfully."
      })

    } catch (error) {
      return handleError(error, res)
    }
  }
}
