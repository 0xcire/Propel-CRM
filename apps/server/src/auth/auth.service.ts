import dayjs from 'dayjs'
import { deleteRateLimit, deleteRedisKV, getRateLimiter, limiterByEmailForAccountRecovery, limiterByEmailForSignIn, limiterByUserIDForAccountVerification, setRedisKV } from '@propel/redis'
import { createRequestAndDeleteRedundancy, deleteTemporaryRequest, findUsersByEmail, findUsersByUsername, getTempRequestFromToken, insertNewUser, NewUser, updateUserByID } from '@propel/drizzle'
import { checkPassword, hashPassword } from '@propel/lib'
import { PropelHTTPError } from '../lib/http-error'
// TODO: should maybe not be here
import { createSecureCookie, createToken, deriveSessionCSRFToken, isDeployed, removeAuthSessionCookies } from '../common/utils'
import { ABSOLUTE_SESSION_COOKIE, ABSOLUTE_SESSION_LENGTH, CSRF_COOKIE, CSRF_SECRET, IDLE_SESSION_COOKIE, IDLE_SESSION_LENGTH, PRE_AUTH_SESSION_COOKIE, SALT_ROUNDS } from '../common/config'

import type { IAuthService } from "./auth.interface"
import type { UserInput, ZUser } from './types'
import type { Ctx } from '../types'
import { randomUUID } from 'node:crypto'
import { sendRecoverPasswordEmail, sendVerifyAccountEmail } from '@propel/emails'

export class AuthService implements IAuthService {
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
    await this.persistAuthSession({ req, res }, sessionID, insertedUser.id);
    await this.createTempRequestAndNotify('verify', { id: insertedUser.id, email: insertedUser.email })

    this.removePreAuthCookies({ req, res });
    this.setAuthSessionCookies({ req, res }, sessionID);

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
    await this.persistAuthSession({ req, res }, sessionID, userByEmail.id);

    this.removePreAuthCookies({ req, res });
    this.setAuthSessionCookies({ req, res }, sessionID);

    return userByEmail;
  }

  async signOut({ req, res }: Ctx): Promise<void> {
    const sessionId = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await this.removeSessionPersistence({ req, res }, sessionId);
    removeAuthSessionCookies({ req, res });
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
    await this.createTempRequestAndNotify('verify', { id: userId, email })
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
    await this.createTempRequestAndNotify('recovery', { id: userByEmail.id, email: userByEmail.email })
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

  private async persistAuthSession({ req }: Ctx, sessionID: string, userID: number) {
    req.session = {
      id: sessionID,
    };
    await setRedisKV(sessionID, String(userID), +(ABSOLUTE_SESSION_LENGTH as string));
  }

  private removePreAuthCookies({ req, res }: Ctx) {
    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: isDeployed(req) ? ".cire.sh" : undefined,
      sameSite: "lax",
    });
  }

  private setAuthSessionCookies({ req, res }: Ctx, sessionID: string) {
    createSecureCookie(req, {
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie(req, {
      res: res,
      name: IDLE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(IDLE_SESSION_LENGTH as string),
    });

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "lax",
      domain: isDeployed(req) ? ".cire.sh" : undefined,
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });
  }

  private async removeSessionPersistence({ req }: Ctx, sessionID: string) {
    req.session = {
      id: "",
    };
    await deleteRedisKV(sessionID);
  }

  // designed how this might look in larger system
  private async createTempRequestAndNotify(requestType: 'verify' | 'recovery', recipient: { id: number, email: string }) {
    const id = randomUUID();

    await createRequestAndDeleteRedundancy({
      id: id,
      expiry: dayjs().add(1, "hour").toDate(),
      userEmail: recipient.email,
      userID: recipient.id,
    });

    switch (requestType) {
      case 'recovery':
        await sendRecoverPasswordEmail(recipient.email, id);
        return;
      case 'verify':
        await sendVerifyAccountEmail(recipient.email, id);
        return;
      default:
        return;
    }
  }
}
