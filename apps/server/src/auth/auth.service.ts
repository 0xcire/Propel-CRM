import dayjs from 'dayjs'
import { deleteRateLimit, getRateLimiter, limiterByEmailForAccountRecovery, limiterByEmailForSignIn, limiterByUserIDForAccountVerification } from '@propel/redis'
import { deleteTemporaryRequest, findUsersByEmail, findUsersByUsername, getTempRequestFromToken, insertNewUser, NewUser, updateUserByID } from '@propel/drizzle'
import { checkPassword, hashPassword } from '@propel/lib'
import { PropelHTTPError } from '../lib/http-error'
// TODO: should maybe not be here
import { createRecoverPasswordRequestAndSendEmail, createToken, createVerifyEmailRequestAndSendEmail, persistAuthSession, removeAuthSessionCookies, removePreAuthCookies, removeSessionPersistence, setAuthSessionCookies } from '../common/utils'
import { ABSOLUTE_SESSION_COOKIE, SALT_ROUNDS } from '../common/config'

import type { IAuthService } from "./auth.interface"
import type { UserInput, ZUser } from './types'
import type { Ctx } from '../types'

export class AuthService implements IAuthService {
    // private rateLimiterService: IRateLimiterService

    // constructor(rateLimiterService: IRateLimiterService) {
    //     this.rateLimiterService = rateLimiterService
    // }

    async signUp({ name, username, email, password }: UserInput, { req, res }: Ctx) {
        if (!name || !username || !email || !password) {
            throw new PropelHTTPError({
                code: "BAD_REQUEST",
                message: "All fields required.",
            });
        }
        
        const userByUsername = await findUsersByUsername(username);
        if (userByUsername) {
          throw new PropelHTTPError({
            code: "CONFLICT",
            message: "Username not available. Please pick another.",
          });
        }
    
        const userByEmail = await findUsersByEmail({ email: email });
        if (userByEmail) {
          throw new PropelHTTPError({
            code: "CONFLICT",
            message: "Email already exists.",
          });
        }
    
        const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));
        const newUser: NewUser = {
          name: name,
          username: username,
          email: email,
          hashedPassword: hashedPassword,
        };
        const insertedUser = await insertNewUser(newUser);
    
        if (!insertedUser) {
          throw new PropelHTTPError({
            code: "BAD_REQUEST",
            message: "There was an error creating your account. Please try again.",
          });
        }
    
        const sessionID = createToken(64);
    
        await persistAuthSession(req, sessionID, insertedUser.id);
        await createVerifyEmailRequestAndSendEmail(insertedUser.id, insertedUser.email);
    
        removePreAuthCookies(req, res);
        setAuthSessionCookies(req, res, sessionID);

        return insertedUser;
    }

    async signIn(email: string, password: string, { req, res }: Ctx): Promise<ZUser> {
        const rateLimiter = await getRateLimiter(limiterByEmailForSignIn, email);
        const tries = rateLimiter?.remainingPoints;
    
        const userByEmail = await findUsersByEmail({ email: email, signingIn: true });
    
        if (!userByEmail) {
            throw new PropelHTTPError({
                code: "UNAUTHORIZED",
                message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
            });
        }
    
        if (userByEmail && userByEmail.hashedPassword) {
            const passwordMatches = await checkPassword(password, userByEmail.hashedPassword);
        
            if (!passwordMatches) {
                throw new PropelHTTPError({
                  code: "UNAUTHORIZED",
                  message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
                });
            }
        }
    
        const sessionID = createToken(16);
    
        await deleteRateLimit(limiterByEmailForSignIn, email);
        // [ ]: if class based, persistAuthSession could be private method on controller
        // seems much better this way
        await persistAuthSession(req, sessionID, userByEmail.id);
    
        removePreAuthCookies(req, res);
        setAuthSessionCookies(req, res, sessionID);

        return userByEmail;
    }

    async signOut({ req, res }: Ctx): Promise<void> {
        const sessionId = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];
        
        await removeSessionPersistence(req, sessionId);
        removeAuthSessionCookies(req, res);
    }

    async verifyEmail(token: string): Promise<void> {
      const tempRequest = await getTempRequestFromToken(token);
      await deleteTemporaryRequest({ id: token });

      if (!tempRequest || !tempRequest.userID) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Request required.",
        });
      }

      if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Request required.",
        });
      }

      const updatedUser = await updateUserByID({
        id: +tempRequest.userID,
        verified: true,
      });

      if (!updatedUser) {
        throw new PropelHTTPError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an issue verifying your email. Please try again.",
        });
      }
    }

    async initNewEmailVerification(userId: number, email: string): Promise<void> {
      await deleteRateLimit(limiterByUserIDForAccountVerification, userId.toString());
      await createVerifyEmailRequestAndSendEmail(userId, email);
    }

    async initAccountRecovery(email: string): Promise<void> {
      const userByEmail = await findUsersByEmail({ email: email });
      
      if (!userByEmail) {
        throw new PropelHTTPError({
          code: 'OK',
          message: "Incoming! Password reset email heading your way.",
        })
      }
  
      await deleteRateLimit(limiterByEmailForAccountRecovery, email);
      await createRecoverPasswordRequestAndSendEmail(userByEmail.id, userByEmail.email);
    }

    async validateTempRecoverySession(id: string): Promise<void> {
      const tempRequest = await getTempRequestFromToken(id);
      
      if (!tempRequest) {
        throw new PropelHTTPError({
          code: "NOT_FOUND",
          message: "Request expired.",
        });
      }
  
      if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
        await deleteTemporaryRequest({ id: id });
  
        throw new PropelHTTPError({
          code: "UNAUTHORIZED",
          message: "Request expired.",
        });
      }
    }

    async updateUserFromAccountRecovery(id: string, password: string): Promise<void> {
      const tempRequest = await getTempRequestFromToken(id);
      
      // this is doing getValidRecoveryRequest??
      if (!tempRequest || !tempRequest.userID) {
        throw new PropelHTTPError({
          code: "NOT_FOUND",
          message: "Request expired.",
        });
      }
  
      if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
        throw new PropelHTTPError({
          code: "UNAUTHORIZED",
          message: "Request expired.",
        });
      }
  
      const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));
  
      const updatedUser = await updateUserByID({
        id: +tempRequest.userID,
        newPassword: hashedPassword,
      });
  
      if (!updatedUser) {
        throw new PropelHTTPError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error updating your account. Please try again.",
        });
      }
  
      await deleteTemporaryRequest({ id: id });
    }

    // private async persistAuthSession() { }

    // private removePreAuthCookies() { }

    // private setAuthSessionCookies() { }
}